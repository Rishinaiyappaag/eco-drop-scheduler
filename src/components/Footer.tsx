
import { Link } from "react-router-dom";
import { Recycle, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and tagline */}
          <div className="md:col-span-1">
            <div className="flex items-center">
              <Recycle className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">EcoDrop</span>
            </div>
            <p className="mt-2 text-sm text-gray-300">
              Making e-waste recycling easy, accessible, and rewarding.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="text-gray-300 hover:text-white transition-colors">
                  Schedule Pickup
                </Link>
              </li>
              <li>
                <Link to="/drop-off" className="text-gray-300 hover:text-white transition-colors">
                  Find Drop-offs
                </Link>
              </li>
              <li>
                <Link to="/rewards" className="text-gray-300 hover:text-white transition-colors">
                  Rewards
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/learn" className="text-gray-300 hover:text-white transition-colors">
                  E-Waste Education
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-gray-300 hover:text-white transition-colors">
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail size={16} className="mr-2" />
                <a href="mailto:rishinaiyappaag@gmail.com" className="text-gray-300 hover:text-white">
                  rishinaiyappaag@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2" />
                <a href="tel:+918105730319" className="text-gray-300 hover:text-white">
                  +91 810 573 0319
                </a>
              </li>
              <li className="flex items-center">
                <MapPin size={16} className="mr-2" />
                <span className="text-gray-300">
                  Bangalore, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-sm text-gray-300 text-center">
            © {new Date().getFullYear()} EcoDrop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
