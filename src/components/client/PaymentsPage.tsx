
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";

// Mock payment data
const mockTransactions = [
  {
    id: "t1",
    date: "2025-04-20",
    project: "Logo Design",
    freelancer: "Alex Johnson",
    amount: "$450",
    status: "Released",
  },
  {
    id: "t2",
    date: "2025-04-18",
    project: "Website Redesign",
    freelancer: "Michael Brown",
    amount: "$1,400",
    status: "Pending",
  },
  {
    id: "t3",
    date: "2025-04-15",
    project: "Mobile App UI - Phase 1",
    freelancer: "Emily Wilson",
    amount: "$1,150",
    status: "Pending",
  },
  {
    id: "t4",
    date: "2025-04-10",
    project: "SEO Consulting",
    freelancer: "David Lee",
    amount: "$800",
    status: "Released",
  },
  {
    id: "t5",
    date: "2025-04-05",
    project: "Content Writing",
    freelancer: "Sarah Williams",
    amount: "$350",
    status: "Released",
  },
];

const PaymentsPage = () => {
  const [transactions, setTransactions] = useState(mockTransactions);

  const handleReleasePayment = (id: string) => {
    // In a real app, this would send an API request to release the payment
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === id
          ? { ...transaction, status: "Released" }
          : transaction
      )
    );
  };

  // Calculate total payments
  const totalReleased = transactions
    .filter((t) => t.status === "Released")
    .reduce((sum, t) => sum + parseFloat(t.amount.replace("$", "").replace(",", "")), 0);

  const totalPending = transactions
    .filter((t) => t.status === "Pending")
    .reduce((sum, t) => sum + parseFloat(t.amount.replace("$", "").replace(",", "")), 0);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Payments</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Released
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalReleased.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">${totalPending.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Freelancer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{transaction.project}</TableCell>
                  <TableCell>{transaction.freelancer}</TableCell>
                  <TableCell className="font-medium">{transaction.amount}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        transaction.status === "Released"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {transaction.status === "Pending" && (
                      <Button
                        size="sm"
                        onClick={() => handleReleasePayment(transaction.id)}
                      >
                        Release
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <h3 className="text-lg font-semibold mt-8">Withdrawal Settings</h3>
      <Card>
        <CardContent className="pt-6">
          <form className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <select
                  id="paymentMethod"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="ecocash">EcoCash</option>
                  <option value="zipit">Zipit</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number (for EcoCash/Zipit)</Label>
                <Input id="phoneNumber" placeholder="+263 7X XXX XXXX" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input id="bankName" placeholder="Enter bank name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input id="accountNumber" placeholder="Enter account number" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountName">Account Holder Name</Label>
              <Input id="accountName" placeholder="Enter name on account" />
            </div>
            
            <Button type="submit">Save Payment Details</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsPage;
