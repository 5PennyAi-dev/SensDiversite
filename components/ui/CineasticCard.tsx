import { cn } from "@/lib/utils"

interface CineasticCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function CineasticCard({ children, className, ...props }: CineasticCardProps) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl",
        "bg-white/5 backdrop-blur-sm",
        "ring-1 ring-white/10",
        "transition-all duration-500 ease-out",
        "hover:scale-[1.02] hover:ring-primary/40 hover:bg-white/10 hover:shadow-2xl hover:shadow-black/50",
        "group",
        className
      )}
      {...props}
    >
      <div className="relative z-10 p-6 sm:p-8">
        {children}
      </div>
      
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  )
}
