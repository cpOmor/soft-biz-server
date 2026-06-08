/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config, {
  jwt_access_expires_in,
  jwt_refresh_expires_in,
} from '../../config';
import AppError from '../../errors/AppError';
import { TProfile, TUser, TVerification } from './auth.interface';
import { forbidden, notFound, serverError } from '../../utils/errorfunc';
import { createToken, verifyToken } from '../../utils/utils';
import { generateUniqueCode } from '../../utils/generateUniqueCode';
import { TEmailInfo } from '../../utils/utils.interface';
import sendEmail from '../../utils/sendEmail';
import { USER_ROLE, UserStatus } from './auth.utils';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { Profile, User } from './auth.model';

const loginUser = async (payload: { email: string; password: string }) => {
  const user = await User.findOne({ email: payload.email }).select('+password');
  if (!user) {
    throw notFound('User not found!');
  }

  // checking if the user is already deleted
  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user?.password,
  );

  if (!isPasswordMatched) {
    throw forbidden('Please provide the correct password.');
  }

  const userStatus = user?.status;
  if (userStatus === UserStatus.blocked) {
    throw forbidden('The account has been blocked.');
  }

  if (user?.status !== UserStatus.inProgress) {
    throw forbidden('Please provide the correct password.');
  }

  const isProfile = await Profile.findOne({ email: user?.email });

  if (isProfile === null) {
    throw forbidden('Something was wrong.');
  }

  await user.save();

  const jwtPayload = {
    email: user?.email,
    fullName: isProfile?.fullName,
    phone: isProfile?.phone,
    id: String(user?._id),
    role: user?.role,
    shopId: (user as any).shopId || '',
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    jwt_refresh_expires_in as string,
  );

  const { Shop } = await import('../Shop/shop.model');
  const shop = (user as any).shopId
    ? await Shop.findById((user as any).shopId).lean()
    : null;

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      name: isProfile?.fullName || '',
      email: user.email,
      phone: isProfile?.phone || '',
      role: user.role,
      status: user.status,
      shopId: (user as any).shopId || '',
    },
    shop: shop
      ? {
          _id: String((shop as any)._id),
          name: (shop as any).name,
          slug: (shop as any).slug,
          currency: (shop as any).currency,
        }
      : null,
  };
};

const logoutUser = async (req: any, data: any) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw notFound('Something was wrong');
  }

  await User.updateOne(
    { email: data?.email },
    { $pull: { devices: { deviceId: data?.deviceId } } },
  );

  req.headers.authorization = '';
  req.cookies.refreshToken = '';
};

const refreshToken = async (req: any, res: any) => {
  const { refreshToken } = req.cookies;

  const decoded = verifyToken(
    refreshToken,
    config.jwt_refresh_secret as string,
  );

  const { email, deviceId } = decoded;
  const user = (await User.findOne({ email })) as unknown as TUser;

  if (!user) {
    throw notFound('User not found!');
  }

  const userStatus = user?.status;
  if (userStatus === UserStatus.blocked) {
    throw forbidden('Please provide the correct password.');
  }
  if (user.status !== UserStatus.inProgress) {
    throw forbidden('Please provide the correct password.');
  }

  const isDevice = await User.findOne({
    email: decoded?.email,
    'devices.deviceId': deviceId,
  });

  if (isDevice === null || !isDevice) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Session is expire new error!',
      [
        {
          path: 'unauthorized',
          message: 'Session is expire new error!',
        },
      ],
    );
  }

  res.clearCookie('connect.sid');

  await User.updateOne(
    { email: user?.email, 'devices.deviceId': deviceId },
    {
      $set: {
        'devices.$.lastActivity': new Date(),
      },
    },
  );

  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

const forgerPassword = async (email: string) => {
  const user: TUser | null = await User.findOne({ email });
  if (!user) {
    throw notFound('User not found!');
  }

  const verification = user?.emailVerification?.verification;

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === UserStatus.blocked) {
    throw forbidden('This use was blocked.');
  }

  const code = generateUniqueCode(6);

  const body = `This is your verification code ${code}`;

  const emailData: TEmailInfo = {
    email: email,
    body: ` <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify OTP to Change Password</title>
    <style>
      svg {
        height: 30px !important;
      }
    </style>
  </head>
  <body style="font-family: Arial, sans-serif;  color: #fff; margin: 0; padding: 0;">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
      <tr>
        <td align="center">
          <table width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #111; border-radius: 8px; box-shadow: 0 4px 8px rgba(255, 255, 0, 0.2); text-align: center;">
            <!-- Header with Logo -->
            <tr>
              <td style="background-color: #ffed00; padding: 10px; text-align: center;">
              
          <img src="https://res.cloudinary.com/dssmacjme/image/upload/v1741600767/vr4iqumzttiqefri1h3n.jpg" alt="Skillion" height="30" class="CToWUd" data-bit="iit">
        
              </td>
            </tr>
            <!-- OTP Section -->
            <tr>
              <td style="padding: 20px;">
                <h2 style="color: #fff; font-size: 24px;">🔐 Verify Your OTP</h2>
                <table align="center" style="background-color: #222; padding: 10px; border-radius: 5px;">
                  <tr>
                    <td style="font-size: 28px; font-weight: bold; color: #ffed00;">${code}</td>
                  </tr>
                </table>
                <p style="font-size: 14px; color: red; margin-top: 10px; font-weight: bold;">
                  ⚠ This OTP is valid for **only 5 minutes**. Please use it before it expires!
                </p>
                <p style="font-size: 14px; color: #bbb; margin-top: 10px;">For security reasons, never share your OTP with anyone.</p>
              </td>
            </tr>
            <!-- Footer Links -->
            <tr>
              <td style="background-color: #000; padding: 15px; text-align: center; font-size: 14px;">
                <a href="https://www.facebook.com/skilliontech.official" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">Facebook</a>
                <a href="https://www.youtube.com/@SkillionTech" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">YouTube</a>
                <a href="https://www.tiktok.com/@skilliontech" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">TikTok</a>
                <a href="https://www.linkedin.com/company/skilliontech" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">LinkedIn</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

    `,
    subject: 'Verify OTP to Change Password',
  };

  const expired = new Date();
  expired.setMinutes(expired.getMinutes() + 2);

  await User.findOneAndUpdate(
    { email },
    { emailVerification: { code, verification, expired } },
  );
  // const sentMail = await sendEmail(emailData);

  // const sentMail = true;
  // if (sentMail) {
  //   await User.findOneAndUpdate(
  //     { email },
  //     { emailVerification: { code, verification, expired } },
  //   );
  // }

  return body;
};

const verification = async (payload: TVerification) => {
  const user = await User.findOne({ email: payload.email }).select(
    'emailVerification',
  );

  if (!user) {
    throw forbidden('Something went wrong!');
  }

  if (user?.emailVerification?.verification) {
    throw forbidden('User already verified');
  }

  if (!payload?.code) {
    throw forbidden('Enter 6 digit code');
  }

  if (new Date() > (user?.emailVerification?.expired as Date)) {
    throw forbidden('Expired . Please request a new code.');
  }

  if (!(payload?.code === user?.emailVerification?.code)) {
    throw forbidden('Oops! That’s not the right code');
  }

  await User.findOneAndUpdate(
    { email: payload.email },
    { emailVerification: { verification: true, code: payload?.code } },
  );

  return;
};

const verificationForgetPassword = async (payload: {
  code: string;
  email: string;
}) => {
  const user = await User.findOne({ email: payload.email }).select(
    'emailVerification',
  );

  if (!user) {
    throw forbidden('Something went wrong!');
  }

  if (!payload?.code) {
    throw forbidden('Enter 6 digit code');
  }

  if (new Date() > (user?.emailVerification?.expired as Date)) {
    throw forbidden('Expired . Please request a new code.');
  }

  if (!(payload?.code === user?.emailVerification?.code)) {
    throw forbidden('Oops! That’s not the right code');
  }

  await User.findOneAndUpdate(
    { email: payload.email },
    { emailVerification: { verification: true, code: payload?.code } },
  );

  const jwtPayload = {
    email: payload.email,
    code: payload.code,
  };

  const validation = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '2m' as string,
  );

  return { validation };
};

const verificationCodeReSend = async (payload: TUser & TProfile) => {
  const code = generateUniqueCode(6);
  const expired = new Date();
  expired.setMinutes(expired.getMinutes() + 2);

  const newUserInfo = {
    emailVerification: { code, expired },
  };

  const emailData: TEmailInfo = {
    email: payload?.email,
    body: `
       <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify OTP to Change Password</title>
    <style>
      svg {
        height: 30px !important;
      }
    </style>
  </head>
  <body style="font-family: Arial, sans-serif;  color: #fff; margin: 0; padding: 0;">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
      <tr>
        <td align="center">
          <table width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #111; border-radius: 8px; box-shadow: 0 4px 8px rgba(255, 255, 0, 0.2); text-align: center;">
            <!-- Header with Logo -->
            <tr>
              <td style="background-color: #ffed00; padding: 10px; text-align: center;">
              
          <img src="https://res.cloudinary.com/dssmacjme/image/upload/v1741600767/vr4iqumzttiqefri1h3n.jpg" alt="Skillion" height="30" class="CToWUd" data-bit="iit">
        
              </td>
            </tr>
            <!-- OTP Section -->
            <tr>
              <td style="padding: 20px;">
                <h2 style="color: #fff; font-size: 24px;">🔐 Verify Your OTP</h2>
                <table align="center" style="background-color: #222; padding: 10px; border-radius: 5px;">
                  <tr>
                    <td style="font-size: 28px; font-weight: bold; color: #ffed00;">${code}</td>
                  </tr>
                </table>
                <p style="font-size: 14px; color: red; margin-top: 10px; font-weight: bold;">
                  ⚠ This OTP is valid for **only 5 minutes**. Please use it before it expires!
                </p>
                <p style="font-size: 14px; color: #bbb; margin-top: 10px;">For security reasons, never share your OTP with anyone.</p>
              </td>
            </tr>
            <!-- Footer Links -->
            <tr>
              <td style="background-color: #000; padding: 15px; text-align: center; font-size: 14px;">
                <a href="https://www.facebook.com/skilliontech.official" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">Facebook</a>
                <a href="https://www.youtube.com/@SkillionTech" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">YouTube</a>
                <a href="https://www.tiktok.com/@skilliontech" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">TikTok</a>
                <a href="https://www.linkedin.com/company/skilliontech" target="_blank" style="color: #ffed00; text-decoration: none; margin: 0 10px;">LinkedIn</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
    subject: 'Verify OTP to Change Password',
  };

  const mainSended = await sendEmail(emailData);

  if (mainSended) {
    const updatedUser = await User.findOneAndUpdate(
      { email: payload?.email },
      newUserInfo,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedUser) {
      throw notFound('User update filled');
    }
    return;
  }
};
const setNewPassword = async (token: string, password: string) => {
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { email } = decoded;

  // Checking if the user exists
  const user = (await User.findOne({ email }).select(
    'email status -_id',
  )) as unknown as TUser;

  if (!user) {
    throw notFound('User not found!');
  }

  const userStatus = user?.status;

  if (userStatus === UserStatus.blocked) {
    throw forbidden('The user has been blocked!');
  }

  // Ensure bcrypt_salt_rounds is a valid number
  const saltRounds = Number(config.bcrypt_salt_rounds);

  if (isNaN(saltRounds) || saltRounds <= 0) {
    throw new Error('Invalid bcrypt salt rounds configuration.');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await User.findOneAndUpdate(
    {
      email: decoded.email,
    },
    {
      password: hashedPassword,
      updateAt: new Date(),
    },
  );

  return '';
};

const changePassword = async (req: any) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw forbidden('Something went wrong');
  }
  const payload = req.body;

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  //hash new password
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // update user password
  await User.findOneAndUpdate(
    {
      email: decoded.email,
    },
    {
      password: hashedPassword,
      updateAt: new Date(),
    },
  );
};

const getMe = async (id: string) => {
  console.log(id);
  const user = await User.findById(id)
    .populate('profileId')
    .select('-verification');

  if (!user) {
    throw notFound('No user found.');
  }

  // Destructure and reassemble the user data
  const { profileId, email, ...restUserData } = user.toObject();

  return { ...profileId, email, ...restUserData };
};

// Update an existing user
const updateMe = async (req: any) => {
  const id: string = req?.user?.id;
  const payload: TUser & TProfile = req?.body;
  const file: any = req?.file;

  const isUser = (await User.findById(id).select('+password')) as TUser &
    TProfile;

  if (!isUser) {
    throw notFound('No user found');
  }

  let profile = isUser.image;
  if (file) {
    try {
      const result = await sendImageToCloudinary(file.filename, file.path);
      profile = result.url as string;
    } catch (error) {
      throw serverError('Failed to upload the image.');
    }
  }

  payload.image = profile;

  await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  const updatedUser = await Profile.findOneAndUpdate(
    { email: isUser?.email },
    payload,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!updatedUser) {
    throw forbidden('User update filled');
  }
  return updatedUser;
};

// Delete a user
const deleteMe = async (id: string) => {
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    throw notFound('No user found.');
  }
  return deletedUser;
};

const registerUser = async (payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  shopName?: string;
  currency?: string;
}) => {
  const exists = await User.findOne({ email: payload.email });
  if (exists) {
    throw new AppError(409, 'Email already registered.', [
      { path: 'email', message: 'Email already registered.' },
    ]);
  }

  const { hashedPassword: hashPw } = await import(
    '../../utils/hashedPassword'
  ).then((m) => ({ hashedPassword: m.hashedPassword }));
  const password = await hashPw(payload.password);

  const newProfile: TProfile = {
    fullName: payload.name,
    phone: payload.phone || '',
    email: payload.email,
    image: '',
  };
  const userProfile = await Profile.create(newProfile);

  // Create user first so we have a valid ownerId for the shop
  const newUser = await User.create({
    profileId: userProfile._id,
    email: payload.email,
    userName: payload.email,
    role: USER_ROLE.shop_owner,
    password,
    rememberPassword: false,
    status: UserStatus.inProgress,
  });

  const { Shop } = await import('../Shop/shop.model');
  const shopName = payload.shopName || `${payload.name}'s Shop`;
  const shopSlug =
    shopName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
  const shop = await Shop.create({
    name: shopName,
    slug: shopSlug,
    currency: payload.currency || 'BDT',
    ownerId: newUser._id,
  });

  // link shopId back to user
  await User.findByIdAndUpdate(newUser._id, { shopId: String(shop._id) });

  const jwtPayload = {
    email: newUser.email,
    fullName: payload.name,
    phone: payload.phone || '',
    id: String(newUser._id),
    role: newUser.role,
    shopId: String(shop._id),
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    user: {
      _id: newUser._id,
      name: payload.name,
      email: newUser.email,
      phone: payload.phone || '',
      role: newUser.role,
      status: newUser.status,
      shopId: String(shop._id),
    },
    shop: {
      _id: String(shop._id),
      name: shopName,
      slug: shopSlug,
      currency: payload.currency || 'BDT',
    },
  };
};

export const AuthServices = {
  loginUser,
  registerUser,
  logoutUser,
  changePassword,
  refreshToken,
  verification,
  forgerPassword,
  setNewPassword,
  verificationForgetPassword,
  verificationCodeReSend,
  getMe,
  updateMe,
  deleteMe,
};
