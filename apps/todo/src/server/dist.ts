import { readFileSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import { basename, join } from "node:path";

export const serveDist = async (req: IncomingMessage, res: ServerResponse) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/javascript');

    return res.end(readFileSync(join('./', (req.url ?? "").split("?")[0] ?? "")));
};