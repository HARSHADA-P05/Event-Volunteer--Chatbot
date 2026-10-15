# EventBuddy – Smart Event Volunteer Coordinator Chatbot

> **A professional college project designed for managing campus event volunteers, automated duty assignments, and real-time inquiries using a rule-based AI chatbot and coordinator dashboard.**

![Project Category](https://img.shields.io/badge/Project-Third--Year%20Computer%20Engineering-6C5CE7)
![Technology](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JavaScript-blueviolet)
![Architecture](https://img.shields.io/badge/Architecture-Rule--Based%20NLP%20%26%20FSM-10B981)
![Hosting](https://img.shields.io/badge/Deployment-GitHub%20Pages-informational)
![Zero Dependencies](https://img.shields.io/badge/Zero%20Paid%20APIs-100%25%20Offline%20Ready-success)

---

## 📌 1. Project Overview & Objectives

In modern college ecosystems, technical symposiums (e.g. *InnovateX*), cultural fests (e.g. *Tarang*), sports meets, and hackathons demand coordination among dozens of student volunteers. Traditional coordination through disjointed WhatsApp groups and paper spreadsheets causes:
- Misplaced volunteer duty assignments and delayed reporting.
- Repeated inquiries to event heads regarding venues, reporting times, schedules, and eligibility.
- Inaccurate duty tracking and delayed distribution of activity credit certificates.

**EventBuddy** solves these operational bottlenecks through a single responsive web platform featuring:
1. **EventBuddy Assistant:** An autonomous, rule-based chatbot capable of answering frequently asked questions, matching intent with keywords, and onboarding volunteers via a multi-step conversational state machine.
2. **Coordinator Dashboard:** A command center for faculty and student leads with real-time statistics, role distribution visualizers, event scheduling, volunteer filtering, duty allocations, and CSV export.
3. **Volunteer Self-Service Portal:** A duty pass verification tool where students enter their Registration ID (e.g. `EB-2026-1001`) to inspect their reporting time, desk assignment, and print an official duty pass.

---

## 💻 2. Technology Stack

- **Frontend Presentation:** Semantic HTML5, accessible ARIA landmarks, modal dialogs.
- **Styling & Layout:** Modern CSS3 with CSS Custom Properties (Theme: Royal Purple `#6C5CE7`, Soft Lavender `#A29BFE`, Clean White `#FFFFFF`), Neumorphic elevation, and flexbox/grid responsiveness.
- **Client-Side Logic:** Vanilla JavaScript (ES6+ modular object architecture). **Zero external frameworks (no React, Angular, or Vue required)** for straightforward academic demonstration.
- **Persistence Layer:** HTML5 `localStorage` API for instant browser data persistence.
- **Zero Paid APIs / Backend Server:** Runs 100% client-side without API fees or database configurations.
- **Source Control & Hosting:** Git, GitHub, and GitHub Pages.

---

## ⚙️ 3. System Architecture & Chatbot Algorithm

EventBuddy uses a deterministic **Natural Language Processing (NLP) Intent Matching Engine** paired with a **Finite State Machine (FSM)**.

```
                           +------------------------+
                           | User Enters Message    |
                           +-----------+------------+
                                       |
                                       v
                     +-----------------------------------+
                     | Is Registration State Machine     |
                     | Active? (Step 0 to Step 6)        |
                     +-----------------+-----------------+
                                       |
                       +---------------+---------------+
                  YES  |                               | NO
                       v                               v
       +-------------------------------+   +-------------------------------+
       | Advance FSM Step:             |   | Intent Classification:        |
       | 1. Name Check                 |   | - Greeting                    |
       | 2. Email & Duplicate Check    |   | - Events / Schedule / Dates   |
       | 3. Department Selection       |   | - Volunteer Roles             |
       | 4. Year of Study              |   | - "My Tasks" Duty Lookup      |
       | 5. Preferred Role             |   | - Venues & Locations          |
       | 6. Shift Availability         |   | - Certificate & Credit Hours  |
       |                               |   | - Coordinator Contact         |
       | -> Commit to LocalStorage     |   | - Fallback with Quick Chips   |
       +-------------------------------+   +-------------------------------+
```

### Key Technical Characteristics:
- **Zero Hallucination:** Deterministic rules ensure that all event dates, venues, and coordinator contact details are verified and accurate.
- **Duplicate Prevention:** Before creating a registration, the email is checked against existing records in `localStorage`. If already registered, the student's existing Registration ID is returned.
- **Offline Capable:** Works without active internet access after initial page load.

---

## 📁 4. Project Directory Structure

```
event volunteer/
├── index.html        # Complete single-page application structure & semantic modal dialogs
├── style.css         # Modern, responsive CSS3 styling (Purple & Lavender palette)
├── script.js         # Chatbot engine, State Machine, CRUD controllers, and localStorage
├── README.md         # Comprehensive academic documentation and setup guide
└── .gitignore        # Clean git repository rules
```

---

## 🚀 5. Beginner-Friendly Step-by-Step Setup Guide

You do not need to install Node.js, npm, or any backend database. You only need a modern web browser (Google Chrome, Microsoft Edge, Firefox, or Safari).

### Method 1: Open Directly in Your Web Browser (Easiest)
1. Navigate to the project folder on your computer:
   `c:\Users\PatilInfotech\Desktop\event volunteer`
2. Double-click `index.html`.
3. The project will open directly in your default web browser!

---

### Method 2: Run with VS Code Live Server (Recommended for Development)
1. Open Visual Studio Code.
2. Click **File** > **Open Folder...** and select `c:\Users\PatilInfotech\Desktop\event volunteer`.
3. If you have the **Live Server** extension installed:
   - Right-click `index.html` in the file tree.
   - Click **Open with Live Server**.
4. The site will launch automatically at `http://127.0.0.1:5500/index.html`.

---

### Method 3: Run with Python Built-in Server (Terminal)
If you have Python installed, open PowerShell in the project directory and run:
```powershell
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

---

## 🧪 6. Testing & Demonstration Walkthrough

Follow these steps to demonstrate every feature to your evaluator or professor:

### 1. Test the Chatbot Assistant
- Open the **Assistant Chatbot** tab.
- Click the quick chip: **"View Events"** &rarr; Notice the live event cards generated from `localStorage`.
- Click **"Volunteer Roles"** &rarr; Notice the detailed roles breakdown.
- Click **"Contact Coordinator"** &rarr; Notice faculty details and office timings.
- Type: *"When is InnovateX?"* or *"Where is the hackathon located?"* &rarr; Notice instant contextual matching.

### 2. Test Guided Conversational Registration
- Click the quick chip: **"Register as Volunteer"** (or click **Register Flow** in header).
- Enter your name (e.g., `Aniket Kadam`).
- Enter an email (e.g., `aniket.kadam@college.edu`).
- Click or type your Department (e.g., `Computer Engineering`).
- Click or type your Year (e.g., `TE (Third Year)`).
- Select your role (e.g., `Technical Support`).
- Select your shift (e.g., `Full Day (8:30 AM - 5:30 PM)`).
- **Result:** You receive a unique **Registration ID** (e.g. `EB-2026-4821`). The record is saved to `localStorage` and immediately updates the Coordinator Dashboard!

### 3. Test Coordinator Dashboard & Task Allocation
- Switch to the **Coordinator Dashboard** tab.
- Notice total volunteers has increased, and role distribution graphs update in real-time.
- In the **Pending Duty Allocations** table, find your newly registered student and click **"Assign Duty"**.
- Select the event (e.g., *InnovateX 2026*), enter Reporting Time (e.g., `08:30 AM`), Location (e.g., `Lab 3 Entrance`), and click **Save Task Allocation**.
- The volunteer's status changes from **Pending** to **Assigned**!

### 4. Test Volunteer Duty Slip Lookup
- Switch to the **My Duty Slip Lookup** tab.
- Enter your Registration ID or try demo ID `EB-2026-1001`.
- Click **Verify Duties**.
- The official duty pass card appears with event title, reporting desk, and instructions.
- Click **"Print Duty Slip"** &rarr; The browser print preview opens with clean pass formatting!

### 5. Test Data Persistence & Reset Feature
- Refresh your browser page (press `F5` or `Ctrl + R`).
- Notice all new events, volunteers, and tasks remain intact!
- Click **"Reset Demo Data"** in the sidebar footer &rarr; A modal prompts confirmation. Confirming restores the original college dataset.

---

## 🌐 7. Step-by-Step GitHub Upload & GitHub Pages Deployment Guide

Follow these exact steps to publish your project live on the internet using GitHub Pages:

### Step 1: Create a New GitHub Repository
1. Log into your GitHub account at [https://github.com](https://github.com).
2. In the top-right corner, click the **`+`** icon and select **New repository**.
3. Name your repository: `eventbuddy` or `event-volunteer-coordinator`.
4. Leave it **Public**.
5. Do **NOT** check "Initialize with a README" (we already have a complete one).
6. Click **Create repository**.

### Step 2: Initialize Git and Push from Your Computer
Open PowerShell in the project directory:
```powershell
# 1. Initialize local git repository
git init

# 2. Add all files to staging
git add .

# 3. Create your first commit
git commit -m "Initial release: EventBuddy college volunteer coordinator chatbot and dashboard"

# 4. Rename main branch
git branch -M main

# 5. Link to your GitHub repository (Replace YOUR_USERNAME with your GitHub handle)
git remote add origin https://github.com/YOUR_USERNAME/eventbuddy.git

# 6. Push your code to GitHub
git push -u origin main
```

### Step 3: Deploy Free via GitHub Pages
1. Go to your repository on GitHub: `https://github.com/YOUR_USERNAME/eventbuddy`.
2. Click on the **Settings** tab (gear icon at the top).
3. In the left sidebar, click **Pages** (under the "Code and automation" section).
4. Under **Build and deployment** > **Branch**:
   - Change the dropdown from `None` to **`main`**.
   - Keep the folder as **`/(root)`**.
   - Click the **Save** button.
5. Wait 1 to 2 minutes. Refresh the page.
6. A green banner will display:
   > **"Your site is live at `https://YOUR_USERNAME.github.io/eventbuddy/`"**
7. Click the link to open your live web application!

---

## 🎓 8. College Project Viva & Oral Exam Q&A Guide

Prepare for your project examination with these standard questions:

| # | Question | Ideal Technical Answer |
|---|---|---|
| **Q1** | **What is the motivation behind EventBuddy?** | EventBuddy resolves the communication lag and organizational chaos of managing dozens of student volunteers during college fests. It automates FAQs and registration via a rule-based chatbot while empowering event heads with a central dashboard. |
| **Q2** | **Why did you choose a Rule-Based Chatbot over an OpenAI / LLM API?** | 1. **Zero Operational Cost:** Does not require paid API subscription tokens.<br>2. **Zero Hallucination:** Answers about venues, dates, and faculty contacts are strictly deterministic and accurate.<br>3. **Privacy & Offline Security:** Student email and IDs stay local and are never transmitted to third-party commercial AI servers.<br>4. **Low Latency:** Instant response time without network round-trips. |
| **Q3** | **How does the conversational registration wizard work?** | It uses a **Finite State Machine (FSM)**. As the student answers, the state transitions from `NAME` &rarr; `EMAIL` &rarr; `DEPT` &rarr; `YEAR` &rarr; `ROLE` &rarr; `SHIFT`. Each state performs regex and duplicate validation before committing to storage and generating a unique ID. |
| **Q4** | **What is the role of `localStorage`?** | `localStorage` provides client-side key-value persistence across browser reloads up to ~5MB. It stores events, registered volunteers, task allocations, and chat history. |
| **Q5** | **How can this project be scaled into production?** | For enterprise deployment across multiple colleges, the `Storage` wrapper in `script.js` can be replaced with asynchronous `fetch()` calls to a Node.js / Python FastAPI REST backend connected to a PostgreSQL database with JWT authentication. The frontend presentation remains unchanged. |

---

## 🔒 9. Security & Data Disclaimer

- This application is developed as an academic project demonstration for college festivals.
- Data is stored in the user's browser via HTML5 `localStorage`. It is not shared between different devices or different browsers on the same machine.
- No confidential credentials, API keys, or passwords are used or stored.

---

## 👨‍💻 Project Authors & Acknowledgements
- **Project Name:** EventBuddy – Smart Event Volunteer Coordinator Chatbot
- **Class / Semester:** Third-Year Computer Engineering
- **Domain:** Web Engineering, Human-Computer Interaction & Artificial Intelligence

Developed with ❤️ for College Event Coordinators and Student Volunteers!
