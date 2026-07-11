import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: Props) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-3xl ${alignCls} ${className ?? ""}`}>
      {eyebrow ? (
        <Reveal>
          <div className="eyebrow mb-6">{eyebrow}</div>
        </Reveal>
      ) : null}
      <Reveal delay={0.05}>
        <h2 className="text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-ivory">
          {title}
        </h2>
      </Reveal>
      {description ? (
        <Reveal delay={0.1}>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
