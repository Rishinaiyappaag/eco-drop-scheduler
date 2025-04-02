
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { ExternalLink } from "lucide-react";

const Partners = () => {
  // Sample partner data
  const partners = [
    {
      id: 1,
      name: "GreenTech Recycling",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fGNvbXBhbnl8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60",
      description: "Leading provider of IT asset disposition services and electronic recycling solutions.",
      website: "https://example.com/greentech"
    },
    {
      id: 2,
      name: "EcoElectronics",
      logo: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8Y29tcGFueXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=600&q=60",
      description: "Specializing in sustainable manufacturing and circular economy electronics.",
      website: "https://example.com/ecoelectronics"
    },
    {
      id: 3,
      name: "Sustainable City Initiative",
      logo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGNvbXBhbnl8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60",
      description: "A city government program to promote responsible waste management.",
      website: "https://example.com/sustainablecity"
    },
    {
      id: 4,
      name: "EarthFriendly Retailers",
      logo: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGNvbXBhbnl8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60",
      description: "Network of sustainable retailers offering discounts for our reward program members.",
      website: "https://example.com/earthfriendly"
    },
    {
      id: 5,
      name: "TechForward Foundation",
      logo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fGNvbXBhbnl8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60",
      description: "Non-profit organization refurbishing electronics for schools and underserved communities.",
      website: "https://example.com/techforward"
    },
    {
      id: 6,
      name: "CircuitCare",
      logo: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjR8fGNvbXBhbnl8ZW58MHx8MHx8&auto=format&fit=crop&w=600&q=60",
      description: "Specialists in precious metal recovery and responsible component recycling.",
      website: "https://example.com/circuitcare"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Partners
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              We work with leading organizations committed to sustainable e-waste management.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner) => (
              <div key={partner.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {partner.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {partner.description}
                  </p>
                  <a 
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary font-medium hover:text-primary-600"
                  >
                    Visit Website
                    <ExternalLink size={16} className="ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-primary-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Interested in Becoming a Partner?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We're always looking to expand our network of responsible e-waste recyclers, 
              eco-friendly businesses, and sustainability advocates.
            </p>
            <a 
              href="mailto:partners@ecodrop.example"
              className="inline-block bg-primary hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Contact Us About Partnership
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Partners;
