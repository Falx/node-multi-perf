import { Config } from "../Config";
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

        let series;
        if (Config.areWorkersEnabled()) {
            series = await Offloader.offload(generateTimeSeries, [total]);
        } else {
            series = generateTimeSeries(total);
        }

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(series);

        return Promise.resolve();
    }
}

function generateTimeSeries(total: number): string {
    const series = [] as [number, number][];
    for (let i = 0; i < total; i++) {
        series.push([Date.now(), i + Math.round(Math.random() * 20)]);
    }
    return JSON.stringify(series);
}
