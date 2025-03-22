
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLocalAuth } from "@/contexts/AuthContext"; 
import { useFamilyTree } from "@/hooks/useFamilyTree";
import { useMutation, useQuery } from "@tanstack/react-query";
import { profileFormSchema, type ProfileFormValues } from "@/schemas/profileSchema";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { BirthDetailsSection } from "./BirthDetailsSection";
import { CurrentLocationSection } from "./CurrentLocationSection";
import { ProfessionalDetailsSection } from "./ProfessionalDetailsSection";
import { OtherInfoSection } from "./OtherInfoSection";
import { BioSection } from "./BioSection";
import { PrivacySection } from "./PrivacySection";

export const ProfileForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser } = useLocalAuth();
  const { saveProfileAndCreateNode, getUserProfile } = useFamilyTree();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: currentUser?.name || "",
      nickname: "",
      email: currentUser?.email || "",
      phone: "",
      gender: "male",
      dateOfBirth: "",
      birthCity: "",
      birthState: "",
      birthCountry: "",
      currentCity: "",
      currentState: "",
      currentCountry: "",
      gotra: "",
      pravara: "",
      occupation: "",
      company: "",
      industry: "",
      primaryLanguage: "",
      secondaryLanguage: "",
      community: "",
      hideEmail: false,
      hidePhone: false,
      hideDob: false,
      bio: "",
    },
  });

  // Query to fetch existing profile data
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile', currentUser?.id],
    queryFn: getUserProfile,
    enabled: !!currentUser?.id
  });

  // Update form with profile data when it's loaded
  React.useEffect(() => {
    if (profileData) {
      form.reset(profileData);
    }
  }, [profileData, form]);

  // Mutation to save profile data
  const saveProfileMutation = useMutation({
    mutationFn: saveProfileAndCreateNode,
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated and added to your family tree.",
      });
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  });

  function onSubmit(values: ProfileFormValues) {
    saveProfileMutation.mutate(values);
  }

  if (isLoading) {
    return <div className="flex justify-center my-8">Loading your profile...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <PersonalInfoSection />
        <BirthDetailsSection />
        <CurrentLocationSection />
        <ProfessionalDetailsSection />
        <OtherInfoSection />
        <BioSection />
        <PrivacySection />
        <Button 
          type="submit" 
          disabled={saveProfileMutation.isPending}
        >
          {saveProfileMutation.isPending ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
};
