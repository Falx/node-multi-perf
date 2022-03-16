import { Offloader } from "../Offloader";
import { HttpHandler, HttpHandlerInput } from "./HttpHandler";

const DEFAULT_SIZE = 5000;


export class LongTaskHttpHandler extends HttpHandler {

    public async canHandle(input: HttpHandlerInput): Promise<void> {
        return Promise.resolve();
    }


    public async handle(input: HttpHandlerInput): Promise<void> {
        const { request, response } = input;

        const search = /\??([^\/\?]*)$/u.exec(request.url!);
        const params = new URLSearchParams(search![1]);
        const total = parseInt(params.get("total") ?? `${DEFAULT_SIZE}`);

        const series = generateTimeSeries(total);
        // const series = await Offloader.offload(generateTimeSeries, [total]);

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(series));

        return Promise.resolve();
    }
}

function generateTimeSeries(total: number): [number,number][] {
    const series = [] as [number,number][];
    for (let i = 0; i < total; i++) {
        series.push([Date.now(), i+Math.round(Math.random()*20)]);
    }
    return series;
}
