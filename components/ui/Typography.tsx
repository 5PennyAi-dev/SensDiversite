import { cn } from "@/lib/utils"

interface TypographyProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  className?: string
}

export function HeroTitle({ children, className, ...props }: TypographyProps) {
  return (
    <h1 
      className={cn(
        "font-display font-medium text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-foreground leading-[1.1]",
        "animate-in fade-in slide-in-from-bottom-4 duration-1000",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

export function SectionTitle({ children, className, ...props }: TypographyProps) {
  return (
    <h2 
      className={cn(
        "font-display text-3xl sm:text-4xl md:text-5xl text-foreground/90 mb-6",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

export function LabelText({ children, className, ...props }: TypographyProps) {
    return (
      <span 
        className={cn(
          "font-body text-xs sm:text-sm uppercase tracking-[0.2em] text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
