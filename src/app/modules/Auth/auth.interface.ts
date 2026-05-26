import { Schema } from "mongoose";
import { BaseType } from "../../utils/utils.interface";
import { TUserRole, TUserStatus } from "./auth.utils";

export type TLoginUser = {
  userName: string;
  phone: string;
  password: string;
};


export type TVerification = BaseType & {
  code: string;
  verification: boolean;
  expired: Date;
};

//  Represents a user type.
export type TUser = BaseType & {
  profileId: Schema.Types.ObjectId;
  email: string;
  role: TUserRole;
  password: string;
  userName: string;
  status: TUserStatus;
  phoneVerification?: TVerification;
  emailVerification?: TVerification;
  rememberPassword: boolean;
  shopId?: string;
};

// Represents a profile type.
export type TProfile = BaseType & {
  
  fullName? : string;
  Birthday? : Date;
  phone: string;
  email: string;
  image?: string;
};

