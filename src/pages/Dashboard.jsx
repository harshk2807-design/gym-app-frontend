import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, UserX, DollarSign, UserPlus, FileText, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import StatsCard from '@/components/dashboard/StatsCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import ClientsChart from '@/components/dashboard/ClientsChart';
import PlanDistributionChart from '@/components/dashboard/PlanDistributionChart';
import ClientForm from '@/components/clients/ClientForm';
import { DashboardSkeleton } from '@/components/LoadingSkeleton';
import { dashboardService, clientService } from '@/services/clients';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/hooks/useToast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Add New Client
  const handleAddClient = () => {
    setFormOpen(true);
  };

  // Handle View Expired Clients
  const handleViewExpired = () => {
    navigate('/expired');
  };

  // Handle Generate Report
  const handleGenerateReport = async () => {
    try {
      toast({
        title: 'Generating Report',
        description: 'Please wait...',
      });

      // Fetch all clients data
      const { data: clients } = await clientService.getAll();
      
      // Generate CSV
      const csvContent = generateCSVReport(clients, stats);
      
      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `gym-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Success',
        description: 'Report downloaded successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate report',
        variant: 'destructive',
      });
    }
  };

  // Generate CSV Report
  const generateCSVReport = (clients, stats) => {
    let csv = 'Gym Management Report\n';
    csv += `Generated on: ${new Date().toLocaleString()}\n\n`;
    
    // Summary Stats
    csv += 'SUMMARY STATISTICS\n';
    csv += `Total Clients,${stats?.stats.totalClients || 0}\n`;
    csv += `Active Clients,${stats?.stats.activeClients || 0}\n`;
    csv += `Expired Clients,${stats?.stats.expiredClients || 0}\n`;
    csv += `Monthly Revenue,₹${stats?.stats.monthlyRevenue || 0}\n\n`;
    
    // Client Details
    csv += 'CLIENT DETAILS\n';
    csv += 'Name,Email,Phone,Age,Gender,Plan Type,Amount,Start Date,End Date,Status\n';
    
    clients.forEach(client => {
      csv += `"${client.full_name}","${client.email}","${client.phone}",${client.age},"${client.gender}","${client.plan_type}",₹${client.plan_amount},"${client.start_date}","${client.end_date}","${client.status}"\n`;
    });
    
    return csv;
  };

  // Handle Form Submit
  const handleSubmitClient = async (formData) => {
    setFormLoading(true);
    try {
      await clientService.create(formData);
      toast({
        title: 'Success',
        description: 'Client added successfully!',
      });
      setFormOpen(false);
      fetchDashboardData();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add client',
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  const statsCards = [
    {
      title: 'Total Clients',
      value: stats?.stats.totalClients || 0,
      icon: Users,
      color: 'bg-blue-500',
      trend: 12.5,
    },
    {
      title: 'Active Clients',
      value: stats?.stats.activeClients || 0,
      icon: UserCheck,
      color: 'bg-green-500',
      trend: 8.3,
    },
    {
      title: 'Expired Clients',
      value: stats?.stats.expiredClients || 0,
      icon: UserX,
      color: 'bg-red-500',
      trend: -5.2,
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(stats?.stats.monthlyRevenue || 0),
      icon: DollarSign,
      color: 'bg-purple-500',
      trend: 15.8,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Welcome back! Here's what's happening with your gym.
            </p>
          </div>
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <StatsCard key={index} {...card} index={index} />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={stats?.revenueData || []} />
        <ClientsChart data={stats?.clientGrowthData || []} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlanDistributionChart data={stats?.planDistributionData || []} />
        
        {/* Quick Actions Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative overflow-hidden rounded-2xl shadow-2xl"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient" />
          
          {/* Overlay Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="relative z-10 p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Clock className="w-6 h-6" />
              </motion.div>
              <h3 className="text-2xl font-bold">Quick Actions</h3>
            </div>
            
            <div className="space-y-3">
              <motion.button 
                onClick={handleAddClient}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-left transition-all flex items-center gap-4 group border border-white/20"
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">Add New Client</p>
                  <p className="text-sm text-white/80">Register a new member</p>
                </div>
              </motion.button>

              <motion.button 
                onClick={handleViewExpired}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-left transition-all flex items-center gap-4 group border border-white/20"
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserX className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">View Expired Clients</p>
                  <p className="text-sm text-white/80">{stats?.stats.expiredClients || 0} members need renewal</p>
                </div>
              </motion.button>

              <motion.button 
                onClick={handleGenerateReport}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 text-left transition-all flex items-center gap-4 group border border-white/20"
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-lg">Generate Report</p>
                  <p className="text-sm text-white/80">Download CSV report</p>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Floating Orbs */}
          <motion.div
            className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-10 left-10 w-24 h-24 bg-pink-300/10 rounded-full blur-2xl"
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -20, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </div>

      {/* Client Form Modal */}
      <ClientForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmitClient}
        client={null}
        loading={formLoading}
      />
    </div>
  );
};

export default Dashboard;
