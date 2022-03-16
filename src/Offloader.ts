import { pool, WorkerPool } from "workerpool";
import { Serializable } from "worker_threads";
import { Offloadable } from "./Offloadable";

export class Offloader {
    private static calcPool: WorkerPool = pool();

    static offload(fn: Offloadable, fnArgs?: Serializable[]) {
        return this.calcPool.exec(fn, fnArgs ?? null)
    }
}