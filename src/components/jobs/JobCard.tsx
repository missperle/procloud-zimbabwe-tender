
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Clock, DollarSign } from "lucide-react";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  budget: string;
  deadline: string;
  categories: string[];
  brief: string;
}

const JobCard = ({
  id,
  title,
  company,
  budget,
  deadline,
  categories,
  brief,
}: JobCardProps) => {
  return (
    <Card className="h-full flex flex-col hover:border-procloud-green transition-colors">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-procloud-gray-600">{company}</p>
          </div>
          <Badge className="bg-procloud-green text-black hover:bg-procloud-green-dark">
            Open
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {categories.map((category) => (
            <Badge key={category} variant="outline" className="border-procloud-gray-300">
              {category}
            </Badge>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-procloud-gray-600 line-clamp-3">{brief}</p>
        
        <div className="flex flex-col sm:flex-row sm:justify-between mt-4 gap-2">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1 text-procloud-green" />
            <span className="text-sm font-medium">{budget}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-procloud-green" />
            <span className="text-sm">Due: {deadline}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Link to={`/jobs/${id}`} className="w-full">
          <Button className="w-full bg-black hover:bg-procloud-gray-800 text-white">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
