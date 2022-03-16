import { HttpHandler, HttpHandlerInput } from "./HttpHandler";

export class ShortTaskHttpHandler extends HttpHandler {


    public canHandle(input: HttpHandlerInput): Promise<void> {
        return Promise.resolve();
    }


    public handle(input: HttpHandlerInput): Promise<void> {
        const res = input.response;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hello World');

        return Promise.resolve();
    }

}