import { useState } from 'react';
import { ShieldAlert, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';

const chartData = [
    { day: '1', v: 42 }, { day: '5', v: 48 }, { day: '9', v: 45 },
    { day: '13', v: 72 }, { day: '14', v: 890 }, { day: '15', v: 1450 },
    { day: '16', v: 1060 }, { day: '17', v: 320 }, { day: '19', v: 78 }
];

const anomaly = {
    count: 3400,
    cohort: 'Male, 18-21 yrs',
    location: 'Surat, Gujarat',
    pincodes: ['395001', '395003', '395006', '395007'],
    zScore: 4.7,
    event: 'Army Recruitment Rally - Jan 25'
};

export default function IntegrityShield({ onAction }) {
    const [showDetails, setShowDetails] = useState(false);
    const [loading, setLoading] = useState(false);
    const [frozen, setFrozen] = useState(false);

    const handleFreeze = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setFrozen(true);
            onAction?.('freeze-updates', {
                count: anomaly.count,
                location: anomaly.location
            });
        }, 800);
    };

    return (
        <div className="bg-white rounded-lg border border-slate-200 h-full flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center">
                        <ShieldAlert size={16} className="text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-800">INTEGRITY Engine</h3>
                        <p className="text-[10px] text-slate-500">Fraud Detection</p>
                    </div>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${frozen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {frozen ? 'Resolved' : 'Active Threat'}
                </span>
            </div>

            {/* Body */}
            <div className="p-4 flex-1 flex flex-col">
                {/* Alert */}
                <div className={`p-3 rounded-lg mb-3 ${frozen ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-start gap-2">
                        <AlertTriangle size={16} className={frozen ? 'text-green-600' : 'text-red-600'} />
                        <div>
                            <p className={`text-xs font-medium ${frozen ? 'text-green-800' : 'text-red-800'}`}>
                                {frozen ? 'Cohort Frozen Successfully' : `Anomaly Detected (Z: ${anomaly.zScore})`}
                            </p>
                            <p className={`text-[11px] mt-0.5 ${frozen ? 'text-green-700' : 'text-red-700'}`}>
                                <strong>{anomaly.count.toLocaleString()}</strong> DOB/Age updates • {anomaly.cohort}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Correlated Event */}
                <div className="p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800 mb-3">
                    <strong>Event:</strong> {anomaly.event}
                </div>

                {/* Chart */}
                <div className="h-28 mb-3">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                            <XAxis dataKey="day" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={v => v > 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                            <ReferenceLine y={45} stroke="#94a3b8" strokeDasharray="3 3" />
                            <ReferenceLine y={180} stroke="#ef4444" strokeDasharray="3 3" />
                            <Line
                                type="monotone"
                                dataKey="v"
                                stroke="#1e40af"
                                strokeWidth={2}
                                dot={(props) => {
                                    const isHigh = props.payload.v > 200;
                                    return <circle cx={props.cx} cy={props.cy} r={isHigh ? 4 : 2} fill={isHigh ? '#dc2626' : '#1e40af'} />;
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-1 mb-3">
                    {[
                        { label: 'Peak', value: 'Jan 15' },
                        { label: 'Count', value: '3,400' },
                        { label: 'Pins', value: '4' },
                        { label: 'Conf', value: '94.7%' }
                    ].map(item => (
                        <div key={item.label} className="text-center p-1.5 bg-slate-50 rounded">
                            <p className="text-[9px] text-slate-500">{item.label}</p>
                            <p className="text-xs font-semibold text-slate-800">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Details */}
                {showDetails && (
                    <div className="p-2 bg-slate-50 rounded text-[10px] text-slate-600 mb-3">
                        <p><strong>Pincodes:</strong> {anomaly.pincodes.join(', ')}</p>
                        <p><strong>Pattern:</strong> Recruitment Fraud Ring</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                <button onClick={() => setShowDetails(!showDetails)} className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1">
                    {showDetails ? <EyeOff size={12} /> : <Eye size={12} />}
                    {showDetails ? 'Hide' : 'Details'}
                </button>
                <button
                    onClick={handleFreeze}
                    disabled={loading || frozen}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all ${frozen
                            ? 'bg-green-100 text-green-700 cursor-default'
                            : 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50'
                        }`}
                >
                    {loading ? (
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        <Lock size={14} />
                    )}
                    {frozen ? 'Frozen ✓' : loading ? 'Freezing...' : 'Freeze Cohort'}
                </button>
            </div>
        </div>
    );
}
