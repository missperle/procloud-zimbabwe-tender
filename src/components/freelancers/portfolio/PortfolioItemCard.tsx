
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import { PortfolioItem } from "./PortfolioManager";

interface PortfolioItemCardProps {
  item: PortfolioItem;
  onEdit: () => void;
  onDelete: () => void;
}

const PortfolioItemCard = ({ item, onEdit, onDelete }: PortfolioItemCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-procloud-gray-200">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-procloud-gray-300 text-procloud-gray-600">
            No Image
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium line-clamp-1">{item.title}</h3>
          
          {item.category && (
            <Badge className="bg-procloud-green text-black hover:bg-procloud-green-dark">
              {item.category}
            </Badge>
          )}
        </div>
        
        {item.description && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">{item.description}</p>
        )}
        
        {item.project_url && (
          <a 
            href={item.project_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-procloud-green hover:underline"
          >
            Visit Project <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        )}
      </div>
      
      <div className="border-t p-3 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onEdit}
          className="text-gray-600 hover:text-black"
        >
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </div>
    </Card>
  );
};

export default PortfolioItemCard;
