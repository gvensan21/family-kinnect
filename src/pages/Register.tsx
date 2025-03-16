
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
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Mock registration function when Clerk is not available
const mockRegister = async (values: z.infer<typeof formSchema>, navigate: ReturnType<typeof useNavigate>) => {
  // Simulate registration process
  console.log("Mock registration with values:", values);
  
  // Show success toast
  toast.success("Registration successful!", {
    description: "This is a mock registration since authentication is not connected."
  });
  
  // Navigate to login page after short delay
  setTimeout(() => {
    navigate("/login");
  }, 1500);
};

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [clerkError, setClerkError] = React.useState(false);
  
  // Try to get Clerk's signup hook, but catch errors
  let signUp: any = null;
  let setActive: any = null;
  let isLoaded = false;
  
  try {
    // Dynamically import to avoid errors during component rendering
    const { useSignUp } = require("@clerk/clerk-react");
    const signUpHook = useSignUp();
    signUp = signUpHook.signUp;
    setActive = signUpHook.setActive;
    isLoaded = signUpHook.isLoaded;
  } catch (error) {
    console.error("Clerk SignUp hook error:", error);
    setClerkError(true);
  }
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      
      // If Clerk is not available, use mock registration
      if (clerkError || !isLoaded || !signUp) {
        await mockRegister(values, navigate);
        return;
      }
      
      // Start the sign up process with Clerk
      await signUp.create({
        firstName: values.name.split(' ')[0],
        lastName: values.name.split(' ').slice(1).join(' ') || '',
        emailAddress: values.email,
        password: values.password,
      });

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      toast({
        title: "Verification Email Sent",
        description: "Please check your email for a verification code.",
      });
      
      // Continue with verification
      const code = prompt("Please enter the verification code sent to your email:");
      
      if (!code) {
        throw new Error("Verification code is required");
      }
      
      // Verify the email
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        toast({
          title: "Registration Successful",
          description: `Welcome, ${values.name}!`,
        });
        navigate("/profile");
      } else {
        throw new Error("Something went wrong during registration.");
      }
    } catch (error: any) {
      console.error("Error during registration:", error);
      toast({
        title: "Registration Error",
        description: error.message || "An error occurred during registration.",
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
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            {clerkError ? 
              "Demo mode: Registration is simulated since authentication service is unavailable." : 
              "Enter your information to create your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-4">
            <Separator className="my-4" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary underline underline-offset-4 hover:text-primary/90">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
