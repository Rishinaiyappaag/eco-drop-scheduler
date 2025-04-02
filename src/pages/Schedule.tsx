
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PickupForm from "@/components/PickupForm";

const Schedule = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Schedule an E-Waste Pickup
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              Let us pick up your e-waste at a time that's convenient for you.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <PickupForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Schedule;
