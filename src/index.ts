import { IncomingMessage, ServerResponse, createServer } from 'http';
import { Config } from './Config';
import { LongTaskHttpHandler } from './handlers/LongTaskHttpHandler';
import { ShortTaskHttpHandler } from './handlers/ShortTaskHttpHandler';
import { guardStream } from './util/GuardedStream';


const hostname = '0.0.0.0';
const port = 3000;

const shortHandler = new ShortTaskHttpHandler();
const longHandler = new LongTaskHttpHandler();

const server = createServer(async (request: IncomingMessage, response: ServerResponse) => {
    if (request.url?.startsWith('/short')) {
        await shortHandler.handleSafe({ request: guardStream(request), response });
        return;
    } 
    if (request.url?.startsWith('/long')) {
        await longHandler.handleSafe({ request: guardStream(request), response });
        return;
    }
    if (request.url?.startsWith('/config')) {
        response.setHeader('Content-type', 'application/json');
        response.end(`{"areWorkersEnabled": ${Config.areWorkersEnabled()}}`);
        return;
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});