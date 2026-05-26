import { Shop } from '../Shop/shop.model';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'BDT',
    duration: 'lifetime',
    features: ['Up to 50 products', '1 staff member', 'Basic invoicing', 'Customer management'],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 499,
    currency: 'BDT',
    duration: 'monthly',
    features: ['Up to 500 products', '5 staff members', 'Custom invoice style', 'Supplier management', 'Reports'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 999,
    currency: 'BDT',
    duration: 'monthly',
    features: ['Unlimited products', 'Unlimited staff', 'All invoice styles', 'Advanced analytics', 'Priority support'],
  },
];

const getPlans = () => PLANS;

const subscribe = async (shopId: string, planId: string) => {
  const plan = PLANS.find(p => p.id === planId);
  if (!plan) return null;
  const expiresAt = planId === 'free' ? null : new Date(Date.now() + 30 * 86400000);
  return Shop.findOneAndUpdate(
    { _id: shopId },
    { subscriptionPlan: planId, planExpiresAt: expiresAt },
    { new: true },
  );
};

const getMySubscription = async (shopId: string) => {
  const shop = await Shop.findById(shopId).select('subscriptionPlan planExpiresAt name');
  if (!shop) return null;
  const plan = PLANS.find(p => p.id === (shop as any).subscriptionPlan);
  return { shop, plan };
};

export const SubscriptionServices = { getPlans, subscribe, getMySubscription };
