import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { clientService } from '@/services/clients';
import { toast } from '@/hooks/useToast';
import { formatCurrency, formatDate } from '@/lib/utils';

const ExpiredClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renewDialog, setRenewDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [renewData, setRenewData] = useState({
    plan_type: 'Monthly',
    plan_amount: '',
    payment_method: 'Cash',
  });

  useEffect(() => {
    fetchExpiredClients();
  }, []);

  const fetchExpiredClients = async () => {
    try {
      const response = await clientService.getAll({ status: 'Expired' });
      setClients(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch expired clients',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = (client) => {
    setSelectedClient(client);
    setRenewData({
      plan_type: client.plan_type,
      plan_amount: client.plan_amount,
      payment_method: 'Cash',
    });
    setRenewDialog(true);
  };

  const handleRenewSubmit = async () => {
    try {
      await clientService.renewPlan(selectedClient.id, renewData);
      toast({
        title: 'Success',
        description: 'Plan renewed successfully',
      });
      setRenewDialog(false);
      fetchExpiredClients();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to renew plan',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900">Expired Clients</h1>
        <p className="text-gray-600 mt-2">Clients whose membership has expired</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{client.full_name}</h3>
                    <Badge variant="destructive" className="mt-1">
                      Expired
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>{client.email}</p>
                  <p>{client.phone}</p>
                  <p>
                    Plan: {client.plan_type} - {formatCurrency(client.plan_amount)}
                  </p>
                  <p>Expired: {formatDate(client.end_date)}</p>
                </div>

                <Button onClick={() => handleRenew(client)} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Renew Plan
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No expired clients found</p>
        </div>
      )}

      <Dialog open={renewDialog} onOpenChange={setRenewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renew Plan</DialogTitle>
            <DialogDescription>
              Renew membership for {selectedClient?.full_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Plan Type</Label>
              <Select
                value={renewData.plan_type}
                onValueChange={(value) => setRenewData({ ...renewData, plan_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Plan Amount (₹)</Label>
              <Input
                type="number"
                value={renewData.plan_amount}
                onChange={(e) => setRenewData({ ...renewData, plan_amount: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={renewData.payment_method}
                onValueChange={(value) => setRenewData({ ...renewData, payment_method: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRenewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenewSubmit}>Renew Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpiredClientsPage;
