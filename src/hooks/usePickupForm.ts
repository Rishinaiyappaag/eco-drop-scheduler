
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
      email: user?.email || "",
      phone: "",
      address: "",
      description: "",
    },
  });

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (user?.email && !form.getValues().email) {
      form.setValue("email", user.email);
    }
    
    // Pre-fill name from user metadata if available
    if (user?.user_metadata) {
      const firstName = user.user_metadata.first_name || "";
      const lastName = user.user_metadata.last_name || "";
      if (firstName || lastName) {
        form.setValue("name", `${firstName} ${lastName}`.trim());
      }
    }
  }, [user, form]);

  return form;
};
