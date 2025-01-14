import { Card } from "@/components/ui/card"
import { GeistSans } from 'geist/font/sans'

interface FeatureCardProps {
  title: string;
  items: string[];
  delay: string;
}

export function FeatureCard({ title, items, delay }: FeatureCardProps) {
  return (
    <Card className={`relative overflow-hidden border-0 shadow-xl bg-white/90 backdrop-blur-sm animate-slide-up ${delay} hover:shadow-2xl transition-all duration-300`}>
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500" />
      <div className="pt-8 px-6 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
        </div>
        <h3 className={`${GeistSans.className} text-xl font-medium text-gray-900 mb-4`}>
          {title}
        </h3>
        <div className="space-y-4">
          <ul className={`${GeistSans.className} space-y-3 text-gray-600 text-sm leading-relaxed list-disc pl-4`}>
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
}

