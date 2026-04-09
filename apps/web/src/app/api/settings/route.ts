import { readSettings, writeSettings } from '@/lib/settings';
import type { AppSettings } from '@/lib/settings';

export async function GET() {
  const settings = await readSettings();
  return Response.json(settings);
}

export async function PATCH(req: Request) {
  const body: Partial<AppSettings> = await req.json();
  await writeSettings(body);
  return Response.json({ ok: true });
}
