
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

// Mock login function when Clerk is not available
const mockLogin = async (values: z.infer<typeof formSchema>, navigate: ReturnType<typeof useNavigate>) => {
  // Simulate login process
  console.log("Mock login with values:", values);
  
  // Show success toast
  toast.success("Login successful!", {
    description: "This is a mock login since authentication is not connected."
  });
  
  // Navigate to profile page after short delay
  setTimeout(() => {
    navigate("/profile");
  }, 1500);
};

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [clerkError, setClerkError] = React.useState(false);
  
  // Try to get Clerk's signin hook, but catch errors
  let signIn: any = null;
  let setActive: any = null;
  let isLoaded = false;
  
  try {
    // Dynamically import to avoid errors during component rendering
    const { useSignIn } = require("@clerk/clerk-react");
    const signInHook = useSignIn();
    signIn = signInHook.signIn;
    setActive = signInHook.setActive;
    isLoaded = signInHook.isLoaded;
  } catch (error) {
    console.error("Clerk SignIn hook error:", error);
    setClerkError(true);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      
      // If Clerk is not available, use mock login
      if (clerkError || !isLoaded || !signIn) {
        await mockLogin(values, navigate);
        return;
      }
      
      const result = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        navigate("/profile");
      } else {
        toast({
          title: "Login Failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error during login:", error);
      toast({
        title: "Login Error",
        description: error.message || "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>
            {clerkError ? 
              "Demo mode: Login is simulated since authentication service is unavailable." : 
              "Enter your email and password to access your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-4">
            <Separator className="my-4" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary underline underline-offset-4 hover:text-primary/90">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
