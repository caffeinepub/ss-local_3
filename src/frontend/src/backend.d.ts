import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;

export type RegisterResult = { ok: null } | { err: string };
export type LoginResult = { ok: { role: string; mobile: string; fullName: string; village: string; validityDate: string | null } } | { err: string };
export type UserInfo = { mobile: string; fullName: string; village: string; validityDate: string | null };

export interface backendInterface {
    register(mobile: string, password: string, fullName: string, village: string): Promise<RegisterResult>;
    login(username: string, password: string): Promise<LoginResult>;
    listAllUsers(): Promise<UserInfo[]>;
    setUserValidity(mobile: string, validityDate: string): Promise<RegisterResult>;
    removeUserValidity(mobile: string): Promise<RegisterResult>;
    deleteUser(mobile: string): Promise<RegisterResult>;
    getUserInfo(mobile: string): Promise<UserInfo | null>;
    updatePassword(mobile: string, oldPassword: string, newPassword: string): Promise<RegisterResult>;
    updateUserInfo(mobile: string, fullName: string, village: string): Promise<RegisterResult>;
}
