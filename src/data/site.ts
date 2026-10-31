export const SITE = {
  name: 'HailBrowser',
  domain: 'hailbrowser.genrecai.com',
  url: 'https://hailbrowser.genrecai.com',
  repo: 'https://github.com/Shyamnath-Sankar/project-hailbrowser',
  download: 'https://github.com/Shyamnath-Sankar/project-hailbrowser/archive/refs/heads/main.zip',
  version: '0.1.0',
  license: 'MIT',
  tagline: 'The fastest browser use ever measured, in the Chrome you are already signed into.',
  description:
    'HailBrowser is an open-source browser-use agent for the Chrome you are already signed into: a side panel for everyday jobs and an MCP server that lets Claude Code, OpenCode, Cursor or Codex drive your real, logged-in browser. Ultrafast averages 4.2s per task over 26 tasks.',
  port: 12306,
  minChrome: 116,
  toolCount: 20,
  mcpToolCount: 18,
} as const;

export const AUTHOR = {
  name: 'Shyamnath Sankar',
  url: 'https://shyamnathsankar.genrecai.com/',
  role: 'Creator and maintainer',
  sameAs: [
    'https://shyamnathsankar.genrecai.com/',
    'https://github.com/Shyamnath-Sankar',
  ],
} as const;

export const COMPANY = {
  name: 'GenrecAI',
  url: 'https://genrecai.com',
} as const;

export const BENCH = {
  passed: 26,
  total: 26,
  runs: 3,
  avg: '4.2s',
  avgSlowest: '4.3s',
  actions: 69,
  decisions: 127,
  textCalls: 4,
  script: 'https://github.com/Shyamnath-Sankar/project-hailbrowser/blob/main/scripts/bench-fast.mjs',
  live: [
    {"goal":"Open YouTube and search for trending videos of today","result":"results page","time":"6.7–9.4s"},
    {"goal":"Search Wikipedia for Gödel's incompleteness theorems and open the article","result":"article open","time":"10.2s"},
    {"goal":"Open Wikipedia and find out in which year Gödel published his incompleteness theorems","result":"answered 1931","time":"14.4s"},
    {"goal":"Search Wikipedia for Ada Lovelace and find out which year she was born","result":"answered 1815","time":"11.0s"},
  ],
  compare: [
    {"metric":"Success","fast":"26/26 (100%) on three full runs","chat":"17/17 on the original task set"},
    {"metric":"Average time per task","fast":"4.2–4.3s","chat":"7.8s"},
    {"metric":"Four hardest multi-step tasks","fast":"4/4 · 6.2s average","chat":"4/4 · 22.6s average (one took 71s)"},
    {"metric":"False “done” claims","fast":"0","chat":"0"},
    {"metric":"Decision model","fast":"Mercury Decide (Inception)","chat":"Mercury 2"},
  ],
  progress: [
    {"stage":"Before the upgrades","score":"10/17 (59%)","note":"1 false “done”","avg":"3.2s"},
    {"stage":"Better page reading and new actions","score":"17/17","note":"—","avg":"3.9s"},
    {"stage":"Checklist and chat-model fallback","score":"21/21","note":"—","avg":"4.4s"},
    {"stage":"Answers to questions","score":"26/26","note":"—","avg":"4.2–4.6s"},
    {"stage":"Text extracted straight from the goal","score":"26/26","note":"—","avg":"4.2s"},
  ],
  tasks: [
    {"task":"Add a specific product to cart (6 identical buttons)","actions":1,"time":"1.6s"} ,
    {"task":"Cheapest item to cart","actions":1,"time":"1.8s"} ,
    {"task":"Answer: price of a product","actions":0,"time":"2.1s"} ,
    {"task":"Answer: cheapest product + price","actions":0,"time":"2.4s"} ,
    {"task":"Answer: “not on the page” (no made-up answer)","actions":0,"time":"2.5s"} ,
    {"task":"Close a dialog with Esc, then click","actions":2,"time":"2.6s"} ,
    {"task":"Link that opens a new tab, then confirm","actions":2,"time":"2.6s"} ,
    {"task":"Search with no button (press Enter)","actions":2,"time":"2.9s"} ,
    {"task":"Hover menu → submenu item","actions":2,"time":"2.9s"} ,
    {"task":"Custom dropdown menu sort","actions":2,"time":"3.3s"} ,
    {"task":"Search + count results (answer)","actions":2,"time":"3.4s"} ,
    {"task":"Pagination to item 27","actions":3,"time":"3.7s"} ,
    {"task":"Tabs widget → mark review helpful","actions":2,"time":"3.7s"} ,
    {"task":"Date picker + continue","actions":2,"time":"3.8s"} ,
    {"task":"Brand + price filters","actions":3,"time":"3.9s"} ,
    {"task":"Autocomplete pick (Zurich)","actions":3,"time":"4.4s"} ,
    {"task":"Unlabeled search box","actions":2,"time":"4.4s"} ,
    {"task":"Button far below the fold","actions":5,"time":"5.0s"} ,
    {"task":"Flight form + checkbox","actions":3,"time":"5.2s"} ,
    {"task":"Cookie wall, then subscribe","actions":3,"time":"5.7s"} ,
    {"task":"Search + sort by price","actions":3,"time":"5.9s"} ,
    {"task":"Search + sort + in-stock filter","actions":4,"time":"6.1s"} ,
    {"task":"Scroll inside a panel to find Kyoto","actions":8,"time":"6.2s"} ,
    {"task":"Form inside a dialog (address)","actions":4,"time":"6.9s"} ,
    {"task":"Answer: phone number in footer","actions":4,"time":"7.0s"} ,
    {"task":"Two autocompletes + travellers (trip search)","actions":6,"time":"8.5s"} ,
  ],
} as const;

export const NAV = [
  { href: '/docs', label: 'Docs' },
  { href: '/use-cases', label: 'Use cases' },
  { href: '/benchmarks', label: 'Benchmarks' },
  { href: '/faq', label: 'FAQ' },
  { href: '/support', label: 'Support' },
] as const;

export const INSTALL = {
  clone: `git clone https://github.com/Shyamnath-Sankar/project-hailbrowser.git
cd project-hailbrowser
npm install`,
  load: 'chrome://extensions',
  setup: 'npm run setup',
} as const;

export const FOOTER_LINKS = [
  {
    title: 'Product',
    links: [
      { href: '/#install', label: 'Download' },
      { href: '/benchmarks', label: 'Benchmarks' },
      { href: '/use-cases', label: 'Use cases' },
      { href: '/docs/modes', label: 'Modes' },
      { href: '/docs/mcp', label: 'Tool reference' },
    ],
  },
  {
    title: 'Compare',
    links: [
      { href: '/browser-use', label: 'Browser use' },
      { href: '/comet-alternative', label: 'Open-source Comet' },
      { href: '/use-cases/coding-agents', label: 'Claude Code & MCP' },
      { href: '/docs/security', label: 'Security model' },
    ],
  },
  {
    title: 'Docs',
    links: [
      { href: '/docs/install', label: 'Install' },
      { href: '/docs/connect', label: 'Connect an agent' },
      { href: '/docs/mcp', label: 'MCP reference' },
      { href: '/docs/modes', label: 'Research, tasks, fast' },
    ],
  },
  {
    title: 'Help',
    links: [
      { href: '/faq', label: 'FAQ' },
      { href: '/support', label: 'Support' },
      { href: '/about', label: 'About' },
      { href: '/llms.txt', label: 'llms.txt' },
    ],
  },
] as const;

export const FAQ = [
  {
    q: 'Does HailBrowser use my real Chrome profile?',
    a: 'Yes. It drives your normal tabs through chrome.debugger, so the sites you are signed into already work. There is no separate profile, no --remote-debugging-port and nothing to install in the browser beyond the extension.',
  },
  {
    q: 'Do I need an API key to use it?',
    a: 'The side panel needs a model key from whichever provider you choose: Anthropic, OpenAI, OpenRouter, Gemini, Together AI, Groq, DeepSeek, Ollama, LM Studio or any OpenAI-compatible endpoint. Keys live in chrome.storage.local and go only to that provider.',
  },
  {
    q: 'Can my coding agent use my logged-in browser?',
    a: 'That is the point of the MCP server. Claude Code, OpenCode, Cursor, Codex, Windsurf, Gemini CLI and Claude Desktop all speak MCP, so each can call read_page, click, type and the rest through the local hub on 127.0.0.1:12306. The side panel header turns green when an agent is connected.',
  },
  {
    q: 'Which browsers does it support?',
    a: 'Chrome, Edge, Brave and other Chromium desktop browsers version 116 or newer. It is a Manifest V3 extension written in plain ES modules, with no build step.',
  },
  {
    q: 'Is it free?',
    a: 'HailBrowser is MIT licensed. You pay only your model provider, and only when a step calls it.',
  },
  {
    q: 'What can it not do yet?',
    a: 'Shadow DOM, cross-origin iframes, canvas apps, file uploads and pop-up windows are not fully supported. Research cannot read PDFs. Scheduled jobs only run while Chrome is open, and one run happens at a time. chrome:// pages and the Chrome Web Store cannot be automated at all because Chrome blocks it.',
  },
  {
    q: 'How is this different from a cloud browser agent?',
    a: 'Nothing runs in a remote browser. HailBrowser uses the browser you are already signed into, on your machine, and shows the work: an animated border, an agent cursor, a status pill with Stop, and every step in the side panel.',
  },
  {
    q: 'Does my data leave my machine?',
    a: 'Your keys stay in the extension, the MCP hub listens on 127.0.0.1 only, and page content goes to the model provider you configured. The project has no telemetry and no account to create.',
  },
] as const;

export const SECURITY = [
  {
    k: 'Keys never leave the extension',
    v: 'API keys are stored in chrome.storage.local and sent only to the provider you call. No proxy, no account, no telemetry.',
  },
  {
    k: 'Localhost only',
    v: 'The MCP hub listens on 127.0.0.1:12306 and refuses WebSocket connections from web pages: any Origin other than a chrome-extension is rejected.',
  },
  {
    k: 'One extension may drive',
    v: 'The first HailBrowser that connects is trusted and remembered in ~/.hailbrowser/trusted-extension.json. Other extensions are rejected. After reinstalling from another folder run npx hailbrowser-mcp trust <new id>.',
  },
  {
    k: 'External agents can be switched off',
    v: 'Settings has an Allow external agents toggle, and the javascript tool can be disabled separately. Both apply to MCP clients, not just the side panel.',
  },
  {
    k: 'Page text is untrusted',
    v: 'Every prompt treats page content as data. Agents are told never to enter passwords or payment details, and never to complete a purchase without explicit instruction.',
  },
  {
    k: 'Nothing finishes late',
    v: 'If a call times out or an agent cancels it, the action in flight is stopped rather than completed later. Screenshots taken for the model hide the overlay, so it sees the page as it is.',
  },
  {
    k: 'Scheduled runs are stricter',
    v: 'A scheduled job never sends, buys, posts or deletes anything unless the goal says so, and it reports what needs you instead of waiting.',
  },
] as const;

export const LIMITS = [
  'Shadow DOM, cross-origin iframes, canvas apps, file uploads and pop-up windows are not fully supported yet.',
  'Research cannot read PDFs yet, so sources that only exist as PDFs are skipped.',
  'Scheduled jobs only run while Chrome is open, and a job that came due while Chrome was closed runs once at the next start.',
  'One run happens at a time. Scheduled jobs that come due during another run wait in a queue.',
  'Ultrafast sees on-screen elements only and scrolls to find more.',
  'A model DONE is a claim, not proof. Verify outcomes that matter.',
  'chrome:// pages and the Chrome Web Store cannot be automated because Chrome blocks it.',
] as const;

export const MODES = [
  {
    n: '01',
    title: 'Chat',
    href: '/docs/modes#chat',
    tags: ['tool calling', 'any provider'],
    body:
      'A full tool-calling agent for the tab you are looking at. It reads the page as refs, clicks, types, takes screenshots and runs JavaScript when it has to, and it hands a question to Research or a long job to Tasks on its own.',
  },
  {
    n: '02',
    title: 'Fast',
    href: '/docs/modes#fast',
    tags: ['ultrafast', 'one request per step'],
    body:
      'The model chooses an operation and an observed element index. It never writes selectors, coordinates or code. The executor re-checks the page before each input and retries the decision, not the action, when something moved.',
  },
  {
    n: '03',
    title: 'Research',
    href: '/docs/modes#research',
    tags: ['quick', 'standard', 'deep'],
    body:
      'Two to four search queries, then the best sources open in background tabs of your browser, so pages that need JavaScript or your logins still work. Every claim in the report carries a numbered source.',
  },
  {
    n: '04',
    title: 'Tasks',
    href: '/docs/modes#tasks',
    tags: ['3 to 15 subtasks', 'resumable'],
    body:
      'A long goal is split into concrete subtasks, each one running with a fresh, focused context. Progress is saved after every step, so closing the panel or restarting Chrome pauses the task instead of losing it.',
  },
] as const;

