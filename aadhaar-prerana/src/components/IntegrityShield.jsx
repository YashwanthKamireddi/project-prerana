import { useState } from 'react';
import { ShieldAlert, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const chartData = [
    { day: 'Jan 1', value: 42 }, { day: 'Jan 3', value: 48 }, { day: 'Jan 5', value: 45 },
    { day: 'Jan 7', value: 51 }, { day: 'Jan 9', value: 47 }, { day: 'Jan 11', value: 44 },
    { day: 'Jan 13', value: 72 }, { day: 'Jan 14', value: 890 }, { day: 'Jan 15', value: 1450 },
    { day: 'Jan 16', value: 1060 }, { day: 'Jan 17', value: 320 }, { day: 'Jan 18', value: 145 },
    { day: 'Jan 19', value: 78 }, { day: 'Jan 20', value: 52 }
];

const anomaly = {
    count: 3400,
    cohort: 'Male, 18-21 yrs',
    location: 'Surat, Gujarat',
    pincodes: ['395001', '395003', '395006', '395007'],
    zScore: 4.7,
    confidence: 94.7,
    correlatedEvent: 'Army Recruitment Rally - Jan 25'
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.[0]) {
        const val = payload[0].value;
        const isAnomaly = val > 200;
        return (
            <div className={`px-3 py-2 rounded shadow-lg border text-sm ${isAnomaly ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
                <p className="text-slate-500 text-xs">{label}</p>
                <p className={`font-semibold ${isAnomaly ? 'text-red-600' : 'text-slate-800'}`}>
                    {val.toLocaleString()} updates
                </p>
            </div>
        );
    }
    return null;
};

export default function IntegrityShield() {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="gov-card h-full">
            <div className="gov-card-header flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                        <ShieldAlert size={18} className="text-red-600" />
                    </div>
                    <div>
                        <h3 className="heading-sm">Integrity Shield</h3>
                        <p className="text-xs text-slate-500">Fraud Detection System</p>
                    </div>
                </div>
                <span className="gov-badge gov-badge-danger">Active Threat</span>
            </div>

            <div className="gov-card-body">
                {/* Alert */}
                <div className="alert alert-danger mb-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-sm">Anomaly Detected (Z-Score: {anomaly.zScore})</p>
                            <p className="text-sm mt-1">
                                <strong>{anomaly.count.toLocaleString()}</strong> DOB/Age updates • {anomaly.cohort}
                            </p>
                            <p className="text-xs mt-1">Location: {anomaly.location}</p>
                        </div>
                    </div>
                </div>

                {/* Correlated Event */}
                <div className="alert alert-warning mb-4 py-2">
                    <p className="text-xs">
                        <strong>Correlated Event:</strong> {anomaly.correlatedEvent}
                    </p>
                </div>

                {/* Chart */}
                <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} interval={2} />
                            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => v > 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                            <Tooltip content={<CustomTooltip />} />
                            <ReferenceLine y={45} stroke="#94a3b8" strokeDasharray="4 4" />
                            <ReferenceLine y={180} stroke="#ef4444" strokeDasharray="4 4" />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#1e40af"
                                strokeWidth={2}
                                dot={(props) => {
                                    const isAnomaly = props.payload.value > 200;
                                    return <circle cx={props.cx} cy={props.cy} r={isAnomaly ? 4 : 2} fill={isAnomaly ? '#dc2626' : '#1e40af'} />;
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-2 mt-3">
                    {[
                        { label: 'Peak', value: 'Jan 15' },
                        { label: 'Affected', value: '3,400' },
                        { label: 'Pincodes', value: '4' },
                        { label: 'Confidence', value: '94.7%' }
                    ].map(item => (
                        <div key={item.label} className="text-center p-2 bg-slate-50 rounded">
                            <p className="text-xs text-slate-500">{item.label}</p>
                            <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Details Toggle */}
                {showDetails && (
                    <div className="mt-3 p-3 bg-slate-50 rounded text-xs space-y-1">
                        <p><strong>Pincodes:</strong> {anomaly.pincodes.join(', ')}</p>
                        <p><strong>Pattern:</strong> Potential Recruitment Fraud Ring</p>
                    </div>
                )}

                {/* Action */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
                    >
                        {showDetails ? <EyeOff size={14} /> : <Eye size={14} />}
                        {showDetails ? 'Hide' : 'Show'} Details
                    </button>
                    <button className="gov-btn gov-btn-danger flex items-center gap-2">
                        <Lock size={16} />
                        Freeze Updates
                    </button>
                </div>
            </div>
        </div>
    );
}
