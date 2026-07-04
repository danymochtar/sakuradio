/**
 * Adapts a Web-standard (Request → Response) handler to the classic Vercel
 * Node signature `export default (req, res)`, which every Vercel Node build
 * recognizes. Lets the API keep clean Web handlers while deploying reliably.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

async function readBody(req: VercelRequest): Promise<string | undefined> {
  // Vercel may have already parsed the body — reserialize it.
  if (req.body !== undefined && req.body !== null && req.body !== '') {
    if (typeof req.body === 'string') return req.body;
    if (Buffer.isBuffer(req.body)) return req.body.toString('utf8');
    return JSON.stringify(req.body);
  }
  // Otherwise drain the raw stream.
  const chunks: Buffer[] = [];
  for await (const chunk of req as AsyncIterable<Buffer | string>) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw.length ? raw : undefined;
}

export function toVercelHandler(fn: (request: Request) => Promise<Response> | Response) {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      const host = (req.headers['x-forwarded-host'] as string) ?? req.headers.host ?? 'localhost';
      const proto = (req.headers['x-forwarded-proto'] as string) ?? 'https';
      const url = `${proto}://${host}${req.url ?? '/'}`;
      const method = (req.method ?? 'GET').toUpperCase();

      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value === undefined) continue;
        if (Array.isArray(value)) value.forEach((v) => headers.append(key, v));
        else headers.set(key, value);
      }

      const hasBody = method !== 'GET' && method !== 'HEAD';
      const body = hasBody ? await readBody(req) : undefined;

      const response = await fn(new Request(url, { method, headers, body }));

      res.status(response.status);
      // Keep Set-Cookie as discrete headers (Better Auth sets these).
      const setCookies = (
        response.headers as Headers & { getSetCookie?: () => string[] }
      ).getSetCookie?.();
      if (setCookies?.length) res.setHeader('Set-Cookie', setCookies);
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() === 'set-cookie') return;
        res.setHeader(key, value);
      });

      const buf = Buffer.from(await response.arrayBuffer());
      res.send(buf);
    } catch (err) {
      console.error('[api] handler error', err);
      const e = err as Error;
      res.status(500).json({
        error: e?.message ?? 'Internal error',
        // Temporary: surface the top of the stack to diagnose init crashes.
        where: e?.stack?.split('\n').slice(0, 3).join(' | '),
      });
    }
  };
}
