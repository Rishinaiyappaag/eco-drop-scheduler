
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import MapSection from "@/components/MapSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Info } from "lucide-react";

const DropOff = () => {
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
          
          <Tabs defaultValue="interactive-map" className="w-full">
            <TabsList className="grid w-full md:w-[400px] mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="interactive-map">
                <MapPin className="h-4 w-4 mr-2" />
                Interactive Map
              </TabsTrigger>
              <TabsTrigger value="google-maps">
                <Info className="h-4 w-4 mr-2" />
                Ecodrop Hotspots
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="interactive-map">
              <MapSection />
            </TabsContent>
            
            <TabsContent value="google-maps">
              <div className="rounded-lg overflow-hidden shadow-md mb-8">
                <div className="aspect-video w-full">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3879.8795782998595!2d77.59335565282154!3d12.919072571552451!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1746219465573!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ecodrop Hotspots"
                    className="w-full h-full"
                  />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Ecodrop Hotspots in this Area
                </h2>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold text-lg">Eco Recyclers Hub</h3>
                    <p className="text-sm text-gray-600">123 Koramangala Main Road, Bangalore - 560034</p>
                    <p className="text-sm text-gray-600 mt-1">Open: Mon-Sat 9AM-6PM</p>
                    <p className="text-sm text-emerald-600 mt-1">10 reward points per visit</p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold text-lg">Green Electronics Disposal</h3>
                    <p className="text-sm text-gray-600">45 Indiranagar Main Road, Bangalore - 560038</p>
                    <p className="text-sm text-gray-600 mt-1">Open: Mon-Sun 10AM-8PM</p>
                    <p className="text-sm text-emerald-600 mt-1">15 reward points per visit</p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold text-lg">Tech Waste Solutions</h3>
                    <p className="text-sm text-gray-600">78 JP Nagar 2nd Phase, Bangalore - 560078</p>
                    <p className="text-sm text-gray-600 mt-1">Open: Tue-Sun 8AM-7PM</p>
                    <p className="text-sm text-emerald-600 mt-1">12 reward points per visit</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What to Expect at Drop-off Centers
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Accepted Items</h3>
                  <p className="mt-2 text-gray-600">
                    Most centers accept computers, laptops, monitors, TVs, mobile phones, 
                    tablets, printers, scanners, keyboards, mice, cables, batteries, and 
                    small household electronics.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">What to Bring</h3>
                  <p className="mt-2 text-gray-600">
                    Bring your ID and the e-waste items. Some centers may require proof of 
                    residence if they serve specific communities or districts.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Data Security</h3>
                  <p className="mt-2 text-gray-600">
                    It's recommended to wipe personal data from devices before recycling. 
                    Many centers offer data destruction services for added security.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Earning Rewards</h3>
                  <p className="mt-2 text-gray-600">
                    Don't forget to register your drop-off with our app to earn reward points! 
                    Show the center staff your app or enter the drop-off code to claim your points.
                  </p>
                </div>
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
