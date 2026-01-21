import { useState } from 'react';
import { MapPin, TrendingUp, ArrowRight, Truck } from 'lucide-react';

const migrationData = {
    source: { state: 'Bihar' },
    destination: { city: 'Surat', state: 'Gujarat', pincode: '395006' },
    corridors: [
        { route: 'Bihar → Gujarat', count: 12840, change: '+340%', status: 'critical' },
        { route: 'UP → Maharashtra', count: 8920, change: '+180%', status: 'high' },
        { route: 'Jharkhand → Karnataka', count: 4560, change: '+95%', status: 'medium' },
    ],
    heatmap: [
        [0.2, 0.4, 0.6, 0.8, 0.5, 0.3],
        [0.3, 0.7, 0.95, 1.0, 0.7, 0.4],
        [0.25, 0.5, 0.85, 0.9, 0.6, 0.3],
        [0.15, 0.3, 0.5, 0.6, 0.4, 0.2],
    ],
    stats: { total: 28450, male: 78, ageGroup: '18-35' }
};

export default function MobilityMatrix({ onAction }) {
    const [selected, setSelected] = useState(0);
    const [loading, setLoading] = useState(false);

    const getHeatColor = (val) => {
        if (val >= 0.9) return 'bg-red-500';
        if (val >= 0.7) return 'bg-orange-400';
        if (val >= 0.5) return 'bg-amber-400';
        if (val >= 0.3) return 'bg-amber-300';
        return 'bg-amber-100';
    };

    const handleAllocate = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onAction?.('allocate-ration', {
                migrants: migrationData.stats.total,
                location: migrationData.destination.city
            });
        }, 800);
    };

    return (
        <div className="bg-white rounded-lg border border-slate-200 h-full flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center">
                        <MapPin size={16} className="text-orange-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-800">MOBILITY Engine</h3>
                        <p className="text-[10px] text-slate-500">Migration Tracker</p>
                    </div>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-red-100 text-red-700">High Alert</span>
            </div>

            {/* Body */}
            <div className="p-4 flex-1 flex flex-col">
                {/* Alert */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-3">
                    <div className="flex items-start gap-2">
                        <TrendingUp size={16} className="text-amber-600 mt-0.5" />
                        <div>
                            <p className="text-xs font-medium text-amber-800">Velocity Spike: +400%</p>
                            <p className="text-[11px] text-amber-700 mt-0.5">
                                <strong>Surat, Gujarat</strong> • {migrationData.stats.total.toLocaleString()} migrants
                            </p>
                        </div>
                    </div>
                </div>

                {/* Heatmap */}
                <div className="mb-3">
                    <p className="text-[10px] font-medium text-slate-500 mb-2">MIGRATION DENSITY</p>
                    <div className="bg-slate-50 rounded p-2">
                        <div className="grid gap-1">
                            {migrationData.heatmap.map((row, i) => (
                                <div key={i} className="flex gap-1">
                                    {row.map((cell, j) => (
                                        <div key={j} className={`flex-1 h-6 rounded ${getHeatColor(cell)}`} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Corridors */}
                <div className="flex-1">
                    <p className="text-[10px] font-medium text-slate-500 mb-2">TOP CORRIDORS</p>
                    <div className="space-y-1">
                        {migrationData.corridors.map((c, i) => (
                            <button
                                key={c.route}
                                onClick={() => setSelected(i)}
                                className={`w-full p-2 rounded text-left text-xs transition-all ${selected === i ? 'bg-slate-700 text-white' : 'bg-slate-50 hover:bg-slate-100'
                                    }`}
                            >
                                <div className="flex justify-between">
                                    <span>{c.route}</span>
                                    <span className={`font-medium ${selected === i ? 'text-amber-300' : 'text-red-600'}`}>{c.change}</span>
                                </div>
                                <p className={`font-semibold mt-0.5 ${selected === i ? 'text-white' : 'text-slate-700'}`}>
                                    {c.count.toLocaleString()} updates
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin size={12} />
                    <span>Bihar</span>
                    <ArrowRight size={12} />
                    <span className="font-medium text-slate-700">Surat</span>
                </div>
                <button
                    onClick={handleAllocate}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 disabled:opacity-50 transition-all"
                >
                    {loading ? (
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        <Truck size={14} />
                    )}
                    {loading ? 'Allocating...' : 'Allocate Ration'}
                </button>
            </div>
        </div>
    );
}
