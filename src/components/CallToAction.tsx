
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-16 bg-primary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Recycle Responsibly?
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-primary-100 mx-auto">
            Join our community of eco-conscious recyclers and help build a sustainable future.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Link to="/register">
                <Button className="px-8 py-6 text-lg bg-white text-primary hover:bg-gray-100">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex">
              <Link to="/learn">
                <Button variant="outline" className="px-8 py-6 text-lg bg-transparent border-white text-white hover:bg-primary-600">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
