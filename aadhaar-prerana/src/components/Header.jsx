import { motion } from 'framer-motion';

export default function Header() {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white border-b-4 sticky top-0 z-50"
            style={{ borderImage: 'linear-gradient(to right, #F26F22 33%, #FFFFFF 33%, #FFFFFF 66%, #138808 66%) 1' }}
        >
            <div className="px-6 py-3 flex items-center justify-between">
                {/* Left: Aadhaar Branding */}
                <div className="flex items-center gap-4">
                    {/* Aadhaar Logo Placeholder */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-uidai-saffron via-white to-uidai-green flex items-center justify-center shadow-md">
                            <span className="text-uidai-navy font-bold text-lg">आ</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-uidai-navy tracking-tight">
                                आधार-प्रेरणा
                            </h1>
                            <p className="text-xs text-slate-500 font-medium tracking-wide">
                                AADHAAR-PRERANA Policy Engine
                            </p>
                        </div>
                    </div>
                </div>

                {/* Center: Title */}
                <div className="hidden md:flex flex-col items-center">
                    <span className="text-sm font-semibold text-uidai-navy uppercase tracking-widest">
                        Policy Intelligence Dashboard
                    </span>
                    <span className="text-xs text-slate-400 mt-0.5">
                        Unique Identification Authority of India
                    </span>
                </div>

                {/* Right: Satyamev Jayate & Status */}
                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-xs font-medium text-green-700">Live Data</span>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-400">Last Sync</p>
                            <p className="text-xs font-medium text-slate-600">20 Jan 2026, 22:00 IST</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2">
                            {/* Ashoka Chakra stylized */}
                            <div className="w-8 h-8 rounded-full border-2 border-uidai-navy flex items-center justify-center">
                                <div className="w-4 h-4 rounded-full border border-uidai-navy relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-1 h-1 bg-uidai-navy rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-uidai-navy">सत्यमेव जयते</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Truth Alone Triumphs</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
