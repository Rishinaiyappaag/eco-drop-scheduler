
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import RewardsSection from "@/components/RewardsSection";

const Rewards = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-16">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 md:text-4xl">
              EcoDrop Rewards Program
            </h1>
            <p className="mt-3 sm:mt-4 max-w-2xl text-lg sm:text-xl text-gray-600 mx-auto">
              Get rewarded for your contribution to a cleaner planet.
            </p>
          </div>
          
          <RewardsSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Rewards;
