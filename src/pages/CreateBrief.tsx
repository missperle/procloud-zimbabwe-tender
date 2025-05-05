
import React from 'react';
import Layout from "@/components/layout/Layout";
import BriefWizard from '@/components/client/brief/BriefWizard';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CreateBrief = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="p-6 max-w-5xl mx-auto flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <div className="h-8 w-8 border-4 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentUser) {
    return (
      <Layout>
        <div className="p-6 max-w-5xl mx-auto">
          <Card className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
            <p className="text-gray-500 mb-4">
              Please log in to create a brief and start finding creators for your project.
            </p>
            <Link to="/login">
              <Button>
                Log In
              </Button>
            </Link>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Create a New Brief</h1>
        <p className="text-gray-500 mb-4">
          Follow our step-by-step process to create a detailed brief for your project. 
          Our AI assistant will help you create a professional brief that attracts the best creators.
        </p>
        
        <Separator className="my-6" />
        
        <BriefWizard />
      </div>
    </Layout>
  );
};

export default CreateBrief;
