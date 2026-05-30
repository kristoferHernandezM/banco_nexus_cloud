import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export function Card({ children, className, hover = false, glass = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-2xl p-6 shadow-sm",
        hover && "transition-all hover:shadow-md hover:scale-[1.01]",
        glass && "backdrop-blur-lg bg-card/80",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn("text-xl font-medium text-foreground", className)}>{children}</h3>;
}

export function CardDescription({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn(className)}>{children}</div>;
}
