import { useState } from 'react';
import { MapPin, TrendingUp, ArrowRight, Truck, Users, ChevronRight } from 'lucide-react';

const migrationData = {
    source: { state: 'Bihar', districts: ['Sitamarhi', 'Darbhanga', 'Madhubani', 'Saharsa'] },
    destination: { city: 'Surat', state: 'Gujarat', pincode: '395006' },
    corridors: [
        { route: 'Bihar → Gujarat', count: 12840, change: '+340%', status: 'critical' },
        { route: 'UP → Maharashtra', count: 8920, change: '+180%', status: 'high' },
        { route: 'Jharkhand → Karnataka', count: 4560, change: '+95%', status: 'medium' },
        { route: 'Odisha → Tamil Nadu', count: 3200, change: '+67%', status: 'low' },
    ],
    heatmap: [
        [0.1, 0.2, 0.3, 0.4, 0.3, 0.2, 0.1],
        [0.2, 0.4, 0.6, 0.8, 0.5, 0.3, 0.2],
        [0.3, 0.7, 0.95, 1.0, 0.75, 0.4, 0.25],
        [0.25, 0.5, 0.85, 0.9, 0.65, 0.35, 0.2],
        [0.15, 0.3, 0.5, 0.6, 0.4, 0.25, 0.1],
    ],
    stats: { total: 28450, male: 78, ageGroup: '18-35' }
};

export default function MobilityMatrix() {
    const [selectedCorridor, setSelectedCorridor] = useState(0);

    const getHeatColor = (val) => {
        if (val >= 0.9) return 'bg-red-500';
        if (val >= 0.7) return 'bg-orange-400';
        if (val >= 0.5) return 'bg-amber-400';
        if (val >= 0.3) return 'bg-amber-300';
        return 'bg-amber-100';
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'critical': return 'text-red-600 bg-red-50';
            case 'high': return 'text-orange-600 bg-orange-50';
            case 'medium': return 'text-amber-600 bg-amber-50';
            default: return 'text-green-600 bg-green-50';
        }
    };

    return (
        <div className="gov-card">
            <div className="gov-card-header flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
                        <MapPin size={18} className="text-orange-600" />
                    </div>
                    <div>
                        <h3 className="heading-sm">Mobility Matrix</h3>
                        <p className="text-xs text-slate-500">Interstate Migration Tracker</p>
                    </div>
                </div>
                <span className="gov-badge gov-badge-danger">High Alert</span>
            </div>

            <div className="gov-card-body">
                {/* Alert Banner */}
                <div className="alert alert-warning mb-4">
                    <div className="flex items-start gap-3">
                        <TrendingUp size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-sm">Velocity Spike: +400%</p>
                            <p className="text-sm mt-1">
                                Address updates in <strong>Surat, Gujarat</strong> (395006)
                            </p>
                            <p className="text-xs mt-1 text-amber-700">
                                Source: {migrationData.source.state} • {migrationData.stats.total.toLocaleString()} migrants detected
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {/* Heatmap */}
                    <div className="col-span-2">
                        <p className="text-xs font-medium text-slate-600 mb-2">Migration Density</p>
                        <div className="bg-slate-50 rounded-lg p-3">
                            <div className="grid gap-1">
                                {migrationData.heatmap.map((row, i) => (
                                    <div key={i} className="flex gap-1">
                                        {row.map((cell, j) => (
                                            <div
                                                key={j}
                                                className={`flex-1 h-8 rounded ${getHeatColor(cell)} transition-all hover:opacity-80`}
                                                title={`${Math.round(cell * 100)}%`}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-500">
                                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100"></span>Low</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-400"></span>Medium</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500"></span>High</span>
                            </div>
                        </div>
                    </div>

                    {/* Corridors */}
                    <div>
                        <p className="text-xs font-medium text-slate-600 mb-2">Top Corridors</p>
                        <div className="space-y-1.5">
                            {migrationData.corridors.map((c, i) => (
                                <button
                                    key={c.route}
                                    onClick={() => setSelectedCorridor(i)}
                                    className={`w-full p-2.5 rounded-lg text-left transition-all ${selectedCorridor === i
                                            ? 'bg-slate-800 text-white'
                                            : 'bg-slate-50 hover:bg-slate-100'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs ${selectedCorridor === i ? 'text-slate-300' : 'text-slate-600'}`}>
                                            {c.route}
                                        </span>
                                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${selectedCorridor === i ? 'bg-white/20' : getStatusStyle(c.status)
                                            }`}>
                                            {c.change}
                                        </span>
                                    </div>
                                    <p className={`text-sm font-semibold mt-1 ${selectedCorridor === i ? 'text-white' : 'text-slate-800'}`}>
                                        {c.count.toLocaleString()} updates
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
                    <div className="text-center p-2 bg-slate-50 rounded">
                        <p className="text-lg font-semibold text-slate-800">{migrationData.stats.male}%</p>
                        <p className="text-xs text-slate-500">Male</p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded">
                        <p className="text-lg font-semibold text-slate-800">{migrationData.stats.ageGroup}</p>
                        <p className="text-xs text-slate-500">Age Group</p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded">
                        <p className="text-lg font-semibold text-slate-800">Textile</p>
                        <p className="text-xs text-slate-500">Industry</p>
                    </div>
                </div>

                {/* Action */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin size={14} />
                        <span>{migrationData.source.state}</span>
                        <ArrowRight size={14} />
                        <span className="font-medium">{migrationData.destination.city}</span>
                    </div>
                    <button className="gov-btn gov-btn-success flex items-center gap-2">
                        <Truck size={16} />
                        Allocate Ration Quota
                    </button>
                </div>
            </div>
        </div>
    );
}
