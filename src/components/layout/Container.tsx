import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`site-container ${className}`.trim()}>
      <div className="site-grid">{children}</div>
    </div>
  );
}

export default Container;
