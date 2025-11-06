// Health check endpoint for Docker container monitoring
// Returns 200 OK if the application is running properly

import { NextResponse } from 'next/server';

export function GET(): NextResponse {
  // Perform basic health checks
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  };

  return NextResponse.json(health, { status: 200 });
}

// Disable caching for health checks
export const dynamic = 'force-dynamic';
