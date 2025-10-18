interface StatusCardProps {
  title: string
  value: string | number
  description?: string
  className?: string
}

export default function StatusCard({ title, value, description, className = '' }: StatusCardProps) {
  return (
    <div className={`bg-white border border-[#00719C] rounded-xl p-6 ${className}`}>
      <h3 className="text-sm font-medium text-[#0C0C0C] mb-2">{title}</h3>
      <p className="text-2xl font-bold text-[#0C0C0C]">{value}</p>
      {description && (
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      )}
    </div>
  )
}
