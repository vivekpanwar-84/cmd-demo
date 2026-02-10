"use client";

import Link from "next/link";
import {
  Menu,
  ChevronDown,
  Users,
  Settings,
  LogOut,
  Bell,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HeaderProps {
  onOpenMobile: () => void;
  onLogout: () => void;
}

// Dummy Notifications
const notifications = [
  {
    id: 1,
    title: "Payment Received",
    description: "Received payment of ₹5,000 from John Doe",
    time: "2 mins ago",
    read: false,
  },
  {
    id: 2,
    title: "New Customer",
    description: "Acme Corp registered as a new customer",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    title: "Invoice Overdue",
    description: "Invoice #1024 for TechSoft is now overdue",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 4,
    title: "System Update",
    description: "System maintenance scheduled for tonight",
    time: "5 hours ago",
    read: true,
  },
];

export default function Header({ onOpenMobile, onLogout }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b flex items-center px-4 sticky top-0 z-30">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onOpenMobile}
      >
        <Menu size={20} />
      </Button>

      <div className="ml-auto flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-900">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50/50">
              <h4 className="font-semibold text-sm">Notifications</h4>
              <span className="text-xs text-muted-foreground">2 unread</span>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer ${!notification.read ? "bg-blue-50/30" : ""
                      }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className={`text-sm ${!notification.read ? "font-semibold" : "font-medium"} text-gray-900`}>
                        {notification.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">{notification.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notification.description}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-2 border-t text-center">
              <Button variant="ghost" size="sm" className="w-full text-xs text-primary h-8">
                Mark all as read
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar>
                <AvatarFallback className="bg-primary text-white">
                  JD
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
