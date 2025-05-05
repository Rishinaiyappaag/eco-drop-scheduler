
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Control } from "react-hook-form";
import { PickupFormSchema } from "@/schemas/pickupFormSchema";

interface TermsCheckboxProps {
  control: Control<PickupFormSchema>;
}

export const TermsCheckbox = ({ control }: TermsCheckboxProps) => {
  return (
    <FormField
      control={control}
      name="termsAccepted"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox 
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              I agree to the terms and conditions for e-waste collection
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};
