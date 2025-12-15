// Type definitions for Vercel serverless functions
// This file helps with TypeScript types in API routes

export interface VercelRequest {
  method?: string
  body?: any
  query?: Record<string, string>
  headers?: Record<string, string>
}

export interface VercelResponse {
  status: (code: number) => VercelResponse
  json: (data: any) => void
  send: (data: any) => void
}

