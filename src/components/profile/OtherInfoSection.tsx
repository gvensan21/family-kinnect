
import React from "react";
import { useFormContext } from "react-hook-form";
import { ProfileFormValues } from "@/schemas/profileSchema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const OtherInfoSection = () => {
  const form = useFormContext<ProfileFormValues>();

  return (
    <div>
      <h3 className="text-lg font-medium">Other Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <FormField
          control={form.control}
          name="primaryLanguage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Language</FormLabel>
              <FormControl>
                <Input placeholder="Primary language" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="secondaryLanguage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secondary Language</FormLabel>
              <FormControl>
                <Input placeholder="Secondary language" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="community"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Community</FormLabel>
              <FormControl>
                <Input placeholder="Community" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
