import { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSupabase } from "@/lib/SupabaseProvider";

/* -----------------------------------------
   TYPES
------------------------------------------ */

export type PickupFormValues = {
  name: string;
  email: string;
  phone: string;
  address: string;
  wasteType: string;
  pickupDate: Date;
  description?: string;
  termsAccepted: boolean;
};

export type WasteTypeOption = {
  value: string;
  label: string;
  points: number;
};

/* -----------------------------------------
   WASTE TYPES (KEPT INSIDE THIS FILE)
------------------------------------------ */

export const wasteTypes: WasteTypeOption[] = [
  { value: "computers", label: "Computers & Laptops", points: 50 },
  { value: "phones", label: "Mobile Phones & Tablets", points: 25 },
  { value: "tvs", label: "TVs & Monitors", points: 40 },
  { value: "printers", label: "Printers & Scanners", points: 30 },
  { value: "batteries", label: "Batteries", points: 10 },
  { value: "cables", label: "Cables & Chargers", points: 5 },
  { value: "appliances", label: "Small Appliances", points: 20 },
  { value: "other", label: "Other Electronics", points: 15 },
];

/* -----------------------------------------
   HOOK
------------------------------------------ */

export const usePickupFormSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, refreshProfile } = useSupabase();
  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";


  /* -----------------------------------------
     GEOCODE FUNCTION
  ------------------------------------------ */

  const getLatLongFromAddress = async (address: string) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/geocode?address=${encodeURIComponent(address)}`
      );

      if (!response.ok) {
        console.error("Geocode API failed:", response.status);
        return null;
      }

      const data = await response.json();

      if (!data || data.latitude == null || data.longitude == null) {
        return null;
      }

      return {
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
      };
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  /* -----------------------------------------
     SUBMIT HANDLER
  ------------------------------------------ */

  const handleSubmit = async (data: PickupFormValues) => {
    setIsSubmitting(true);

    try {
      const formattedDate = format(data.pickupDate, "yyyy-MM-dd");

      const selectedWasteType = wasteTypes.find(
        (type) => type.value === data.wasteType
      );

      const pointsToAdd = selectedWasteType?.points ?? 15;

      // 🔥 STRICT GEOCODE BLOCK
      // 🔥 CALL GEOCODE
const coordinates = await getLatLongFromAddress(data.address);

console.log("Coordinates:", coordinates);

// ⛔ HARD BLOCK if geocode fails
if (!coordinates || coordinates.latitude == null || coordinates.longitude == null) {
  toast({
    title: "Invalid address",
    description:
      "Could not locate this address. Please enter full street name and area.",
    variant: "destructive",
  });
  setIsSubmitting(false);
  return { success: false };
}

      // 🔥 INSERT ONLY IF VALID COORDINATES
      const { error } = await supabase.from("e_waste_requests").insert([
        {
          user_id: user?.id ?? null,
          pickup_time: formattedDate,
          waste_type: data.wasteType,
          description: data.description ?? "",
          address: data.address,
          phone: data.phone ?? "",
          status: "pending",
          points_awarded: 0,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        },
      ] as any);

      if (error) throw error;

      toast({
        title: "Pickup Scheduled!",
        description: `Scheduled for ${format(
          data.pickupDate,
          "PPP"
        )}. You'll earn ${pointsToAdd} points when approved.`,
      });

      return { success: true };
    } catch (error: any) {
      console.error("Error scheduling pickup:", error);

      toast({
        title: "Error scheduling pickup",
        description: error.message ?? "Something went wrong.",
        variant: "destructive",
      });

      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};
