# AI Academy — PRD

## Project Overview
Interactive Russian-language educational web platform for teaching beginners about AI assistants (ChatGPT, Gemini, prompting, roles, Google AI Pro).

**Date Built**: February 2025
**Status**: MVP Complete

## Architecture
- **Frontend**: React + React Router + Tailwind CSS + Framer Motion
- **Backend**: FastAPI (minimal, progress can be stored locally)
- **Database**: MongoDB (not heavily used — content is static)
- **Content Storage**: Structured JS data files in `/src/data/`

## User Personas
1. **Teacher**: Uses Teaching Mode page for live 2-hour class presentation
2. **Student**: Learns through modules, takes quizzes, uses prompt builder
3. **Practitioner**: Uses prompt library and cheat sheet as reference

## Core Requirements (Static)
- Full Russian language UI and content
- Premium dark theme with blue/red/green/yellow accents
- Desktop-first, mobile-responsive
- Sidebar navigation with module progress
- Print-friendly mode

## What's Been Implemented

### Pages (14 total)
1. **Home Dashboard** - Hero, stats, 10 module cards, tools section, learning outcomes
2. **Module 1: Intro** - What is AI, how it works, quiz
3. **Module 2: ChatGPT** - Full guide, features, prompts, personalization, before/after
4. **Module 3: Gemini** - Full guide, Google integration, prompts
5. **Module 4: GPT vs Gemini** - Comparison table + clickable scenario selector
6. **Module 5: Prompt Fundamentals** - Formula, examples, mini-builder
7. **Module 6: Prompt Builder** - Interactive builder with templates + live preview
8. **Module 7: Prompt Library** - 60+ prompts, search, category filter
9. **Module 8: Roles** - 6 role cards with before/after comparisons
10. **Module 9: Google AI** - Tools overview with expandable cards
11. **Module 10: Tools & Workflow** - Workflow diagrams, use case grid
12. **Teaching Mode** - 2-hour timeline with 8 blocks, tabs (explain/demo/question/task)
13. **Practice Page** - 5 interactive exercises
14. **Cheat Sheet** - 10 rules, formulas, templates, checklist
15. **Print Center** - Quick print for all materials

### Data Files
- `courseData.js` - 10 modules + teaching timeline (8 time blocks)
- `promptLibrary.js` - 10 categories, 60+ prompts
- `practiceData.js` - 5 exercises (rewrite, choose, assign-role, build-prompt, compare)

### Components
- `DashboardLayout`, `Sidebar` - Layout with progress indicators
- `QuizBlock` - Interactive quiz with reveal
- `BeforeAfterPrompt` - Side-by-side prompt comparison
- `TipBox`, `WarningBox`, `SuccessBox`, `InfoBox` - Content callouts
- `useProgress` hook - localStorage-based progress tracking

## Progress Tracking
- Stored in `localStorage` as `ai_academy_progress`
- Mark Complete button on each module
- Progress bar on home page

## Prioritized Backlog

### P0 (Needed for teaching tomorrow)
- [x] All 14 pages
- [x] Teaching mode with timeline
- [x] Practice exercises
- [x] Print functionality

### P1 (Next phase)
- [ ] Video embedding support (YouTube/Drive URLs in content config)
- [ ] Quiz result tracking and summary
- [ ] Downloadable PDF export (jsPDF)
- [ ] Dark/light theme toggle

### P2 (Future expansion)
- [ ] Admin content management (JSON config editor)
- [ ] Multi-course library structure
- [ ] User authentication for personalized progress
- [ ] Backend API for saving progress across devices
- [ ] Homework/assignment blocks
- [ ] Video lesson support with Google Drive integration

## Next Tasks
1. Add video URL support to courseData.js for future video lessons
2. Implement PDF export for cheat sheet
3. Add more prompt examples to the library
4. Create additional practice exercises
5. Add dark/light toggle
