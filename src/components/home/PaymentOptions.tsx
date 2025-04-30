
import { Badge } from "@/components/ui/badge";
import { Shield, DollarSign, Banknote } from "lucide-react";

const PaymentOptions = () => {
  return (
    <section className="py-20 bg-procloud-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="mb-4">Safe & Secure Payments</h2>
          <p className="text-lg text-procloud-gray-600 max-w-2xl mx-auto">
            proCLOUD offers multiple payment options with escrow protection for both freelancers and businesses.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-procloud-green/10 p-3 rounded-full">
                  <Shield className="w-6 h-6 text-procloud-green" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Escrow Protection</h3>
                  <p className="text-procloud-gray-600">Funds are held securely until work is approved</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-procloud-green/10 p-3 rounded-full">
                  <DollarSign className="w-6 h-6 text-procloud-green" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">USD Payments</h3>
                  <p className="text-procloud-gray-600">Cash-out options in USD for freelancers</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-procloud-green/10 p-3 rounded-full">
                  <Banknote className="w-6 h-6 text-procloud-green" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Local Options</h3>
                  <p className="text-procloud-gray-600">Support for Ecocash and ZIPIT payments</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-procloud-black text-white p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-6">Supported Payment Methods</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-procloud-gray-700 p-4 rounded-lg text-center hover:border-procloud-green transition-colors">
                <div className="font-bold mb-2">Ecocash</div>
                <Badge variant="outline" className="bg-procloud-green/20 text-white border-procloud-green/50">
                  Mobile Money
                </Badge>
              </div>
              <div className="border border-procloud-gray-700 p-4 rounded-lg text-center hover:border-procloud-green transition-colors">
                <div className="font-bold mb-2">ZIPIT</div>
                <Badge variant="outline" className="bg-procloud-green/20 text-white border-procloud-green/50">
                  Bank Transfer
                </Badge>
              </div>
              <div className="border border-procloud-gray-700 p-4 rounded-lg text-center hover:border-procloud-green transition-colors">
                <div className="font-bold mb-2">USD Cash</div>
                <Badge variant="outline" className="bg-procloud-green/20 text-white border-procloud-green/50">
                  Physical Pickup
                </Badge>
              </div>
              <div className="border border-procloud-gray-700 p-4 rounded-lg text-center hover:border-procloud-green transition-colors">
                <div className="font-bold mb-2">USD Bank</div>
                <Badge variant="outline" className="bg-procloud-green/20 text-white border-procloud-green/50">
                  FCA Account
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentOptions;
