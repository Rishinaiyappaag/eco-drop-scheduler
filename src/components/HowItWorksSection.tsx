
import { Laptop, Smartphone, Cpu, Cable, Zap } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      id: 1,
      title: "Register an account",
      description: "Create a free account to access all features and track your recycling history.",
      icon: <Laptop className="h-8 w-8 text-primary" />,
    },
    {
      id: 2,
      title: "Select your e-waste",
      description: "Tell us what items you want to recycle - computers, phones, batteries, etc.",
      icon: <Smartphone className="h-8 w-8 text-primary" />,
    },
    {
      id: 3,
      title: "Choose pickup or drop-off",
      description: "Schedule a convenient pickup time or find a nearby drop-off location.",
      icon: <Cpu className="h-8 w-8 text-primary" />,
    },
    {
      id: 4,
      title: "Recycle & earn rewards",
      description: "Complete your recycling and earn points for each item recycled.",
      icon: <Cable className="h-8 w-8 text-primary" />,
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            Recycling e-waste has never been easier. Follow these simple steps:
          </p>
        </div>

        <div className="mt-16">
          <div className="relative">
            {/* Line connecting the steps */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-primary-100 -translate-y-1/2" aria-hidden="true"></div>
            
            {/* Steps */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              {steps.map((step) => (
                <div key={step.id} className="relative">
                  <div className="flex flex-col items-center">
                    <div className="flex-shrink-0 bg-white border-4 border-primary rounded-full h-16 w-16 flex items-center justify-center z-10 relative animate-pulse-gentle">
                      {step.icon}
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-gray-900">{step.title}</h3>
                    <p className="mt-2 text-center text-base text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 bg-primary-50 p-8 rounded-lg">
          <div className="flex flex-col md:flex-row items-center justify-center">
            <div className="flex-shrink-0 bg-white rounded-full h-16 w-16 flex items-center justify-center mb-4 md:mb-0 md:mr-6">
              <Zap className="h-8 w-8 text-accent" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-900">Make an Impact!</h3>
              <p className="mt-2 text-gray-600 max-w-2xl">
                Every piece of e-waste properly recycled helps reduce landfill waste, 
                prevents toxic materials from polluting our environment, and recovers 
                valuable materials that can be reused.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
