// server/middleware/cors.ts
import { defineEventHandler, setHeader } from "h3";

export default defineEventHandler((event) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://your-domain.com",
  ] as const;
  const origin = event.node.req.headers.origin as string | undefined;

  if (origin && allowedOrigins.includes(origin)) {
    setHeader(event, "Access-Control-Allow-Origin", origin);
  }

  setHeader(
    event,
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  setHeader(
    event,
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  setHeader(event, "Access-Control-Allow-Credentials", "true");

  if (event.method === "OPTIONS") {
    event.node.res.statusCode = 204;
    event.node.res.end();
    return;
  }
});
