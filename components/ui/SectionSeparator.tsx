import { cn } from "@/lib/utils"

interface SectionSeparatorProps {
  className?: string
}

export function SectionSeparator({ className }: SectionSeparatorProps) {
  return (
    <div className={cn("w-full flex items-center justify-center py-8 opacity-60", className)}>
      <div className="h-px w-full max-w-sm bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  )
}
