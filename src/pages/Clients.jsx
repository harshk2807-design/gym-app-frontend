import { useEffect, useState } from 'react';
import { Plus, Filter, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ClientList from '@/components/clients/ClientList';
import ClientForm from '@/components/clients/ClientForm';
import { ClientListSkeleton } from '@/components/LoadingSkeleton';
import EmptyState from '@/components/EmptyState';
import { clientService } from '@/services/clients';
import { toast } from '@/hooks/useToast';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientService.getAll();
      setClients(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch clients',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedClient(null);
    setFormOpen(true);
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this client?')) return;

    try {
      await clientService.delete(id);
      toast({
        title: 'Success',
        description: 'Client deleted successfully',
      });
      fetchClients();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete client',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (selectedClient) {
        await clientService.update(selectedClient.id, formData);
        toast({
          title: 'Success',
          description: 'Client updated successfully',
        });
      } else {
        await clientService.create(formData);
        toast({
          title: 'Success',
          description: 'Client added successfully',
        });
      }
      setFormOpen(false);
      fetchClients();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Operation failed',
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleExport = () => {
    try {
      // Generate CSV
      let csv = 'Name,Email,Phone,Age,Gender,Plan Type,Amount,Start Date,End Date,Status\n';
      clients.forEach(client => {
        csv += `"${client.full_name}","${client.email}","${client.phone}",${client.age},"${client.gender}","${client.plan_type}",${client.plan_amount},"${client.start_date}","${client.end_date}","${client.status}"\n`;
      });

      // Download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `clients-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      toast({
        title: 'Success',
        description: 'Clients exported successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export clients',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <ClientListSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Clients
          </h1>
          <p className="text-gray-600 mt-2 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">
              {clients.length}
            </span>
            Manage your gym members
          </p>
        </div>
        
        <div className="flex gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={handleExport} 
              variant="outline"
              className="shadow-lg border-2"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={handleAdd}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Active</p>
              <p className="text-2xl font-bold text-green-700">
                {clients.filter(c => c.status === 'Active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✓
              </motion.div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Expired</p>
              <p className="text-2xl font-bold text-red-700">
                {clients.filter(c => c.status === 'Expired').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⚠️
              </motion.div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total</p>
              <p className="text-2xl font-bold text-blue-700">{clients.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                👥
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Client List or Empty State */}
      <AnimatePresence mode="wait">
        {clients.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <EmptyState
              title="No Clients Yet"
              description="Start building your gym community by adding your first client. Track memberships, payments, and grow your business!"
              action={handleAdd}
              actionLabel="Add First Client"
              icon={Plus}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ClientList 
              clients={clients} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Client Form Modal */}
      <ClientForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        client={selectedClient}
        loading={formLoading}
      />
    </div>
  );
};

export default Clients;
