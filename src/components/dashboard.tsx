"use client";

import { Building2, Users, DollarSign, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { useDashboardStats } from "@/hooks/useAdmin";
import { RevenueData, SubscriptionPlan } from "@/types/dashboard";

const revenueData: RevenueData[] = [
  { month: "Jan", revenue: 45000, subscriptions: 120 },
  { month: "Feb", revenue: 52000, subscriptions: 145 },
  { month: "Mar", revenue: 48000, subscriptions: 135 },
  { month: "Apr", revenue: 61000, subscriptions: 160 },
  { month: "May", revenue: 55000, subscriptions: 155 },
  { month: "Jun", revenue: 67000, subscriptions: 180 }
];

const subscriptionData: SubscriptionPlan[] = [
  { name: "Basic", value: 45, color: "#ff9966" },
  { name: "Pro", value: 35, color: "#ffb84d" },
  { name: "Enterprise", value: 20, color: "#ffd699" }
];

export function Dashboard() {
  const { data: statsData, isLoading, error } = useDashboardStats();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error || !statsData) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load dashboard data.</p>
      </div>
    );
  }

  const { totalOrgs, totalUsers, totalCustomers, invoiceStats } = statsData;

  const totalDueAmount = invoiceStats.reduce(
    (acc, curr) => acc + curr.totalAmount,
    0
  );

  const stats = [
    {
      title: "Total Organizations",
      value: totalOrgs.toLocaleString(),
      icon: Building2
    },
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: Users
    },
    {
      title: "Total Customers",
      value: totalCustomers.toLocaleString(),
      icon: Users
    },
    {
      title: "Due Amount",
      value: `₹${totalDueAmount.toLocaleString()}`,
      icon: DollarSign
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-semibold">{stat.value}</h3>
                </div>

                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#ff9966" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subscription Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={subscriptionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subscriptionData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
