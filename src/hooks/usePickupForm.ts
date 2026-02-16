import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useSupabase } from "@/lib/SupabaseProvider";
import { pickupFormSchema, PickupFormSchema } from "@/schemas/pickupFormSchema";

export const usePickupForm = () => {
  const { user } = useSupabase();

  const form = useForm<PickupFormSchema>({
    resolver: zodResolver(pickupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      wasteType: "",
      pickupDate: undefined,
      description: "",
      termsAccepted: true,
    },
  });

  // ✅ Safely prefill user info AFTER form initializes
  useEffect(() => {
    if (!user) return;

    if (user.email) {
      form.setValue("email", user.email);
    }

    if (user.user_metadata) {
      const firstName = user.user_metadata.first_name || "";
      const lastName = user.user_metadata.last_name || "";

      const fullName = `${firstName} ${lastName}`.trim();
      if (fullName) {
        form.setValue("name", fullName);
      }
    }
  }, [user, form]);

  return form;
};
