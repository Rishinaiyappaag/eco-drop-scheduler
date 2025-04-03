
import { Link } from "react-router-dom";
import { Recycle } from "lucide-react";

const BrandLogo = () => {
  return (
    <div className="flex items-center">
      <Link to="/" className="flex items-center">
        <Recycle className="h-8 w-8 text-primary" />
        <span className="ml-2 text-xl font-semibold text-primary">EcoDrop</span>
      </Link>
    </div>
  );
};

export default BrandLogo;
