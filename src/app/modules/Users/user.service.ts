/* eslint-disable @typescript-eslint/no-explicit-any */

import { notFound } from '../../utils/errorfunc';
import { Schema } from 'mongoose'; 
import { generateUniqueCode } from '../../utils/generateUniqueCode';
import { IMyRequest } from '../../utils/decoded';
import QueryBuilder from '../../builder/QueryBuilder';
import { hashedPassword } from '../../utils/hashedPassword';
import { USER_ROLE, UserStatus } from '../Auth/auth.utils';
import { Profile, User } from '../Auth/auth.model';
import { TProfile, TUser } from '../Auth/auth.interface';

const getUsers = async (req: IMyRequest) => {
  const queryBuilder = new QueryBuilder(
    User.find({ role: USER_ROLE.shop_owner }).populate('profileId'),
    req.query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const transformedUsers = await queryBuilder.modelQuery;
  const meta = await queryBuilder.countTotal();
  const exportData = transformedUsers.map((user: any) => {
    const { profileId, ...restUserData } = user.toObject();
    return {
      ...profileId,
      ...restUserData,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  });
  return { transformedUsers, meta, exportData };
};

// Create a new user
const createUser = async (payload: TUser & TProfile) => {
  console.log(payload)
  const isExitsUser = await User.findOne({ userName: payload?.userName });
  if (isExitsUser) {
    throw notFound('User already exists.');
  }
 

  const password = await hashedPassword(payload?.password);
  const code = generateUniqueCode(6);
  const newProfile: TProfile = {
    fullName: payload?.fullName,
    Birthday: payload?.Birthday,
    phone: payload?.phone,
    email: payload?.email,
    image: payload?.image || '',
  };

  // Profile creation
  const userProfile = await Profile.create(newProfile);

  const expired = new Date();
  expired.setMinutes(expired.getMinutes() + 5); // Set expiration to 5 minutes from now

  const newUserInfo: TUser = {
    profileId: userProfile._id as Schema.Types.ObjectId,
    email: payload.email as string,
    role: USER_ROLE.shop_owner,
    userName: payload?.userName,
    password,
    rememberPassword: false,
    status: UserStatus.inProgress,
    phoneVerification: { code, verification: false, expired },
    emailVerification: { code, verification: false, expired },
  };

  await User.create(newUserInfo);
};

export const UserServices = {
  getUsers,
  createUser,
};
