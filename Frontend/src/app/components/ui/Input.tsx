import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm text-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full h-11 px-4 rounded-xl border border-input bg-input-background",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            "transition-all placeholder:text-muted-foreground",
            error && "border-destructive focus:ring-destructive",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);
