
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import MapSection from "@/components/MapSection";

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
          
          <MapSection />
          
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
