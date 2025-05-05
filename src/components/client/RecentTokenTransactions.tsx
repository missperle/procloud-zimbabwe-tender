import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, ArrowDown, ArrowUp, Calendar } from "lucide-react";

// Define transaction types
type TransactionType = "purchase" | "usage" | "refund" | "admin";
type TransactionStatus = "completed" | "pending" | "failed";

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: Date;
  description: string;
  status: TransactionStatus;
  paymentMethod?: string;
}

// Helper function to format dates nicely
const formatDate = (date: Date): string => {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Helper function to get badge variant based on transaction type
const getTransactionBadge = (type: TransactionType, status: TransactionStatus) => {
  if (status === "failed") return "destructive";
  if (status === "pending") return "outline";
  
  switch (type) {
    case "purchase":
      return "default";
    case "usage":
      return "secondary";
    case "refund":
      return "secondary";
    case "admin":
      return "outline";
    default:
      return "default";
  }
};

// Helper to get icon based on transaction type
const TransactionIcon = ({ type }: { type: TransactionType }) => {
  switch (type) {
    case "purchase":
      return <ArrowUp className="h-4 w-4" />;
    case "usage":
      return <ArrowDown className="h-4 w-4" />;
    case "refund":
      return <Coins className="h-4 w-4" />;
    case "admin":
      return <Calendar className="h-4 w-4" />;
    default:
      return null;
  }
};

// Sample data - in a real app this would come from an API or Firestore
const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: "tx1",
    type: "purchase",
    amount: 100,
    date: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    description: "Purchased standard token bundle",
    status: "completed",
    paymentMethod: "EcoCash"
  },
  {
    id: "tx2",
    type: "usage",
    amount: -10,
    date: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    description: "Created job posting: Website Redesign",
    status: "completed"
  },
  {
    id: "tx3",
    type: "purchase",
    amount: 250,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    description: "Purchased premium token bundle",
    status: "completed",
    paymentMethod: "Mukuru"
  },
  {
    id: "tx4",
    type: "usage",
    amount: -25,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    description: "Featured job posting: Mobile App Developer",
    status: "completed"
  },
  {
    id: "tx5",
    type: "purchase",
    amount: 100,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    description: "Purchased standard token bundle",
    status: "pending",
    paymentMethod: "InnBucks"
  }
];

interface RecentTokenTransactionsProps {
  transactions?: Transaction[];
  limit?: number;
}

const RecentTokenTransactions = ({ 
  transactions = SAMPLE_TRANSACTIONS,
  limit = 5 
}: RecentTokenTransactionsProps) => {
  const [visibleTransactions, setVisibleTransactions] = useState(transactions.slice(0, limit));
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {visibleTransactions.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No recent transactions</p>
          ) : (
            visibleTransactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-start justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-start space-x-3">
                  <div className={`mt-1 rounded-full p-1.5 ${
                    transaction.type === "usage" 
                      ? "bg-amber-100 text-amber-700" 
                      : "bg-green-100 text-green-700"
                  }`}>
                    <TransactionIcon type={transaction.type} />
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm">
                      {transaction.description}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <span>{formatDate(transaction.date)}</span>
                      {transaction.paymentMethod && (
                        <span className="flex items-center">
                          <span className="mx-1.5">•</span>
                          {transaction.paymentMethod}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`font-medium ${
                    transaction.amount > 0 
                      ? "text-green-600"
                      : "text-amber-600"
                  }`}>
                    {transaction.amount > 0 ? "+" : ""}{transaction.amount}
                  </div>
                  <Badge 
                    variant={getTransactionBadge(transaction.type, transaction.status)} 
                    className="mt-1 text-[10px] h-5"
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTokenTransactions;
