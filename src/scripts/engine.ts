/**
 * One clock for the whole site: Lenis for scroll, GSAP's ticker for everything that
 * moves, ScrollTrigger for what enters the viewport. Page effects are created in
 * `onPage()` and reverted on every navigation, so nothing leaks across pages.
 *
 * Without JS the CSS shows every section; with reduced motion we skip Lenis, the
 * reveal choreography and the demo loop, and render the demo's end state.
 */
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis: Lenis | null = null;
let bootedFor = '';
let cleanups: Array<() => void> = [];

/* -------------------------------------------------------------------------- */
/* global, once per document                                                  */
/* -------------------------------------------------------------------------- */

function initGlobal() {
  if (!reduced) {
    lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  ScrollTrigger.config({ ignoreMobileResize: true });

  // Delegated handlers: they survive every page swap, so they are bound once.
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const copy = target.closest<HTMLButtonElement>('[data-copy]');
    if (copy) {
      const block = copy.closest('.code');
      const text = block?.querySelector('code')?.textContent ?? '';
      void copyText(text, copy);
      return;
    }

    const menu = target.closest<HTMLButtonElement>('[data-menu-toggle]');
    if (menu) {
      const panel = document.querySelector<HTMLElement>('#mobile-nav');
      if (!panel) return;
      const open = panel.dataset.open !== 'true';
      panel.dataset.open = String(open);
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      return;
    }

    if (target.closest('#mobile-nav a')) {
      const panel = document.querySelector<HTMLElement>('#mobile-nav');
      const button = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
      if (panel) panel.dataset.open = 'false';
      if (button) button.setAttribute('aria-expanded', 'false');
      return;
    }

    const tab = target.closest<HTMLButtonElement>('[role="tab"]');
    if (tab && tab.parentElement?.hasAttribute('role')) {
      selectTab(tab);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const panel = document.querySelector<HTMLElement>('#mobile-nav');
      const button = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
      if (panel?.dataset.open === 'true') {
        panel.dataset.open = 'false';
        button?.setAttribute('aria-expanded', 'false');
        button?.focus();
      }
    }

    const tab = (event.target as HTMLElement)?.closest<HTMLButtonElement>('[role="tab"]');
    if (tab && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
      const list = [...(tab.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [])];
      const index = list.indexOf(tab);
      const next = list[(index + (event.key === 'ArrowRight' ? 1 : -1) + list.length) % list.length];
      next?.focus();
      next?.click();
      event.preventDefault();
    }
  });

  document.addEventListener('input', (event) => {
    const input = (event.target as HTMLElement)?.closest<HTMLInputElement>('[data-tool-search]');
    if (input) filterTools(input);
  });

  document.addEventListener('astro:before-swap', () => {
    cleanups.forEach((fn) => fn());
    cleanups = [];
    bootedFor = '';
    ScrollTrigger.getAll().forEach((t) => t.kill());
    if (lenis) lenis.stop();
  });

  document.addEventListener('astro:after-swap', () => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      lenis.start();
    }
  });
}

async function copyText(text: string, button: HTMLButtonElement) {
  try {
    await navigator.clipboard.writeText(text);
    const label = button.querySelector('[data-copy-label]');
    if (label) {
      const previous = label.textContent;
      label.textContent = 'Copied';
      button.dataset.done = 'true';
      window.setTimeout(() => {
        label.textContent = previous ?? 'Copy';
        button.dataset.done = 'false';
      }, 1600);
    }
  } catch {
    button.dataset.done = 'false';
  }
}

function selectTab(tab: HTMLButtonElement) {
  const list = tab.parentElement;
  if (!list) return;
  list.querySelectorAll<HTMLButtonElement>('[role="tab"]').forEach((other) => {
    const selected = other === tab;
    other.setAttribute('aria-selected', String(selected));
    other.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(other.getAttribute('aria-controls') ?? '');
    if (panel) panel.hidden = !selected;
  });
}

function filterTools(input: HTMLInputElement) {
  const root = input.closest<HTMLElement>('[data-tools]');
  if (!root) return;
  const query = input.value.trim().toLowerCase();
  const tools = [...root.querySelectorAll<HTMLElement>('[data-tool]')];
  let shown = 0;
  tools.forEach((tool) => {
    const hit = query === '' || (tool.dataset.key ?? '').includes(query);
    tool.hidden = !hit;
    if (hit) shown += 1;
  });
  root.querySelectorAll<HTMLElement>('[data-tool-group]').forEach((group) => {
    const any = [...group.querySelectorAll<HTMLElement>('[data-tool]')].some((t) => !t.hidden);
    group.hidden = !any;
  });
  const empty = root.querySelector<HTMLElement>('[data-tools-empty]');
  if (empty) empty.hidden = shown !== 0;
  const count = root.querySelector<HTMLElement>('[data-tool-count]');
  if (count) count.textContent = query === '' ? '20 tools · 18 in MCP · 2 MCP only' : `${shown} of 20 tools`;
}

/* -------------------------------------------------------------------------- */
/* per page                                                                   */
/* -------------------------------------------------------------------------- */

function onPage() {
  const path = `${location.pathname}${location.search}`;
  if (bootedFor === path) return;
  bootedFor = path;

  ScrollTrigger.refresh();

  if (!reduced) reveals();
  rail();
  toc();
  demo();
  firstPaint();
}

function firstPaint() {
  // Anything above the fold is revealed at once, so the first frame is complete.
  document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-group]').forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) el.classList.add('is-in');
  });
}

function reveals() {
  document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-group]').forEach((el) => {
    if (el.classList.contains('is-in')) return;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => el.classList.add('is-in'),
    });
    cleanups.push(() => trigger.kill());
  });
}

function rail() {
  const items = [...document.querySelectorAll<HTMLElement>('[data-rail-item]')];
  if (items.length === 0) return;

  const setActive = (item: HTMLElement) => {
    items.forEach((other) => {
      const on = other === item;
      other.classList.toggle('is-active', on);
      other.querySelector('a')?.setAttribute('aria-current', on ? 'true' : 'false');
    });
  };

  items.forEach((item) => {
    const hash = new URL(item.dataset.railTarget ?? '', location.href).hash;
    const section = hash ? document.querySelector<HTMLElement>(hash) : null;
    if (!section) return;
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 45%',
      end: 'bottom 45%',
      onToggle: (self) => {
        if (self.isActive) setActive(item);
      },
    });
    cleanups.push(() => trigger.kill());
  });
}

function toc() {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-toc] a')];
  if (links.length === 0) return;
  links.forEach((link) => {
    const id = link.getAttribute('href')?.replace('#', '');
    const heading = id ? document.getElementById(id) : null;
    if (!heading) return;
    const trigger = ScrollTrigger.create({
      trigger: heading,
      start: 'top 120px',
      end: 'bottom 120px',
      onToggle: (self) => link.classList.toggle('is-active', self.isActive),
    });
    cleanups.push(() => trigger.kill());
  });
}

/* -------------------------------------------------------------------------- */
/* the signature: one decision of the ultrafast loop                          */
/* -------------------------------------------------------------------------- */

type DemoParts = {
  root: HTMLElement;
  page: HTMLElement;
  field: HTMLElement;
  query: HTMLElement;
  cursor: HTMLElement;
  op: HTMLElement;
  target: HTMLElement;
  value: HTMLElement;
  answer: HTMLElement;
  step: HTMLElement;
  rows: HTMLElement[];
  logs: HTMLElement[];
};

const demos = new WeakMap<HTMLElement, () => void>();

function demo() {
  document.querySelectorAll<HTMLElement>('[data-demo]').forEach((root) => {
    const parts = readDemo(root);
    if (!parts) return;

    const finish = () => {
      parts.query.textContent = DEMO_GOAL;
      parts.field.dataset.state = 'done';
      parts.op.textContent = 'CLICK';
      parts.target.textContent = '[3] · Lisbon, 20 Sep';
      parts.value.textContent = DEMO_GOAL;
      parts.answer.textContent = DEMO_ANSWER;
      parts.step.textContent = 'step 05 / 05';
      parts.rows[2]?.classList.add('is-target');
      parts.logs.forEach((line, i) => line.classList.toggle('on', i >= 1));
      gsap.set(parts.cursor, { opacity: 0 });
    };

    if (reduced) {
      finish();
      return;
    }

    let timeline: gsap.core.Timeline | null = null;

    const play = () => {
      timeline?.kill();
      gsap.killTweensOf(parts.cursor);
      parts.rows.forEach((row) => row.classList.remove('is-target'));
      parts.logs.forEach((line) => line.classList.remove('on'));
      parts.query.textContent = '';
      parts.field.dataset.state = 'typing';
      parts.op.textContent = '—';
      parts.target.textContent = '—';
      parts.value.textContent = '—';
      parts.answer.textContent = 'nothing read yet';
      parts.step.textContent = 'step 01 / 05';

      const pageRect = parts.page.getBoundingClientRect();
      const fieldRect = parts.field.getBoundingClientRect();
      const rowRect = parts.rows[2]?.getBoundingClientRect() ?? fieldRect;

      const toField = {
        x: fieldRect.left - pageRect.left + 28,
        y: fieldRect.top - pageRect.top + fieldRect.height / 2 - 9,
      };
      const toRow = {
        x: rowRect.left - pageRect.left + 26,
        y: rowRect.top - pageRect.top + rowRect.height / 2 - 9,
      };

      const typed = { chars: 0 };
      const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
      timeline = tl;

      tl.set(parts.cursor, { ...toField, x: toField.x - 90, y: toField.y + 26, opacity: 1, scale: 1 })
        .call(() => {
          parts.logs[0]?.classList.add('on');
        })
        .to(parts.cursor, { x: toField.x, y: toField.y, duration: 0.55 })
        .call(() => ripple(parts.cursor))
        .to({}, { duration: 0.18 })
        .call(() => {
          parts.logs[1]?.classList.add('on');
          parts.logs[1] && (parts.logs[1].textContent = '02 decision · TYPE_TEXT');
          parts.op.textContent = 'TYPE_TEXT';
          parts.step.textContent = 'step 03 / 05';
        })
        .to(typed, {
          chars: DEMO_GOAL.length,
          duration: 1.35,
          ease: 'none',
          onUpdate: () => {
            parts.query.textContent = DEMO_GOAL.slice(0, Math.round(typed.chars));
          },
        })
        .call(() => {
          parts.value.textContent = DEMO_GOAL;
          parts.logs[2]?.classList.add('on');
        })
        .to({}, { duration: 0.55 })
        .call(() => {
          parts.rows[2]?.classList.add('is-target');
          parts.step.textContent = 'step 04 / 05';
        })
        .to(parts.cursor, { x: toRow.x, y: toRow.y, duration: 0.5 }, '<')
        .call(() => ripple(parts.cursor))
        .to({}, { duration: 0.24 })
        .call(() => {
          parts.op.textContent = 'CLICK';
          parts.target.textContent = '[3] · Lisbon, 20 Sep';
          parts.logs[3]?.classList.add('on');
          parts.step.textContent = 'step 05 / 05';
        })
        .to({}, { duration: 0.45 })
        .call(() => {
          parts.answer.textContent = DEMO_ANSWER;
          parts.field.dataset.state = 'done';
          parts.logs[4]?.classList.add('on');
          parts.logs[2] && (parts.logs[2].textContent = `03 type · ${DEMO_GOAL.length} chars`);
          parts.logs[3] && (parts.logs[3].textContent = '04 click [3] · ok');
        })
        .call(() => {
          // the concept keeps breathing while the visitor does nothing
          gsap.to(parts.cursor, {
            y: toRow.y - 5,
            duration: 2.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        });
    };

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: 'top 92%',
      end: 'bottom 8%',
      onEnter: () => play(),
      onEnterBack: () => play(),
      onLeave: () => timeline?.pause(),
      onLeaveBack: () => timeline?.pause(),
    });

    const replay = () => {
      gsap.killTweensOf(parts.cursor);
      play();
    };
    demos.set(root, replay);
    cleanups.push(() => {
      trigger.kill();
      timeline?.kill();
      gsap.killTweensOf(parts.cursor);
      demos.delete(root);
    });
  });
}

const DEMO_GOAL = 'flights lisbon 20 sep';
const DEMO_ANSWER = '09:40 nonstop · 2h45 · from €84';

function readDemo(root: HTMLElement): DemoParts | null {
  const pick = (selector: string) => root.querySelector<HTMLElement>(selector);
  const page = pick('.demo__page');
  const field = pick('[data-demo-field]');
  const query = pick('[data-demo-query]');
  const cursor = pick('[data-demo-cursor]');
  const op = pick('[data-demo-op]');
  const target = pick('[data-demo-target]');
  const value = pick('[data-demo-value]');
  const answer = pick('[data-demo-answer-text]');
  const step = pick('[data-demo-step]');
  const rows = [...root.querySelectorAll<HTMLElement>('[data-demo-row]')];
  const logs = [...root.querySelectorAll<HTMLElement>('[data-demo-log]')];
  if (!page || !field || !query || !cursor || !op || !target || !value || !answer || !step || rows.length < 3) {
    return null;
  }
  return { root, page, field, query, cursor, op, target, value, answer, step, rows, logs };
}

function ripple(cursor: HTMLElement) {
  cursor.classList.remove('is-ripple');
  // force a reflow so the animation can restart
  void cursor.offsetWidth;
  cursor.classList.add('is-ripple');
  gsap.delayedCall(0.55, () => cursor.classList.remove('is-ripple'));
}

/* -------------------------------------------------------------------------- */
/* boot                                                                       */
/* -------------------------------------------------------------------------- */

function boot() {
  onPage();

  // Scrollable code blocks, tables and data panels must be reachable without a pointer.
  document.querySelectorAll<HTMLElement>('pre, table, .data').forEach((el) => {
    if (el.scrollWidth > el.clientWidth + 1 && !el.hasAttribute('tabindex')) {
      el.tabIndex = 0;
      if (el.tagName === 'PRE') el.setAttribute('aria-label', 'Scrollable code');
      if (el.classList.contains('data')) el.setAttribute('aria-label', 'Scrollable table');
    }
  });
}

initGlobal();

document.addEventListener('astro:page-load', boot);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

// Replay buttons are delegated here because the demo instance lives in page scope.
document.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>('[data-demo-replay]');
  if (!button) return;
  const root = button.closest<HTMLElement>('[data-demo]');
  if (!root) return;
  if (reduced) return;
  demos.get(root)?.();
});
