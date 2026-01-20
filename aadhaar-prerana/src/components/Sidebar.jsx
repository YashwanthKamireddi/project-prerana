import {
    Home,
    MapPin,
    ShieldAlert,
    Users,
    BarChart3,
    Settings,
    FileText,
    HelpCircle,
    AlertTriangle
} from 'lucide-react';

const navItems = [
    { id: 'home', icon: Home, label: 'Dashboard', active: true },
    { id: 'migration', icon: MapPin, label: 'Migration Radar', badge: 3 },
    { id: 'fraud', icon: ShieldAlert, label: 'Fraud Detection', alert: true },
    { id: 'exclusion', icon: Users, label: 'Exclusion Map' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
];

const bottomNav = [
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'help', icon: HelpCircle, label: 'Help' },
];

export default function Sidebar({ activeTab, setActiveTab }) {
    return (
        <aside className="w-60 bg-slate-800 min-h-screen flex flex-col">
            {/* Ministry Badge */}
            <div className="px-4 py-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-slate-700 flex items-center justify-center text-lg">
                        🏛️
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">PMO Dashboard</p>
                        <p className="text-xs text-slate-400">Restricted Access</p>
                    </div>
                </div>
            </div>

            {/* Main Nav */}
            <nav className="flex-1 px-3 py-4">
                <p className="px-3 text-[10px] uppercase tracking-wider text-slate-500 mb-2">
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
                                    className={`nav-item w-full ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
                                >
                                    <Icon size={18} />
                                    <span className="flex-1 text-left">{item.label}</span>
                                    {item.badge && (
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-orange-500 text-white">
                                            {item.badge}
                                        </span>
                                    )}
                                    {item.alert && (
                                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>

                {/* Alert Box */}
                <div className="mt-4 mx-1 p-3 bg-red-900/30 border border-red-800/50 rounded-lg">
                    <div className="flex items-start gap-2">
                        <AlertTriangle size={14} className="text-red-400 mt-0.5" />
                        <div>
                            <p className="text-xs font-medium text-red-300">Active Alert</p>
                            <p className="text-[10px] text-red-400/80 mt-0.5">
                                Anomaly in Surat region
                            </p>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Bottom Nav */}
            <div className="px-3 py-3 border-t border-slate-700">
                <ul className="space-y-1">
                    {bottomNav.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.id}>
                                <button className="nav-item nav-item-inactive w-full">
                                    <Icon size={16} />
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* User */}
            <div className="px-4 py-3 border-t border-slate-700">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">PS</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">Principal Secretary</p>
                        <p className="text-xs text-slate-400 truncate">UIDAI Central</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
