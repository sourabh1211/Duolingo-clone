import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "super" | "white";

const styles: Record<Variant, { cls: string; shadow: string }> = {
  primary: { cls: "bg-green text-white", shadow: "#58a700" },
  secondary: { cls: "bg-blue text-white", shadow: "#1899d6" },
  danger: { cls: "bg-red text-white", shadow: "#ea2b2b" },
  super: { cls: "bg-purple text-white", shadow: "#a568cc" },
  white: { cls: "bg-white text-blue", shadow: "rgba(0,0,0,.2)" },
  ghost: { cls: "border-2 border-line bg-surface text-blue", shadow: "rgb(var(--line))" },
};

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  full?: boolean;
}

/** The chunky press-down button used throughout the app. */
export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", full, className = "", style, ...rest },
  ref,
) {
  const v = styles[variant];
  return (
    <button
      ref={ref}
      className={`btn ${v.cls} ${full ? "w-full" : ""} ${className}`}
      style={{ ["--btn-shadow" as string]: v.shadow, ...style }}
      {...rest}
    />
  );
});
