import { useState } from 'react';
import { Users, Truck, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

const districtData = [
    { name: 'Sitamarhi', enrolled: 15000, updated: 4000, gap: 11000 },
    { name: 'Darbhanga', enrolled: 12500, updated: 5200, gap: 7300 },
    { name: 'Madhubani', enrolled: 10800, updated: 3600, gap: 7200 },
    { name: 'Saharsa', enrolled: 9200, updated: 4100, gap: 5100 },
    { name: 'Purnia', enrolled: 8700, updated: 4800, gap: 3900 },
];

const focusDistrict = {
    name: 'Sitamarhi',
    gap: 11000,
    gapPercent: 73.3,
    avgAge: '2.4 yrs',
    pincodes: ['843302', '843314', '843325'],
    lastVan: '45 days ago'
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        const enrolled = payload.find(p => p.dataKey === 'enrolled')?.value || 0;
        const updated = payload.find(p => p.dataKey === 'updated')?.value || 0;
        const gap = enrolled - updated;
        return (
            <div className="bg-white border border-slate-200 rounded shadow-lg p-3 text-sm">
                <p className="font-medium text-slate-800 mb-2">{label}</p>
                <div className="space-y-1 text-xs">
                    <p className="flex justify-between gap-4">
                        <span className="text-slate-500">Birth Enrollments</span>
                        <span className="font-medium text-green-600">{enrolled.toLocaleString()}</span>
                    </p>
                    <p className="flex justify-between gap-4">
                        <span className="text-slate-500">Biometric Updates</span>
                        <span className="font-medium text-blue-600">{updated.toLocaleString()}</span>
                    </p>
                    <hr className="my-1" />
                    <p className="flex justify-between gap-4">
                        <span className="text-red-600 font-medium">At Risk</span>
                        <span className="font-bold text-red-600">{gap.toLocaleString()}</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export default function GenesisTrigger() {
    const [showInsights, setShowInsights] = useState(false);
    const [selected, setSelected] = useState(0);

    const totalGap = districtData.reduce((sum, d) => sum + d.gap, 0);

    return (
        <div className="gov-card">
            <div className="gov-card-header flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Users size={18} className="text-amber-600" />
                    </div>
                    <div>
                        <h3 className="heading-sm">Genesis Trigger</h3>
                        <p className="text-xs text-slate-500">Child Inclusion Gap Analysis</p>
                    </div>
                </div>
                <span className="gov-badge gov-badge-warning">Action Required</span>
            </div>

            <div className="gov-card-body">
                {/* Focus Alert */}
                <div className="alert alert-warning mb-4">
                    <div className="flex items-start gap-3">
                        <Users size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-sm">Focus: {focusDistrict.name} District</p>
                            <p className="text-sm mt-1">
                                <strong className="text-red-600">{focusDistrict.gap.toLocaleString()}</strong> children at risk ({focusDistrict.gapPercent}% gap)
                            </p>
                            <p className="text-xs mt-1">Avg age: {focusDistrict.avgAge} • Last van: {focusDistrict.lastVan}</p>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={districtData} margin={{ top: 15, right: 10, left: -15, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v / 1000}K`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="enrolled" fill="#22c55e" radius={[3, 3, 0, 0]} onClick={(_, i) => setSelected(i)}>
                                {districtData.map((_, i) => (
                                    <Cell key={i} fill={selected === i ? '#16a34a' : '#86efac'} cursor="pointer" />
                                ))}
                            </Bar>
                            <Bar dataKey="updated" fill="#3b82f6" radius={[3, 3, 0, 0]} onClick={(_, i) => setSelected(i)}>
                                {districtData.map((_, i) => (
                                    <Cell key={i} fill={selected === i ? '#1d4ed8' : '#93c5fd'} cursor="pointer" />
                                ))}
                                <LabelList
                                    dataKey="gap"
                                    position="top"
                                    formatter={v => `-${(v / 1000).toFixed(1)}K`}
                                    style={{ fontSize: 9, fill: '#dc2626', fontWeight: 600 }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-6 mt-2 text-xs">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-400"></span>Birth Enrollments</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-400"></span>Biometric Updates</span>
                    <span className="flex items-center gap-1.5 text-red-600 font-medium">-Gap = At Risk</span>
                </div>

                {/* Total */}
                <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-xs text-red-600">Total Children at Risk (Bihar)</p>
                        <p className="text-2xl font-bold text-red-700">{totalGap.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold text-slate-700">{districtData.length}</p>
                        <p className="text-xs text-slate-500">Districts</p>
                    </div>
                </div>

                {/* Insights Toggle */}
                <button
                    onClick={() => setShowInsights(!showInsights)}
                    className="w-full mt-3 p-2 bg-slate-50 rounded flex items-center justify-between text-sm hover:bg-slate-100 transition-colors"
                >
                    <span className="font-medium text-slate-700">Analysis Insights</span>
                    {showInsights ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showInsights && (
                    <div className="mt-2 p-3 bg-slate-50 rounded text-xs space-y-2">
                        <p className="text-slate-600"><strong>Finding:</strong> High exclusion correlates with areas lacking permanent Aadhaar Seva Kendras.</p>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-blue-50 rounded text-center">
                                <p className="text-blue-600">Male</p>
                                <p className="font-bold text-blue-700">52%</p>
                            </div>
                            <div className="p-2 bg-pink-50 rounded text-center">
                                <p className="text-pink-600">Female</p>
                                <p className="font-bold text-pink-700">48%</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={12} />
                        Pincodes: {focusDistrict.pincodes.map((p, i) => (
                            <span key={p} className="font-mono">{p}{i < focusDistrict.pincodes.length - 1 ? ', ' : ''}</span>
                        ))}
                    </div>
                    <button className="gov-btn gov-btn-primary flex items-center gap-2">
                        <Truck size={16} />
                        Deploy Mobile Van
                    </button>
                </div>
            </div>
        </div>
    );
}
