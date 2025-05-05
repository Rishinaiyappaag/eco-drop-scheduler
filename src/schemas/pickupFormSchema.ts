
import * as z from "zod";

export const pickupFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  wasteType: z.string({
    required_error: "Please select the type of e-waste.",
  }),
  pickupDate: z.date({
    required_error: "Please select a pickup date.",
  }),
  description: z.string().optional(),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions." }),
  }),
});

export type PickupFormSchema = z.infer<typeof pickupFormSchema>;
