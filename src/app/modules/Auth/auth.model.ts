import { Schema, model } from 'mongoose'; 
import { USER_ROLE, UserStatus } from './auth.utils';
import { TProfile, TUser } from './auth.interface';

const userSchema = new Schema<TUser & TProfile>(
  {
    profileId: {
      type: Schema.Types.ObjectId,
      ref: 'Profiles',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    userName: {
      type: String,
      required: [true, 'User is required'],
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.user,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.inProgress,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
      trim: true,
    },
    emailVerification: {
      code: { type: String },
      expired: { type: Date },
      verification: { type: Boolean },
    },
    rememberPassword: {
      type: Boolean,
      default: false,
      trim: true,
    },
    shopId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const profileSchema = new Schema<TProfile>(
  {
    
    fullName: {
      type: String,
      required: false,
      trim: true,
    },
    Birthday: {
      type: Date,
      required: false,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Profile = model<TProfile>('Profiles', profileSchema);
export const User = model<TUser & TProfile>('Users', userSchema);
