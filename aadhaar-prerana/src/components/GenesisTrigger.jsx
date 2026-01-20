import { motion } from 'framer-motion';
import { Users, Baby, Fingerprint, AlertCircle, Truck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

// Hardcoded inclusion gap data
const districtData = [
    { district: 'Sitamarhi', enrolment: 15000, biometric: 4000, gap: 11000 },
    { district: 'Darbhanga', enrolment: 12500, biometric: 5200, gap: 7300 },
    { district: 'Madhubani', enrolment: 10800, biometric: 3600, gap: 7200 },
    { district: 'Saharsa', enrolment: 9200, biometric: 4100, gap: 5100 },
    { district: 'Purnia', enrolment: 8700, biometric: 4800, gap: 3900 },
];

const sitamarhiDetails = {
    totalBirths: 15000,
    biometricUpdates: 4000,
    exclusionGap: 11000,
    exclusionRate: 73.3,
    averageAge: '2.4 years',
    criticalPincodes: ['843302', '843314', '843325'],
    lastMobileVanDeployment: '45 days ago'
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const enrolment = payload.find(p => p.dataKey === 'enrolment')?.value || 0;
        const biometric = payload.find(p => p.dataKey === 'biometric')?.value || 0;
        const gap = enrolment - biometric;

        return (
            <div className="p-3 rounded-lg shadow-lg border bg-white border-slate-200">
                <p className="text-sm font-semibold text-uidai-navy">{label}</p>
                <div className="mt-2 space-y-1">
                    <p className="text-xs flex items-center justify-between gap-4">
                        <span className="text-slate-500">Birth Enrolments:</span>
                        <span className="font-semibold text-uidai-green">{enrolment.toLocaleString()}</span>
                    </p>
                    <p className="text-xs flex items-center justify-between gap-4">
                        <span className="text-slate-500">Biometric Updates:</span>
                        <span className="font-semibold text-uidai-navy">{biometric.toLocaleString()}</span>
                    </p>
                    <hr className="border-slate-200" />
                    <p className="text-xs flex items-center justify-between gap-4">
                        <span className="text-red-500 font-medium">At Risk:</span>
                        <span className="font-bold text-red-600">{gap.toLocaleString()}</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export default function GenesisTrigger() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="gov-card"
        >
            {/* Header */}
            <div className="gov-card-header flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Users className="text-amber-600" size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-uidai-navy text-lg">Genesis Trigger</h3>
                        <p className="text-xs text-slate-500">Child Inclusion Gap Analyzer</p>
                    </div>
                </div>
                <span className="gov-badge gov-badge-warning flex items-center gap-1">
                    <AlertCircle size={12} />
                    Action Required
                </span>
            </div>

            {/* Body */}
            <div className="gov-card-body">
                {/* Focus District Alert */}
                <div className="mb-5 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <Baby className="text-amber-600" size={16} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-amber-800 text-sm">Focus District: Sitamarhi</h4>
                            <p className="text-amber-700 text-sm mt-1">
                                <span className="font-bold text-red-600">{sitamarhiDetails.exclusionGap.toLocaleString()}</span> Children at Risk of Exclusion
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs">
                                    Gap Rate: {sitamarhiDetails.exclusionRate}%
                                </span>
                                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs">
                                    Avg Age: {sitamarhiDetails.averageAge}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Double Bar Chart */}
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={districtData} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis
                                dataKey="district"
                                tick={{ fontSize: 10, fill: '#64748b' }}
                                axisLine={{ stroke: '#e2e8f0' }}
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: '#64748b' }}
                                axisLine={{ stroke: '#e2e8f0' }}
                                tickFormatter={(value) => `${value / 1000}K`}
                            />
                            <Tooltip content={<CustomTooltip />} />

                            {/* Birth Enrolments */}
                            <Bar
                                dataKey="enrolment"
                                fill="#138808"
                                radius={[4, 4, 0, 0]}
                                name="Birth Enrolments"
                            >
                                {districtData.map((entry, index) => (
                                    <Cell
                                        key={`enrol-${index}`}
                                        fill={index === 0 ? '#138808' : '#86efac'}
                                    />
                                ))}
                            </Bar>

                            {/* Biometric Updates */}
                            <Bar
                                dataKey="biometric"
                                fill="#000080"
                                radius={[4, 4, 0, 0]}
                                name="Biometric Updates"
                            >
                                {districtData.map((entry, index) => (
                                    <Cell
                                        key={`bio-${index}`}
                                        fill={index === 0 ? '#000080' : '#93c5fd'}
                                    />
                                ))}
                                <LabelList
                                    dataKey="gap"
                                    position="top"
                                    formatter={(value) => `-${(value / 1000).toFixed(1)}K`}
                                    style={{ fontSize: 9, fill: '#dc2626', fontWeight: 600 }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-uidai-green"></div>
                        <span className="text-xs text-slate-600">Birth Enrolments</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-uidai-navy"></div>
                        <span className="text-xs text-slate-600">Biometric Updates</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-red-600">-Gap</span>
                        <span className="text-xs text-slate-600">Exclusion Risk</span>
                    </div>
                </div>

                {/* Insight Box */}
                <div className="mt-4 p-3 bg-slate-50 rounded-lg flex items-start gap-3">
                    <Fingerprint className="text-slate-400 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                        <p className="text-xs text-slate-600">
                            <span className="font-semibold text-uidai-navy">Insight:</span> High exclusion correlates with areas lacking permanent Aadhaar Seva Kendras.
                            Last mobile van deployment: <span className="font-medium text-amber-600">{sitamarhiDetails.lastMobileVanDeployment}</span>
                        </p>
                    </div>
                </div>

                {/* Action */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                        Critical Pincodes: {sitamarhiDetails.criticalPincodes.map((pc, i) => (
                            <span key={pc} className="font-mono font-medium text-uidai-navy">
                                {pc}{i < sitamarhiDetails.criticalPincodes.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="gov-action-btn gov-action-btn-primary flex items-center gap-2"
                    >
                        <Truck size={16} />
                        Deploy Mobile Van Unit
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
