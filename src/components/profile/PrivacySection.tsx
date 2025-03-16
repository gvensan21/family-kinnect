
import React from "react";
import { useFormContext } from "react-hook-form";
import { ProfileFormValues } from "@/schemas/profileSchema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

export const PrivacySection = () => {
  const form = useFormContext<ProfileFormValues>();

  return (
    <div>
      <h3 className="text-lg font-medium">Privacy Settings</h3>
      <div className="space-y-4 mt-4">
        <FormField
          control={form.control}
          name="hideEmail"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Hide Email Address</FormLabel>
                <FormDescription>
                  Your email will be hidden from other users.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hidePhone"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Hide Phone Number</FormLabel>
                <FormDescription>
                  Your phone number will be hidden from other users.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hideDob"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Hide Date of Birth</FormLabel>
                <FormDescription>
                  Your date of birth will be hidden from other users.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
