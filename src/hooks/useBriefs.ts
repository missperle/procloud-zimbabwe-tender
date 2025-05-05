
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface BriefData {
  title: string;
  original_description: string;
  budget: string;
  deadline: string;
  category: string;
  attachment_url?: string;
}

export interface ProposalData {
  brief_id: string;
  content: string;
  price: string;
  timeline: string;
}

export function useBriefs() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { currentUser } = useAuth();
  
  // Client submits a new brief
  const submitBrief = async (briefData: BriefData) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to submit a brief.",
        variant: "destructive",
      });
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('client_briefs')
        .insert([
          {
            ...briefData,
            client_id: currentUser.id,
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
  
  // Update an existing brief
  const updateBrief = async (briefId: string, briefData: Partial<BriefData>) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to update a brief.",
        variant: "destructive",
      });
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Convert deadline to ISO string if it exists in the data
      const formattedData = briefData.deadline
        ? { ...briefData, deadline: new Date(briefData.deadline).toISOString() }
        : briefData;
        
      const { data, error } = await supabase
        .from('client_briefs')
        .update(formattedData)
        .eq('id', briefId)
        .eq('client_id', currentUser.id) // Ensure user can only update their own briefs
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Brief updated successfully",
        description: "Your brief has been updated and sent for review.",
      });
      
      return data;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update brief";
      setError(errorMessage);
      toast({
        title: "Error updating brief",
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
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to submit a proposal.",
        variant: "destructive",
      });
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('proposals')
        .insert([
          {
            ...proposalData,
            freelancer_id: currentUser.id,
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
    if (!currentUser) {
      return [];
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('client_briefs')
        .select('*')
        .eq('client_id', currentUser.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch briefs";
      setError(errorMessage);
      toast({
        title: "Error fetching briefs",
        description: errorMessage,
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Get a specific brief by ID
  const getBriefById = async (briefId: string) => {
    if (!currentUser) {
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('client_briefs')
        .select('*')
        .eq('id', briefId)
        .maybeSingle();
        
      if (error) throw error;
      
      return data;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch brief";
      setError(errorMessage);
      return null;
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
    if (!currentUser) {
      return [];
    }
    
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
        .eq('freelancer_id', currentUser.id)
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
    updateBrief,
    submitProposal,
    getClientBriefs,
    getBriefById,
    getPublishedBriefs,
    getFreelancerProposals,
    loading,
    error,
  };
}
