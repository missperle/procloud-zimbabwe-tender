
import { useState, useEffect } from "react";
import { 
  Card, CardContent, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import {
  doc, updateDoc, addDoc, collection, query, where, orderBy,
  getDocs, onSnapshot, serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// Define type for brief items
interface BriefItem {
  id: string;
  title: string;
  originalText: string;
  reviewText?: string;
  status: "new" | "in_review" | "published" | "assigned";
  clientId: string;
  createdAt: any; // Firestore timestamp
}

const ReviewQueue = () => {
  const [briefs, setBriefs] = useState<BriefItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrief, setSelectedBrief] = useState<BriefItem | null>(null);
  const [editedText, setEditedText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch briefs that need review
  useEffect(() => {
    const fetchBriefs = async () => {
      try {
        // Try to create sample briefs for testing if none exist
        await createSampleBriefsIfNeeded();
        
        const briefsRef = collection(db, "briefs");
        
        // Query for new briefs
        const briefsQuery = query(
          briefsRef,
          where("status", "==", "new"),
          orderBy("createdAt", "desc")
        );
        
        // Set up real-time listener
        const unsubscribe = onSnapshot(briefsQuery, (snapshot) => {
          const briefsData: BriefItem[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data() as Omit<BriefItem, "id">;
            briefsData.push({
              id: doc.id,
              ...data
            });
          });
          setBriefs(briefsData);
          setLoading(false);
        }, (error) => {
          console.error("Error fetching briefs:", error);
          toast({
            title: "Error",
            description: "Failed to load briefs for review",
            variant: "destructive"
          });
          setLoading(false);
        });
        
        // Clean up listener on component unmount
        return () => unsubscribe();
      } catch (error) {
        console.error("Error setting up briefs listener:", error);
        setLoading(false);
      }
    };

    fetchBriefs();
  }, []);

  // Create sample briefs if none exist
  const createSampleBriefsIfNeeded = async () => {
    try {
      const briefsRef = collection(db, "briefs");
      const snapshot = await getDocs(query(briefsRef, where("status", "==", "new")));
      
      // If no briefs exist, create sample ones
      if (snapshot.empty) {
        console.log("No briefs found, creating sample data");
        
        const sampleBriefs = [
          {
            title: "Website Redesign for Clothing Brand",
            originalText: "We need a complete overhaul of our e-commerce website to improve user experience and conversion rates. The current site is outdated and difficult to navigate on mobile devices.",
            status: "new",
            clientId: "sample-client-1",
            createdAt: serverTimestamp()
          },
          {
            title: "Marketing Campaign for Product Launch",
            originalText: "We're launching a new health supplement next month and need a comprehensive digital marketing strategy. We need help with social media content, email campaigns, and paid advertising.",
            status: "new",
            clientId: "sample-client-2",
            createdAt: serverTimestamp()
          },
          {
            title: "Logo Design for Tech Startup",
            originalText: "Our AI startup needs a modern, minimalist logo that conveys innovation and reliability. We prefer blue and gray color schemes and want something that works well on both light and dark backgrounds.",
            status: "new",
            clientId: "sample-client-3",
            createdAt: serverTimestamp()
          }
        ];
        
        // Add sample briefs to Firestore
        for (const brief of sampleBriefs) {
          await addDoc(briefsRef, brief);
        }
        
        console.log("Sample briefs created successfully");
      }
    } catch (error) {
      console.error("Error creating sample briefs:", error);
    }
  };

  // Handle brief selection for editing
  const handleSelectBrief = (brief: BriefItem) => {
    setSelectedBrief(brief);
    setEditedText(brief.reviewText || brief.originalText);
    setDialogOpen(true);
  };

  // Handle publishing the edited brief
  const handlePublishBrief = async () => {
    if (!selectedBrief || !editedText.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const briefRef = doc(db, "briefs", selectedBrief.id);
      
      // Update the brief with reviewed text and new status
      await updateDoc(briefRef, {
        reviewText: editedText,
        status: "published",
        publishedAt: serverTimestamp()
      });
      
      toast({
        title: "Success",
        description: "Brief has been reviewed and published",
      });
      
      // Close the dialog
      setDialogOpen(false);
      setSelectedBrief(null);
    } catch (error) {
      console.error("Error publishing brief:", error);
      toast({
        title: "Error",
        description: "Failed to publish the brief",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mark brief as "in review" when opened for editing
  const handleStartReview = async (briefId: string) => {
    try {
      const briefRef = doc(db, "briefs", briefId);
      
      await updateDoc(briefRef, {
        status: "in_review",
        reviewStartedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error marking brief as in review:", error);
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : briefs.length === 0 ? (
        <Card>
          <CardContent className="flex justify-center items-center p-12">
            <p className="text-muted-foreground">No briefs waiting for review</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {briefs.map((brief) => (
            <Card key={brief.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{brief.title}</CardTitle>
                  <Badge variant="outline">{brief.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {brief.originalText}
                </p>
              </CardContent>
              <CardFooter>
                <Dialog open={dialogOpen && selectedBrief?.id === brief.id} onOpenChange={(open) => {
                  if (!open) setDialogOpen(false);
                }}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        handleSelectBrief(brief);
                        handleStartReview(brief.id);
                      }}
                    >
                      Rewrite & Publish
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Review & Edit Brief</DialogTitle>
                      <DialogDescription>
                        Edit the brief to remove sensitive information and prepare it for publication.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        placeholder="Edit the brief text..."
                        className="min-h-[200px]"
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handlePublishBrief}
                        disabled={isSubmitting || !editedText.trim()}
                      >
                        {isSubmitting ? "Publishing..." : "Publish to Freelancers"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewQueue;
