
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
import { Textarea } from "@/components/ui/textarea";

export const BioSection = () => {
  const form = useFormContext<ProfileFormValues>();

  return (
    <FormField
      control={form.control}
      name="bio"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Biography</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Tell us about yourself"
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
