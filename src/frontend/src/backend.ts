/* eslint-disable */

// @ts-nocheck

import { Actor, HttpAgent, type HttpAgentOptions, type ActorConfig, type Agent, type ActorSubclass } from "@icp-sdk/core/agent";
import type { Principal } from "@icp-sdk/core/principal";
import { idlFactory, type _SERVICE } from "./declarations/backend.did";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;

export type RegisterResult = { ok: null } | { err: string };
export type LoginResult = { ok: { role: string; mobile: string; fullName: string; village: string; validityDate: [] | [string] } } | { err: string };
export type UserInfo = { mobile: string; fullName: string; village: string; validityDate: [] | [string] };

export class ExternalBlob {
    _blob?: Uint8Array<ArrayBuffer> | null;
    directURL: string;
    onProgress?: (percentage: number) => void = undefined;
    private constructor(directURL: string, blob: Uint8Array<ArrayBuffer> | null){
        if (blob) { this._blob = blob; }
        this.directURL = directURL;
    }
    static fromURL(url: string): ExternalBlob {
        return new ExternalBlob(url, null);
    }
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob {
        const url = URL.createObjectURL(new Blob([new Uint8Array(blob)], { type: 'application/octet-stream' }));
        return new ExternalBlob(url, blob);
    }
    public async getBytes(): Promise<Uint8Array<ArrayBuffer>> {
        if (this._blob) { return this._blob; }
        const response = await fetch(this.directURL);
        const blob = await response.blob();
        this._blob = new Uint8Array(await blob.arrayBuffer());
        return this._blob;
    }
    public getDirectURL(): string { return this.directURL; }
    public withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob {
        this.onProgress = onProgress;
        return this;
    }
}

export interface backendInterface {
    register(mobile: string, password: string, fullName: string, village: string): Promise<RegisterResult>;
    login(username: string, password: string): Promise<LoginResult>;
    listAllUsers(): Promise<UserInfo[]>;
    setUserValidity(mobile: string, validityDate: string): Promise<RegisterResult>;
    removeUserValidity(mobile: string): Promise<RegisterResult>;
    deleteUser(mobile: string): Promise<RegisterResult>;
    getUserInfo(mobile: string): Promise<[] | [UserInfo]>;
    updatePassword(mobile: string, oldPassword: string, newPassword: string): Promise<RegisterResult>;
    updateUserInfo(mobile: string, fullName: string, village: string): Promise<RegisterResult>;
}

export class Backend implements backendInterface {
    constructor(private actor: ActorSubclass<_SERVICE>, private _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>, private _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>, private processError?: (error: unknown) => never){}

    async register(mobile: string, password: string, fullName: string, village: string): Promise<RegisterResult> {
        return this.actor.register(mobile, password, fullName, village);
    }

    async login(username: string, password: string): Promise<LoginResult> {
        return this.actor.login(username, password);
    }

    async listAllUsers(): Promise<UserInfo[]> {
        return this.actor.listAllUsers();
    }

    async setUserValidity(mobile: string, validityDate: string): Promise<RegisterResult> {
        return this.actor.setUserValidity(mobile, validityDate);
    }

    async removeUserValidity(mobile: string): Promise<RegisterResult> {
        return this.actor.removeUserValidity(mobile);
    }

    async deleteUser(mobile: string): Promise<RegisterResult> {
        return this.actor.deleteUser(mobile);
    }

    async getUserInfo(mobile: string): Promise<[] | [UserInfo]> {
        return this.actor.getUserInfo(mobile);
    }

    async updatePassword(mobile: string, oldPassword: string, newPassword: string): Promise<RegisterResult> {
        return this.actor.updatePassword(mobile, oldPassword, newPassword);
    }

    async updateUserInfo(mobile: string, fullName: string, village: string): Promise<RegisterResult> {
        return this.actor.updateUserInfo(mobile, fullName, village);
    }
}

export interface CreateActorOptions {
    agent?: Agent;
    agentOptions?: HttpAgentOptions;
    actorOptions?: ActorConfig;
    processError?: (error: unknown) => never;
}

export function createActor(canisterId: string, _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>, _downloadFile: (file: Uint8Array) => Promise<ExternalBlob>, options: CreateActorOptions = {}): Backend {
    const agent = options.agent || HttpAgent.createSync({ ...options.agentOptions });
    if (options.agent && options.agentOptions) {
        console.warn("Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent.");
    }
    const actor = Actor.createActor<_SERVICE>(idlFactory, {
        agent,
        canisterId: canisterId,
        ...options.actorOptions
    });
    return new Backend(actor, _uploadFile, _downloadFile, options.processError);
}
