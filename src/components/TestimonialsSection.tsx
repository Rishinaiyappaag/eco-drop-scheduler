
import { Card, CardContent } from "@/components/ui/card";
import { QuoteIcon } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content: "EcoDrop made recycling my old electronics so easy. I scheduled a pickup, and they came right to my door. Plus, I earned rewards points that I used for a discount at my favorite eco-friendly store!",
    author: "Maria Johnson",
    role: "Regular User",
    image: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: 2,
    content: "As a small business owner, I needed a solution for properly disposing of outdated equipment. EcoDrop's business service was perfect - efficient, responsible, and they provided all the documentation we needed for compliance.",
    author: "David Chen",
    role: "Business Owner",
    image: "https://i.pravatar.cc/150?img=59",
  },
  {
    id: 3,
    content: "The drop-off locator feature is a game-changer. I found a certified recycling center just 10 minutes from my house that I didn't even know existed. No more hoarding old phones in my drawer!",
    author: "Alex Rivera",
    role: "Tech Enthusiast",
    image: "https://i.pravatar.cc/150?img=11",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-neutral">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            What Our Users Say
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            Don't just take our word for it - hear from people who have used EcoDrop
            to recycle their e-waste and make a difference.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white overflow-hidden hover:shadow-lg transition duration-300">
              <CardContent className="p-6">
                <div className="flex justify-start mb-4">
                  <QuoteIcon className="h-8 w-8 text-primary opacity-50" />
                </div>
                <p className="text-gray-700 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-12 w-12 rounded-full"
                      src={testimonial.image}
                      alt={testimonial.author}
                    />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-bold text-gray-900">{testimonial.author}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
