import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost";

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  withArrow?: boolean;
};

const base =
  "group inline-flex items-center gap-3 px-7 py-4 rounded-full text-sm tracking-wide uppercase font-medium transition-all duration-500 ease-out will-change-transform";

const styles: Record<Variant, string> = {
  solid:
    "bg-ivory text-onyx hover:bg-gold hover:text-onyx shadow-elegant hover:-translate-y-0.5",
  outline:
    "border border-ivory/25 text-ivory hover:border-gold hover:text-gold hover:-translate-y-0.5",
  ghost: "text-ivory hover:text-gold",
};

export function LuxeLink({
  to,
  children,
  variant = "solid",
  className,
  withArrow = true,
}: BaseProps & { to: string }) {
  return (
    <Link to={to} className={cn(base, styles[variant], className)}>
      <span>{children}</span>
      {withArrow ? (
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={1.5}
        />
      ) : null}
    </Link>
  );
}

export function LuxeAnchor({
  href,
  children,
  variant = "solid",
  className,
  withArrow = true,
  target,
  rel,
}: BaseProps & {
  href: string;
  target?: string;
  rel?: string;
}) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={cn(base, styles[variant], className)}
    >
      <span>{children}</span>
      {withArrow ? (
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={1.5}
        />
      ) : null}
    </a>
  );
}

export function LuxeButton({
  children,
  variant = "solid",
  className,
  withArrow = true,
  type = "button",
  onClick,
  disabled,
}: BaseProps & {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        base,
        styles[variant],
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
    >
      <span>{children}</span>
      {withArrow ? (
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={1.5}
        />
      ) : null}
    </button>
  );
}
