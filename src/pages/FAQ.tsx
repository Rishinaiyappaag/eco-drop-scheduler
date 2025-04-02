
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              Find answers to common questions about e-waste recycling and our services.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto mt-8">
            <div className="space-y-6">
              {/* FAQ Item 1 */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    What types of e-waste do you accept?
                  </h3>
                </div>
                <div className="border-t border-gray-200">
                  <div className="px-4 py-5 sm:px-6">
                    <p className="text-gray-600">
                      We accept a wide range of electronic waste including computers, laptops, monitors, 
                      smartphones, tablets, printers, TVs, batteries, cables, and small household electronics. 
                      For large appliances, please contact us directly to arrange a special pickup.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Item 2 */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    How does the pickup scheduling process work?
                  </h3>
                </div>
                <div className="border-t border-gray-200">
                  <div className="px-4 py-5 sm:px-6">
                    <p className="text-gray-600">
                      Simply navigate to our Schedule Pickup page, select the types of e-waste you have, 
                      choose your preferred date and time slot, and provide your address details. 
                      Once submitted, you'll receive a confirmation email with all the details.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Item 3 */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Is there a fee for e-waste pickup?
                  </h3>
                </div>
                <div className="border-t border-gray-200">
                  <div className="px-4 py-5 sm:px-6">
                    <p className="text-gray-600">
                      Standard residential pickups are free for most common electronic items. 
                      Special items like large TVs or commercial quantities may incur a small fee. 
                      The exact cost, if any, will be displayed before you confirm your pickup request.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Item 4 */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    How does the reward program work?
                  </h3>
                </div>
                <div className="border-t border-gray-200">
                  <div className="px-4 py-5 sm:px-6">
                    <p className="text-gray-600">
                      You earn EcoPoints for each recycling activity based on the type and amount of e-waste. 
                      These points can be redeemed for discounts at partner stores, tree planting donations, 
                      or sustainable product vouchers. Check our Rewards page for more details.
                    </p>
                  </div>
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

export default FAQ;
