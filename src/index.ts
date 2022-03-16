import { IncomingMessage, ServerResponse, createServer } from 'http';
import { LongTaskHttpHandler } from './handlers/LongTaskHttpHandler';
import { ShortTaskHttpHandler } from './handlers/ShortTaskHttpHandler';
import { guardStream } from './util/GuardedStream';
import { pool } from 'workerpool'
import { MockResponse } from './MockResponse';
import { HttpHandler } from './handlers/HttpHandler';


const hostname = '0.0.0.0';
const port = 3000;
const myPool = pool();

const shortHandler = new ShortTaskHttpHandler();
const longHandler = new LongTaskHttpHandler();

const server = createServer(async (request: IncomingMessage, response: ServerResponse) => {
    if (request.url?.startsWith('/short')) {
        await shortHandler.handleSafe({ request: guardStream(request), response });
    } else if (request.url?.startsWith('/long')) {
        await longHandler.handleSafe({ request: guardStream(request), response });
    }
});

async function offload(handler: HttpHandler, request: IncomingMessage, response: ServerResponse): Promise<any> {
    const mock = new MockResponse();
    await handler.handleSafe({ request: guardStream(request), response: mock });
    return mock.getOutput();
}

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});