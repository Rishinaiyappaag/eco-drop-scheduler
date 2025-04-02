
import { motion } from "framer-motion";
import { Trash2, Award, Recycle, TreePine } from "lucide-react";

const StatsSection = () => {
  const stats = [
    { id: 1, label: "E-waste collected", value: "150+ tons", icon: <Trash2 className="h-8 w-8 text-primary" /> },
    { id: 2, label: "Recycling rewards earned", value: "$25,000+", icon: <Award className="h-8 w-8 text-primary" /> },
    { id: 3, label: "Successful pickups", value: "10,000+", icon: <Recycle className="h-8 w-8 text-primary" /> },
    { id: 4, label: "CO₂ emissions saved", value: "500+ tons", icon: <TreePine className="h-8 w-8 text-primary" /> },
  ];

  return (
    <section className="py-16 bg-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Our Impact</h2>
          <p className="mt-4 max-w-2xl text-xl text-primary-100 mx-auto">
            Together, we're making a difference one device at a time.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div 
              key={stat.id}
              className="bg-primary-700 px-6 py-8 rounded-lg shadow-lg hover:bg-primary-600 transition duration-300"
            >
              <div className="flex flex-col items-center">
                {stat.icon}
                <p className="mt-4 text-3xl font-extrabold text-white">{stat.value}</p>
                <p className="mt-1 text-base text-primary-100">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-lg text-primary-100">
            Join thousands of environmentally-conscious individuals taking action against e-waste pollution.
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
