export type Param = { name: string; required?: boolean; note?: string };

export type Tool = {
  name: string;
  group: 'Session' | 'Read' | 'Act' | 'Script' | 'Delegate';
  description: string;
  params: Param[];
  mcpOnly?: boolean;
};

/**
 * Taken from extension/src/tools/schemas.js, which is the canonical definition shared by
 * the side panel and the MCP server. Keep this file in sync when the schemas change.
 */
export const TOOLS: Tool[] = [
  {
    name: 'tabs_context',
    group: 'Session',
    description: 'List open tabs with id, title and url, and show which tab the tools act on by default. Call this first.',
    params: [],
  },
  {
    name: 'tabs_create',
    group: 'Session',
    description: 'Open a new background tab without stealing focus and make it the current agent tab.',
    params: [
      { name: 'url', note: 'default about:blank' },
      { name: 'activate', note: 'bring to front, default false' },
    ],
  },
  {
    name: 'tabs_select',
    group: 'Session',
    description: 'Make an existing tab the current agent tab. Set activate only when the person wants to watch.',
    params: [{ name: 'tabId', required: true }, { name: 'activate' }],
  },
  {
    name: 'tabs_close',
    group: 'Session',
    description: 'Close a tab you opened.',
    params: [{ name: 'tabId', required: true }],
  },
  {
    name: 'navigate',
    group: 'Session',
    description: 'Load a URL in the tab and wait for it. Also accepts back, forward or reload.',
    params: [{ name: 'url', required: true }, { name: 'tabId' }],
  },
  {
    name: 'read_page',
    group: 'Read',
    description:
      'The page as an indexed list of interactive elements ([ref_N] role "name" value=...) plus the visible text. Cheaper and more precise than a screenshot.',
    params: [
      { name: 'tabId' },
      { name: 'viewportOnly', note: 'only elements on screen' },
      { name: 'maxElements', note: 'default 300' },
      { name: 'compact', note: 'on-screen only, max 150, less text' },
    ],
  },
  {
    name: 'find',
    group: 'Read',
    description: 'Find interactive elements whose role, name, value or placeholder contains the query. Returns refs.',
    params: [{ name: 'query', required: true }, { name: 'tabId' }],
  },
  {
    name: 'get_page_text',
    group: 'Read',
    description: 'Readable text of the page, main content first. Use it for articles, results and anything you need to quote.',
    params: [{ name: 'tabId' }, { name: 'maxChars', note: 'default 20000' }],
  },
  {
    name: 'screenshot',
    group: 'Read',
    description:
      'Capture the visible part of the tab as an image. Coordinates in the image can be passed to click, scroll and hover.',
    params: [{ name: 'tabId' }],
  },
  {
    name: 'click',
    group: 'Act',
    description: 'Click by ref (preferred) or at screenshot coordinates. Real, trusted mouse events through CDP.',
    params: [
      { name: 'ref', note: 'e.g. ref_12' },
      { name: 'x' },
      { name: 'y' },
      { name: 'tabId' },
      { name: 'button', note: 'left, right, middle' },
      { name: 'clickCount', note: '2 for double click' },
      { name: 'modifiers', note: 'ctrl, shift, alt, meta' },
    ],
  },
  {
    name: 'type',
    group: 'Act',
    description:
      'Focus a field and replace its content (clear=false appends), then report whether the page changed or rejected the value. Without a ref it types into the focused element and says which one.',
    params: [
      { name: 'text', required: true },
      { name: 'ref' },
      { name: 'tabId' },
      { name: 'clear' },
      { name: 'submit', note: 'press Enter afterwards' },
    ],
  },
  {
    name: 'press_key',
    group: 'Act',
    description: 'Press keys or chords, space separated: Enter, Tab Tab, ctrl+a Backspace, Escape, ArrowDown.',
    params: [{ name: 'keys', required: true }, { name: 'tabId' }, { name: 'repeat' }],
  },
  {
    name: 'scroll',
    group: 'Act',
    description:
      'Scroll the box under a ref or point, or the page when neither is given. Says "Nothing scrolled" when it is already at the end.',
    params: [
      { name: 'direction', required: true, note: 'up, down, left, right' },
      { name: 'amount', note: 'wheel ticks of about 120px, default 5' },
      { name: 'ref' },
      { name: 'x' },
      { name: 'y' },
      { name: 'tabId' },
    ],
  },
  {
    name: 'select_option',
    group: 'Act',
    description:
      'Choose an option of a native select by value or visible label. For multi-selects, option adds one choice and options sets the full list.',
    params: [
      { name: 'ref', required: true },
      { name: 'option' },
      { name: 'options', note: 'full list for multi-selects' },
      { name: 'tabId' },
    ],
  },
  {
    name: 'hover',
    group: 'Act',
    description: 'Move the pointer over an element or point to reveal menus and tooltips.',
    params: [{ name: 'ref' }, { name: 'x' }, { name: 'y' }, { name: 'tabId' }],
  },
  {
    name: 'handle_dialog',
    group: 'Act',
    description:
      'Close a confirm, prompt or "leave site?" dialog that is freezing the page. Plain alerts close automatically and are reported in the next result.',
    params: [
      { name: 'accept', note: 'true = OK / Leave, default true' },
      { name: 'text', note: 'answer for prompt()' },
      { name: 'tabId' },
    ],
  },
  {
    name: 'wait',
    group: 'Act',
    description: 'Wait for results to load. Ten seconds maximum.',
    params: [{ name: 'seconds', required: true }],
  },
  {
    name: 'javascript',
    group: 'Script',
    description:
      'Evaluate an expression in the page and return its JSON result. Top-level await works. For inspection and extraction; prefer click and type for interaction.',
    params: [{ name: 'code', required: true }, { name: 'tabId' }],
  },
  {
    name: 'run_task',
    group: 'Delegate',
    mcpOnly: true,
    description:
      'Hand a whole goal to HailBrowser\u2019s own agent with the models configured in the extension. ultrafast is one decision request per step; normal is the full tool-calling agent. Returns a summary and the step log.',
    params: [
      { name: 'goal', required: true, note: 'include every value the agent needs' },
      { name: 'mode', note: 'normal or ultrafast' },
      { name: 'url', note: 'start URL' },
      { name: 'values', note: 'field name to text, e.g. From: Zurich' },
      { name: 'tabId' },
    ],
  },
  {
    name: 'stop_task',
    group: 'Delegate',
    mcpOnly: true,
    description:
      'Stop the run_task an agent started. Tasks the person started in the side panel can only be stopped there.',
    params: [],
  },
];

export const TOOL_GROUPS: { key: Tool['group']; title: string; blurb: string }[] = [
  { key: 'Session', title: 'Tabs and navigation', blurb: 'Find the tab, open one, move it, close it.' },
  { key: 'Read', title: 'Reading the page', blurb: 'Refs and text first, pixels when they help.' },
  { key: 'Act', title: 'Acting on the page', blurb: 'Trusted input, with a report on what changed.' },
  { key: 'Script', title: 'Scripting', blurb: 'One escape hatch, can be switched off in Settings.' },
  { key: 'Delegate', title: 'Hand over a goal', blurb: 'MCP only: let HailBrowser drive instead of driving it.' },
];
