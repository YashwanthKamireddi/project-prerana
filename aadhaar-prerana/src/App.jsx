import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    TrendingUp,
    Users,
    AlertTriangle,
    Clock,
    CheckCircle2
} from 'lucide-react';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MobilityMatrix from './components/MobilityMatrix';
import IntegrityShield from './components/IntegrityShield';
import GenesisTrigger from './components/GenesisTrigger';

// Dashboard summary stats
const summaryStats = [
    {
        id: 'total-updates',
        label: 'Total Updates Today',
        value: '2,34,567',
        change: '+12.4%',
        changeType: 'positive',
        icon: Activity,
        color: 'bg-blue-50 text-blue-600'
    },
    {
        id: 'migration-alerts',
        label: 'Migration Alerts',
        value: '23',
        change: '+8',
        changeType: 'warning',
        icon: TrendingUp,
        color: 'bg-uidai-saffron/10 text-uidai-saffron'
    },
    {
        id: 'fraud-flags',
        label: 'Fraud Flags',
        value: '7',
        change: '3 Critical',
        changeType: 'danger',
        icon: AlertTriangle,
        color: 'bg-red-50 text-red-600'
    },
    {
        id: 'exclusion-risk',
        label: 'Exclusion Risk',
        value: '45,230',
        change: '-2.1%',
        changeType: 'positive',
        icon: Users,
        color: 'bg-amber-50 text-amber-600'
    },
];

// Recent activity feed
const recentActivity = [
    { id: 1, type: 'alert', message: 'High velocity migration detected in Surat corridor', time: '2 min ago', status: 'pending' },
    { id: 2, type: 'success', message: 'Mobile van deployed to Sitamarhi, Bihar', time: '15 min ago', status: 'completed' },
    { id: 3, type: 'alert', message: 'Age update anomaly flagged for review', time: '32 min ago', status: 'pending' },
    { id: 4, type: 'success', message: 'Ration quota auto-allocated for 2,340 families', time: '1 hr ago', status: 'completed' },
];

function App() {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <Header />

                {/* Dashboard Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {/* Page Title */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-uidai-navy">Policy Intelligence Overview</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Real-time analytics from Aadhaar ecosystem • Last updated: 20 Jan 2026, 22:00 IST
                        </p>
                    </div>

                    {/* Summary Stats */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        {summaryStats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={stat.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="gov-card p-4 hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                                            <Icon size={20} />
                                        </div>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stat.changeType === 'positive' ? 'bg-green-100 text-green-700' :
                                                stat.changeType === 'warning' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {stat.change}
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-uidai-navy mt-3">{stat.value}</p>
                                    <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Main Dashboard Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Mobility Matrix - Spans 2 columns */}
                        <MobilityMatrix />

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Integrity Shield */}
                            <IntegrityShield />
                        </div>
                    </div>

                    {/* Second Row */}
                    <div className="grid grid-cols-3 gap-6 mt-6">
                        {/* Genesis Trigger */}
                        <div className="col-span-2">
                            <GenesisTrigger />
                        </div>

                        {/* Recent Activity */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="gov-card"
                        >
                            <div className="gov-card-header">
                                <h3 className="font-semibold text-uidai-navy">Recent Activity</h3>
                            </div>
                            <div className="gov-card-body p-0">
                                <div className="divide-y divide-slate-100">
                                    {recentActivity.map((activity) => (
                                        <div key={activity.id} className="px-5 py-3 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-start gap-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${activity.status === 'completed' ? 'bg-green-100' : 'bg-amber-100'
                                                    }`}>
                                                    {activity.status === 'completed' ? (
                                                        <CheckCircle2 size={14} className="text-green-600" />
                                                    ) : (
                                                        <Clock size={14} className="text-amber-600" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-slate-700 line-clamp-2">{activity.message}</p>
                                                    <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Footer Attribution */}
                    <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                        <p className="text-xs text-slate-400">
                            Aadhaar-Prerana Policy Intelligence Engine • Unique Identification Authority of India
                        </p>
                        <p className="text-[10px] text-slate-300 mt-1">
                            This is a restricted dashboard. Unauthorized access is prohibited under IT Act 2000.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;
