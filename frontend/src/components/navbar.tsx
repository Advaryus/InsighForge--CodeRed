"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeSwitch } from "@/components/theme-switch";
import { useSession, signIn, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { name: "Home", href: "#" },
  { name: "Compare", href: "/chatbot" },
  { name: "Meta", href: "/meta" },
  { name: "Insight", href: "/insights" },
  { name: "About", href: "/about" },
];

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-4 left-0 right-0 z-50 mx-auto w-full max-w-5xl",
        "rounded-full border border-white/10 bg-white/60 px-4 py-2 backdrop-blur-md",
        "dark:bg-gray-950/60 shadow-lg"
      )}
    >
      <div className="flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-foreground">
          Insight<span className="text-cyan-500">Forge</span>
        </Link>
        <div className="flex items-center space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <ThemeSwitch />
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative w-8 h-8 rounded-full"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={session.user?.image ?? ""}
                      alt={session.user?.name ?? "User"}
                    />
                    <AvatarFallback>
                      {session.user?.name?.[0] ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user?.name ?? "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email ?? "No email"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={(event) => {
                    event.preventDefault();
                    signOut();
                  }}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => signIn()}
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
