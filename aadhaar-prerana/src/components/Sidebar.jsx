import { motion } from 'framer-motion';
import {
    Home,
    MapPin,
    ShieldAlert,
    Users,
    BarChart3,
    Settings,
    FileText,
    HelpCircle
} from 'lucide-react';

const navItems = [
    { id: 'home', icon: Home, label: 'Dashboard', active: true },
    { id: 'migration', icon: MapPin, label: 'Migration Radar', badge: '3' },
    { id: 'fraud', icon: ShieldAlert, label: 'Fraud Detection', badge: '!' },
    { id: 'exclusion', icon: Users, label: 'Exclusion Map' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
];

const bottomNavItems = [
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'help', icon: HelpCircle, label: 'Help' },
];

export default function Sidebar({ activeTab, setActiveTab }) {
    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-64 bg-uidai-navy min-h-screen flex flex-col"
        >
            {/* Ministry Badge */}
            <div className="px-4 py-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center">
                        <span className="text-white text-lg">🏛️</span>
                    </div>
                    <div>
                        <p className="text-white/90 text-sm font-semibold">PMO Dashboard</p>
                        <p className="text-white/50 text-xs">Restricted Access</p>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 py-4">
                <p className="px-3 text-[10px] uppercase tracking-widest text-white/40 mb-3 font-medium">
                    Main Menu
                </p>
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                                            ? 'bg-white/15 text-white'
                                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <Icon size={18} className={isActive ? 'text-uidai-saffron' : ''} />
                                    <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                                    {item.badge && (
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badge === '!'
                                                ? 'bg-red-500 text-white animate-pulse'
                                                : 'bg-uidai-saffron text-white'
                                            }`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>

                {/* Alert Box */}
                <div className="mt-6 mx-1 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <div className="flex items-start gap-2">
                        <ShieldAlert size={16} className="text-red-400 mt-0.5" />
                        <div>
                            <p className="text-xs font-semibold text-red-300">Active Alert</p>
                            <p className="text-[10px] text-red-200/80 mt-1">
                                Anomaly detected in Surat region. Review required.
                            </p>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Bottom Navigation */}
            <div className="px-3 py-4 border-t border-white/10">
                <ul className="space-y-1">
                    {bottomNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.id}>
                                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200">
                                    <Icon size={16} />
                                    <span className="text-sm">{item.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* User Info */}
            <div className="px-4 py-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-uidai-saffron to-uidai-green flex items-center justify-center">
                        <span className="text-white text-sm font-bold">PS</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">Principal Secretary</p>
                        <p className="text-white/50 text-xs truncate">UIDAI Central</p>
                    </div>
                </div>
            </div>
        </motion.aside>
    );
}
