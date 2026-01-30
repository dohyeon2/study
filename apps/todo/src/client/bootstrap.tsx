import { hydrateRoot, type Root } from "react-dom/client";
import ws from 'ws';

let root: Root | null = null;

export const bootstrap = async () => {
    const main = await import('/dist/main.js?v=' + Date.now()).then(m => m.main);
    if (root) {
        root.render(await main());
    } else {
        root = hydrateRoot(document.body, await main());
    }
};


const socket = new WebSocket('ws://localhost:3000');

socket.onopen = () => {
    console.log('WebSocket connection established');
};
socket.addEventListener('message', async function message(data) {
    console.log('received: %s', data.data);
    await bootstrap();
});

bootstrap();