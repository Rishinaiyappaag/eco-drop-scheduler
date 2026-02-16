
import { useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import MapSection from "@/components/MapSection";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Phone, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSupabase } from "@/lib/SupabaseProvider";
import { useNavigate } from "react-router-dom";

const DROP_OFF_LOCATIONS = [
  { id: "elxion", name: "Elxion E-waste Recycling", address: "No 24, 23rd A Main Rd, R.K Colony, Marenahalli, 2nd Phase, J. P. Nagar, Bengaluru, Karnataka 560041", phone: "08026589066", hours: "Mon-Sat: 9AM-6PM", points: 10, mapLink: "https://maps.app.goo.gl/pJto51u8nYCbXGv89", website: "http://www.elxion.in/", lat: 12.9081, lng: 77.5856 },
  { id: "ewaste-hub", name: "Ewaste Hub", address: "No 3, Oppo Hombegowda Ground, 10th Cross, Lakkasandra Extension, Wilson Garden, Bengaluru, Karnataka 560027", phone: "09066319066", hours: "Mon-Sun: 10AM-8PM", points: 15, mapLink: "https://maps.app.goo.gl/CDoobfs829xkZGx67", lat: 12.9400, lng: 77.5950 },
  { id: "zolopik", name: "Zolopik", address: "58, 22nd Main Rd, Marenahalli, 2nd Phase, J. P. Nagar, Bengaluru, Karnataka 560078", phone: "09743440440", hours: "Tue-Sun: 8AM-7PM", points: 12, mapLink: "https://maps.app.goo.gl/uCts53vj1pb8xK9K6", website: "https://www.zolopik.com/", lat: 12.9082, lng: 77.5830 },
  { id: "ecosphere", name: "Ecosphere Waste Solutions", address: "Flat No 201, Dhammanagi Zeus Apartment, Millers Tank Bund Rd, Vasanth Nagar, Bengaluru, Karnataka 560051", phone: "09035489496", hours: "Mon-Sat: 9AM-6PM", points: 10, mapLink: "https://maps.app.goo.gl/WZDHbsQxRJ7zpQXb6", lat: 12.9850, lng: 77.5870 },
  { id: "saahas", name: "Saahas Waste Management Pvt Ltd", address: "32, 5th B Cross, 16th Main Rd, MCHS Colony, Stage 2, BTM Layout, Bengaluru, Karnataka 560076", phone: "18002586676", hours: "Mon-Sat: 9AM-6PM", points: 12, mapLink: "https://maps.app.goo.gl/Jse1YuQtTKPyaofYA", website: "https://saahaszerowaste.com/", lat: 12.9165, lng: 77.6101 },
];

const WASTE_TYPES = [
  { value: "computers", label: "Computers & Laptops", points: 50 },
  { value: "phones", label: "Mobile Phones & Tablets", points: 25 },
  { value: "tvs", label: "TVs & Monitors", points: 40 },
  { value: "printers", label: "Printers & Scanners", points: 30 },
  { value: "batteries", label: "Batteries", points: 10 },
  { value: "cables", label: "Cables & Chargers", points: 5 },
  { value: "appliances", label: "Small Appliances", points: 20 },
  { value: "other", label: "Other Electronics", points: 15 },
];

const DropOff = () => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [wasteType, setWasteType] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useSupabase();
  const navigate = useNavigate();

  const handleSubmitDropOff = async () => {
    if (!user) {
      toast({ title: "Please log in", description: "You need to be logged in to submit a drop-off.", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (!selectedLocation || !wasteType) {
      toast({ title: "Missing fields", description: "Please select a location and waste type.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const location = DROP_OFF_LOCATIONS.find(l => l.id === selectedLocation);
      if (!location) throw new Error("Invalid location");

      const { error } = await supabase.from("e_waste_requests").insert([{
        user_id: user.id,
        pickup_time: new Date().toISOString().split("T")[0],
        waste_type: wasteType,
        description: description || "",
        address: location.address,
        phone: location.phone,
        status: "pending",
        points_awarded: 0,
        request_type: "dropoff",
        drop_off_location: location.name,
        latitude: location.lat,
        longitude: location.lng,
      }] as any);

      if (error) throw error;

      const selectedWaste = WASTE_TYPES.find(w => w.value === wasteType);
      toast({
        title: "Drop-off Submitted!",
        description: `Your drop-off at ${location.name} has been submitted. You'll earn ${selectedWaste?.points || 15} points when approved by admin.`,
      });

      setSelectedLocation("");
      setWasteType("");
      setDescription("");
    } catch (error: any) {
      console.error("Drop-off submission error:", error);
      toast({ title: "Error", description: error.message || "Failed to submit drop-off.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Find E-Waste Drop-off Locations
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              Locate certified e-waste recycling centers near you.
            </p>
          </div>

          {/* Drop-off Submission Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-primary">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📦 Submit a Drop-off Request</h2>
            <p className="text-gray-600 mb-6">Select a location and the type of e-waste you're dropping off. Admin will review and approve your request, and reward points will be credited to your account.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="location">Drop-off Location</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select a drop-off location" />
                  </SelectTrigger>
                  <SelectContent>
                    {DROP_OFF_LOCATIONS.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.name} (+{loc.points} pts)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="wasteType">E-waste Type</Label>
                <Select value={wasteType} onValueChange={setWasteType}>
                  <SelectTrigger id="wasteType">
                    <SelectValue placeholder="Select waste type" />
                  </SelectTrigger>
                  <SelectContent>
                    {WASTE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label} (+{type.points} points)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe the items you're dropping off..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Button onClick={handleSubmitDropOff} disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="mr-2 h-4 w-4" /> Submit Drop-off Request</>
              )}
            </Button>
          </div>

          <div className="space-y-8">
            <div className="h-96 rounded-lg overflow-hidden shadow-md">
              <MapSection />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Ecodrop Hotspots in this Area
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DROP_OFF_LOCATIONS.map((loc) => (
                  <Card key={loc.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="bg-primary-100 p-4 relative">
                        <MapPin className="text-primary w-8 h-8 absolute right-4 top-4" />
                        <h3 className="font-semibold text-lg text-primary-800">{loc.name}</h3>
                        <p className="text-sm text-gray-700">{loc.address}</p>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <p className="text-sm text-gray-600">{loc.hours}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <p className="text-sm text-gray-600">{loc.phone}</p>
                        </div>
                        <a href={loc.mapLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block font-medium">
                          View on Google Maps
                        </a>
                        {loc.website && (
                          <a href={loc.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline block">
                            Visit Website
                          </a>
                        )}
                        <p className="text-sm text-emerald-600 mt-2 font-medium">
                          {loc.points} reward points per visit
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* WHAT TO EXPECT SECTION */}
          <div className="mt-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What to Expect at Drop-off Centers
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Accepted Items</h3>
                <p className="mt-2 text-gray-600">
                  Most centers accept computers, laptops, monitors, TVs, mobile phones, tablets, printers, scanners, keyboards, mice, cables, batteries, and small household electronics.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">What to Bring</h3>
                <p className="mt-2 text-gray-600">
                  Bring your ID and the e-waste items. Some centers may require proof of residence if they serve specific communities or districts.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Data Security</h3>
                <p className="mt-2 text-gray-600">
                  It's recommended to wipe personal data from devices before recycling. Many centers offer data destruction services for added security.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Earning Rewards</h3>
                <p className="mt-2 text-gray-600">
                  Submit your drop-off request above and the admin will verify and approve it. Points will be credited to your account upon approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DropOff;
