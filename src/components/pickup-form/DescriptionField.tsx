
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { PickupFormSchema } from "@/schemas/pickupFormSchema";

interface DescriptionFieldProps {
  control: Control<PickupFormSchema>;
}

export const DescriptionField = ({ control }: DescriptionFieldProps) => {
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Additional Details</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Describe your e-waste items or provide any additional information..." 
              className="min-h-[80px]"
              {...field}
            />
          </FormControl>
          <FormDescription>
            Please include any specific details about the items, quantity, or special handling instructions.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
