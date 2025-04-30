
import { CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Post Your Brief',
    description: 'Set your budget, deadline, and requirements. No negotiation, just clear expectations.',
    forBusiness: true
  },
  {
    number: '02',
    title: 'Browse Submissions',
    description: 'Review work submitted by verified Zimbabwe-based freelancers.',
    forBusiness: true
  },
  {
    number: '03',
    title: 'Select & Pay',
    description: 'Choose your favorite submission and release payment from secure escrow.',
    forBusiness: true
  },
  {
    number: '04',
    title: 'Browse Opportunities',
    description: 'Find jobs matching your skills with clear, upfront budgets.',
    forFreelancer: true
  },
  {
    number: '05',
    title: 'Submit Your Best Work',
    description: 'Create and submit work that meets the brief requirements.',
    forFreelancer: true
  },
  {
    number: '06',
    title: 'Get Paid Securely',
    description: 'Receive payment directly when your work is selected.',
    forFreelancer: true
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="mb-4">How It Works</h2>
          <p className="text-lg text-procloud-gray-600 max-w-2xl mx-auto">
            Our tender-style platform eliminates bidding wars and frustrating negotiations.
            Set clear expectations and get quality results.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-6 inline-flex items-center">
              <span className="w-8 h-8 rounded-full bg-procloud-green text-white flex items-center justify-center text-sm mr-2">
                <CheckCircle className="w-5 h-5" />
              </span>
              For Businesses
            </h3>
            
            <div className="space-y-6">
              {steps
                .filter(step => step.forBusiness)
                .map((step) => (
                  <div 
                    key={step.number} 
                    className="p-6 border border-procloud-gray-200 rounded-lg hover:border-procloud-green transition-colors"
                  >
                    <div className="flex items-start">
                      <span className="text-procloud-green font-bold text-xl mr-4">{step.number}</span>
                      <div>
                        <h4 className="font-bold text-xl mb-2">{step.title}</h4>
                        <p className="text-procloud-gray-600">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          <div>
            <h3 className="mb-6 inline-flex items-center">
              <span className="w-8 h-8 rounded-full bg-procloud-green text-white flex items-center justify-center text-sm mr-2">
                <CheckCircle className="w-5 h-5" />
              </span>
              For Freelancers
            </h3>
            
            <div className="space-y-6">
              {steps
                .filter(step => step.forFreelancer)
                .map((step) => (
                  <div 
                    key={step.number} 
                    className="p-6 border border-procloud-gray-200 rounded-lg hover:border-procloud-green transition-colors"
                  >
                    <div className="flex items-start">
                      <span className="text-procloud-green font-bold text-xl mr-4">{step.number}</span>
                      <div>
                        <h4 className="font-bold text-xl mb-2">{step.title}</h4>
                        <p className="text-procloud-gray-600">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
