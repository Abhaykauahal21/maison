import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
});

type Subscriber = { email: string; at: string };

const FILE = path.join(process.cwd(), "data", "subscribers.json");

const readAll = async (): Promise<Subscriber[]> => {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Subscriber[];
  } catch {
    return [];
  }
};

/**
 * "Stay with the story" sign-ups. Emails are appended to data/subscribers.json (git-ignored).
 * That is fine for a single server; on serverless hosting (read-only disk) swap the storage
 * below for a real service (Mailchimp, Resend audience, a database...).
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  const { email } = parsed.data;
  const all = await readAll();
  const already = all.some((s) => s.email === email);

  if (!already) {
    all.push({ email, at: new Date().toISOString() });
    try {
      await fs.mkdir(path.dirname(FILE), { recursive: true });
      await fs.writeFile(FILE, JSON.stringify(all, null, 2), "utf8");
    } catch {
      return Response.json({ ok: false, error: "We couldn't save that just now. Please try again." }, { status: 500 });
    }
  }

  return Response.json({ ok: true, already });
}
