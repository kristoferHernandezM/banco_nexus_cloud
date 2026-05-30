import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "success";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border-2 border-border bg-transparent hover:bg-accent",
    ghost: "hover:bg-accent",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    success: "bg-success text-success-foreground hover:bg-success/90",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-5",
    lg: "h-12 px-6",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
