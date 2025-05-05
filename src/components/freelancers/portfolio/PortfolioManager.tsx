
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PortfolioItemCard from "./PortfolioItemCard";
import PortfolioItemForm from "./PortfolioItemForm";
import { Plus, Loader2 } from "lucide-react";

export interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  project_url: string | null;
}

const PortfolioManager = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  // Fetch portfolio items
  useEffect(() => {
    const fetchPortfolioItems = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from("portfolio_items")
          .select("*")
          .eq("freelancer_id", currentUser.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        setPortfolioItems(data || []);
      } catch (error: any) {
        console.error("Error fetching portfolio:", error);
        toast({
          title: "Error fetching portfolio",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioItems();
  }, [currentUser, toast]);

  const handleItemAdded = (newItem: PortfolioItem) => {
    setPortfolioItems([newItem, ...portfolioItems]);
    setShowForm(false);
    setEditingItem(null);
  };

  const handleItemUpdated = (updatedItem: PortfolioItem) => {
    setPortfolioItems(
      portfolioItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from("portfolio_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setPortfolioItems(portfolioItems.filter(item => item.id !== id));
      
      toast({
        title: "Portfolio item deleted",
        description: "The item has been removed from your portfolio",
      });
    } catch (error: any) {
      console.error("Error deleting portfolio item:", error);
      toast({
        title: "Error deleting item",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleEditItem = (item: PortfolioItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Portfolio</h2>
          <p className="text-gray-500">Showcase your work to potential clients</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        )}
      </div>

      {showForm ? (
        <PortfolioItemForm 
          onCancel={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          onSave={editingItem ? handleItemUpdated : handleItemAdded}
          editItem={editingItem}
        />
      ) : loading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-procloud-green" />
        </div>
      ) : portfolioItems.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-md">
          <h3 className="text-lg font-medium mb-2">No portfolio items yet</h3>
          <p className="text-gray-500 mb-4">Add projects to your portfolio to showcase your work</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolioItems.map((item) => (
            <PortfolioItemCard 
              key={item.id}
              item={item}
              onEdit={() => handleEditItem(item)}
              onDelete={() => handleDeleteItem(item.id)}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default PortfolioManager;
