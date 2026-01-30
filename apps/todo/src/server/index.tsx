import type { IncomingMessage, ServerResponse } from "node:http";
import { serveDist } from "./dist";
import { render } from "./render";

export const handler = async (req: IncomingMessage, res: ServerResponse) => {
    try {
        res.statusCode = 200;

        if (req.url?.startsWith('/dist/')) {
            return serveDist(req, res);
        }

        const stream = await render();
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Transfer-Encoding', 'chunked');

        return stream.pipeTo(new WritableStream({
            write(chunk) {
                res.write(chunk);
            },
            close() {
                res.end();
            }
        }));
    } catch (error) {
        res.statusCode = 500;
        res.end('Server error');
    }
};