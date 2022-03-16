import { IncomingMessage, ServerResponse, createServer } from 'http';
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
    } else if (request.url?.startsWith('/long')) {
        await longHandler.handle({ request: guardStream(request), response });
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});