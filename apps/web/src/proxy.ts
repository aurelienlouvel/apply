import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Auth disabled — passthrough all requests
export function proxy(_req: NextRequest) {
  return NextResponse.next();
}
