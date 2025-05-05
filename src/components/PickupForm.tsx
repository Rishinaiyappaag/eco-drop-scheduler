
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/lib/SupabaseProvider";
import { usePickupForm } from "@/hooks/usePickupForm";
import { usePickupFormSubmit, wasteTypes } from "@/hooks/usePickupFormSubmit";
import { PersonalInfoFields } from "@/components/pickup-form/PersonalInfoFields";
import { WasteTypeField } from "@/components/pickup-form/WasteTypeField";
import { DatePickerField } from "@/components/pickup-form/DatePickerField";
import { DescriptionField } from "@/components/pickup-form/DescriptionField";
import { TermsCheckbox } from "@/components/pickup-form/TermsCheckbox";
import { SubmitButton } from "@/components/pickup-form/SubmitButton";

const PickupForm = () => {
  const { user } = useSupabase();
  const form = usePickupForm();
  const { handleSubmit, isSubmitting } = usePickupFormSubmit();
  
  const onSubmit = async (values: any) => {
    const result = await handleSubmit(values);
    if (result.success) {
      form.reset();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Schedule Your Pickup</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PersonalInfoFields control={form.control} />
          
          <WasteTypeField control={form.control} wasteTypes={wasteTypes} />
          
          <DatePickerField control={form.control} />
          
          <DescriptionField control={form.control} />
          
          <TermsCheckbox control={form.control} />
          
          <SubmitButton isSubmitting={isSubmitting} />
        </form>
      </Form>
    </div>
  );
};

export default PickupForm;
