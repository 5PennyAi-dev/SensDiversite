import { cn } from "@/lib/utils"

interface CineasticCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  noPadding?: boolean
}

export function CineasticCard({ children, className, noPadding = false, ...props }: CineasticCardProps) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl flex flex-col",
        "bg-card border border-white/5", // Use specific card background
        "transition-all duration-500 ease-out",
        "group hover:-translate-y-1", // Lift effect
        "hover:border-primary/30", // Gold border on hover
        "hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]", // Deep shadow
        // Inner glow effect via shadow
        "hover:shadow-[inset_0_0_20px_-10px_theme(colors.primary)]",
        className
      )}
      {...props}
    >
      <div className={cn(
        "relative z-10",
        noPadding ? "flex-1" : "p-6 sm:p-8"
      )}>
        {children}
      </div>
      
      {/* Texture overlay for the card itself (optional, adds paper feel) */}
      <div className="absolute inset-0 opacity-[0.03] bg-noise pointer-events-none mix-blend-overlay" />
      
      {/* Gradient sheen */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </div>
  )
}
