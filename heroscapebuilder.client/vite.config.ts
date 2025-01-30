import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';

const certFilePath = "/certs/origin.pem";
const keyFilePath = "/certs/origin.key";

let httpsConfig: undefined | { key: Buffer; cert: Buffer } = undefined;

// Ensure the certificate files exist before enabling HTTPS
if (fs.existsSync(certFilePath) && fs.existsSync(keyFilePath)) {
    httpsConfig = {
        key: fs.readFileSync(keyFilePath),
        cert: fs.readFileSync(certFilePath),
    };
} else {
    console.warn("⚠️  HTTPS Certificate files not found! Ensure ~/heroscapebuilder-certs is correctly mounted.");
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        port: 5173,
        https: httpsConfig, // Only enable HTTPS if certificates exist
    },
});
