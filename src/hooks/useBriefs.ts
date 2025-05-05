
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BriefData {
  title: string;
  original_description: string;
  budget: string;
  deadline: string;
  category: string;
  attachment_url?: string;
}

interface ProposalData {
  brief_id: string;
  content: string;
  price: string;
  timeline: string;
}

export function useBriefs() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Client submits a new brief
  const submitBrief = async (briefData: BriefData) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('client_briefs')
        .insert([
          {
            ...briefData,
            deadline: new Date(briefData.deadline).toISOString(),
            status: 'draft'
          }
        ])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Brief submitted successfully",
        description: "Your brief has been sent to Proverb Digital for review.",
      });
      
      return data;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to submit brief";
      setError(errorMessage);
      toast({
        title: "Error submitting brief",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Freelancer submits a proposal for a brief
  const submitProposal = async (proposalData: ProposalData) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('proposals')
        .insert([
          {
            ...proposalData,
            status: 'submitted'
          }
        ])
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Proposal submitted successfully",
        description: "Your proposal has been sent to Proverb Digital for review.",
      });
      
      return data;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to submit proposal";
      setError(errorMessage);
      toast({
        title: "Error submitting proposal",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Get client's briefs
  const getClientBriefs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('client_briefs')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch briefs";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Get published briefs for freelancers
  const getPublishedBriefs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('client_briefs')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch published briefs";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Get freelancer's proposals
  const getFreelancerProposals = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select(`
          *,
          client_briefs (
            title,
            anonymous_description,
            budget,
            deadline,
            category
          )
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch proposals";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    submitBrief,
    submitProposal,
    getClientBriefs,
    getPublishedBriefs,
    getFreelancerProposals,
    loading,
    error,
  };
}
