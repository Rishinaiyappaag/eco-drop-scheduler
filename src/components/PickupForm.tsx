import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel, 
  FormDescription,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSupabase } from "@/lib/SupabaseProvider";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
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

type FormValues = z.infer<typeof formSchema>;

const wasteTypes = [
  { value: "computers", label: "Computers & Laptops", points: 50 },
  { value: "phones", label: "Mobile Phones & Tablets", points: 25 },
  { value: "tvs", label: "TVs & Monitors", points: 40 },
  { value: "printers", label: "Printers & Scanners", points: 30 },
  { value: "batteries", label: "Batteries", points: 10 },
  { value: "cables", label: "Cables & Chargers", points: 5 },
  { value: "appliances", label: "Small Appliances", points: 20 },
  { value: "other", label: "Other Electronics", points: 15 },
];

const PickupForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useSupabase();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: user?.email || "",
      phone: "",
      address: "",
      description: "",
    },
  });

  // Pre-fill email if user is logged in
  if (user?.email && !form.getValues().email) {
    form.setValue("email", user.email);
  }

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to schedule a pickup.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting pickup request:", data);
      console.log("Current user:", user);
      
      // Get the waste type points
      const selectedWasteType = wasteTypes.find(type => type.value === data.wasteType);
      const pointsToAdd = selectedWasteType?.points || 15; // Default to 15 if not found
      
      // Format the date for storage
      const formattedDate = format(data.pickupDate, "yyyy-MM-dd");
      
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
        throw requestError;
      }
      
      // Check if the user has a profile before attempting to update points
      const { data: profileCheck, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();
        
      console.log("Profile check:", { profileCheck, profileCheckError });
      
      // If profile doesn't exist, create it
      if (!profileCheck && !profileCheckError) {
        const { data: newProfile, error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
            email: user.email || '',
            reward_points: pointsToAdd
          })
          .select();
          
        console.log("New profile created:", { newProfile, createProfileError });
        
        if (createProfileError) {
          throw createProfileError;
        }
      } else {
        // Update the existing profile with the new reward points
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('reward_points')
          .eq('id', user.id)
          .maybeSingle();
        
        console.log("Current profile:", { profile, profileError });
        
        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }
        
        const currentPoints = profile?.reward_points || 0;
        const newPoints = currentPoints + pointsToAdd;
        
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({ reward_points: newPoints })
          .eq('id', user.id)
          .select();
        
        console.log("Profile update result:", { updatedProfile, updateError });
        
        if (updateError) {
          throw updateError;
        }
      }
      
      toast({
        title: "Pickup Scheduled!",
        description: `Your e-waste pickup has been scheduled for ${format(data.pickupDate, "PPP")}. You earned ${pointsToAdd} reward points!`,
      });
      
      form.reset();
      
    } catch (error: any) {
      console.error("Error scheduling pickup:", error);
      
      toast({
        title: "Error scheduling pickup",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Schedule Your Pickup</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Phone Field */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Address Field */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pickup Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Your complete address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Waste Type Selection */}
          <FormField
            control={form.control}
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
          
          {/* Date Picker */}
          <FormField
            control={form.control}
            name="pickupDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Pickup Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Select your preferred pickup date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Details</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your e-waste items or provide any additional information..." 
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Please include any specific details about the items, quantity, or special handling instructions.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Terms and Conditions */}
          <FormField
            control={form.control}
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
          
          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Processing...
              </>
            ) : (
              "Schedule Pickup"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PickupForm;
