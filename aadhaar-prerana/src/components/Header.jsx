export default function Header() {
    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            {/* Tricolor stripe */}
            <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-green-600"></div>

            <div className="px-5 py-3 flex items-center justify-between">
                {/* Left: Branding */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-slate-200 bg-slate-50 flex items-center justify-center">
                        <span className="text-blue-900 font-bold text-lg">आ</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-slate-800">
                            आधार-प्रेरणा
                        </h1>
                        <p className="text-xs text-slate-500">
                            AADHAAR-PRERANA Policy Engine
                        </p>
                    </div>
                </div>

                {/* Center: Title */}
                <div className="hidden md:block text-center">
                    <p className="text-sm font-medium text-slate-700">
                        Policy Intelligence Dashboard
                    </p>
                    <p className="text-xs text-slate-400">
                        Unique Identification Authority of India
                    </p>
                </div>

                {/* Right: Status */}
                <div className="flex items-center gap-4">
                    <div className="hidden lg:block text-right">
                        <p className="text-xs text-slate-400">Last Sync</p>
                        <p className="text-xs font-medium text-slate-600">20 Jan 2026, 22:00 IST</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-slate-700">सत्यमेव जयते</p>
                        <p className="text-[10px] text-slate-400">Truth Alone Triumphs</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
