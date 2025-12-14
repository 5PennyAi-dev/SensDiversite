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
    "text-xs uppercase tracking-[0.2em] font-body font-medium transition-colors duration-200",
    active 
      ? "text-primary underline underline-offset-4 decoration-1" 
      : "text-muted-foreground hover:text-primary",
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
