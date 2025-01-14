import { GeistSans } from 'geist/font/sans'

export function Hero() {
  return (
    <div className="text-center space-y-6 mb-20">
      <h1 className={`${GeistSans.className} text-center max-w-4xl mx-auto`}>
        <span className="text-5xl sm:text-6xl md:text-7xl font-normal text-gray-500">
          Internal{' '}
        </span>
        <span className="text-5xl sm:text-6xl md:text-7xl font-semibold text-gray-900">
          AI Assistant
        </span>
        <span className="text-5xl sm:text-6xl md:text-7xl font-normal text-gray-500">
          {' '}for{' '}
        </span>
        <span className="text-5xl sm:text-6xl md:text-7xl font-semibold text-gray-900">
          Partisia Blockchain
        </span>
      </h1>
      <p className="text-gray-600 text-xl max-w-2xl mx-auto">
        Please connect with bettina sosa for any technical issues.
      </p>
    </div>
  )
}

