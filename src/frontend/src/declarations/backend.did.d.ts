/* eslint-disable */

// @ts-nocheck

import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';
import type { Principal } from '@icp-sdk/core/principal';

export type LoginResult =
  | { ok: { role: string; mobile: string; validityDate: [] | [string] } }
  | { err: string };

export type RegisterResult = { ok: null } | { err: string };

export interface UserInfo {
  mobile: string;
  validityDate: [] | [string];
}

export interface _SERVICE {
  register: ActorMethod<[string, string], RegisterResult>;
  login: ActorMethod<[string, string], LoginResult>;
  listAllUsers: ActorMethod<[], UserInfo[]>;
  setUserValidity: ActorMethod<[string, string], RegisterResult>;
  removeUserValidity: ActorMethod<[string], RegisterResult>;
  deleteUser: ActorMethod<[string], RegisterResult>;
  getUserInfo: ActorMethod<[string], [] | [UserInfo]>;
}
export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
