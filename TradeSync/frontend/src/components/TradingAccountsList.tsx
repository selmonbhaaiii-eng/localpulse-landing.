import { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TradingAccount, getTradingAccounts, deleteTradingAccount } from "@/api/tradingAccounts";
import { AddTradingAccountForm } from "./AddTradingAccountForm";
import api from "@/api/axios";

export function TradingAccountsList() {
  const [accounts, setAccounts] = useState<TradingAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await getTradingAccounts();
      setAccounts(data);
    } catch (error) {
      console.error("Failed to fetch accounts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this trading account?")) {
      try {
        await deleteTradingAccount(id);
        fetchAccounts();
      } catch (error) {
        console.error("Failed to delete account", error);
        alert("Failed to delete account.");
      }
    }
  };

  const handleConnect = async (accountId: string) => {
    try {
      // Step 2.2: Redirect to the backend OAuth connect endpoint
      const response = await api.get(`/api/v1/trading-accounts/${accountId}/oauth/connect`);
      if (response.data && response.data.authorization_url) {
        window.location.href = response.data.authorization_url;
      } else {
        alert("Failed to get authorization URL.");
      }
    } catch (error) {
      console.error("Failed to connect account", error);
      alert("Failed to initiate connection. Make sure API keys are configured.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONNECTED":
        return <Badge className="bg-green-500 hover:bg-green-600">Connected</Badge>;
      case "TOKEN_EXPIRED":
        return <Badge variant="destructive">Expired</Badge>;
      case "NOT_CONNECTED":
      default:
        return <Badge variant="secondary">Not Connected</Badge>;
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Trading Accounts</CardTitle>
          <CardDescription>Manage your connected broker accounts.</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Account</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Trading Account</DialogTitle>
            </DialogHeader>
            <AddTradingAccountForm 
              onSuccess={() => {
                setIsAddDialogOpen(false);
                fetchAccounts();
              }}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">Loading accounts...</div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border rounded-md border-dashed">
            No trading accounts found. Add one to get started!
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Broker</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Added On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.broker}</TableCell>
                  <TableCell>{account.account_name}</TableCell>
                  <TableCell>{getStatusBadge(account.status)}</TableCell>
                  <TableCell>{new Date(account.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {account.status !== "CONNECTED" && (
                      <Button size="sm" onClick={() => handleConnect(account.id)}>
                        {account.status === "TOKEN_EXPIRED" ? "Reconnect" : "Connect"}
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(account.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
