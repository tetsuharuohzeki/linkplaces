import type { ExtensionRuntime, ExtensionMessageSender } from '@linkplaces/webext_types';
import type { AssertTypeGuardFn } from './AssertTypeGuardFn.js';

import type { TowerService } from './traits.js';

export class SendMessageResponder<in out TRequest, in out TResponse> {
    private _runtime: ExtensionRuntime;
    private _onMessage: typeof SendMessageResponder.prototype.onMessage = this.onMessage.bind(this);

    private _validator: AssertTypeGuardFn<TRequest>;
    private _service: TowerService<TRequest, TResponse>;

    constructor(runtime: ExtensionRuntime, validator: AssertTypeGuardFn<TRequest>, service: TowerService<TRequest, TResponse>) {
        this._runtime = runtime;
        this._validator = validator;
        this._service = service;
    }

    private _initialize(): void {
        const runtime = this._runtime;
        runtime.onMessage.addListener(this._onMessage);
    }

    destory(): void {
        const runtime = this._runtime;
        runtime.onMessage.removeListener(this._onMessage);

        this._service = null as never;
        this._validator = null as never;
        this._onMessage = null as never;
        this._runtime = null as never;
    }

    run(): void {
        this._initialize();
    }

    async onMessage(message: object, _sender: ExtensionMessageSender): Promise<unknown> {
        this._validator(message);
        const res = this._callService(message);
        return res;
    }

    private async _callService(packet: TRequest): Promise<TResponse> {
        const res = await this._service.call(packet);
        return res;
    }
}
