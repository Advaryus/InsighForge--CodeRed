"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/components/icons";

const formSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters long.",
    }),
    confirmPassword: z.string(),
    rememberMe: z.boolean().default(false),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log(values);
    setTimeout(() => setIsLoading(false), 3000);
  }

  return (
    <Tabs defaultValue="signin" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        <TabsTrigger
          value="signin"
          className="text-lg font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-orange-500 dark:data-[state=active]:bg-gray-700 text-orange-500"
        >
          Sign In
        </TabsTrigger>
        <TabsTrigger
          value="signup"
          className="text-lg font-semibold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-orange-500 dark:data-[state=active]:bg-gray-700"
        >
          Sign Up
        </TabsTrigger>
      </TabsList>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <TabsContent value="signin">
            <div className="space-y-4 text-center mb-8">
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-400 to-pink-500 dark:from-orange-500 dark:to-pink-600 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Sign in to continue your secure journey
              </p>
            </div>
          </TabsContent>
          <TabsContent value="signup">
            <div className="space-y-4 text-center mb-8">
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-orange-400 to-pink-500 dark:from-orange-500 dark:to-pink-600 bg-clip-text text-transparent">
                Create Account
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Join our secure platform today
              </p>
            </div>
          </TabsContent>
        </motion.div>
      </AnimatePresence>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </FormLabel>
                <FormControl>
                  <motion.div
                    whileFocus={{
                      scale: 1.02,
                      boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.3)",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      placeholder="Enter your email"
                      className="dark:bg-gray-900 rounded-xl border-gray-300 focus:border-rose-800 focus:ring-rose-800"
                      {...field}
                    />
                  </motion.div>
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </FormLabel>
                <FormControl>
                  <motion.div
                    whileFocus={{
                      scale: 1.02,
                      boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.3)",
                    }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                  >
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="dark:bg-gray-900 rounded-xl border-gray-300 focus:border-rose-800 focus:ring-rose-800 pr-12"
                      {...field}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                    >
                      {showPassword ? (
                        <Icons.eyeOff className="h-5 w-5" />
                      ) : (
                        <Icons.eye className="h-5 w-5" />
                      )}
                    </motion.button>
                  </motion.div>
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />

          <AnimatePresence>
            {activeTab === "signup" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <motion.div
                          whileFocus={{
                            scale: 1.02,
                            boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.3)",
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <Input
                            type="password"
                            placeholder="Confirm your password"
                            className="rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            {...field}
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                    </motion.div>
                  </FormControl>
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Remember me
                  </FormLabel>
                </FormItem>
              )}
            />
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm font-medium text-orange-600 hover:text-pink-700 dark:text-orange-400 dark:hover:text-rose-500"
            >
              Forgot password?
            </motion.button>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-rose-500 dark:from-orange-700 
              dark:to-rose-600 hover:from-orange-600 hover:to-rose-600 dark:hover:from-rose-700 dark:hover:to-orange-800 text-white font-semibold py-2 px-4 rounded-xl transition duration-300 ease-in-out"
              disabled={isLoading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {activeTab === "signin" ? "Sign In" : "Sign Up"}
            </Button>
          </motion.div>
        </form>
      </Form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm uppercase">
          <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
            Or continue with
          </span>
        </div>
      </div>

      
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            className="w-full space-x-2 py-2 px-4 rounded-xl border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            onClick={() => signIn("google")}
            disabled={isLoading}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="h-5 w-5 mr-2" />
            )}
            Sign in With Google
          </Button>
        </motion.div>

        {/*<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <Icons.gitHub className="h-5 w-5 mr-2" />
            GitHub
          </Button>
        </motion.div>*/}
      

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        {activeTab === "signin"
          ? "Don't have an account? "
          : "Already have an account? "}
        <Button
          variant="link"
          className="font-medium text-orange-600 dark:text-orange-400 hover:text-indigo-500 dark:hover:text-indigo-300 p-0"
          onClick={() =>
            setActiveTab(activeTab === "signin" ? "signup" : "signin")
          }
        >
          {activeTab === "signin" ? "Sign up" : "Sign in"}
        </Button>
      </motion.p>
    </Tabs>
  );
}
