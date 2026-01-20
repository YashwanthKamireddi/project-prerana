import { motion } from 'framer-motion';
import { MapPin, TrendingUp, ArrowRight, AlertTriangle, Truck } from 'lucide-react';

// Hardcoded migration data
const migrationData = {
    source: {
        state: 'Bihar',
        districts: ['Sitamarhi', 'Darbhanga', 'Madhubani', 'Saharsa'],
        totalMigrants: 28450
    },
    destination: {
        city: 'Surat',
        state: 'Gujarat',
        pincode: '395006',
        velocitySpike: '+400%'
    },
    corridorStats: [
        { route: 'Bihar → Gujarat', count: 12840, change: '+340%' },
        { route: 'UP → Maharashtra', count: 8920, change: '+180%' },
        { route: 'Jharkhand → Karnataka', count: 4560, change: '+95%' },
        { route: 'Odisha → Tamil Nadu', count: 3200, change: '+67%' },
    ],
    heatmapGrid: [
        [0.2, 0.3, 0.4, 0.5, 0.3, 0.2, 0.1],
        [0.3, 0.5, 0.7, 0.9, 0.6, 0.3, 0.2],
        [0.4, 0.8, 1.0, 1.0, 0.8, 0.4, 0.3],
        [0.3, 0.6, 0.9, 0.95, 0.7, 0.4, 0.2],
        [0.2, 0.4, 0.6, 0.7, 0.5, 0.3, 0.1],
    ]
};

export default function MobilityMatrix() {
    const getHeatColor = (intensity) => {
        if (intensity >= 0.9) return 'bg-red-600';
        if (intensity >= 0.7) return 'bg-orange-500';
        if (intensity >= 0.5) return 'bg-uidai-saffron';
        if (intensity >= 0.3) return 'bg-amber-300';
        return 'bg-amber-100';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="gov-card col-span-2"
        >
            {/* Header */}
            <div className="gov-card-header flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-uidai-saffron/10 flex items-center justify-center">
                        <MapPin className="text-uidai-saffron" size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-uidai-navy text-lg">Mobility Matrix</h3>
                        <p className="text-xs text-slate-500">Interstate Migration Velocity Tracker</p>
                    </div>
                </div>
                <span className="gov-badge gov-badge-danger flex items-center gap-1">
                    <AlertTriangle size={12} />
                    High Alert
                </span>
            </div>

            {/* Body */}
            <div className="gov-card-body">
                {/* Alert Banner */}
                <div className="mb-5 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="text-red-600" size={16} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-red-800 text-sm">Velocity Spike Detected</h4>
                            <p className="text-red-700 text-sm mt-1">
                                <span className="font-bold">{migrationData.destination.velocitySpike}</span> Address Updates in
                                <span className="font-semibold"> Surat, Gujarat</span> (Pincode: {migrationData.destination.pincode})
                            </p>
                            <p className="text-xs text-red-600/80 mt-1">
                                Source Region: <span className="font-medium">{migrationData.source.state}</span> |
                                Total Migrants: <span className="font-medium">{migrationData.source.totalMigrants.toLocaleString()}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-3 gap-5">
                    {/* Heatmap Visualization */}
                    <div className="col-span-2">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
                            Migration Density Heatmap
                        </p>
                        <div className="bg-slate-50 rounded-lg p-4">
                            <div className="grid gap-1">
                                {migrationData.heatmapGrid.map((row, i) => (
                                    <div key={i} className="flex gap-1">
                                        {row.map((cell, j) => (
                                            <motion.div
                                                key={j}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: (i * 7 + j) * 0.02 }}
                                                className={`flex-1 h-10 rounded ${getHeatColor(cell)} transition-all duration-300 hover:scale-105 cursor-pointer`}
                                                title={`Intensity: ${Math.round(cell * 100)}%`}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                            {/* Legend */}
                            <div className="flex items-center gap-4 mt-4 justify-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-amber-100"></div>
                                    <span className="text-xs text-slate-500">Low</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-uidai-saffron"></div>
                                    <span className="text-xs text-slate-500">Medium</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-red-600"></div>
                                    <span className="text-xs text-slate-500">Critical</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Corridor Stats */}
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
                            Top Corridors
                        </p>
                        <div className="space-y-2">
                            {migrationData.corridorStats.map((corridor, index) => (
                                <motion.div
                                    key={corridor.route}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-slate-700">{corridor.route}</span>
                                        <span className={`text-xs font-bold ${corridor.change.includes('+3') ? 'text-red-600' : 'text-uidai-saffron'
                                            }`}>
                                            {corridor.change}
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold text-uidai-navy mt-1">
                                        {corridor.count.toLocaleString()} updates
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Section */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin size={14} />
                        <span>Bihar</span>
                        <ArrowRight size={14} className="text-uidai-saffron" />
                        <span className="font-medium text-uidai-navy">Surat, Gujarat</span>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="gov-action-btn gov-action-btn-success flex items-center gap-2"
                    >
                        <Truck size={16} />
                        Auto-Allocate Ration Quota
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
