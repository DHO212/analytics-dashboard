import { memo } from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  updatedAt?: string;
  action?: React.ReactNode;
}

export const PageHeader = memo(function PageHeader({
  title,
  subtitle,
  updatedAt,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        {/* Headline — not screaming, authoritative */}
        <h2 className="text-[1.125rem] font-semibold tracking-tight text-[rgb(var(--text))]">
          {title}
        </h2>
        <p className="mt-0.5 text-[12.5px] text-[rgb(var(--text-2))]">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {action}
        {updatedAt && (
          <div className="flex items-center gap-1.5">
            <span className="live-dot" aria-hidden="true" />
            <span className="font-code text-[10.5px] text-[rgb(var(--text-3))]">
              {updatedAt}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});
