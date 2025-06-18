export type TUser = {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  verifyToken: string;
  verified: boolean;
  resetToken?: string;
  resetTokenExpiry?: Date;
};

export type TUserCreateDTO = Partial<Omit<TUser, '_id'>>;
export type TUserUpdateDTO = TUserCreateDTO & Required<{ _id: string }>;
export function isTUser(arg: any): arg is TUser {
  return (
    arg !== 'undefined' &&
    arg._id !== 'undefined' &&
    arg.name !== 'undefined' &&
    arg.lastName !== 'undefined' &&
    arg.email !== 'undefined' &&
    arg.username !== 'undefined' &&
    arg.password !== 'undefined' &&
    arg.createdAt !== 'undefined' &&
    arg.updatedAt !== 'undefined' &&
    arg.verifyToken !== 'undefined' &&
    arg.verified !== 'undefined'
    // resetToken and resetTokenExpiry are optional, so no need to check
  );
}
export function isTUserArray(arg: any): arg is TUser[] {
  return Array.isArray(arg) && arg.every((v) => isTUser(v));
}
export function asTUser(arg: any): TUser {
  if (isTUser(arg)) {
    return arg;
  }
  throw new Error('Invalid TUser');
}
export function isTUserCreateDTO(arg: any): arg is TUserCreateDTO {
  return true;
}
export function isTUserUpdateDTO(arg: any): arg is TUserUpdateDTO {
  return arg && arg._id;
}
