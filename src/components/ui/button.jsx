import { cn } from "../../lib/utils";

const styles = {
  base: "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
  primary:
    "bg-[#f7b955] text-[#1a1206] hover:bg-[#f4a93b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7b955]",
  ghost: "bg-white/5 text-white hover:bg-white/10",
};

export function Button({ className, variant = "primary", ...props }) {
  return (
    <button
      className={cn(styles.base, styles[variant], className)}
      {...props}
    />
  );
}
