const isServer = typeof window === 'undefined';

export const config = {
  openAI: {
    apiKey: isServer ? process.env.OPENAI_API_KEY || '' : '',
  },
  environment: process.env.NODE_ENV || 'development',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
};

// Validate the configuration
if (isServer && !config.openAI.apiKey) {
  console.error('OpenAI API key is missing. Please set the OPENAI_API_KEY environment variable.');
}

if (!config.apiUrl) {
  console.error('API URL is missing. Please set the NEXT_PUBLIC_API_URL environment variable.');
}

