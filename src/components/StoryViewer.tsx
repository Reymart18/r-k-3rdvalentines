import type { Story } from './types';

interface StoryViewerProps {
    story: Story;
    activeSlide: number;
    progress: number;
    onTap: (e: React.MouseEvent<HTMLDivElement>) => void;
    onClose: () => void;
}

export default function StoryViewer({ story, activeSlide, progress, onTap, onClose }: StoryViewerProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #150a12 0%, #1c0e18 25%, #1a0c16 50%, #170b14 75%, #120810 100%)' }}>
            {/* Story image */}
            <div
                className="absolute inset-0 flex items-center justify-center"
                onClick={onTap}
            >
                <img
                    src={story.slides[activeSlide].img}
                    alt=""
                    className="w-full h-full object-contain"
                    style={{ animation: 'popup 0.25s ease-out' }}
                    key={`${story.id}-${activeSlide}`}
                />
                {/* Dark gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none" />
            </div>

            {/* Progress bars */}
            <div className="absolute left-0 right-0 top-0 z-10 flex gap-1 p-2 pt-3 sm:p-3 sm:pt-4">
                {story.slides.map((_, i) => (
                    <div key={i} className="flex-1 h-[3px] bg-white/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full transition-none"
                            style={{
                                width: i < activeSlide
                                    ? '100%'
                                    : i === activeSlide
                                        ? `${progress}%`
                                        : '0%',
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Story header */}
            <div className="absolute left-0 right-0 top-6 z-10 flex items-center px-3 sm:top-8 sm:px-4">
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-pink-400 sm:h-9 sm:w-9">
                        <img
                            src={story.cover}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="truncate text-xs font-semibold text-white sm:text-sm">{story.label}</p>
                        <p className="text-[11px] text-white/60 sm:text-xs">Just now</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="ml-auto p-1 text-xl text-white transition-transform hover:scale-110 sm:text-2xl"
                >
                    ✕
                </button>
            </div>

            {/* Caption at bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-10 p-4 sm:p-6">
                <p className="text-center text-base font-medium text-white drop-shadow-lg sm:text-lg">
                    {story.slides[activeSlide].caption}
                </p>
                <div className="flex justify-center gap-3 mt-3">
                    <span className="text-2xl animate-pulse"></span>
                </div>
            </div>
        </div>
    );
}
