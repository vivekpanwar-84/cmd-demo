"use client";

import { UserPlus, AlertCircle, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: "active" | "inactive";
  joinedDate: string;
  organizationId: string;
}

const mockStaff: StaffMember[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@acme.com",
    phone: "+1 234 567 8900",
    role: "Admin",
    status: "active",
    joinedDate: "2024-01-15",
    organizationId: "1",
  },
  {
    id: "2",
    name: "Bob Williams",
    email: "bob@acme.com",
    phone: "+1 234 567 8901",
    role: "Manager",
    status: "active",
    joinedDate: "2024-03-20",
    organizationId: "1",
  },
  {
    id: "3",
    name: "Carol Martinez",
    email: "carol@acme.com",
    phone: "+1 234 567 8902",
    role: "Sales Rep",
    status: "active",
    joinedDate: "2024-05-10",
    organizationId: "2",
  },
  {
    id: "4",
    name: "David Lee",
    email: "david@acme.com",
    phone: "+1 234 567 8903",
    role: "Sales Rep",
    status: "active",
    joinedDate: "2024-06-18",
    organizationId: "1",
  },
  {
    id: "5",
    name: "Emma Davis",
    email: "emma@acme.com",
    phone: "+1 234 567 8904",
    role: "Support",
    status: "inactive",
    joinedDate: "2024-08-05",
    organizationId: "3",
  },
];

interface StaffProps {
  organizationId: string;
}

export function AdminStaff({ organizationId }: StaffProps) {
  const filteredStaff = mockStaff.filter(
    (staff) => staff.organizationId === organizationId,
  );

  const staffUsed = filteredStaff.filter(
    (staff) => staff.status === "active",
  ).length;

  const staffLimit = 50;
  const usagePercentage = (staffUsed / staffLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Usage Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="font-semibold">Staff Usage</h3>
              <p className="text-sm text-muted-foreground">
                {staffUsed} of {staffLimit} staff members
              </p>
            </div>

            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Staff Member
            </Button>
          </div>

          <Progress value={usagePercentage} />

          {usagePercentage > 80 && (
            <div className="flex items-center gap-2 mt-3 text-sm text-orange-600">
              <AlertCircle className="w-4 h-4" />
              <span>
                You&#39;re approaching your staff limit. Consider upgrading your
                plan.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Desktop Table */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Joined</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="border-b">
                  <td className="p-3 font-medium">{staff.name}</td>
                  <td className="p-3">{staff.email}</td>
                  <td className="p-3">{staff.phone}</td>
                  <td className="p-3">
                    <Badge variant="outline">{staff.role}</Badge>
                  </td>
                  <td className="p-3">
                    <Badge
                      className={
                        staff.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {staff.status}
                    </Badge>
                  </td>
                  <td className="p-3">{staff.joinedDate}</td>
                  <td className="p-3">
                    <Button size="sm" variant="outline">
                      <Pencil></Pencil>
                    </Button>
                  </td>
                </tr>
              ))}

              {filteredStaff.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No staff members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredStaff.map((staff) => (
          <Card key={staff.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{staff.name}</p>
                  <p className="text-sm text-muted-foreground">{staff.role}</p>
                </div>
                <Badge
                  className={
                    staff.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }
                >
                  {staff.status}
                </Badge>
              </div>

              <div className="text-sm space-y-1">
                <p>Email: {staff.email}</p>
                <p>Phone: {staff.phone}</p>
                <p>Joined: {staff.joinedDate}</p>
              </div>

              <Button size="sm" variant="outline" className="w-full">
                <Pencil></Pencil>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}