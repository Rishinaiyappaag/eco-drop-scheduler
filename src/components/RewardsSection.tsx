
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Laptop, Smartphone, Tv, Gift, Battery, Award } from "lucide-react";

const rewards = [
  {
    id: 1,
    title: "Eco Store Discount",
    points: 100,
    description: "10% off at participating eco-friendly stores",
    icon: <Gift className="h-6 w-6 text-accent" />,
  },
  {
    id: 2,
    title: "Tree Planting",
    points: 250,
    description: "We'll plant a tree in your name",
    icon: <Award className="h-6 w-6 text-accent" />,
  },
  {
    id: 3,
    title: "Premium Recycling Kit",
    points: 500,
    description: "Receive a home recycling kit with sorting bins",
    icon: <Gift className="h-6 w-6 text-accent" />,
  },
];

const RewardsSection = () => {
  const isMobile = useIsMobile();
  
  // In a real app, these would come from the user's profile
  const userPoints = 175;
  const nextRewardPoints = 250;
  const progress = (userPoints / nextRewardPoints) * 100;
  
  const recyclingHistory = [
    { id: 1, date: "Apr 15, 2023", type: "Laptop", points: 50, icon: <Laptop className="h-5 w-5" /> },
    { id: 2, date: "Mar 22, 2023", type: "Smartphones (3)", points: 75, icon: <Smartphone className="h-5 w-5" /> },
    { id: 3, date: "Feb 10, 2023", type: "Television", points: 40, icon: <Tv className="h-5 w-5" /> },
    { id: 4, date: "Jan 05, 2023", type: "Batteries", points: 10, icon: <Battery className="h-5 w-5" /> },
  ];
  
  return (
    <section className="py-8 md:py-16 bg-gradient-to-r from-primary-50 to-secondary-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Earn Rewards for Recycling
          </h2>
          <p className="mt-3 md:mt-4 max-w-2xl text-lg md:text-xl text-gray-600 mx-auto">
            Get rewarded for your environmental responsibility. Earn points for every recycling action.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:gap-8">
          {/* User's rewards status - Always display first on mobile */}
          <Card className="w-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl md:text-2xl">Your Rewards</CardTitle>
              <CardDescription>
                Track your progress and points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Current Points</span>
                <span className="text-2xl font-bold text-primary">{userPoints}</span>
              </div>
              <div className="mb-6">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between mt-1 text-xs text-gray-500">
                  <span>0</span>
                  <span>{nextRewardPoints} points needed for next reward</span>
                </div>
              </div>
              
              <h4 className="font-medium mb-4">Recycling History</h4>
              <div className="space-y-3">
                {recyclingHistory.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className="bg-primary-100 p-2 rounded-full mr-3">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.type}</p>
                        <p className="text-xs text-gray-500">{item.date}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-primary-50 text-primary border-primary">
                      +{item.points} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Available rewards */}
          <Card className="w-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl md:text-2xl">Available Rewards</CardTitle>
              <CardDescription>
                Redeem your points for these eco-friendly rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewards.map((reward) => (
                  <div 
                    key={reward.id} 
                    className={`border rounded-lg p-4 flex flex-col ${
                      userPoints >= reward.points 
                        ? "border-primary bg-primary-50 hover:shadow-md transition" 
                        : "border-gray-200 bg-gray-50 opacity-75"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="bg-white p-2 rounded-full">
                        {reward.icon}
                      </div>
                      <Badge className={userPoints >= reward.points ? "bg-primary" : "bg-gray-400"}>
                        {reward.points} pts
                      </Badge>
                    </div>
                    <h4 className="font-medium text-gray-900">{reward.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{reward.description}</p>
                    <button 
                      className={`mt-auto text-sm font-medium py-2 px-3 rounded-md w-full ${
                        userPoints >= reward.points 
                          ? "bg-primary text-white hover:bg-primary-600"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                      disabled={userPoints < reward.points}
                    >
                      {userPoints >= reward.points ? "Redeem Now" : "Not Enough Points"}
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-secondary-50 rounded-lg border border-secondary-100">
                <h4 className="font-medium text-gray-900 mb-2">How to Earn More Points</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="bg-secondary-100 p-1 rounded-full mr-2 mt-0.5">
                      <Smartphone className="h-4 w-4 text-secondary-700" />
                    </div>
                    <span className="text-sm">Mobile phones & tablets: 25 points each</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-secondary-100 p-1 rounded-full mr-2 mt-0.5">
                      <Laptop className="h-4 w-4 text-secondary-700" />
                    </div>
                    <span className="text-sm">Computers & laptops: 50 points each</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-secondary-100 p-1 rounded-full mr-2 mt-0.5">
                      <Tv className="h-4 w-4 text-secondary-700" />
                    </div>
                    <span className="text-sm">TVs & monitors: 40 points each</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-secondary-100 p-1 rounded-full mr-2 mt-0.5">
                      <Battery className="h-4 w-4 text-secondary-700" />
                    </div>
                    <span className="text-sm">Batteries & small electronics: 5-15 points</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RewardsSection;
