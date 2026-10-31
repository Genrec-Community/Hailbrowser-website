export type DocLink = {
  href: string;
  label: string;
  group: 'Start' | 'Reference' | 'Behaviour';
  blurb: string;
};

export const DOCS: DocLink[] = [
  { href: '/docs/install', label: 'Install', group: 'Start', blurb: 'Clone, load the folder, add a key, verify it works.' },
  { href: '/docs/connect', label: 'Connect an agent', group: 'Start', blurb: 'Claude Code, OpenCode, Cursor, Codex, Claude Desktop, Gemini CLI.' },
  { href: '/docs/mcp', label: 'MCP reference', group: 'Reference', blurb: 'All twenty tools, parameters, return shapes and failures.' },
  { href: '/docs/modes', label: 'Modes', group: 'Behaviour', blurb: 'Chat, Fast, Research and Tasks: what each one does and costs.' },
  { href: '/docs/security', label: 'Security', group: 'Behaviour', blurb: 'Keys, loopback, the trust file and what agents will not do.' },
  { href: '/docs/limits', label: 'Limits', group: 'Behaviour', blurb: 'What version 0.1.0 cannot do yet, without hedging.' },
];

export const DOC_GROUPS: DocLink['group'][] = ['Start', 'Reference', 'Behaviour'];

export function pagerFor(href: string) {
  const index = DOCS.findIndex((doc) => doc.href === href);
  return {
    prev: index > 0 ? DOCS[index - 1] : { href: '/docs', label: 'Docs', blurb: '' },
    next: index >= 0 && index < DOCS.length - 1 ? DOCS[index + 1] : null,
  };
}
