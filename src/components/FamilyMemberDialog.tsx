
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";

interface FamilyMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  mode: 'add' | 'edit';
  initialData?: any;
}

const FamilyMemberDialog = ({
  isOpen,
  onClose,
  onSave,
  mode,
  initialData = {}
}: FamilyMemberDialogProps) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      "first name": "",
      gender: "M",
      birthday: ""
    }
  });

  useEffect(() => {
    if (initialData) {
      // Set form values from initialData
      setValue("first name", initialData["first name"] || "");
      setValue("gender", initialData.gender || "M");
      setValue("birthday", initialData.birthday || "");
    }
  }, [initialData, setValue, isOpen]);

  const onSubmit = (data: any) => {
    onSave({
      "first name": data["first name"],
      gender: data.gender,
      birthday: data.birthday ? parseInt(data.birthday) : undefined
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add Family Member' : 'Edit Family Member'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              {...register("first name", { required: "Name is required" })} 
              placeholder="Enter name" 
            />
            {errors["first name"] && (
              <p className="text-sm text-red-500">{errors["first name"].message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <RadioGroup 
              defaultValue={initialData.gender || "M"} 
              onValueChange={(value) => setValue("gender", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="M" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="F" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthday">Birth Year</Label>
            <Input 
              id="birthday" 
              type="number" 
              {...register("birthday")} 
              placeholder="e.g., 1980" 
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'add' ? 'Add Member' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FamilyMemberDialog;
