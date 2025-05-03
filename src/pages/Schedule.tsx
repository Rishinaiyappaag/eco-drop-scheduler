
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PickupForm from "@/components/PickupForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSupabase } from "@/lib/SupabaseProvider";

const Schedule = () => {
  const { user, isLoading } = useSupabase();
  const navigate = useNavigate();

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
          
          {!isLoading && !user && (
            <div className="max-w-2xl mx-auto mb-8">
              <Alert variant="default" className="border-amber-500 bg-amber-50">
                <InfoIcon className="h-4 w-4 text-amber-600" />
                <AlertTitle>Sign in recommended</AlertTitle>
                <AlertDescription>
                  To earn reward points and track your pickups, please sign in or create an account.
                </AlertDescription>
                <div className="mt-4 flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => navigate('/register')}
                  >
                    Create Account
                  </Button>
                </div>
              </Alert>
            </div>
          )}
          
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
