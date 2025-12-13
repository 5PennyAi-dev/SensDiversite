import { cn } from "@/lib/utils"

interface PaperCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function PaperCard({ className, children, ...props }: PaperCardProps) {
  return (
    <div
      className={cn(
        "bg-[var(--paper-2)] border border-[var(--border)] rounded-2xl p-5 md:p-7 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-[1px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
