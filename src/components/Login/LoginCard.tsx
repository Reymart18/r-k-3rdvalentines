import HeartBox from './HeartBox';

interface LoginCardProps {
    callsign: string;
    specialDay: string;
    heartOpen: boolean;
    errorMsg: string;
    onCallsignChange: (value: string) => void;
    onSpecialDayChange: (value: string) => void;
    onHeartToggle: () => void;
    onLogin: () => void;
}

export default function LoginCard({
    callsign,
    specialDay,
    heartOpen,
    errorMsg,
    onCallsignChange,
    onSpecialDayChange,
    onHeartToggle,
    onLogin,
}: LoginCardProps) {
    return (
        <div className="flex items-center justify-center px-4 pb-8 pt-4 sm:px-6 lg:w-1/2 lg:p-8">
            <div className="relative w-full max-w-md rounded-3xl border-2 border-pink-200 bg-white/90 p-5 shadow-2xl backdrop-blur-md sm:p-8" style={{
                boxShadow: '0 25px 60px -15px rgba(236, 72, 153, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
            }}>
                {/* 3D Heart Box */}
                <HeartBox heartOpen={heartOpen} onToggle={onHeartToggle} />

                {/* Header */}
                <div className="mb-6 mt-12 text-center sm:mb-8 sm:mt-16">
                    <h1 className="bg-gradient-to-r from-pink-500 via-red-500 to-pink-500 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                        My Dearest Love
                    </h1>
                    <p className="mt-2 text-xs italic text-pink-400 sm:text-sm">
                        ✨ Enter our secret codes to unlock my heart ✨
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-4 sm:space-y-6">
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400">
                            💌
                        </span>
                        <input
                            type="text"
                            value={callsign}
                            onChange={(e) => onCallsignChange(e.target.value)}
                            placeholder="Our secret callsign ending with 'st'"
                            className="w-full rounded-2xl border-2 border-pink-200 bg-white/70 py-3 pl-11 pr-4 text-sm text-pink-600 placeholder-pink-300 outline-none transition-all duration-300 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 sm:py-4 sm:pl-12 sm:text-base"
                        />
                    </div>

                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400 z-10">
                            📅
                        </span>
                        {!specialDay && (
                            <span className="absolute left-12 top-1/2 -translate-y-1/2 text-pink-300 pointer-events-none">
                                The magical day you said 'Yes'
                            </span>
                        )}
                        <input
                            type="date"
                            value={specialDay}
                            onChange={(e) => onSpecialDayChange(e.target.value)}
                            className={`w-full cursor-pointer rounded-2xl border-2 border-pink-200 bg-white/70 py-3 pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 sm:py-4 sm:pl-12 sm:text-base [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 ${specialDay ? '' : 'date-empty'}`}
                        />
                    </div>

                    <button onClick={onLogin} className="w-full rounded-2xl bg-gradient-to-r from-pink-500 via-red-500 to-pink-500 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-pink-600 hover:via-red-600 hover:to-pink-600 hover:shadow-xl active:scale-95 sm:py-4">
                        <span className="flex items-center justify-center gap-2">
                            <span>Unlock Our Love</span>
                            <span className="text-xl">💖</span>
                        </span>
                    </button>

                    {/* Error Message */}
                    {errorMsg && (
                        <div className="text-center animate-bounce">
                            <p className="text-red-500 font-medium text-sm bg-red-50 rounded-xl py-2 px-4 border border-red-200">
                                {errorMsg}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Message */}
                <div className="mt-8 text-center">
                    <p className="text-pink-400 text-sm">
                        Forever & Always 💕
                    </p>
                    <div className="flex justify-center gap-2 mt-3 text-2xl">
                        <span className="animate-bounce" style={{ animationDelay: '0s' }}>❤️</span>
                        <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🧡</span>
                        <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>💛</span>
                        <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>💚</span>
                        <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>💙</span>
                        <span className="animate-bounce" style={{ animationDelay: '0.5s' }}>💜</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
