import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';

export type RegisterResult = { 'ok': null } | { 'err': string };
export type LoginResult = { 'ok': { role: string; mobile: string; fullName: string; village: string; validityDate: [] | [string] } } | { 'err': string };
export interface UserInfo { mobile: string; fullName: string; village: string; validityDate: [] | [string] }

export interface _SERVICE {
  register: ActorMethod<[string, string, string, string], RegisterResult>;
  login: ActorMethod<[string, string], LoginResult>;
  listAllUsers: ActorMethod<[], UserInfo[]>;
  setUserValidity: ActorMethod<[string, string], RegisterResult>;
  removeUserValidity: ActorMethod<[string], RegisterResult>;
  deleteUser: ActorMethod<[string], RegisterResult>;
  getUserInfo: ActorMethod<[string], [] | [UserInfo]>;
  updatePassword: ActorMethod<[string, string, string], RegisterResult>;
  updateUserInfo: ActorMethod<[string, string, string], RegisterResult>;
}

export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
