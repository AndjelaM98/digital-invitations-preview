import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";

import "./App.css";
import HomePage from "./pages/HomePage";
import TemplateDetailPage from "./pages/TemplateDetailPage";
import FullInvitationPage from "./pages/FullInvitationPage";
import OrderPage from "./pages/OrderPage";
import PreviewIndexPage from "./pages/PreviewIndexPage";
import TemplatePreviewPage from "./pages/TemplatePreviewPage";

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

/** Scroll to hash targets after client-side navigation (e.g. /#pricing). */
function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const id = hash.replace("#", "");
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<PreviewIndexPage />} />
        <Route path="/sajt" element={<HomePage />} />
        <Route path="/pozivnice/:slug" element={<TemplateDetailPage />} />
        <Route path="/pozivnice/:slug/puna" element={<FullInvitationPage />} />
        <Route path="/poruci/:slug" element={<OrderPage />} />
        <Route path="/preview" element={<PreviewIndexPage />} />
        <Route path="/preview/:templateId" element={<TemplatePreviewPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
