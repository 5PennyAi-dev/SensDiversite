import { cn } from "@/lib/utils"

interface SectionSeparatorProps {
  className?: string
}

export function SectionSeparator({ className }: SectionSeparatorProps) {
  return (
    <div className={cn("flex items-center justify-center py-10 opacity-60", className)}>
      <div className="h-px bg-[var(--border)] flex-grow max-w-[100px]" />
      <div className="mx-4 text-[var(--border)] text-sm">◆</div>
      <div className="h-px bg-[var(--border)] flex-grow max-w-[100px]" />
    </div>
  )
}
