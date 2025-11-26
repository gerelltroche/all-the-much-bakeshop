import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://allthemuchbakeshop.com'

  return {
    rules: [
      // General crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/drops/*/order/checkout',
          '/drops/*/order/confirmation',
          '/thank-you',
          '/unsubscribe',
          '_next/',
        ],
      },
      // OpenAI crawlers
      {
        userAgent: 'OAI-SearchBot', // ChatGPT Search - Critical for live search
        allow: '/',
      },
      {
        userAgent: 'GPTBot', // OpenAI training crawler
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User', // User-initiated web browsing
        allow: '/',
      },
      // Microsoft/Bing - Critical (powers ChatGPT Search index)
      {
        userAgent: 'Bingbot',
        allow: '/',
      },
      // Google crawlers
      {
        userAgent: 'Googlebot', // Powers AI Overviews and Gemini
        allow: '/',
      },
      {
        userAgent: 'Google-Extended', // Gemini/Bard training
        allow: '/',
      },
      // Anthropic/Claude crawlers
      {
        userAgent: 'Claude-Web', // Claude live browsing
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },
      {
        userAgent: 'Anthropic-AI',
        allow: '/',
      },
      // Perplexity
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      // Other AI crawlers
      {
        userAgent: 'Cohere-AI',
        allow: '/',
      },
      {
        userAgent: 'YouBot', // You.com
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
