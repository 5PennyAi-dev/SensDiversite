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
        "relative overflow-hidden rounded-lg flex flex-col",
        "bg-card/80 border border-border/30",
        "transition-all duration-700 ease-out",
        "group hover:-translate-y-0.5",
        "hover:border-primary/30",
        "hover:bg-card",
        className
      )}
      {...props}
    >
      {/* Ambient glow on hover */}
      <div
        className="absolute -inset-px rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsla(30, 50%, 64%, 0.06), transparent 40%)',
        }}
      />

      {/* Top edge highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className={cn(
        "relative z-10",
        noPadding ? "flex-1" : "p-6 sm:p-8"
      )}>
        {children}
      </div>

      {/* Subtle inner shadow for depth */}
      <div className="absolute inset-0 rounded-lg shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] pointer-events-none" />
    </div>
  )
}
