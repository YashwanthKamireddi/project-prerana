import { motion } from 'framer-motion';
import { ShieldAlert, Lock, AlertOctagon, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';

// Hardcoded fraud detection data - flat line for 20 days, then massive spike
const generateChartData = () => {
    const data = [];
    const baselineValue = 45;

    // Days 1-12: Normal baseline
    for (let i = 1; i <= 12; i++) {
        data.push({
            day: `Jan ${i}`,
            updates: baselineValue + Math.random() * 15 - 7,
            baseline: baselineValue
        });
    }

    // Day 13: Slight increase
    data.push({ day: 'Jan 13', updates: 72, baseline: baselineValue });

    // Days 14-16: MASSIVE SPIKE
    data.push({ day: 'Jan 14', updates: 890, baseline: baselineValue });
    data.push({ day: 'Jan 15', updates: 1450, baseline: baselineValue });
    data.push({ day: 'Jan 16', updates: 1060, baseline: baselineValue });

    // Days 17-20: Gradual decline but still elevated
    data.push({ day: 'Jan 17', updates: 320, baseline: baselineValue });
    data.push({ day: 'Jan 18', updates: 145, baseline: baselineValue });
    data.push({ day: 'Jan 19', updates: 78, baseline: baselineValue });
    data.push({ day: 'Jan 20', updates: 52, baseline: baselineValue });

    return data;
};

const chartData = generateChartData();

const anomalyDetails = {
    totalAnomalousUpdates: 3400,
    ageRange: '18-21',
    gender: 'Male',
    timeWindow: '48 hours',
    affectedPincodes: ['395001', '395003', '395006', '395007'],
    suspectedPattern: 'Recruitment Fraud Ring',
    confidence: 94.7
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const value = payload[0].value;
        const isAnomaly = value > 200;
        return (
            <div className={`p-3 rounded-lg shadow-lg border ${isAnomaly ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p className={`text-lg font-bold ${isAnomaly ? 'text-red-600' : 'text-uidai-navy'}`}>
                    {Math.round(value).toLocaleString()} updates
                </p>
                {isAnomaly && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertOctagon size={10} />
                        Anomaly Detected
                    </p>
                )}
            </div>
        );
    }
    return null;
};

export default function IntegrityShield() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="gov-card"
        >
            {/* Header */}
            <div className="gov-card-header flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                        <ShieldAlert className="text-red-600" size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-uidai-navy text-lg">Integrity Shield</h3>
                        <p className="text-xs text-slate-500">Fraud Pattern Detection System</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="gov-badge gov-badge-danger animate-pulse">
                        Active Threat
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="gov-card-body">
                {/* Anomaly Alert */}
                <div className="mb-5 p-4 bg-gradient-to-r from-red-600 to-red-700 rounded-lg text-white">
                    <div className="flex items-start gap-3">
                        <AlertOctagon className="flex-shrink-0 mt-0.5" size={24} />
                        <div className="flex-1">
                            <h4 className="font-bold text-sm">ANOMALY DETECTED</h4>
                            <p className="text-red-100 text-sm mt-1">
                                <span className="font-bold text-white">{anomalyDetails.totalAnomalousUpdates.toLocaleString()}</span> Age Updates
                                ({anomalyDetails.ageRange} {anomalyDetails.gender}s) in <span className="font-bold text-white">{anomalyDetails.timeWindow}</span>
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                                    Confidence: {anomalyDetails.confidence}%
                                </span>
                                <span className="bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded text-xs font-semibold">
                                    {anomalyDetails.suspectedPattern}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="h-64 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis
                                dataKey="day"
                                tick={{ fontSize: 10, fill: '#64748b' }}
                                axisLine={{ stroke: '#e2e8f0' }}
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: '#64748b' }}
                                axisLine={{ stroke: '#e2e8f0' }}
                            />
                            <Tooltip content={<CustomTooltip />} />

                            {/* Highlight anomaly period */}
                            <ReferenceArea x1="Jan 14" x2="Jan 16" fill="#fef2f2" fillOpacity={0.8} />

                            {/* Baseline reference line */}
                            <ReferenceLine
                                y={45}
                                stroke="#94a3b8"
                                strokeDasharray="5 5"
                                label={{ value: 'Baseline', position: 'right', fontSize: 10, fill: '#94a3b8' }}
                            />

                            {/* Main data line */}
                            <Line
                                type="monotone"
                                dataKey="updates"
                                stroke="#000080"
                                strokeWidth={2}
                                dot={(props) => {
                                    const { cx, cy, payload } = props;
                                    const isAnomaly = payload.updates > 200;
                                    return (
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={isAnomaly ? 6 : 3}
                                            fill={isAnomaly ? '#dc2626' : '#000080'}
                                            stroke={isAnomaly ? '#fecaca' : 'none'}
                                            strokeWidth={isAnomaly ? 3 : 0}
                                        />
                                    );
                                }}
                                activeDot={{ r: 6, fill: '#F26F22' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-3 mt-4">
                    <div className="p-3 bg-slate-50 rounded-lg text-center">
                        <p className="text-xs text-slate-500">Peak Day</p>
                        <p className="text-sm font-bold text-uidai-navy">Jan 15</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg text-center">
                        <p className="text-xs text-slate-500">Affected</p>
                        <p className="text-sm font-bold text-uidai-navy">3,400</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg text-center">
                        <p className="text-xs text-slate-500">Pincodes</p>
                        <p className="text-sm font-bold text-uidai-navy">4</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg text-center">
                        <p className="text-xs text-red-500">Risk Level</p>
                        <p className="text-sm font-bold text-red-600">Critical</p>
                    </div>
                </div>

                {/* Action */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                        Last analyzed: <span className="font-medium">2 minutes ago</span>
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="gov-action-btn gov-action-btn-danger flex items-center gap-2"
                    >
                        <Lock size={16} />
                        Freeze Cohort Updates
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
