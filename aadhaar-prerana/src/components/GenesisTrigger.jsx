import { useState } from 'react';
import { Users, Truck, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from 'recharts';

const districtData = [
    { name: 'Sitamarhi', enrolled: 15000, updated: 4000, gap: 11000 },
    { name: 'Darbhanga', enrolled: 12500, updated: 5200, gap: 7300 },
    { name: 'Madhubani', enrolled: 10800, updated: 3600, gap: 7200 },
    { name: 'Saharsa', enrolled: 9200, updated: 4100, gap: 5100 },
];

const focusDistrict = {
    name: 'Sitamarhi',
    gap: 11000,
    gapPercent: 73.3,
    avgAge: '2.4 yrs',
    pincodes: ['843302', '843314', '843325'],
    lastVan: '45 days ago'
};

export default function GenesisTrigger({ onAction }) {
    const [showInsights, setShowInsights] = useState(false);
    const [selected, setSelected] = useState(0);
    const [loading, setLoading] = useState(false);
    const [deployed, setDeployed] = useState(false);

    const totalGap = districtData.reduce((sum, d) => sum + d.gap, 0);

    const handleDeploy = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setDeployed(true);
            onAction?.('deploy-van', {
                district: districtData[selected].name,
                state: 'Bihar'
            });
        }, 800);
    };

    return (
        <div className="bg-white rounded-lg border border-slate-200 h-full flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-amber-100 flex items-center justify-center">
                        <Users size={16} className="text-amber-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-800">GENESIS Engine</h3>
                        <p className="text-[10px] text-slate-500">Child Inclusion Gap</p>
                    </div>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${deployed ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {deployed ? 'Van Deployed' : 'Action Required'}
                </span>
            </div>

            {/* Body */}
            <div className="p-4 flex-1 flex flex-col">
                {/* Alert */}
                <div className={`p-3 rounded-lg mb-3 ${deployed ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                    <div className="flex items-start gap-2">
                        <Users size={16} className={deployed ? 'text-green-600' : 'text-amber-600'} />
                        <div>
                            <p className={`text-xs font-medium ${deployed ? 'text-green-800' : 'text-amber-800'}`}>
                                {deployed ? `Van deployed to ${districtData[selected].name}` : `Focus: ${focusDistrict.name} District`}
                            </p>
                            <p className={`text-[11px] mt-0.5 ${deployed ? 'text-green-700' : 'text-amber-700'}`}>
                                <strong className="text-red-600">{focusDistrict.gap.toLocaleString()}</strong> children at risk ({focusDistrict.gapPercent}% gap)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="h-32 mb-3">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={districtData} margin={{ top: 15, right: 5, left: -20, bottom: 5 }}>
                            <XAxis dataKey="name" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={v => `${v / 1000}K`} />
                            <Bar dataKey="enrolled" fill="#22c55e" radius={[2, 2, 0, 0]} onClick={(_, i) => setSelected(i)}>
                                {districtData.map((_, i) => (
                                    <Cell key={i} fill={selected === i ? '#16a34a' : '#86efac'} cursor="pointer" />
                                ))}
                            </Bar>
                            <Bar dataKey="updated" fill="#3b82f6" radius={[2, 2, 0, 0]} onClick={(_, i) => setSelected(i)}>
                                {districtData.map((_, i) => (
                                    <Cell key={i} fill={selected === i ? '#1d4ed8' : '#93c5fd'} cursor="pointer" />
                                ))}
                                <LabelList dataKey="gap" position="top" formatter={v => `-${(v / 1000).toFixed(0)}K`} style={{ fontSize: 8, fill: '#dc2626', fontWeight: 600 }} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex justify-center gap-4 text-[10px] mb-3">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-green-400"></span>Enrolled</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-400"></span>Updated</span>
                    <span className="text-red-600 font-medium">-Gap</span>
                </div>

                {/* Total */}
                <div className="p-2 bg-red-50 rounded-lg flex items-center justify-between mb-3">
                    <div>
                        <p className="text-[10px] text-red-600">Total At Risk (Bihar)</p>
                        <p className="text-lg font-bold text-red-700">{totalGap.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold text-slate-700">{districtData.length}</p>
                        <p className="text-[10px] text-slate-500">Districts</p>
                    </div>
                </div>

                {/* Insights Toggle */}
                <button onClick={() => setShowInsights(!showInsights)} className="w-full p-2 bg-slate-50 rounded flex items-center justify-between text-xs hover:bg-slate-100 transition-colors">
                    <span className="font-medium text-slate-700">Insights</span>
                    {showInsights ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {showInsights && (
                    <div className="mt-2 p-2 bg-slate-50 rounded text-[10px] space-y-1">
                        <p className="text-slate-600">High exclusion correlates with areas lacking Aadhaar Seva Kendras.</p>
                        <div className="flex gap-2">
                            <span className="px-2 py-0.5 bg-blue-100 rounded text-blue-700">Male: 52%</span>
                            <span className="px-2 py-0.5 bg-pink-100 rounded text-pink-700">Female: 48%</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <MapPin size={10} />
                    {focusDistrict.pincodes.slice(0, 2).join(', ')}...
                </div>
                <button
                    onClick={handleDeploy}
                    disabled={loading || deployed}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all ${deployed
                            ? 'bg-green-100 text-green-700 cursor-default'
                            : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                        }`}
                >
                    {loading ? (
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        <Truck size={14} />
                    )}
                    {deployed ? 'Deployed ✓' : loading ? 'Deploying...' : 'Deploy Van'}
                </button>
            </div>
        </div>
    );
}
