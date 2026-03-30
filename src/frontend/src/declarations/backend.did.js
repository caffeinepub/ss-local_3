/* eslint-disable */

// @ts-nocheck

import { IDL } from '@icp-sdk/core/candid';

const LoginResult = IDL.Variant({
  ok: IDL.Record({ role: IDL.Text, mobile: IDL.Text, validityDate: IDL.Opt(IDL.Text) }),
  err: IDL.Text,
});

const RegisterResult = IDL.Variant({
  ok: IDL.Null,
  err: IDL.Text,
});

const UserInfo = IDL.Record({
  mobile: IDL.Text,
  validityDate: IDL.Opt(IDL.Text),
});

export const idlService = IDL.Service({
  register: IDL.Func([IDL.Text, IDL.Text], [RegisterResult], []),
  login: IDL.Func([IDL.Text, IDL.Text], [LoginResult], []),
  listAllUsers: IDL.Func([], [IDL.Vec(UserInfo)], ['query']),
  setUserValidity: IDL.Func([IDL.Text, IDL.Text], [RegisterResult], []),
  removeUserValidity: IDL.Func([IDL.Text], [RegisterResult], []),
  deleteUser: IDL.Func([IDL.Text], [RegisterResult], []),
  getUserInfo: IDL.Func([IDL.Text], [IDL.Opt(UserInfo)], ['query']),
});

export const idlInitArgs = [];

export const idlFactory = ({ IDL }) => {
  const LoginResult = IDL.Variant({
    ok: IDL.Record({ role: IDL.Text, mobile: IDL.Text, validityDate: IDL.Opt(IDL.Text) }),
    err: IDL.Text,
  });
  const RegisterResult = IDL.Variant({
    ok: IDL.Null,
    err: IDL.Text,
  });
  const UserInfo = IDL.Record({
    mobile: IDL.Text,
    validityDate: IDL.Opt(IDL.Text),
  });
  return IDL.Service({
    register: IDL.Func([IDL.Text, IDL.Text], [RegisterResult], []),
    login: IDL.Func([IDL.Text, IDL.Text], [LoginResult], []),
    listAllUsers: IDL.Func([], [IDL.Vec(UserInfo)], ['query']),
    setUserValidity: IDL.Func([IDL.Text, IDL.Text], [RegisterResult], []),
    removeUserValidity: IDL.Func([IDL.Text], [RegisterResult], []),
    deleteUser: IDL.Func([IDL.Text], [RegisterResult], []),
    getUserInfo: IDL.Func([IDL.Text], [IDL.Opt(UserInfo)], ['query']),
  });
};

export const init = ({ IDL }) => { return []; };
