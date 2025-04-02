
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BookOpen, FileText, HelpCircle } from "lucide-react";

const Learn = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Learn About E-Waste
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              Understand the impact of electronic waste and how proper recycling helps our planet.
            </p>
          </div>
          
          <Tabs defaultValue="impact" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="impact">Impact</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="process">Process</TabsTrigger>
              <TabsTrigger value="tips">Tips</TabsTrigger>
            </TabsList>
            
            {/* Impact Tab Content */}
            <TabsContent value="impact">
              <Card>
                <CardHeader>
                  <CardTitle>Environmental Impact</CardTitle>
                  <CardDescription>Understanding the consequences of improper e-waste disposal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Global E-Waste Crisis</h3>
                    <p className="text-gray-600">
                      Electronic waste is the fastest growing waste stream in the world. In 2019 alone, 
                      the world generated 53.6 million metric tons of e-waste, and only 17.4% was 
                      properly recycled. The rest ended up in landfills or was improperly handled, 
                      causing significant environmental damage.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Toxic Substances</h3>
                    <p className="text-gray-600">
                      E-waste contains toxic substances like lead, mercury, cadmium, and flame retardants. 
                      When improperly disposed, these toxins can leach into soil and water, 
                      contaminating ecosystems and potentially entering the food chain.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Resource Depletion</h3>
                    <p className="text-gray-600">
                      Manufacturing electronics requires valuable resources, including rare earth metals, 
                      gold, silver, copper, and aluminum. Not recycling means these resources are lost 
                      and must be newly extracted, leading to habitat destruction, energy consumption, 
                      and pollution.
                    </p>
                  </div>
                  
                  <Alert className="bg-primary-50 border-primary-200">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    <AlertTitle>Did you know?</AlertTitle>
                    <AlertDescription>
                      Recycling one million laptops saves the energy equivalent to the 
                      electricity used by more than 3,500 US homes in a year.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Materials Tab Content */}
            <TabsContent value="materials">
              <Card>
                <CardHeader>
                  <CardTitle>Materials in Electronics</CardTitle>
                  <CardDescription>What your devices are made of and why it matters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Valuable Materials</h3>
                    <p className="text-gray-600">
                      Electronics contain many valuable materials that can be recovered and reused:
                    </p>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
                      <li>Gold and silver in circuit boards and connectors</li>
                      <li>Copper in wiring and circuit boards</li>
                      <li>Aluminum in casings and frames</li>
                      <li>Rare earth elements in displays and magnets</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Hazardous Substances</h3>
                    <p className="text-gray-600">
                      Electronics also contain potentially harmful materials that require special handling:
                    </p>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
                      <li>Lead in older CRT screens and solder</li>
                      <li>Mercury in flat-screen displays and switches</li>
                      <li>Cadmium in batteries and circuit boards</li>
                      <li>Brominated flame retardants in plastic casings</li>
                      <li>Beryllium in connectors and older components</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Material Recovery</h3>
                    <p className="text-gray-600">
                      Proper recycling can recover up to 90% of the materials in electronics. 
                      These recovered materials require significantly less energy to process 
                      than extracting new raw materials, reducing the carbon footprint of new electronics.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Process Tab Content */}
            <TabsContent value="process">
              <Card>
                <CardHeader>
                  <CardTitle>Recycling Process</CardTitle>
                  <CardDescription>How e-waste is properly processed and recycled</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Collection</h3>
                    <p className="text-gray-600">
                      The process begins with collection through drop-off centers, retailer take-back 
                      programs, or pickup services like EcoDrop. Items are sorted by type for 
                      efficient processing.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Disassembly & Sorting</h3>
                    <p className="text-gray-600">
                      Electronics are manually disassembled to remove hazardous components like 
                      batteries and mercury switches. Parts are sorted into categories: circuit boards, 
                      plastics, metals, glass, etc.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Shredding & Separation</h3>
                    <p className="text-gray-600">
                      Materials are shredded and then separated using various technologies:
                    </p>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
                      <li>Magnetic separation for ferrous metals</li>
                      <li>Eddy current separation for non-ferrous metals</li>
                      <li>Density separation for plastics</li>
                      <li>Chemical processes for precious metals recovery</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Refining & Reuse</h3>
                    <p className="text-gray-600">
                      Recovered materials are refined and prepared for reuse in manufacturing. 
                      Some components, like certain circuit boards or hard drives, may be 
                      refurbished and reused directly if they're still functional.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Tips Tab Content */}
            <TabsContent value="tips">
              <Card>
                <CardHeader>
                  <CardTitle>Tips for Responsible E-Waste Management</CardTitle>
                  <CardDescription>How you can make a difference</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Extend Device Lifespan</h3>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
                      <li>Use protective cases and screen protectors</li>
                      <li>Clean your devices regularly</li>
                      <li>Update software to maintain performance</li>
                      <li>Replace batteries instead of entire devices when possible</li>
                      <li>Consider repairs before replacement</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Data Security</h3>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
                      <li>Back up important data before recycling</li>
                      <li>Factory reset smartphones and tablets</li>
                      <li>Use disk-wiping software on computers</li>
                      <li>Remove and physically destroy hard drives if you have highly sensitive data</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Consider Refurbishment</h3>
                    <p className="text-gray-600">
                      Before recycling, consider if your device could be:
                    </p>
                    <ul className="mt-2 space-y-1 list-disc list-inside text-gray-600">
                      <li>Given to a family member or friend</li>
                      <li>Donated to a school or charity</li>
                      <li>Sold on the secondary market</li>
                      <li>Used for a different purpose (old phones can be used as security cameras)</li>
                    </ul>
                  </div>
                  
                  <Alert className="bg-primary-50 border-primary-200">
                    <HelpCircle className="h-4 w-4 text-primary" />
                    <AlertTitle>Need Help?</AlertTitle>
                    <AlertDescription className="flex items-center gap-2">
                      <span>Contact our team for personalized advice on your e-waste.</span>
                      <a href="#" className="text-primary font-medium hover:underline">
                        Get Support
                      </a>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="max-w-4xl mx-auto mt-12">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-2">What items can be recycled as e-waste?</h3>
                <p className="text-gray-600">
                  Most electronic devices can be recycled, including computers, laptops, tablets, smartphones, 
                  printers, scanners, TVs, monitors, keyboards, mice, cables, batteries, and small household 
                  appliances. Some specialized items like medical equipment may require special handling.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Is there a fee for e-waste recycling?</h3>
                <p className="text-gray-600">
                  Most standard items can be recycled free of charge through EcoDrop. However, some items 
                  with special handling requirements, such as certain types of batteries or large appliances, 
                  may incur a small fee to cover processing costs.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-2">How is my data protected when I recycle my devices?</h3>
                <p className="text-gray-600">
                  We recommend wiping all personal data from your devices before recycling. 
                  For an additional fee, we offer certified data destruction services that comply 
                  with industry standards to ensure your information remains secure.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Can businesses use EcoDrop services?</h3>
                <p className="text-gray-600">
                  Yes, we offer special programs for businesses with larger volumes of e-waste. 
                  These include scheduled pickups, bulk pricing, and certificates of recycling 
                  for compliance purposes. Contact our business services team for more information.
                </p>
              </div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto mt-12 text-center">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-primary mr-2" />
              <h2 className="text-2xl font-bold">Resources</h2>
            </div>
            <p className="text-gray-600 mb-8">
              Learn more about e-waste management and responsible recycling.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a 
                href="#"
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
              >
                <FileText className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-medium text-gray-900">E-Waste Guide</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Comprehensive guide to understanding and managing e-waste
                </p>
              </a>
              
              <a 
                href="#"
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
              >
                <FileText className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Research Reports</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Scientific studies on the environmental impact of e-waste
                </p>
              </a>
              
              <a 
                href="#"
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
              >
                <FileText className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Educational Materials</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Resources for schools and communities to raise awareness
                </p>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Learn;
