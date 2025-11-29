import { motion } from 'framer-motion';
import { Edit, Trash2, DollarSign, Calendar, Phone, Mail, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, getDaysRemaining } from '@/lib/utils';

const ClientCard = ({ client, onEdit, onDelete, index, viewMode = 'grid' }) => {
  const daysRemaining = getDaysRemaining(client.end_date);
  const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
        whileHover={{ scale: 1.01, x: 5 }}
      >
        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <motion.div
                className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {client.full_name.charAt(0).toUpperCase()}
              </motion.div>

              {/* Name and Status */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {client.full_name}
                </h3>
                <Badge 
                  variant={client.status === 'Active' ? 'success' : 'destructive'} 
                  className="text-xs"
                >
                  {client.status}
                </Badge>
              </div>

              {/* Contact Info */}
              <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="truncate max-w-[200px]">{client.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-500" />
                  <span>{client.phone}</span>
                </div>
              </div>

              {/* Plan Info */}
              <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-purple-600 bg-purple-50 px-4 py-2 rounded-lg">
                <DollarSign className="w-4 h-4" />
                <span>{client.plan_type} - {formatCurrency(client.plan_amount)}</span>
              </div>

              {/* Status Indicator */}
              {client.status === 'Active' && (
                <div className={`hidden xl:flex items-center gap-2 text-sm px-4 py-2 rounded-lg ${
                  isExpiringSoon 
                    ? 'bg-yellow-50 text-yellow-700' 
                    : 'bg-blue-50 text-blue-700'
                }`}>
                  <Calendar className="w-4 h-4" />
                  <span>
                    {daysRemaining > 0
                      ? `${daysRemaining}d left`
                      : 'Expires today'}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => onEdit(client)}
                    className="hover:bg-blue-100 hover:text-blue-600"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => onDelete(client.id)}
                    className="hover:bg-red-100 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Grid View (existing code)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <Card className="hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden relative group">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Status Indicator */}
        <motion.div
          className={`absolute top-0 right-0 w-32 h-32 blur-3xl -z-0 ${
            client.status === 'Active' ? 'bg-green-200' : 'bg-red-200'
          }`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />

        <CardContent className="p-6 relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {client.full_name.charAt(0).toUpperCase()}
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {client.full_name}
                  </h3>
                  <Badge 
                    variant={client.status === 'Active' ? 'success' : 'destructive'} 
                    className="text-xs"
                  >
                    {client.status}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => onEdit(client)}
                  className="hover:bg-blue-100 hover:text-blue-600"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => onDelete(client.id)}
                  className="hover:bg-red-100 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <motion.div 
              className="flex items-center gap-2 text-sm text-gray-600 group/item"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Mail className="w-4 h-4 text-blue-500 group-hover/item:scale-110 transition-transform" />
              <span className="truncate">{client.email}</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2 text-sm text-gray-600 group/item"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Phone className="w-4 h-4 text-green-500 group-hover/item:scale-110 transition-transform" />
              <span>{client.phone}</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2 text-sm text-gray-600 group/item"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <DollarSign className="w-4 h-4 text-purple-500 group-hover/item:scale-110 transition-transform" />
              <span className="font-medium">
                {client.plan_type} - {formatCurrency(client.plan_amount)}
              </span>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2 text-sm text-gray-600 group/item"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Calendar className="w-4 h-4 text-orange-500 group-hover/item:scale-110 transition-transform" />
              <span>{formatDate(client.start_date)} - {formatDate(client.end_date)}</span>
            </motion.div>

            {client.address && (
              <motion.div 
                className="flex items-center gap-2 text-sm text-gray-600 group/item"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <MapPin className="w-4 h-4 text-red-500 group-hover/item:scale-110 transition-transform" />
                <span className="truncate">{client.address}</span>
              </motion.div>
            )}
          </div>

          {/* Status Banner */}
          {client.status === 'Active' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-lg ${
                isExpiringSoon 
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' 
                  : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
              }`}
            >
              <p className={`text-sm font-medium ${
                isExpiringSoon ? 'text-orange-700' : 'text-blue-700'
              }`}>
                {daysRemaining > 0
                  ? `⏰ ${daysRemaining} days remaining`
                  : daysRemaining === 0
                  ? '⚠️ Expires today'
                  : '❌ Expired'}
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClientCard;
