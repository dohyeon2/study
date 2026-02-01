import { build } from "esbuild";
import { watch } from "node:fs";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { WebSocketServer } from "ws";
import { bundleVendor } from "./src/server/vendor";


const buildBundles = async () => {
    try {
        await bundleVendor();
        await build({
            entryPoints: ['./src/client/bootstrap.tsx'],
            outdir: './dist/',
            bundle: true,
            format: 'esm',
            jsx: 'automatic',
            sourcemap: true,
            packages: 'external',
        });
        await build({
            entryPoints: ['./src/client/main.tsx'],
            outdir: './dist/',
            bundle: true,
            format: 'esm',
            jsx: 'automatic',
            sourcemap: true,
            packages: 'external',
        });
    } catch (error) {
        console.error(error);
    }
}

const attachHandler = async () => {
    try {
        const { handler: handlerFn } = await import('./src/server/index.tsx?v=' + Date.now());
        handler = handlerFn;
    } catch (error) {
        console.error(error);
    }
}

let handler = (req: IncomingMessage, res: ServerResponse) => {
    res.statusCode = 500;
    res.end('Server error');
};

buildBundles();
attachHandler();

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    handler(req, res);
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

const wsServer = new WebSocketServer({ server, });

wsServer.on('connection', () => {
    console.log('WebSocket connection established');
});

watch('./src/', { recursive: true }, async () => {
    await buildBundles();
    await attachHandler();

    if (wsServer.clients.size) {
        console.log('Sending reload to clients');
        wsServer.clients.forEach((client) => {
            client.send('reload');
        });
    }
    if (!server.listening) {
        server.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    }
});