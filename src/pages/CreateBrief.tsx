
import React from 'react';
import Layout from "@/components/layout/Layout";
import BriefWizard from '@/components/client/brief/BriefWizard';
import { Separator } from '@/components/ui/separator';

const CreateBrief = () => {
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
