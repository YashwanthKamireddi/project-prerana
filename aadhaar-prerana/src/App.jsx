import { useState, useEffect } from 'react';
import {
    Activity,
    TrendingUp,
    Users,
    AlertTriangle,
    Clock,
    CheckCircle2,
    RefreshCw,
    X
} from 'lucide-react';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MobilityMatrix from './components/MobilityMatrix';
import IntegrityShield from './components/IntegrityShield';
import GenesisTrigger from './components/GenesisTrigger';

const summaryStats = [
    { id: 'total-updates', label: 'Total Updates Today', value: 234567, change: '+12.4%', changeType: 'up', icon: Activity },
    { id: 'migration-alerts', label: 'Migration Alerts', value: 23, change: '+8 new', changeType: 'up', icon: TrendingUp },
    { id: 'fraud-flags', label: 'Fraud Flags', value: 7, change: '3 critical', changeType: 'danger', icon: AlertTriangle },
    { id: 'exclusion-risk', label: 'Exclusion Risk', value: 45230, change: '-2.1%', changeType: 'down', icon: Users },
];

const recentActivity = [
    { id: 1, message: 'High velocity migration detected in Surat corridor', time: '2 min ago', status: 'pending' },
    { id: 2, message: 'Mobile van deployed to Sitamarhi district', time: '15 min ago', status: 'completed' },
    { id: 3, message: 'Age update anomaly flagged for review', time: '32 min ago', status: 'pending' },
    { id: 4, message: 'Ration quota allocated for 2,340 families', time: '1 hr ago', status: 'completed' },
];

function App() {
    const [activeTab, setActiveTab] = useState('home');
    const [stats, setStats] = useState(summaryStats);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [notification, setNotification] = useState(null);
    const [activities, setActivities] = useState(recentActivity);

    // Live counter effect
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => prev.map(stat => ({
                ...stat,
                value: stat.id === 'total-updates' ? stat.value + Math.floor(Math.random() * 3) + 1 : stat.value
            })));
            setLastUpdate(new Date());
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Global action handler for demo
    const handleAction = (action, details) => {
        const messages = {
            'allocate-ration': `✓ Ration quota allocated for ${details?.migrants || '28,450'} migrants in ${details?.location || 'Surat corridor'}`,
            'freeze-updates': `✓ Cohort updates frozen for ${details?.count || '3,400'} records in ${details?.location || 'Surat'}`,
            'deploy-van': `✓ Mobile van unit dispatched to ${details?.district || 'Sitamarhi'}, Bihar`,
        };

        setNotification({ type: 'success', message: messages[action] || 'Action completed' });

        // Add to activity log
        setActivities(prev => [{
            id: Date.now(),
            message: messages[action],
            time: 'Just now',
            status: 'completed'
        }, ...prev.slice(0, 3)]);

        // Update relevant stats
        if (action === 'allocate-ration') {
            setStats(prev => prev.map(s => s.id === 'migration-alerts' ? { ...s, value: Math.max(0, s.value - 1) } : s));
        } else if (action === 'freeze-updates') {
            setStats(prev => prev.map(s => s.id === 'fraud-flags' ? { ...s, value: Math.max(0, s.value - 1) } : s));
        } else if (action === 'deploy-van') {
            setStats(prev => prev.map(s => s.id === 'exclusion-risk' ? { ...s, value: Math.max(0, s.value - 500) } : s));
        }

        setTimeout(() => setNotification(null), 4000);
    };

    const formatNumber = (num) => num.toLocaleString('en-IN');

    return (
        <div className="min-h-screen bg-slate-100 flex">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex-1 flex flex-col min-w-0">
                <Header />

                <main className="flex-1 p-5 overflow-auto">
                    {/* Notification Toast */}
                    {notification && (
                        <div className="fixed top-20 right-5 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
                            <CheckCircle2 size={20} />
                            <span className="text-sm font-medium">{notification.message}</span>
                            <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-80">
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    {/* Page Header */}
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h1 className="text-xl font-semibold text-slate-800">Policy Intelligence Overview</h1>
                            <p className="text-sm text-slate-500 mt-0.5">
                                Last updated: {lastUpdate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} IST
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded border border-green-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-xs font-medium text-green-700">Live</span>
                            </div>
                            <button className="p-2 hover:bg-slate-200 rounded transition-colors">
                                <RefreshCw size={16} className="text-slate-500" />
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-4 mb-5">
                        {stats.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div key={stat.id} className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                                            <Icon size={18} className="text-slate-600" />
                                        </div>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${stat.changeType === 'up' ? 'bg-green-100 text-green-700' :
                                                stat.changeType === 'down' ? 'bg-green-100 text-green-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {stat.change}
                                        </span>
                                    </div>
                                    <p className="text-2xl font-semibold text-slate-800 tabular-nums">{formatNumber(stat.value)}</p>
                                    <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* THREE EQUAL ENGINE CARDS */}
                    <div className="grid grid-cols-3 gap-5 mb-5">
                        <MobilityMatrix onAction={handleAction} />
                        <IntegrityShield onAction={handleAction} />
                        <GenesisTrigger onAction={handleAction} />
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg border border-slate-200">
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-medium text-slate-800">Recent Activity</h3>
                            <span className="text-xs text-slate-400">{activities.length} events</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {activities.map((item) => (
                                <div key={item.id} className="px-5 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${item.status === 'completed' ? 'bg-green-100' : 'bg-amber-100'
                                        }`}>
                                        {item.status === 'completed' ? (
                                            <CheckCircle2 size={12} className="text-green-600" />
                                        ) : (
                                            <Clock size={12} className="text-amber-600" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-700">{item.message}</p>
                                        <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-slate-200 text-center">
                        <p className="text-xs text-slate-400">
                            AADHAAR-PRERANA Policy Intelligence Engine • UIDAI
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;
