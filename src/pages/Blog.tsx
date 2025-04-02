
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { CalendarIcon, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";

const Blog = () => {
  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "The Environmental Impact of E-Waste",
      excerpt: "Learn about how improper e-waste disposal affects our environment and what we can do to help.",
      date: "April 22, 2023",
      author: "Emma Green",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 2,
      title: "How to Prepare Your Devices for Recycling",
      excerpt: "A step-by-step guide to ensure all your personal data is removed before recycling your electronics.",
      date: "March 15, 2023",
      author: "Alex Tech",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    },
    {
      id: 3,
      title: "Innovative Ways Companies Are Tackling E-Waste",
      excerpt: "Discover how forward-thinking companies are redesigning products for better recyclability.",
      date: "February 8, 2023",
      author: "Maya Johnson",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              EcoDrop Blog
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
              Stay informed about e-waste recycling, sustainability, and eco-friendly tips.
            </p>
          </div>
          
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <User size={16} className="mr-1" />
                    <span className="mr-4">{post.author}</span>
                    <CalendarIcon size={16} className="mr-1" />
                    <span className="mr-4">{post.date}</span>
                    <Clock size={16} className="mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                  <Link 
                    to={`/blog/${post.id}`}
                    className="text-primary font-medium hover:text-primary-600 flex items-center"
                  >
                    Read more
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
