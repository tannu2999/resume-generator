import { query } from "@anthropic-ai/claude-agent-sdk";
import { readFileSync } from "fs";
import { resolve } from "path";

// ─── Configuration ───────────────────────────────────────────────
const RESUME_DATA_PATH = resolve(process.cwd(), "data/resume.json");
const OUTPUT_DIR = resolve(process.cwd(), "output");

// ─── System Prompt ───────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a professional resume builder agent. Your job is to:

1. Read the user's resume data from a JSON file.
2. Generate a beautifully formatted, ATS-friendly HTML resume.
3. Write the HTML resume to the output directory.

## Resume Design Rules:
- Use clean, modern design with a single-column layout
- Use a professional color scheme (dark headers, subtle accent colors)
- Ensure the HTML is self-contained with inline CSS (no external dependencies)
- Make it print-friendly (use @media print styles)
- Keep the design ATS-compatible — avoid tables for layout, use semantic HTML
- Use system fonts (Arial, Helvetica, sans-serif) for maximum compatibility
- The resume should fit on 1-2 pages when printed on A4/Letter paper

## Content Rules:
- Improve bullet points to use strong action verbs (Led, Built, Designed, etc.)
- Quantify achievements where possible
- Keep language concise and impactful 
- Tailor the summary to be compelling and specific
- Order sections: Header → Summary → Experience → Projects → Education → Skills

## Output:
- Write the final HTML to: output/resume.html
- Also create a plain-text version at: output/resume.txt
- Print a short summary of improvements you made to the content
`;

// ─── Main ────────────────────────────────────────────────────────
async function main() {
  // Check if resume data file exists
  let resumeDataPrompt: string;

  try {
    const rawData = readFileSync(RESUME_DATA_PATH, "utf-8");
    resumeDataPrompt = `Here is the user's resume data:\n\n\`\`\`json\n${rawData}\n\`\`\`\n\nPlease read this data, enhance the content, generate a professional HTML resume, and save it to the output/ directory. Also create a plain text version.`;
  } catch {
    // No data file found — ask the agent to collect info interactively
    resumeDataPrompt = `No resume data file was found at data/resume.json. 
    
Please help the user create their resume by:
1. Creating the output/ directory if it doesn't exist
2. Creating a template file at data/resume.json with the expected structure (refer to src/types.ts for the schema)
3. Tell the user to fill in their data in data/resume.json and run again.

For reference, here's the expected JSON structure:
{
  "personal": { "name": "", "email": "", "phone": "", "location": "", "summary": "" },
  "experience": [{ "company": "", "role": "", "startDate": "", "endDate": "", "location": "", "highlights": [] }],
  "education": [{ "institution": "", "degree": "", "field": "", "startDate": "", "endDate": "" }],
  "skills": { "languages": [], "frameworks": [], "tools": [] },
  "projects": [{ "name": "", "description": "", "techStack": [] }]
}`;
  }

  console.log("🚀 Starting Resume Generator Agent...\n");

  // Run the agent
  const stream = query({
    prompt: resumeDataPrompt,
    options: {
      systemPrompt: SYSTEM_PROMPT,
      // Allow the agent to read files and write output
      tools: ["Read", "Write", "Bash"],
      // Auto-approve these tools so the agent runs without permission prompts
      allowedTools: ["Read", "Write", "Bash"],
      // Max turns before the agent stops
      maxTurns: 15,
      // Use your preferred model (defaults to sonnet)
      // model: "opus",
    },
  });

  // Stream and display agent messages
  for await (const message of stream) {
    switch (message.type) {
      case "assistant":
        // The agent's text responses
        if (message.message.content) {
          for (const block of message.message.content) {
            if (block.type === "text") {
              console.log(block.text);
            }
          }
        }
        break;

      case "tool_use_summary":
        // Log a summary of tool usage
        console.log(`\n🔧 ${message.summary}`);
        break;

      case "result":
        // Final result
        console.log("\n✅ Resume generation complete!");
        console.log(`📄 Check the output/ directory for your resume files.`);
        break;
    }
  }
}

main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});
