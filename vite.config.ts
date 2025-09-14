import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// helper to split CSV env var safely
const splitEnv = (v) =>
  typeof v === "string" && v.length
    ? v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

export default defineConfig(async () => {
  // اجمع مصادر الهوستات الممكنة
  const replDev = process.env.REPLIT_DEV_DOMAIN; // e.g. "abcd.riker.replit.dev"
  const replDomains = process.env.REPLIT_DOMAINS; // e.g. "a.replit.dev,b.replit.dev"
  const additional = process.env.__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS; // optional CSV

  const hosts = new Set([
    ...(replDev ? [replDev] : []),
    ...splitEnv(replDomains),
    ...splitEnv(additional),
  ]);

  // لو ما في شيء و احنا في وضع تطوير حاول ألا تمنع (fallback dev convenience)
  if (hosts.size === 0 && process.env.NODE_ENV !== "production") {
    // ملاحظة: هذا تخفيف أمني لكن مناسب للـ Replit/dev. احذفه للـ production.
    hosts.add("*");
  }

  return {
    plugins: [
      react(),
      runtimeErrorOverlay(),
      ...(process.env.NODE_ENV !== "production" &&
      process.env.REPL_ID !== undefined
        ? [
            await import("@replit/vite-plugin-cartographer").then((m) =>
              m.cartographer(),
            ),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
      // host: true يجعل السيرفر يستمع على كل الواجهات (ضروري في بعض بيئات الحاويات/Replit)
      host: true,
      // حول الـ Set إلى Array
      allowedHosts: Array.from(hosts),
    },
  };
});
