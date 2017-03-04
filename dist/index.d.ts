import { Module } from 'magnet-core/module';
export default class Ioredis extends Module {
    setup(): Promise<void>;
    teardown(): Promise<void>;
}
