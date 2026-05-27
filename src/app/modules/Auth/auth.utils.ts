export const USER_ROLE = {
  customer: 'customer',
  super_admin: 'super_admin',
  shop_owner: 'shop_owner',
  manager: 'manager',
  salesman: 'salesman',
  accountant: 'accountant',
  inventory_manager: 'inventory_manager',
  staff: 'staff',
} as const;

export const UserStatus = { inProgress: 'in-progress', blocked: 'blocked' } as const;
export type TUserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export type TUserRole = keyof typeof USER_ROLE;