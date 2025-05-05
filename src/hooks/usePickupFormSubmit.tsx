
import { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSupabase } from "@/lib/SupabaseProvider";
import { Button } from "@/components/ui/button"; 

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

export const usePickupFormSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user, refreshProfile } = useSupabase();
  const navigate = useNavigate();

  const handleSubmit = async (data: PickupFormValues) => {
    console.log("Form submitted with data:", data);
    setIsSubmitting(true);
    
    try {
      // Format the date for storage
      const formattedDate = format(data.pickupDate, "yyyy-MM-dd");
      
      // Get the waste type points
      const selectedWasteType = wasteTypes.find(type => type.value === data.wasteType);
      const pointsToAdd = selectedWasteType?.points || 15; // Default to 15 if not found
      
      if (user) {
        // For authenticated users, directly use the authenticated user's ID
        console.log("Creating pickup request for authenticated user:", user.id);
        
        // Store the pickup request in e_waste_requests table
        const { data: requestData, error: requestError } = await supabase
          .from('e_waste_requests')
          .insert({
            user_id: user.id,
            waste_type: data.wasteType,
            pickup_time: formattedDate,
            status: 'pending',
            address: data.address,
            phone: data.phone,
            description: data.description || ''
          })
          .select();
        
        console.log("Pickup request result:", { requestData, requestError });
        
        if (requestError) {
          throw new Error("Error storing pickup request: " + requestError.message);
        }
        
        // Update reward points for the user
        try {
          // Check if the user has a profile before attempting to update points
          const { data: profileCheck, error: profileCheckError } = await supabase
            .from('profiles')
            .select('id, reward_points')
            .eq('id', user.id)
            .maybeSingle();
            
          console.log("Profile check:", { profileCheck, profileCheckError });
          
          // If profile doesn't exist, create it
          if (!profileCheck && !profileCheckError) {
            const { data: newProfile, error: createProfileError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                first_name: user.user_metadata?.first_name || data.name.split(' ')[0] || '',
                last_name: user.user_metadata?.last_name || data.name.split(' ')[1] || '',
                email: user.email || data.email,
                reward_points: pointsToAdd
              })
              .select();
              
            console.log("New profile created:", { newProfile, createProfileError });
            
            if (createProfileError) {
              console.error("Error creating profile:", createProfileError);
            }
          } else if (profileCheck) {
            // Update the existing profile with the new reward points
            const currentPoints = profileCheck.reward_points || 0;
            const newPoints = currentPoints + pointsToAdd;
            
            const { data: updatedProfile, error: updateError } = await supabase
              .from('profiles')
              .update({ reward_points: newPoints })
              .eq('id', user.id)
              .select();
            
            console.log("Profile update result:", { updatedProfile, updateError });
            
            if (updateError) {
              console.error("Error updating profile:", updateError);
            }
          }
          
          // Refresh the profile data in the context after updating points
          await refreshProfile();
        } catch (profileErr) {
          // Log but don't fail the whole operation
          console.error("Profile update error:", profileErr);
        }
        
        toast({
          title: "Pickup Scheduled!",
          description: `Your e-waste pickup has been scheduled for ${format(data.pickupDate, "PPP")}. You earned ${pointsToAdd} reward points!`,
        });
      } else {
        // For non-authenticated users, we need to store as a guest
        console.log("Creating pickup request for guest user");
        
        // Store the guest information in the description field
        const guestDescription = `Guest Request - Name: ${data.name}, Email: ${data.email}, ${data.description || ''}`;
        
        // Create pickup request without user_id for guest
        const { data: requestData, error: requestError } = await supabase
          .from('e_waste_requests')
          .insert({
            waste_type: data.wasteType,
            pickup_time: formattedDate,
            status: 'pending',
            address: data.address,
            phone: data.phone,
            description: guestDescription
          })
          .select();
        
        console.log("Guest pickup request result:", { requestData, requestError });
        
        if (requestError) {
          throw new Error("Error storing pickup request: " + requestError.message);
        }
        
        toast({
          title: "Pickup Scheduled!",
          description: `Your e-waste pickup has been scheduled for ${format(data.pickupDate, "PPP")}. Create an account to earn reward points!`,
        });
        
        // Suggest creating an account
        setTimeout(() => {
          toast({
            title: "Create an Account",
            description: "Sign up to track your pickups and earn reward points!",
            action: <Button onClick={() => navigate('/register')} size="sm">Sign Up</Button>
          });
        }, 2000);
      }
      
      return { success: true };
    } catch (error: any) {
      console.error("Error scheduling pickup:", error);
      
      toast({
        title: "Error scheduling pickup",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
      
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};
