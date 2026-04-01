import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type RegisterResult = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export type LoginResult = {
    __kind__: "ok";
    ok: {
        role: string;
        fullName: string;
        village: string;
        mobile: string;
        validUntil?: string;
    };
} | {
    __kind__: "err";
    err: string;
};
export interface UserInfo {
    fullName: string;
    village: string;
    mobile: string;
    validUntil?: string;
}
export interface backendInterface {
    deleteUser(mobile: string): Promise<RegisterResult>;
    getUserInfo(mobile: string): Promise<UserInfo | null>;
    listAllUsers(): Promise<Array<UserInfo>>;
    login(username: string, password: string): Promise<LoginResult>;
    register(mobile: string, password: string, fullName: string, village: string): Promise<RegisterResult>;
    removeUserValidity(mobile: string): Promise<RegisterResult>;
    setUserValidity(mobile: string, validityDate: string): Promise<RegisterResult>;
    updatePassword(mobile: string, oldPassword: string, newPassword: string): Promise<RegisterResult>;
    updateUserInfo(mobile: string, fullName: string, village: string): Promise<RegisterResult>;
}
