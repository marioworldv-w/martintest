# AI Academy — PRD

## Project Overview
Interactive Russian-language educational web platform for teaching beginners about AI assistants (ChatGPT, Gemini, prompting, roles, Google AI Pro).

**Date Built**: February 2025
**Last Updated**: March 2026
**Status**: P0 Complete — Ready for Live Teaching

## Architecture
- **Frontend**: React + React Router + Tailwind CSS + Custom CSS (glassmorphism, matrix)
- **Backend**: FastAPI (minimal)
- **Database**: MongoDB (not used — content is static)
- **Content Storage**: Structured JS data files in `/src/data/`
- **Design**: Premium Luxury Matrix style — dark, glassmorphism, blue/red/green/yellow accents

## User Personas
1. **Teacher**: Uses Teaching Mode page for live 2-hour class presentation
2. **Student**: Learns through modules, takes quizzes, uses prompt builder
3. **Practitioner**: Uses prompt library and cheat sheet as reference

## Core Requirements
- Full Russian language UI and content
- Premium dark theme with bright accents (blue, red, green, yellow)
- Desktop-first, mobile-responsive
- Sidebar navigation with module progress
- Print-friendly mode for key pages
- Animated Matrix background with glassmorphism effects

## What's Been Implemented

### Pages (16 total)
1. **Home Dashboard** - Hero, stats (120+ prompts, 5 tools), 10 module cards, tools section
2. **Module 1: Intro** - What is AI, how it works, quiz
3. **Module 2: ChatGPT** - Full guide, features, prompts, personalization
4. **Module 3: Gemini** - Full guide, Google integration, prompts
5. **Module 4: GPT vs Gemini** - Comparison table + scenario selector + print button
6. **Module 5: Prompt Fundamentals** - Formula, examples, mini-builder
7. **Module 6: Prompt Builder** - Interactive builder with templates + live preview
8. **Module 7: Prompt Library** - 120+ prompts, search, category filter, print button
9. **Module 8: Roles** - 6 role cards with before/after comparisons
10. **Module 9: Google AI** - Tools overview with expandable cards
11. **Module 10: Tools & Workflow** - Workflow diagrams, use case grid
12. **Teaching Mode** - Enhanced: 6 tabs per block, quick toolbar, teacher notes, recap, mini-practice
13. **Demo Prompts** - NEW: 5 sections (Beginner, GPT, Gemini, Roles, Improvement), quality comparison
14. **Practice Page** - 5 interactive exercises
15. **Cheat Sheet** - 10 rules, formulas, templates, checklist, print button
16. **Print Center** - Quick print for all materials including Demo Prompts

### Data Files
- `courseData.js` - 10 modules + teaching timeline (8 time blocks) + 5 tools
- `promptLibrary.js` - 13 categories, 120+ prompts
- `practiceData.js` - 5 exercises

### Components
- `DashboardLayout`, `Sidebar` - Layout with progress indicators
- `MatrixCanvas` - Animated matrix rain background
- `QuizBlock` - Interactive quiz with reveal
- `BeforeAfterPrompt` - Side-by-side prompt comparison
- `TipBox`, `WarningBox`, `SuccessBox`, `InfoBox` - Content callouts
- `useProgress` hook - localStorage-based progress tracking

### Design System
- Premium glassmorphism (glass, glass-card, glass-sidebar)
- Glow effects (hover-glow-blue/green/red/yellow)
- Animated Matrix canvas background
- Ambient light orbs
- Premium card borders and badges
- Print-optimized CSS for clean output

## Routes
- `/` - Home
- `/module/intro` - Module 1
- `/module/chatgpt` - Module 2
- `/module/gemini` - Module 3
- `/module/comparison` - Module 4
- `/module/prompts` - Module 5
- `/module/prompt-builder` - Module 6
- `/module/prompt-library` - Module 7
- `/module/roles` - Module 8
- `/module/google-ai` - Module 9
- `/module/tools` - Module 10
- `/teaching-mode` - Teaching Mode
- `/demo-prompts` - Demo Prompts (NEW)
- `/practice` - Practice
- `/cheatsheet` - Cheat Sheet
- `/print-center` - Print Center

## Progress Tracking
- Stored in `localStorage` as `ai_academy_progress`
- Mark Complete button on each module
- Progress bar on home page

## Prioritized Backlog

### P0 (Complete)
- [x] All 16 pages
- [x] Teaching mode with 6-tab system, quick toolbar, recap, mini-practice
- [x] Demo Prompts page with 5 sections and quality comparison
- [x] Print functionality with dedicated buttons on key pages
- [x] Premium Luxury Matrix design
- [x] 120+ prompt library
- [x] Practice exercises

### P1 (Next phase)
- [ ] Video embedding support (YouTube/Drive URLs in content config)
- [ ] Quiz result tracking and summary
- [ ] Downloadable PDF export (jsPDF)
- [ ] Dark/light theme toggle
- [ ] Content scalability refactor (extract all JSX text to data files)

### P2 (Future expansion)
- [ ] Admin content management (JSON config editor)
- [ ] Multi-course library structure
- [ ] User authentication for personalized progress
- [ ] Backend API for saving progress across devices
- [ ] Homework/assignment blocks
- [ ] Video lesson support with Google Drive integration
