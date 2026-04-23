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

  // Bangalore city center used as fallback when geocoding cannot resolve the address
  const BANGALORE_DEFAULT = { latitude: 12.9716, longitude: 77.5946 };

  /* -----------------------------------------
     GEOCODE FUNCTION (Nominatim, no backend needed)
  ------------------------------------------ */

  const getLatLongFromAddress = async (address: string): Promise<{ latitude: number; longitude: number }> => {
    try {
      const lower = address.toLowerCase();
      const hasCity = lower.includes("bangalore") || lower.includes("bengaluru") || lower.includes("karnataka");
      const query = hasCity ? address : `${address}, Bangalore, Karnataka, India`;

      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
      const response = await fetch(url, {
        headers: { "Accept-Language": "en" },
      });

      if (!response.ok) throw new Error("Nominatim request failed");

      const data = await response.json();
      if (data && data.length > 0) {
        return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
    // Fall back to Bangalore center so the DB constraint is never violated
    return BANGALORE_DEFAULT;
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

      const { latitude, longitude } = await getLatLongFromAddress(data.address);

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
          latitude,
          longitude,
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
