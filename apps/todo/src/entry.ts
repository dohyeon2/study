import type { IncomingMessage, ServerResponse } from "node:http";
import { appHandler } from "./app";
import path from "node:path";
import { readFileSync } from "node:fs";

export const handler = async <R extends IncomingMessage, S extends ServerResponse<R>>(req: R, res: S) => {
    if (req.url === '/main.js') {
        const file = readFileSync(path.join(__dirname, 'client', 'main.js'));
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.write(file);
        res.end();
        return;
    }
    const stream = await appHandler();
    stream.pipeTo(new WritableStream({
        write(chunk) {
            res.write(chunk);
        },
        close() {
            res.end();
        }
    }));
}