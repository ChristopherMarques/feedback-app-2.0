"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Settings,
  CreditCard,
  BarChart2,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/widget-config", label: "Widget Config", icon: BarChart2 },
  { href: "/manage-plan", label: "Manage Plan", icon: CreditCard },
  { href: "/account-settings", label: "Account Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex flex-col w-64 bg-white dark:bg-gray-800 h-full border-r">
      <div className="flex items-center justify-center h-16  border-b">
        <h1 className="text-2xl font-bold">Feedback App</h1>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2 py-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <span
                  className={`flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    pathname === item.href ? "bg-gray-200 dark:bg-gray-700" : ""
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4">
        <Button onClick={handleSignOut} variant="outline" className="w-full">
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </div>
    </div>
  );
}
