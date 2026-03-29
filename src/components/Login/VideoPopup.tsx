interface VideoPopupProps {
    videoSrc: string;
    onClose: () => void;
}

export default function VideoPopup({ videoSrc, onClose }: VideoPopupProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative animate-popup"
                onClick={(e) => e.stopPropagation()}
                style={{
                    animation: 'popup 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
            >
                <div className="relative">
                    <div className="h-[70vw] w-[70vw] max-h-[360px] max-w-[360px] overflow-hidden rounded-3xl border-4 border-pink-400 shadow-2xl sm:h-96 sm:w-96 sm:border-8" style={{
                        boxShadow: '0 0 60px rgba(236, 72, 153, 0.6)'
                    }}>
                        <video
                            src={videoSrc}
                            autoPlay
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 animate-bounce text-3xl sm:-top-4 sm:text-4xl">💖</span>
                    <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 animate-bounce text-3xl sm:-bottom-4 sm:text-4xl" style={{ animationDelay: '0.2s' }}>💕</span>
                    <span className="absolute top-1/2 -left-5 -translate-y-1/2 animate-bounce text-2xl sm:-left-6 sm:text-3xl" style={{ animationDelay: '0.1s' }}>💗</span>
                    <span className="absolute top-1/2 -right-5 -translate-y-1/2 animate-bounce text-2xl sm:-right-6 sm:text-3xl" style={{ animationDelay: '0.3s' }}>💗</span>
                </div>
                <p className="mt-4 text-center text-xs text-white animate-pulse sm:text-sm">Tap anywhere to close 💕</p>
            </div>
        </div>
    );
}
