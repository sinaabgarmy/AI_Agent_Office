# ChronoZero: Blockchain Exploit Defect Lab & Multi-Agent War Room

An open-source, virtualized cyber security defect lab and autonomous multi-agent debate arena for testing blockchain protocol vulnerabilities, consensus flaws, and cryptographic leaks in a controlled sandbox.

---

## 💻 What You Need on Your Windows 11 Laptop

To run ChronoZero live on your own Windows 11 computer with **zero hardware costs** and **100% free open-source tools**, install the following:

### 1. Mandatory Software (Free)
* **Node.js (v20+ LTS):**  
  Download the Windows Installer (`.msi`) from [https://nodejs.org/](https://nodejs.org/) and run the setup. Keep default checkboxes checked.
* **Web Browser:**  
  Microsoft Edge, Google Chrome, Brave, or Firefox.

### 2. Optional Recommended Tools
* **Git for Windows:** Download from [https://git-scm.com/](https://git-scm.com/) to easily clone repositories.
* **VS Code:** Free code editor from [https://code.visualstudio.com/](https://code.visualstudio.com/).

---

## 🍃 Setting Up MongoDB Free Plan (MongoDB Atlas M0)

ChronoZero supports **MongoDB Atlas Free Tier (M0)** for persistent storage of defect records, custom agent personas, and debate sessions. If you don't configure MongoDB, the system automatically falls back to an embedded in-memory database with browser synchronization so it never crashes!

To connect your free MongoDB Atlas database:
1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) and sign up (100% free, **no credit card required**).
2. Choose **"M0 Free"** as your cluster tier (Shared 512 MB storage, always free).
3. Select your preferred Cloud Provider and Region (e.g., AWS / Frankfurt or US-East).
4. **Security Quickstart:**
   * Create a Database Username & Password (e.g., `chrono_admin` and a strong password). Save this password!
   * Under **Network Access**, click **"Add IP Address"** -> select **"Allow Access from Anywhere"** (`0.0.0.0/0`) so your laptop can connect.
5. Click **Connect** -> **Drivers** (Node.js) -> Copy the connection string:
   ```text
   mongodb+srv://chrono_admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
6. Open your `.env` file in the project folder and paste the string:
   ```env
   MONGODB_URI="mongodb+srv://chrono_admin:YOUR_PASSWORD@cluster0.abcde.mongodb.net/chronozero_lab?retryWrites=true&w=majority"
   ```

---

## 🤖 Free AI APIs (Zero Cost)

ChronoZero is architected with dual AI capabilities:
1. **100% Free Autonomous Heuristic Engine (Default):**  
   Works out of the box with **zero API keys and zero internet access needed**. Simulates deep dialectical debates with real EVM opcodes, Lean4 invariants, and BFT consensus equations.
2. **Google Gemini Free Tier (Optional):**  
   If you want live real-time LLM streaming for custom bots:
   * Go to [https://aistudio.google.com/](https://aistudio.google.com/)
   * Click **"Get API key"** (free tier includes high rate limits)
   * Paste it into `.env` as `GEMINI_API_KEY="AIzaSy..."` or directly inside the ChronoZero in-app Settings modal!

---

## 🚀 How to Run the System on Windows 11

### Option 1: One-Click Startup (Recommended)
Simply **double-click** the file:
```text
start.bat
```
This batch script will:
1. Verify Node.js is installed.
2. Automatically initialize `.env` from `.env.example`.
3. Install required npm packages if missing (`npm install`).
4. Start the full-stack server on `http://localhost:3000`.
5. **Open your browser automatically the moment the server is actually live** — never too early, even during a slow first-time install.

### Option 2: PowerShell Launcher
Right-click `start.ps1` and choose **"Run with PowerShell"** (or run `powershell -ExecutionPolicy Bypass -File .\start.ps1`).

### Option 3: Command Line (development, with hot reload)
Open Terminal / PowerShell in the folder:
```bash
npm install
npm run dev
```
Then visit [http://localhost:3000](http://localhost:3000).

### Option 4: Production mode (lighter, no hot reload)
```bash
npm run build && npm run build:server
npm run start:dist
```
This compiles the frontend (`dist/`) and the backend (`dist-server/`), then serves everything from one Node process — less RAM, faster startup, no file watching.

---

## 🌍 Deployment Decision: Laptop-First, 100% Free

ChronoZero is designed to **run directly on your Windows 11 laptop** — that is the supported architecture:

* The Express + Vite + MongoDB stack runs perfectly on a normal laptop with Node.js. No server, no cloud bill, no porting work.
* **Do NOT deploy this Express app to Cloudflare Workers** — Workers cannot run Express middleware or the MongoDB driver's persistent TCP connections. That deploy path was removed from the plan on purpose.
* The infrastructure stack stays **100% free forever**: Node.js (open source) + MongoDB Atlas M0 (free tier) + Gemini/Groq free tiers + the built-in offline heuristic engine.

**Want to reach your lab from outside your home network (still free, still running on your laptop)?**
Use [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/):
```powershell
winget install Cloudflare.cloudflared
cloudflared tunnel --url http://localhost:3000
```
This prints a free temporary public URL (`https://<random>.trycloudflare.com`) that proxies straight to your laptop. No code changes, no port forwarding, no paid plan.

If you ever DO split the frontend and backend onto different hosts, set `VITE_API_URL` in `.env` to the backend origin — every API call in the app already respects it.

## 🛡️ Core Features Breakdown

### 1. War Room Debate Arena
* **5 to 10+ Bots:** Dr. Aris Thorne (@ZeroCipher), Vesper Vance (@0xNull), Elena Rostova (@SentinEL), Kaelen Jax (@ConsensusGhost), Nia Chen (@DarkPool), Prof. Magnus Lindqvist (@StateRoot), Zara Morales (@Entropy), Ronan Gallagher (@ByteCode), plus any custom agents you create!
* **Adversarial Cognitive Engine v2:** The bots genuinely ARGUE — every turn classifies the previous claim, picks a stance (Direct Rebuttal / Reinforce & Extend / Layer Redirect / Cross-Examination), attacks from a rotating angle deck, and callbacks to arguments made earlier. An anti-repetition ledger guarantees no bot ever repeats itself. Every turn shows a move chip (e.g. `Direct Rebuttal + Memory Callback · Censorship Weaponization`) and a live **Clash meter** shows what % of turns are direct rebuttals.
* **Scenario Forge:** Click the scenario dropdown → **"＋ Forge New Scenario"** to add YOUR OWN debate scenario (title, architecture, hypothesis, briefing, involved agents). Custom scenarios persist to MongoDB/localStorage and the debate engine anchors onto their exact vocabulary.
* **Speed Controls:** Run debates at 1x, 2x, **3x (0.7s/turn real-time)**, or step manually. A composing indicator shows which agent is writing the next rebuttal.
* **Live User Interjection:** Type your own exploit hypotheses or questions into the input bar — the most relevant specialist answers YOU directly ("Operator Response"), and the next bot rebuts that answer.

### 2. Exploit Types, Cost of Exploit & Defect Execution Mechanism
Located under **"Sandbox & Economics"**:
* **Exploit Types:**
  * Checks-Effects-Interactions (CEI) State Desynchronization Reentrancy
  * Byzantine 34% Gossip Withholding & Liveness Stall
  * Ephemeral Nonce Reuse Private Key Recovery via LLL Lattice Reduction
  * TWAP Oracle Price Staleness & Bad-Debt Injection
* **Cost of Exploit:**
  * **Capital Required:** Exact dollar amounts (e.g. $1,450 flash loan borrow fee vs $148,000,000 in staked validator nodes).
  * **Gas Priority Bribe:** Flashbots private builder tips (e.g. 0.65 ETH).
  * **Compute Cost:** Hardware requirements (e.g. standard CPU vs 0 GPU hours).
  * **Capital at Risk:** Slashed stake risk vs reverted bundle cost.
  * **MEV Profit Potential & ROI:** Potential extraction value (e.g. +21,379,200% ROI).
* **Defect Execution Mechanism:**
  * **Preconditions:** Exact protocol state required before the defect can trigger.
  * **Chronological Phases:** Phase 1 (Reconnaissance) -> Phase 2 (Desynchronization) -> Phase 3 (Drain) -> Phase 4 (Settlement).
  * **Critical Defect Point:** Pinpoints the vulnerable line of code.
  * **Defensive Tripwire:** Explains which assertion or circuit breaker halts the attack.

### 3. Log Decryption Terminal
* Intercepted files from the development network (`MEMO-DEV-2026-0941.enc`, `VALIDATOR-TELEMETRY-CLUSTER3.enc`, etc.).
* Built-in tools for XOR Hex decoding, Base64 decoding, and AES-GCM decryption.
* Auto-solve with cryptanalyst bot `@Entropy`.
* One-click action to catalog discovered flaws into the Defect Matrix.

### 4. Agent Studio (Customize Agents & System Instructions)
* Add new custom cybersecurity bots with custom names, handles, roles, and ideologies.
* **Custom System Instructions:** Write prompt instructions governing how the bot argues, what vulnerabilities it prioritizes, and what invariants it cites.
* Custom bots get their own generated **angle decks** in the debate engine, so they argue with full variety instead of repeating one sentence.
* Test agent instruction responses directly in the interactive prompt sandbox.
* Persists automatically to your free MongoDB Atlas database and localStorage.

### 4b. Engine Self-Test (optional)
Run `npx tsx soak-test.ts` in the project folder to verify the debate engine end-to-end: 50 simulated turns across three scenarios assert zero repeated content, cross-referencing between agents, move/angle variety, operator-interjection handling, and custom-scenario support.

### 5. Markdown Report Exporting (`.md`)
Click **"Export Playbook"** in the top navigation bar at any time to generate and download a comprehensive, publication-grade security report in clean Markdown (`.md`) containing:
* Executive Summary
* Agent Dossiers & Custom System Instructions
* Exploit Economics & Taxonomy Matrix
* Decrypted Internal Communication Logs
* Full Defect Remediation Playbook (CVE and CWE indexed)
* Complete Debate Transcripts

---

## 🔧 Windows 11 Troubleshooting

* **Port 3000 is in use:**  
  The server now detects this and tells you clearly. Change `PORT=3000` to `PORT=3005` in your `.env` file and restart.
* **PowerShell script restriction:**  
  If Windows blocks running `.ps1` scripts, open PowerShell as Administrator and run:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
  ```
  Or simply use `start.bat`.
* **MongoDB connection timeout:**  
  Make sure your IP address is whitelisted in MongoDB Atlas under **Network Access** (`0.0.0.0/0`). If MongoDB is unreachable, ChronoZero continues operating seamlessly using its local in-memory database!

---

*ChronoZero is 100% Free and Open Source under the GPL-3.0 License for Ethical Cybersecurity Research & Education.*

---

## 🗂️ Knowledge Vault — Obsidian Memory System (v3)

ChronoZero now ships with a permanent, local, **100% free** knowledge brain powered by Obsidian:

- **Every debate** is archived as Markdown (written live, message by message).
- **Concepts, claims, discoveries, contradictions** are auto-extracted and connected with `[[wikilinks]]` — open Obsidian's Graph View and watch your knowledge network grow.
- **Hybrid persistent memory**: before each turn, agents retrieve their own history, the council's collective memory, and topic-matched knowledge from previous debates. Debates compound instead of repeating.
- **Controlled autonomy**: agents propose decisions, you approve or reject them in the Approval Queue (or directly in Obsidian).
- **Keyless web research**: every debate starts with a free DuckDuckGo/Wikipedia research pass.

**Setup:** start the app → open the **Knowledge Vault** tab → paste a folder path like
`D:\AI-Research\ChronoZero-Vault` → Create & Connect. Then open that folder in Obsidian
(*Open folder as vault*). Full guide: **OBSIDIAN-SETUP.md**.

*All infrastructure remains free: local Markdown vault, local SQLite/JSON index, keyless research, free-tier AI (or the built-in 100% free engine).*

## Local scheduled automation

The app runs an hourly, local-only automation cycle by default while the server is running:

- Refresh surface-coverage scores from the local vault and scenario list.
- Assign confidence-ranked techniques from the already-saved intel library to agents.
- Write a defensive coverage-priority report under `data/automation/reports/`.
- Persist the schedule, coverage trends, and last 40 cycle results in `data/automation-state.json`.

The Surface Map tab lets you pause or resume automation, choose hourly, six-hourly, or daily intervals, and run a cycle manually. Coverage priorities compare local coverage and severity; they are not predictions of real-world exploitability. Scheduled jobs never probe target systems. They do make outbound requests to public sources: the hourly intel harvest and, when enabled, the autopilot's web research (see below).

The default server bind address is `127.0.0.1`. Set `HOST` explicitly only if you intend to make the app reachable from another device and have secured that access.

## Autopilot (self-maintenance)

The **Autopilot** tab runs one cycle (default every 6 hours, or on demand) and logs every change to `00-System/Evolution Log.md`:

| Step | What it does |
|---|---|
| Vault sync | Reads the whole Obsidian vault from disk (any folder), keeps the index live while Obsidian is open, and digests notes **you** wrote into `06-Agent-Memory/Shared/Operator Knowledge.md` so agents retrieve them. |
| Source health | Switches off intel sources that fail 3 harvests in a row, retries them after 7 days. 31 keyless sources ship (16 new: bridges, zk, governance, oracles, supply chain); add your own RSS/arXiv feeds. |
| Web research | Searches the web for the worst coverage gaps, saves short attributed excerpts to `12-Web-Captures/`. Web-derived techniques are **quarantined** (not taught to agents) unless you enable "Trust web captures". |
| Skills | Counts every time a skill is injected into a turn; retires off-domain, non-defect, duplicate and long-unused skills to `03-Knowledge/Skills/_Archive` (restorable). |
| Scenario forge | Generates debate scenarios from gaps, intel, graph hypotheses, hunt targets and vault seed notes; pauses while 12 are waiting to be debated. |
| Agent foundry | Adds a specialist for a layer with no dedicated agent (max 6) and trains it on that layer. |
| Artifacts | Publishes System Brief, Scenario Pack and Skill Audit as standalone HTML in `14-Artifacts/`. |

**Add scenarios and agents from Obsidian:** copy a template from `00-System/Templates/`, set `type: scenario-seed` or `type: agent-seed`, fill it in — the next sync imports it.

**Vault API:** `GET /api/vault/notes`, `GET /api/vault/note?path=`, `PUT /api/vault/note` (`create | overwrite | append | upsert`), `DELETE /api/vault/note?path=` (moves to `.trash`), `POST /api/vault/rescan`.

The autopilot edits configuration, knowledge, skills, roster and scenarios — never source code. Each feature has its own switch and settings changes can be undone from the tab.
