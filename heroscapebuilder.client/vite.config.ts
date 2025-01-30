import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        port: 5173,
        https: {
            key: fs.readFileSync('/app/certs/origin.key'),
            cert: fs.readFileSync('/app/certs/origin.pem'),
        },
        host: '0.0.0.0',
        strictPort: true,
    },
});