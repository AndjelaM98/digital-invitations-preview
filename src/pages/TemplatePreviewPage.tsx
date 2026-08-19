import type { ComponentType } from "react";
import { Link, useParams } from "react-router-dom";

import { getInvitationTemplate } from "../TEMPLATE POZIVNICE";
import "./TemplatePreviewPage.css";

/**
 * Preview for invitation templates.
 * Example: /preview/envelope-romance
 */
function TemplatePreviewPage() {
  const { templateId } = useParams<{ templateId: string }>();
  const entry = getInvitationTemplate(templateId ?? "");

  if (!entry) {
    return (
      <main className="template-preview template-preview--empty">
        <p>Template nije pronađen.</p>
        <Link to="/">Nazad na listu</Link>
      </main>
    );
  }

  const { Component } = entry as {
    Component: ComponentType<{ content?: unknown }>;
  };

  return (
    <div className="template-preview">
      <Component />
    </div>
  );
}

export default TemplatePreviewPage;
