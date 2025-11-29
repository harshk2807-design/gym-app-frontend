import { useState } from 'react';
import { Search, SlidersHorizontal, Grid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import ClientCard from './ClientCard';
import EmptyState from '@/components/EmptyState';

const ClientList = ({ clients, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);

  // Filter clients
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.full_name.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase()) ||
      client.phone.includes(search);

    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesPlan = planFilter === 'all' || client.plan_type === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Get filter counts
  const filterCounts = {
    all: clients.length,
    Active: clients.filter(c => c.status === 'Active').length,
    Expired: clients.filter(c => c.status === 'Expired').length,
    Monthly: clients.filter(c => c.plan_type === 'Monthly').length,
    Quarterly: clients.filter(c => c.plan_type === 'Quarterly').length,
    Yearly: clients.filter(c => c.plan_type === 'Yearly').length,
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Search Bar and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <motion.div
              whileFocus={{ scale: 1.02 }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 pr-4 h-12 border-2 focus:border-blue-500 transition-all shadow-sm"
              />
              {search && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Filter Toggle and View Mode */}
          <div className="flex gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className={`h-12 border-2 ${showFilters ? 'bg-blue-50 border-blue-300' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </motion.div>

            {/* View Mode Toggle */}
            <div className="flex border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('grid')}
                className={`p-3 transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
                className={`p-3 transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Filter Dropdowns - Collapsible */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {/* Status Filter */}
                <div className="flex-1">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-12 border-2 shadow-sm">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        All Status ({filterCounts.all})
                      </SelectItem>
                      <SelectItem value="Active">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Active ({filterCounts.Active})
                        </span>
                      </SelectItem>
                      <SelectItem value="Expired">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          Expired ({filterCounts.Expired})
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Plan Filter */}
                <div className="flex-1">
                  <Select value={planFilter} onValueChange={setPlanFilter}>
                    <SelectTrigger className="h-12 border-2 shadow-sm">
                      <SelectValue placeholder="Filter by plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Plans ({filterCounts.all})</SelectItem>
                      <SelectItem value="Monthly">Monthly ({filterCounts.Monthly})</SelectItem>
                      <SelectItem value="Quarterly">Quarterly ({filterCounts.Quarterly})</SelectItem>
                      <SelectItem value="Yearly">Yearly ({filterCounts.Yearly})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                {(statusFilter !== 'all' || planFilter !== 'all' || search) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      className="h-12 border-2 border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setStatusFilter('all');
                        setPlanFilter('all');
                        setSearch('');
                      }}
                    >
                      Clear All
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Filters Display */}
        {(statusFilter !== 'all' || planFilter !== 'all') && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2"
          >
            {statusFilter !== 'all' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                Status: {statusFilter}
                <button
                  onClick={() => setStatusFilter('all')}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  ✕
                </button>
              </motion.div>
            )}
            {planFilter !== 'all' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
              >
                Plan: {planFilter}
                <button
                  onClick={() => setPlanFilter('all')}
                  className="hover:bg-purple-200 rounded-full p-0.5"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Results Count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between text-sm text-gray-600"
      >
        <span>
          Showing <span className="font-bold text-blue-600">{filteredClients.length}</span> of{' '}
          <span className="font-bold">{clients.length}</span> client{clients.length !== 1 ? 's' : ''}
        </span>
        {search && (
          <span className="text-gray-500">
            Searching for: <span className="font-semibold">"{search}"</span>
          </span>
        )}
      </motion.div>

      {/* Client Grid/List */}
      <AnimatePresence mode="wait">
        {filteredClients.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <EmptyState
              title={search ? 'No Results Found' : 'No Clients Match Filters'}
              description={
                search
                  ? `No clients match your search for "${search}". Try adjusting your search terms.`
                  : 'No clients match the selected filters. Try changing your filter criteria.'
              }
              icon={Search}
            />
          </motion.div>
        ) : (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredClients.map((client, index) => (
              <ClientCard
                key={client.id}
                client={client}
                onEdit={onEdit}
                onDelete={onDelete}
                index={index}
                viewMode={viewMode}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination Info (if needed in future) */}
      {filteredClients.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center pt-4"
        >
          <div className="text-sm text-gray-500">
            {filteredClients.length === 1 ? '1 client' : `${filteredClients.length} clients`} displayed
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ClientList;
