import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-gray-200 rounded-lg shimmer" />
        <div className="h-4 w-64 bg-gray-200 rounded shimmer" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 w-24 bg-gray-200 rounded shimmer" />
                  <div className="h-8 w-32 bg-gray-200 rounded shimmer" />
                  <div className="h-3 w-40 bg-gray-200 rounded shimmer" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-6 w-32 bg-gray-200 rounded shimmer mb-4" />
              <div className="h-64 bg-gray-200 rounded shimmer" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const ClientListSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-gray-200 rounded shimmer" />
          <div className="h-4 w-48 bg-gray-200 rounded shimmer" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded shimmer" />
      </div>

      <div className="flex gap-4">
        <div className="flex-1 h-10 bg-gray-200 rounded shimmer" />
        <div className="w-40 h-10 bg-gray-200 rounded shimmer" />
        <div className="w-40 h-10 bg-gray-200 rounded shimmer" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full shimmer" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded shimmer" />
                      <div className="h-3 w-20 bg-gray-200 rounded shimmer" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-200 rounded shimmer" />
                    <div className="h-3 w-full bg-gray-200 rounded shimmer" />
                    <div className="h-3 w-3/4 bg-gray-200 rounded shimmer" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
