import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import DashboardLayout from './components/Layout/DashboardLayout';
import HomePage from './pages/HomePage';
import IntroPage from './pages/IntroPage';
import ChatGPTPage from './pages/ChatGPTPage';
import GeminiPage from './pages/GeminiPage';
import ComparisonPage from './pages/ComparisonPage';
import PromptFundamentalsPage from './pages/PromptFundamentalsPage';
import PromptBuilderPage from './pages/PromptBuilderPage';
import PromptLibraryPage from './pages/PromptLibraryPage';
import RolesPage from './pages/RolesPage';
import GoogleAIPage from './pages/GoogleAIPage';
import ToolsPage from './pages/ToolsPage';
import TeachingModePage from './pages/TeachingModePage';
import PracticePage from './pages/PracticePage';
import CheatSheetPage from './pages/CheatSheetPage';
import PrintCenterPage from './pages/PrintCenterPage';

function AppRoutes() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/module/intro" element={<IntroPage />} />
        <Route path="/module/chatgpt" element={<ChatGPTPage />} />
        <Route path="/module/gemini" element={<GeminiPage />} />
        <Route path="/module/comparison" element={<ComparisonPage />} />
        <Route path="/module/prompts" element={<PromptFundamentalsPage />} />
        <Route path="/module/prompt-builder" element={<PromptBuilderPage />} />
        <Route path="/module/prompt-library" element={<PromptLibraryPage />} />
        <Route path="/module/roles" element={<RolesPage />} />
        <Route path="/module/google-ai" element={<GoogleAIPage />} />
        <Route path="/module/tools" element={<ToolsPage />} />
        <Route path="/teaching-mode" element={<TeachingModePage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/cheatsheet" element={<CheatSheetPage />} />
        <Route path="/print-center" element={<PrintCenterPage />} />
      </Routes>
    </DashboardLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
