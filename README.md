# Resume Generator Agent 📄

An AI-powered resume generator built with the **Claude Agent SDK** and TypeScript. It takes your structured data, enhances the content with strong action verbs and quantified achievements, and outputs a professional, ATS-friendly HTML resume.

## How It Works

```
data/resume.json  →  Claude Agent  →  output/resume.html
   (your info)       (enhances &       (polished resume)
                      formats)
```

The agent:
1. Reads your resume data from `data/resume.json`
2. Improves bullet points with action verbs and impact metrics
3. Generates a clean, print-ready HTML resume
4. Saves both HTML and plain-text versions to `output/`

## Prerequisites

- **Node.js** v18+ 
- **Claude Code CLI** installed and authenticated with your Max subscription
  ```bash
  # Install Claude Code globally
  npm install -g @anthropic-ai/claude-code

  # Authenticate (opens browser for OAuth)
  claude login
  ```

## Setup

```bash
# Clone and enter the project
cd resume-generator

# Install dependencies
npm install

# Edit data/resume.json with YOUR details
# (a sample is already provided)

# Run the agent
npm run dev
```

## Project Structure

```
resume-generator/
├── src/
│   ├── index.ts        # Main agent entry point
│   └── types.ts        # TypeScript types for resume data
├── data/
│   └── resume.json     # Your resume data (edit this!)
├── output/
│   ├── resume.html     # Generated HTML resume
│   └── resume.txt      # Generated plain-text resume
├── package.json
├── tsconfig.json
└── README.md
```

## Key Concepts You'll Learn

### 1. Agent SDK `query()` function
The core of the agent — sends a prompt to Claude and streams back responses. The agent can autonomously decide to use tools (read files, write files, run bash commands) to complete its task.

### 2. Tool Use
The agent uses built-in tools:
- **Read** — reads your resume.json
- **Write** — saves the generated HTML/text files  
- **Bash** — creates directories, runs commands if needed

### 3. System Prompts for Agents
The system prompt defines the agent's behavior, design rules, and output format. This is where you control the quality of the generated resume.

### 4. Streaming Messages
The agent streams its work in real-time. You see tool usage, text output, and the final result as it happens.

## Customization Ideas

- **Add a PDF export** — use puppeteer to convert the HTML to PDF
- **Multiple templates** — add a `--template` flag for different resume styles
- **Interactive mode** — use the `AskUserQuestion` tool to collect info via CLI prompts
- **Cover letter generator** — extend the agent to also produce a tailored cover letter
- **Job description matching** — pass a job posting URL and tailor the resume to it

## Authentication Note

The Claude Agent SDK uses Claude Code under the hood. When you run `claude login` and authenticate with your **Max subscription**, the Agent SDK will use those credentials. You do NOT need a separate API key.

If you prefer using an API key instead:
```bash
export ANTHROPIC_API_KEY=sk-ant-...
```
