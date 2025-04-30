
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PortfolioItemProps {
  title: string;
  image: string;
  category: string;
  onClick: () => void;
}

const PortfolioItem = ({
  title,
  image,
  category,
  onClick,
}: PortfolioItemProps) => {
  return (
    <Card 
      className="group cursor-pointer overflow-hidden hover:border-procloud-green transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-0 relative">
        <div className="relative aspect-[4/3] overflow-hidden bg-procloud-gray-200">
          {image ? (
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-procloud-gray-300 text-procloud-gray-600">
              No Image
            </div>
          )}
          
          <div className="absolute inset-0 bg-procloud-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white font-medium">View Project</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center p-3">
        <h4 className="font-medium text-sm line-clamp-1">{title}</h4>
        <Badge className="bg-procloud-green text-black hover:bg-procloud-green-dark">
          {category}
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default PortfolioItem;
