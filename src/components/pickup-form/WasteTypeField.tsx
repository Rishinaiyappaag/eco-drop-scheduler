
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { WasteTypeOption } from "@/hooks/usePickupFormSubmit";
import { PickupFormSchema } from "@/schemas/pickupFormSchema";

interface WasteTypeFieldProps {
  control: Control<PickupFormSchema>;
  wasteTypes: WasteTypeOption[];
}

export const WasteTypeField = ({ control, wasteTypes }: WasteTypeFieldProps) => {
  return (
    <FormField
      control={control}
      name="wasteType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>E-waste Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select the type of e-waste" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {wasteTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label} (+{type.points} points)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
