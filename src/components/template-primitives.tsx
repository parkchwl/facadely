import { ReactNode } from "react";

export function TemplateContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-[1440px] px-6 md:px-10 ${className}`}>{children}</div>;
}
