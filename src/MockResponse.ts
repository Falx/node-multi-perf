import { IncomingMessage, OutgoingMessage, ServerResponse } from "http";
import { Socket } from "net";

export class MockResponse extends ServerResponse {

    constructor() {
        super(new IncomingMessage(new Socket()));
    }

    buffer: any[] = [];

    write(chunk: any, callback?: (error: Error | null | undefined) => void): boolean;
    write(chunk: any, encoding: BufferEncoding, callback?: (error: Error | null | undefined) => void): boolean;
    write(chunk: any, encoding?: any, callback?: any): boolean {
        this.buffer.push(chunk);
        if (callback) {callback()}
        return true;
    }

    end(cb?: () => void): this;
    end(chunk: any, cb?: () => void): this;
    end(chunk: any, encoding: BufferEncoding, cb?: () => void): this;
    end(chunk?: any, encoding?: any, cb?: any): this {
        if (chunk) {
            this.write(chunk);
        }
        if(cb) cb();
        return this;
    }

    getOutput(): any {
        return this.buffer.join('');
    }

}