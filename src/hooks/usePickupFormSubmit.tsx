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

  // Bangalore city center used as last-resort fallback
  const BANGALORE_DEFAULT = { latitude: 12.9716, longitude: 77.5946 };

  /* -----------------------------------------
     GEOCODE FUNCTION (Nominatim, progressive simplification)
  ------------------------------------------ */

  const nominatimQuery = async (query: string): Promise<{ latitude: number; longitude: number } | null> => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=in`;
      const res = await fetch(url, { headers: { "Accept-Language": "en" } });
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.length > 0) {
        return { latitude: parseFloat(data[0].lat), longitude: parseFloat(data[0].lon) };
      }
    } catch { /* ignore */ }
    return null;
  };

  const inBangalore = (r: { latitude: number; longitude: number }) =>
    r.latitude >= 12.7 && r.latitude <= 13.2 && r.longitude >= 77.3 && r.longitude <= 77.8;

  const getLatLongFromAddress = async (address: string): Promise<{ latitude: number; longitude: number }> => {
    const parts = address.split(",").map(p => p.trim()).filter(Boolean);
    const skip = new Set(["india", "karnataka", "bangalore", "bengaluru", ""]);

    // Sort locality parts longest-first — longer names are more specific landmarks
    const localityParts = parts
      .filter(p =>
        !skip.has(p.toLowerCase()) &&
        !/\d{6}/.test(p) &&
        !/^[\d/\-]+$/.test(p)
      )
      .sort((a, b) => b.length - a.length);

    // 1. Try each locality individually (longest = most specific first)
    for (const part of localityParts) {
      const result = await nominatimQuery(`${part}, Bangalore, Karnataka, India`);
      if (result &&
          !(result.latitude === BANGALORE_DEFAULT.latitude && result.longitude === BANGALORE_DEFAULT.longitude) &&
          inBangalore(result)) {
        return result;
      }
    }

    // 2. Try pincode
    const pincodeMatch = address.match(/\b(\d{6})\b/);
    if (pincodeMatch) {
      const result = await nominatimQuery(`${pincodeMatch[1]}, Karnataka, India`);
      if (result && inBangalore(result)) return result;
    }

    // 3. Try full address as last resort
    const lower = address.toLowerCase();
    const hasCity = lower.includes("bangalore") || lower.includes("bengaluru") || lower.includes("karnataka");
    const withCity = hasCity ? address : `${address}, Bangalore, Karnataka, India`;
    const result = await nominatimQuery(withCity);
    if (result && inBangalore(result)) return result;

    console.warn("Geocoding fell back to Bangalore center for:", address);
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
