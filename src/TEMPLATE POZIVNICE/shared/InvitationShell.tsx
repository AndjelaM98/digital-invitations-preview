import type { ReactNode } from "react";
import "./InvitationShell.css";

type InvitationShellProps = {
  templateId: string;
  children: ReactNode;
  className?: string;
  "aria-hidden"?: boolean;
};

/** Outer chrome for any invitation template page. */
function InvitationShell({
  templateId,
  children,
  className = "",
  "aria-hidden": ariaHidden,
}: InvitationShellProps) {
  return (
    <div
      className={`invitation-shell ${className}`.trim()}
      data-invitation-template={templateId}
      aria-hidden={ariaHidden}
    >
      <div className="invitation-shell__canvas">{children}</div>
    </div>
  );
}

export default InvitationShell;
