interface PageHeaderProps {
  title: string
  description?: string
  className?: string
}

export function PageHeader({
  title,
  description,
  className = ""
}: PageHeaderProps) {
  return (
    <header className={`mb-8 ${className}`}>
      <h1 className="text-4xl font-medium tracking-tight text-gray-900 mb-1">
        {title}
      </h1>
      {description && <p className="text-gray-600">{description}</p>}
    </header>
  )
}
