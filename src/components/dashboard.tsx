"use client";

import {
  Building2,
  Users,
  DollarSign,
  Loader2,
  TrendingUp,
  ArrowUpRight,
  Clock,
  ChevronRight,
  Plus,
  FileText,
  UserPlus,
  Bell
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useDashboardStats } from "@/hooks/useAdmin";

/* ================= MOCK DATA FOR VISUALS ================= */

const collectionData = [
  { name: "Mon", amount: 4000 },
  { name: "Tue", amount: 8000 },
  { name: "Wed", amount: 6000 },
  { name: "Thu", amount: 10000 },
  { name: "Fri", amount: 12000 },
  { name: "Sat", amount: 9000 },
  { name: "Sun", amount: 11000 },
];

const paymentStatusData = [
  { name: "Paid", value: 65, color: "#ff9966" },
  { name: "Pending", value: 25, color: "#ffccb3" },
  { name: "Overdue", value: 10, color: "#ffe6da" },
];

const recentActivities = [
  { id: 1, type: "payment", text: "Invoice #402 paid by Acme Corp", time: "2 hours ago", amount: "₹12,400" },
  { id: 2, type: "customer", text: "New customer 'NexGen Solutions' added", time: "5 hours ago" },
  { id: 3, type: "invoice", text: "New invoice generated for Delta Inc", time: "Yesterday", amount: "₹4,500" },
  { id: 4, type: "reminder", text: "Reminder sent to Bright Star Ltd", time: "Yesterday" },
];

/* ================= COMPONENT ================= */

export function Dashboard() {
  const { data: statsData, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Designing your workspace...</p>
        </div>
      </div>
    );
  }

  if (error || !statsData) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Card className="max-w-md border-destructive/20 bg-destructive/5">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <Building2 className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold">Data Retrieval Error</h3>
            <p className="text-sm text-muted-foreground">
              We couldn't fetch your dashboard statistics. Please check your connection and try again.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { totalOrgs, totalStaff, totalCustomers, invoiceStats } = statsData;

  const totalDueAmount = invoiceStats?.reduce(
    (acc, curr) => acc + curr.totalAmount,
    0
  ) || 0;

  const stats = [
    {
      title: "Total Organizations",
      value: totalOrgs || 0,
      icon: Building2,
      trend: "+12%",
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Total Staff",
      value: totalStaff || 0,
      icon: Users,
      trend: "+4%",
      color: "bg-orange-50 text-orange-600"
    },
    {
      title: "Total Customers",
      value: totalCustomers || 0,
      icon: Users,
      trend: "+8%",
      color: "bg-green-50 text-green-600"
    },
    {
      title: "Due Amount",
      value: `₹${totalDueAmount.toLocaleString()}`,
      icon: DollarSign,
      trend: "-2%",
      color: "bg-purple-50 text-purple-600",
      meta: {
        total: "totalAmount",
        remaining: "remainingAmount"
      }
    },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Welcome back! Here's a high-level overview of your CRM.
          </p>
        </div>
        {/* <div className="flex gap-3">
          <Button className="bg-[#ff9966] hover:bg-[#ff8855] text-white shadow-lg shadow-primary/20 h-11 px-6 rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </div> */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="group border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white/50 backdrop-blur-sm">
              {/* <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl ${stat.color} transition-transform group-hover:scale-110 duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant="secondary" className="bg-white/80 border-none text-[10px] font-bold">
                    {stat.trend}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</h3>
                </div>
              </CardContent> */}


               <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-xl ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-bold">
                    {stat.trend}
                  </Badge>
                </div>

                {/* 🔥 ONLY DUE AMOUNT CARD CUSTOM UI */}
                {stat.title === "Due Amount" ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Amount</span>
                      <span className="font-bold text-gray-900">
                        ₹0
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Remaining Amount</span>
                      <span className="font-bold text-purple-600">
                        ₹0
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Due Amount</span>
                      <span className="font-bold text-gray-900">
                        {stat.value}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      {stat.title}
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </h3>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Trend Area Chart */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-50 px-6 py-5">
            <div>
              <CardTitle className="text-xl font-bold">Collection Trend</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Weekly payment recovery analysis</p>
            </div>
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+24.5%</span>
            </div>
          </CardHeader>
          <CardContent className="pt-8 px-2">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={collectionData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff9966" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff9966" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  cursor={{ stroke: '#ff9966', strokeWidth: 2 }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#ff9966"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Status Pie Chart */}
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="px-6 py-5 border-b border-gray-50">
            <CardTitle className="text-xl font-bold">Payment Health</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Current collection status</p>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {paymentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-8 space-y-4">
              {paymentStatusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-white">
          <CardHeader className="px-6 py-5 border-b border-gray-50 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold">Recent Updates</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 font-bold text-xs uppercase tracking-widest">
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary opacity-70" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{activity.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                  {activity.amount && (
                    <span className="text-sm font-bold text-[#ff9966]">{activity.amount}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Helpers */}
        <Card className="border-none shadow-sm bg-[#ff9966]/10 border-t-2 border-t-[#ff9966]">
          <CardHeader className="px-6 py-5">
            <CardTitle className="text-xl font-bold text-[#cc6644]">Quick Actions</CardTitle>
            <p className="text-xs text-[#cc6644]/70 mt-1">Speed up your workflow</p>
          </CardHeader>
          <CardContent className="space-y-3 px-6 pb-6">
            <Button variant="outline" className="w-full justify-start bg-white border-none shadow-sm hover:translate-x-1 transition-transform h-12 rounded-xl group text-gray-700">
              <FileText className="w-4 h-4 mr-3 text-orange-500" />
              Generate Report
              <ArrowUpRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
            <Button variant="outline" className="w-full justify-start bg-white border-none shadow-sm hover:translate-x-1 transition-transform h-12 rounded-xl group text-gray-700">
              <UserPlus className="w-4 h-4 mr-3 text-blue-500" />
              Invite Team Member
              <ArrowUpRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
            <Button variant="outline" className="w-full justify-start bg-white border-none shadow-sm hover:translate-x-1 transition-transform h-12 rounded-xl group text-gray-700">
              <Bell className="w-4 h-4 mr-3 text-green-500" />
              Configure Reminders
              <ArrowUpRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
