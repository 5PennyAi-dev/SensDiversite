import { cn } from "@/lib/utils"
import Link from "next/link"

interface TagPillProps {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
  href?: string
  className?: string
}

export function TagPill({ children, active, onClick, href, className }: TagPillProps) {
  const baseStyles = cn(
    "text-[13px] uppercase tracking-wider font-medium transition-colors duration-200",
    active 
      ? "text-[var(--accent)] underline underline-offset-4 decoration-1" 
      : "text-[var(--muted-foreground)] hover:text-[var(--accent)]",
    className
  )

  if (href) {
    return (
      <Link href={href} className={baseStyles}>
        {children}
      </Link>
    )
  }

  return (
    <span 
      onClick={onClick} 
      className={cn(baseStyles, onClick && "cursor-pointer")}
    >
      {children}
    </span>
  )
}
