import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, UserX, Dumbbell, LogOut, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const { logout, admin } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'from-blue-500 to-blue-600' },
    { to: '/clients', icon: Users, label: 'Clients', color: 'from-green-500 to-green-600' },
    { to: '/expired', icon: UserX, label: 'Expired Clients', color: 'from-red-500 to-red-600' },
  ];

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 flex flex-col shadow-2xl"
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-700/50 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />
        <div className="flex items-center gap-3 relative z-10">
          <motion.div 
            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Dumbbell className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h2 className="font-bold text-lg text-white">Gym Manager</h2>
            <div className="flex items-center gap-1 text-xs text-blue-400">
              <TrendingUp className="w-3 h-3" />
              <span>Pro Edition</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, index) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-5 h-5 relative z-10" />
                </motion.div>
                <span className="font-medium relative z-10">{item.label}</span>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-auto"
                  >
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </motion.div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-700/50">
        <motion.div 
          className="mb-4 p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 relative overflow-hidden group"
          whileHover={{ scale: 1.02 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/10 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {admin?.full_name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{admin?.full_name}</p>
              <p className="text-xs text-gray-400 truncate">{admin?.email}</p>
            </div>
          </div>
        </motion.div>
        
        <Button
          onClick={logout}
          variant="outline"
          className="w-full justify-start border-slate-700 text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500 transition-all group"
        >
          <LogOut className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
          Logout
        </Button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
