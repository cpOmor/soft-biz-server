import { Router } from 'express';
import { AuthRoutes }         from '../modules/Auth/auth.route';
import { userRoutes }         from '../modules/Users/user.route';
import { ShopRoutes }         from '../modules/Shop/shop.route';
import { ProductRoutes }      from '../modules/Product/product.route';
import { CustomerRoutes }     from '../modules/Customer/customer.route';
import { SupplierRoutes }     from '../modules/Supplier/supplier.route';
import { InvoiceRoutes }      from '../modules/Invoice/invoice.route';
import { TaskRoutes }         from '../modules/Task/task.route';
import { StaffRoutes }        from '../modules/Staff/staff.route';
import { DashboardRoutes }    from '../modules/Dashboard/dashboard.route';
import { SubscriptionRoutes } from '../modules/Subscription/subscription.route';
import { ThemeRoutes }        from '../modules/Theme/theme.route';

const router = Router();

const moduleRoutes = [
  { path: '/auth',          route: AuthRoutes },
  { path: '/user',          route: userRoutes },
  { path: '/shops',         route: ShopRoutes },
  { path: '/products',      route: ProductRoutes },
  { path: '/customers',     route: CustomerRoutes },
  { path: '/suppliers',     route: SupplierRoutes },
  { path: '/invoices',      route: InvoiceRoutes },
  { path: '/tasks',         route: TaskRoutes },
  { path: '/staff',         route: StaffRoutes },
  { path: '/dashboard',     route: DashboardRoutes },
  { path: '/subscriptions', route: SubscriptionRoutes },
  { path: '/themes',        route: ThemeRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
