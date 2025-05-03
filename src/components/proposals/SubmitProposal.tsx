
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface SubmitProposalProps {
  jobTitle: string;
  jobId: string;
}

interface ProposalFormValues {
  proposal: string;
}

const SubmitProposal = ({ jobTitle, jobId }: SubmitProposalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bulletPoints, setBulletPoints] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const form = useForm<ProposalFormValues>({
    defaultValues: {
      proposal: "",
    },
  });

  const onSubmit = async (data: ProposalFormValues) => {
    try {
      // Here you would add the code to submit the proposal to your backend
      // For example: await addDoc(collection(db, "proposals"), { 
      //   jobId, 
      //   proposal: data.proposal,
      //   userId: auth.currentUser.uid,
      //   createdAt: serverTimestamp()
      // });
      
      toast({
        title: "Proposal submitted",
        description: "Your proposal has been successfully submitted.",
      });
      
      // Reset form after submission
      form.reset();
    } catch (error) {
      console.error("Error submitting proposal:", error);
      toast({
        title: "Submission failed",
        description: "Failed to submit your proposal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const generateProposal = async () => {
    if (!bulletPoints.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter at least one bullet point.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const functions = getFunctions();
      const draftFn = httpsCallable(functions, 'draftProposal');
      
      const bullets = bulletPoints
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      const { data } = await draftFn({ bullets, jobTitle }) as { data: { proposal: string } };
      
      // Update form value with the generated proposal
      form.setValue("proposal", data.proposal);
      
      // Close modal
      setIsModalOpen(false);
      setBulletPoints("");
      
      toast({
        title: "Proposal drafted",
        description: "Your proposal has been generated. Feel free to edit it before submitting.",
      });
    } catch (error) {
      console.error("Error generating proposal:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate proposal. Please try again or write it manually.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Submit Your Proposal</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="proposal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Proposal</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your proposal here..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(true)}
            >
              Help me draft
            </Button>
            <Button type="submit">Submit Proposal</Button>
          </CardFooter>
        </form>
      </Form>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isGenerating ? "Generating draft..." : "Enter bullet points"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="List your key points, one per line..."
              className="min-h-[150px]"
              value={bulletPoints}
              onChange={(e) => setBulletPoints(e.target.value)}
              disabled={isGenerating}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              onClick={generateProposal}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Proposal"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default SubmitProposal;
