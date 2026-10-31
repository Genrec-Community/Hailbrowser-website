export type Client = {
  id: string;
  label: string;
  file: string;
  lang: 'bash' | 'json' | 'toml';
  code: string;
  note?: string;
};

const NODE = '/path/to/hailbrowser/mcp-server/src/index.js';

/**
 * Snippets mirror docs/connect.md. `npm run setup` prints all of them with the real
 * absolute path of your checkout, which is what the page tells people to run first.
 */
export const CLIENTS: Client[] = [
  {
    id: 'claude-code',
    label: 'Claude Code',
    file: 'terminal',
    lang: 'bash',
    code: `claude mcp add hailbrowser --scope user -- node ${NODE}`,
    note: 'Check with claude mcp list. Copy SKILL.md to ~/.claude/skills/hailbrowser/SKILL.md so Claude knows the workflow.',
  },
  {
    id: 'opencode',
    label: 'OpenCode',
    file: '~/.config/opencode/opencode.json',
    lang: 'json',
    code: `{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "hailbrowser": {
      "type": "local",
      "command": ["node", "${NODE}"],
      "enabled": true
    }
  }
}`,
    note: 'Or opencode.json in a single project. Pair it with a decision model so run_task needs no text-model key.',
  },
  {
    id: 'codex',
    label: 'Codex CLI',
    file: '~/.codex/config.toml',
    lang: 'toml',
    code: `[mcp_servers.hailbrowser]
command = "node"
args = ["${NODE}"]`,
  },
  {
    id: 'cursor',
    label: 'Cursor',
    file: '~/.cursor/mcp.json',
    lang: 'json',
    code: `{
  "mcpServers": {
    "hailbrowser": {
      "command": "node",
      "args": ["${NODE}"]
    }
  }
}`,
    note: 'The same block works for Claude Desktop, Windsurf and Gemini CLI, each in its own config file.',
  },
  {
    id: 'claude-desktop',
    label: 'Claude Desktop',
    file: 'claude_desktop_config.json',
    lang: 'json',
    code: `{
  "mcpServers": {
    "hailbrowser": {
      "command": "node",
      "args": ["${NODE}"]
    }
  }
}`,
  },
  {
    id: 'gemini',
    label: 'Gemini CLI',
    file: '~/.gemini/settings.json',
    lang: 'json',
    code: `{
  "mcpServers": {
    "hailbrowser": {
      "command": "node",
      "args": ["${NODE}"]
    }
  }
}`,
  },
];

export const CONNECT_OPTIONS = [
  { flag: '--port N', env: 'HAILBROWSER_PORT', def: '12306', meaning: 'Hub port. Set the same port in the extension Settings.' },
  { flag: 'HAILBROWSER_EXTENSION_ID', env: '', def: 'unset', meaning: 'Accept only this extension ID. Without it the first extension that connects is trusted.' },
  { flag: 'HAILBROWSER_TRUST_FILE', env: '', def: '~/.hailbrowser/trusted-extension.json', meaning: 'Where the trusted extension ID is remembered. Manage with hailbrowser-mcp trust.' },
] as const;

export const PROMPTS = [
  {
    title: 'Ask for the goal, not the steps',
    prompt: 'Use hailbrowser to open my GitHub notifications and summarise what needs a reply.',
  },
  {
    title: 'Hand over a form with its values',
    prompt: 'Use hailbrowser run_task in ultrafast mode to search Google Flights one way, 1 adult, From=Zurich, To=London, Date=2026-09-20.',
  },
  {
    title: 'Ask a question the page can answer',
    prompt: 'Use hailbrowser on my open tab to find what the plan costs and whether annual billing is cheaper.',
  },
  {
    title: 'Give it a recurring job',
    prompt: 'Every weekday at 8, use hailbrowser to check my supplier portal for new invoices and tell me the total.',
  },
] as const;
