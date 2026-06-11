"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/common/Card";
import { Users, Ship, Factory, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock Data for Chart
const chartData = [
  { name: "Jan", leads: 4000, revenue: 2400 },
  { name: "Feb", leads: 3000, revenue: 1398 },
  { name: "Mar", leads: 2000, revenue: 9800 },
  { name: "Apr", leads: 2780, revenue: 3908 },
  { name: "May", leads: 1890, revenue: 4800 },
  { name: "Jun", leads: 2390, revenue: 3800 },
  { name: "Jul", leads: 3490, revenue: 4300 },
];

// Mock Data for Recent Activity
const recentActivity = [
  { id: "1", type: "Lead", title: "New Lead: Global Rice Traders", date: "2 hours ago", status: "Active" },
  { id: "2", type: "Freight", title: "Updated Rate: Mundra to Jebel Ali", date: "5 hours ago", status: "Completed" },
  { id: "3", type: "ExMill", title: "Added: 1121 Basmati Sella", date: "1 day ago", status: "Active" },
  { id: "4", type: "Quote", title: "Quotation sent to EuroFoods Inc", date: "1 day ago", status: "Pending" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DashboardPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Dashboard Overview"
        description="Welcome back! Here is what's happening with your export business today."
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mt-6 space-y-6"
      >
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={itemVariants}>
            <Card className="p-6 enterprise-card group cursor-pointer border-l-4 border-l-[var(--color-brand-primary)]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Leads</p>
                  <h3 className="text-3xl font-extrabold text-slate-900 group-hover:text-[var(--color-brand-primary)] transition-colors">1,284</h3>
                </div>
                <div className="p-3 bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)] rounded-xl">
                  <Users size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm font-medium text-emerald-600">
                <ArrowUpRight size={16} className="mr-1" />
                <span>12% from last month</span>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6 enterprise-card group cursor-pointer border-l-4 border-l-cyan-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Freight</p>
                  <h3 className="text-3xl font-extrabold text-slate-900 group-hover:text-cyan-500 transition-colors">432</h3>
                </div>
                <div className="p-3 bg-cyan-500/10 text-cyan-600 rounded-xl">
                  <Ship size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm font-medium text-emerald-600">
                <ArrowUpRight size={16} className="mr-1" />
                <span>4% from last week</span>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6 enterprise-card group cursor-pointer border-l-4 border-l-amber-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">ExMill Entries</p>
                  <h3 className="text-3xl font-extrabold text-slate-900 group-hover:text-amber-500 transition-colors">89</h3>
                </div>
                <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
                  <Factory size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm font-medium text-rose-600">
                <ArrowDownRight size={16} className="mr-1" />
                <span>2% from last week</span>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6 enterprise-card group cursor-pointer border-l-4 border-l-indigo-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Monthly Revenue</p>
                  <h3 className="text-3xl font-extrabold text-slate-900 group-hover:text-indigo-500 transition-colors">$45.2k</h3>
                </div>
                <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-xl">
                  <TrendingUp size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm font-medium text-emerald-600">
                <ArrowUpRight size={16} className="mr-1" />
                <span>18% from last month</span>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Area */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="p-6 enterprise-card h-full flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Performance Overview</h3>
                <p className="text-sm font-medium text-slate-500">Lead generation vs. estimated revenue trends.</p>
              </div>
              <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-brand-primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-brand-primary)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E8EC" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#7F8C8D', fontWeight: 600 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#7F8C8D', fontWeight: 600 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontWeight: 600 }}
                      itemStyle={{ fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="leads" stroke="var(--color-brand-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                    <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="p-0 enterprise-card h-full overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Recent Activity</h3>
                <p className="text-sm font-medium text-slate-500">Latest updates across your CRM.</p>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {recentActivity.map((activity, index) => (
                  <div key={activity.id} className="p-4 hover:bg-[var(--color-brand-table-hover)] rounded-xl transition-colors cursor-pointer group flex gap-4 items-start">
                    <div className="mt-1">
                      <div className={`h-2 w-2 rounded-full ${activity.status === 'Active' ? 'bg-emerald-500' : activity.status === 'Pending' ? 'bg-amber-500' : 'bg-blue-500'} ring-4 ring-white shadow-sm`}></div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-[var(--color-brand-primary)] transition-colors">{activity.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{activity.type}</span>
                        <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                        <span className="text-xs font-medium text-slate-500">{activity.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <button className="w-full text-sm font-bold text-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary-hover)] transition-colors">
                  View All Activity →
                </button>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
