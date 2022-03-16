import { Serializable } from "worker_threads";

export interface Offloadable {
    (...args: any[]) :  any;
}