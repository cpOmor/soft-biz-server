import { Invoice } from '../Invoice/invoice.model';
import { Task } from '../Task/task.model';
import { Customer } from '../Customer/customer.model';
import { Product } from '../Product/product.model';

const getAnalytics = async (shopId: string, query: { period?: string }) => {
  const now   = new Date();
  let startDate: Date;
  if (query.period === '7d')       startDate = new Date(now.getTime() - 7  * 86400000);
  else if (query.period === '30d') startDate = new Date(now.getTime() - 30 * 86400000);
  else { // today
    startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
  }

  const [invoices, tasks, customers, products] = await Promise.all([
    Invoice.find({ shopId, createdAt: { $gte: startDate } }),
    Task.countDocuments({ shopId, status: { $in: ['pending', 'in_progress'] } }),
    Customer.find({ shopId }),
    Product.find({ shopId }),
  ]);

  const todaySales  = invoices.reduce((s, inv) => s + (inv.total || 0), 0);
  const todayCash   = invoices.reduce((s, inv) => s + (inv.paid  || 0), 0);
  const totalDue    = customers.reduce((s, c) => s + ((c as any).totalDue || 0), 0);
  const totalProfit = invoices.reduce((s, inv) => s + ((inv.total || 0) - (inv.paid || 0) >= 0 ? 0 : 0), 0);

  // Sales chart (last 7 days)
  const chartDays = 7;
  const salesChart = Array.from({ length: chartDays }, (_, i) => {
    const d = new Date(now.getTime() - (chartDays - 1 - i) * 86400000);
    const dateStr = d.toISOString().slice(0, 10);
    const amount = invoices
      .filter(inv => inv.createdAt.toISOString().slice(0, 10) === dateStr)
      .reduce((s, inv) => s + (inv.total || 0), 0);
    return { date: dateStr, amount };
  });

  // Top products by invoice occurrence
  const productCount: Record<string, { name: string; sold: number; revenue: number }> = {};
  invoices.forEach(inv => {
    (inv.items || []).forEach((item: any) => {
      const key = item.description;
      if (!productCount[key]) productCount[key] = { name: key, sold: 0, revenue: 0 };
      productCount[key].sold    += item.qty   || 0;
      productCount[key].revenue += item.total || 0;
    });
  });
  const topProducts = Object.values(productCount)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    todaySales,
    todayCash,
    totalDue,
    totalProfit,
    pendingOrders: 0,
    pendingTasks:  tasks,
    salesChart,
    topProducts,
    expenseVsProfit: [],
  };
};

export const DashboardServices = { getAnalytics };
