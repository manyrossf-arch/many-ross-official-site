import Link from "next/link";
import type { ReactNode } from "react";

type ExternalLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

export function ExternalLink({ href, children, className, ariaLabel }: ExternalLinkProps) {
  const isInternalAnchor = href.startsWith("#");

  if (isInternalAnchor) {
    return (
      <Link href={href} className={className} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} aria-label={ariaLabel} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
