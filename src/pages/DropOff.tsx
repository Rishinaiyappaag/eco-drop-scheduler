
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import MapSection from "@/components/MapSection";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Clock, Phone } from "lucide-react";

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
          
          <div className="space-y-8">
            {/* Use MapSection instead of Google Maps iframe */}
            <div className="h-96 rounded-lg overflow-hidden shadow-md">
              <MapSection />
            </div>
            
            {/* Ecodrop Hotspots List */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Ecodrop Hotspots in this Area
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="bg-primary-100 p-4 relative">
                      <MapPin className="text-primary w-8 h-8 absolute right-4 top-4" />
                      <h3 className="font-semibold text-lg text-primary-800">Eco Recyclers Hub</h3>
                      <p className="text-sm text-gray-700">123 Koramangala Main Road, Bangalore - 560034</p>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <p className="text-sm text-gray-600">Mon-Sat: 9AM-6PM</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <p className="text-sm text-gray-600">(555) 123-4567</p>
                      </div>
                      <p className="text-sm text-emerald-600 mt-2 font-medium">10 reward points per visit</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="bg-primary-100 p-4 relative">
                      <MapPin className="text-primary w-8 h-8 absolute right-4 top-4" />
                      <h3 className="font-semibold text-lg text-primary-800">Green Electronics Disposal</h3>
                      <p className="text-sm text-gray-700">45 Indiranagar Main Road, Bangalore - 560038</p>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <p className="text-sm text-gray-600">Mon-Sun: 10AM-8PM</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <p className="text-sm text-gray-600">(555) 987-6543</p>
                      </div>
                      <p className="text-sm text-emerald-600 mt-2 font-medium">15 reward points per visit</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="bg-primary-100 p-4 relative">
                      <MapPin className="text-primary w-8 h-8 absolute right-4 top-4" />
                      <h3 className="font-semibold text-lg text-primary-800">Tech Waste Solutions</h3>
                      <p className="text-sm text-gray-700">78 JP Nagar 2nd Phase, Bangalore - 560078</p>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <p className="text-sm text-gray-600">Tue-Sun: 8AM-7PM</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <p className="text-sm text-gray-600">(555) 345-6789</p>
                      </div>
                      <p className="text-sm text-emerald-600 mt-2 font-medium">12 reward points per visit</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="mt-8 max-w-3xl mx-auto">
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
