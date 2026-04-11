import { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  message: string
}

export function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-gold/30 mb-6 scale-[2]">
        {icon}
      </div>
      <p className="text-mauve text-sm font-light uppercase tracking-[3px]">
        {message}
      </p>
    </div>
  )
}
