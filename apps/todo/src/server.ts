import { createServer } from "http";
import { handler } from "./entry";

const server = createServer(handler);

server.listen(3020, () => {
    console.log('Server is running on port 3020');
    console.log('http://localhost:3020');
});
