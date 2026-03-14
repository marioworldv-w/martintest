import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import Dashboard from "@/pages/Dashboard";

function App() {
  return (
    <TooltipProvider delayDuration={300}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="bottom-right" theme="dark" />
    </TooltipProvider>
  );
}

export default App;
