import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const StatsCard = ({ title, value, icon: Icon, color, index, trend }) => {
  const isPositive = trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.1,
        type: 'spring',
        stiffness: 200,
        damping: 20
      }}
      whileHover={{ 
        y: -5,
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 relative group">
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br opacity-5"
          style={{
            background: `linear-gradient(135deg, ${color === 'bg-blue-500' ? '#3b82f6' : color === 'bg-green-500' ? '#10b981' : color === 'bg-red-500' ? '#ef4444' : '#a855f7'} 0%, transparent 100%)`
          }}
          animate={{
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Shimmer Effect on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="shimmer absolute inset-0" />
        </div>

        <CardContent className="p-6 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {title}
              </p>
              <motion.h3 
                className="text-3xl font-bold mt-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                {value}
              </motion.h3>
              
              {trend !== undefined && (
                <motion.div 
                  className={cn(
                    'flex items-center gap-1 text-sm mt-2 font-medium',
                    isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {isPositive ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{Math.abs(trend)}% from last month</span>
                </motion.div>
              )}
            </div>
            
            <motion.div 
              className={cn(
                'p-3 rounded-xl shadow-lg relative overflow-hidden',
                color
              )}
              whileHover={{ 
                rotate: [0, -10, 10, -10, 0],
                scale: 1.1
              }}
              transition={{ duration: 0.5 }}
            >
              {/* Icon Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-white opacity-0"
                animate={{
                  opacity: [0, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <Icon className="w-6 h-6 text-white relative z-10" />
            </motion.div>
          </div>
        </CardContent>

        {/* Bottom Accent Line */}
        <motion.div
          className={cn('h-1', color)}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
        />
      </Card>
    </motion.div>
  );
};

export default StatsCard;
