import react from "@vitejs/plugin-react";
import builtins from "rollup-plugin-polyfill-node";
import { defineConfig, searchForWorkspaceRoot } from "vite";
import restart from "vite-plugin-restart";
import UnoCSS from "unocss/vite";
import dns from "dns";
import * as fs from 'fs';
import dotenv from 'dotenv';
import findConfig from "find-config";

dns.setDefaultResultOrder("verbatim");

const builtinsPlugin = {
  ...builtins({ include: ["fs/promises"] }),
  name: "rollup-plugin-polyfill-node",
};

let dotEnvPath = null;
if (fs.existsSync('/home/ubuntu/eli')) {
  dotEnvPath = findConfig('.env', {cwd: '/home/ubuntu/eli/experiment'});
} else if (fs.existsSync('/Users/eclagget/Code/experiment')) {
  dotEnvPath = findConfig('.env', {cwd: '/Users/eclagget/Code/experiment/face-morph'});
}

if (dotEnvPath) {
  const envFile = dotenv.parse(fs.readFileSync(dotEnvPath));
  for (const key of Object.keys(envFile)) {
    process.env[key] = envFile[key];
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ["@empirica/tajriba", "@empirica/core"],
  },
  server: {
    port: process.env['PORT_EMPIRICA_PROXY'],
    open: false,
    strictPort: true,
    host: "0.0.0.0",
    hmr: {
      host: "localhost",
      protocol: "ws",
      port: process.env['PORT_EMPIRICA_PROXY'],
    },
    fs: {
      allow: [
        // search up for workspace root
        searchForWorkspaceRoot(process.cwd()),
      ],
    },
  },
  build: {
    minify: false,
    target: "esnext",
    sourcemap: true,
    rollupOptions: {
      preserveEntrySignatures: "strict",
      external: ['@empirica/core'],
      plugins: [builtinsPlugin],
      output: {
        sourcemap: true,
      },
    },
  },
  clearScreen: false,
  plugins: [
    restart({
      restart: [
        "./uno.config.cjs",
        "./node_modules/@empirica/core/dist/**/*.{js,ts,jsx,tsx,css}",
        "./node_modules/@empirica/core/assets/**/*.css",
      ],
    }),
    UnoCSS(),
    react(),
  ],
  define: {
    "process.env": {
      NODE_ENV: process.env.NODE_ENV || "development",
    },
  },
});
