import { useState, useRef, useEffect } from 'react';
import type { Story } from './types';

interface StoriesRowProps {
    stories: Story[];
    viewedStories: Set<number>;
    onOpenStory: (index: number) => void;
}

export default function StoriesRow({ stories, viewedStories, onOpenStory }: StoriesRowProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const updateScrollButtons = () => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        updateScrollButtons();
        el.addEventListener('scroll', updateScrollButtons, { passive: true });
        return () => el.removeEventListener('scroll', updateScrollButtons);
    }, []);

    const scroll = (dir: 'left' | 'right') => {
        scrollRef.current?.scrollBy({ left: dir === 'left' ? -240 : 240, behavior: 'smooth' });
    };

    return (
        <div className="relative px-1 pb-5 pt-2 sm:px-2 sm:pb-6 sm:pt-3">
            {/* Section title */}
            <div className="mb-3 flex items-center gap-2 px-2 sm:mb-4 sm:px-3">
                <div className="h-[1px] flex-1" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(251,113,133,0.3) 50%, transparent 100%)' }} />
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: 'rgba(251,113,133,0.5)' }}>
                    Memories
                </span>
                <div className="h-[1px] flex-1" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(251,113,133,0.3) 50%, transparent 100%)' }} />
            </div>

            {/* Scroll container */}
            <div className="relative group">
                {/* Left scroll button */}
                {canScrollLeft && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full opacity-85 backdrop-blur-md transition-all duration-300 hover:scale-110 sm:opacity-0 sm:group-hover:opacity-100"
                        style={{
                            background: 'rgba(251,113,133,0.2)',
                            border: '1px solid rgba(251,113,133,0.3)',
                            boxShadow: '0 0 15px rgba(251,113,133,0.2)',
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(251,113,133,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                )}

                {/* Right scroll button */}
                {canScrollRight && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full opacity-85 backdrop-blur-md transition-all duration-300 hover:scale-110 sm:opacity-0 sm:group-hover:opacity-100"
                        style={{
                            background: 'rgba(251,113,133,0.2)',
                            border: '1px solid rgba(251,113,133,0.3)',
                            boxShadow: '0 0 15px rgba(251,113,133,0.2)',
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(251,113,133,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                    </button>
                )}

                {/* Edge fade overlays */}
                {canScrollLeft && (
                    <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none" style={{ background: 'linear-gradient(90deg, #150a12 0%, transparent 100%)' }} />
                )}
                {canScrollRight && (
                    <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none" style={{ background: 'linear-gradient(270deg, #150a12 0%, transparent 100%)' }} />
                )}

                <div
                    ref={scrollRef}
                    className="flex gap-3 overflow-x-auto px-3 pb-3 sm:gap-5 sm:px-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {stories.map((story, index) => {
                        const isViewed = viewedStories.has(index);
                        const isHovered = hoveredIndex === index;

                        return (
                            <div
                                key={story.id}
                                className="flex flex-col items-center gap-2.5 cursor-pointer flex-shrink-0 transition-transform duration-300"
                                style={{ transform: isHovered ? 'translateY(-4px)' : 'translateY(0)' }}
                                onClick={() => onOpenStory(index)}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {/* Animated gradient ring */}
                                <div className="relative">
                                    {/* Glow effect behind ring */}
                                    {!isViewed && (
                                        <div
                                            className="absolute inset-[-4px] rounded-full opacity-60 blur-md"
                                            style={{
                                                background: 'conic-gradient(from 0deg, #fb7185, #e879a0, #f9a8c8, #fb7185)',
                                                animation: isHovered ? 'spin 3s linear infinite' : 'none',
                                            }}
                                        />
                                    )}

                                    <div
                                        className="relative rounded-full p-[2.5px] transition-all duration-500"
                                        style={{
                                            background: isViewed
                                                ? 'linear-gradient(135deg, rgba(120,100,110,0.4), rgba(90,70,80,0.3))'
                                                : 'conic-gradient(from 0deg, #fb7185, #f472b6, #e879a0, #f9a8c8, #fb7185)',
                                            boxShadow: isViewed
                                                ? 'none'
                                                : isHovered
                                                    ? '0 0 28px rgba(251,113,133,0.5), 0 0 8px rgba(251,113,133,0.3)'
                                                    : '0 0 16px rgba(251,113,133,0.25)',
                                        }}
                                    >
                                        <div
                                            className="rounded-full p-[2.5px]"
                                            style={{ background: '#150a12' }}
                                        >
                                            <div className="relative h-[58px] w-[58px] overflow-hidden rounded-full sm:h-[68px] sm:w-[68px]">
                                                <img
                                                    src={story.cover}
                                                    alt={story.label}
                                                    className="w-full h-full object-cover transition-transform duration-500"
                                                    style={{
                                                        transform: isHovered ? 'scale(1.12)' : 'scale(1)',
                                                        filter: isViewed ? 'brightness(0.7) saturate(0.6)' : 'brightness(1) saturate(1)',
                                                    }}
                                                />
                                                {/* Inner vignette on image */}
                                                <div
                                                    className="absolute inset-0 rounded-full pointer-events-none"
                                                    style={{
                                                        background: 'radial-gradient(circle, transparent 50%, rgba(21,10,18,0.4) 100%)',
                                                    }}
                                                />
                                                {/* Viewed check */}
                                                {isViewed && (
                                                    <div className="absolute inset-0 flex items-center justify-center rounded-full"
                                                        style={{ background: 'rgba(21,10,18,0.35)' }}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(251,113,133,0.7)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Label */}
                                <span
                                    className="max-w-[70px] truncate text-center text-[10px] font-medium transition-all duration-300 sm:max-w-[76px] sm:text-[11px]"
                                    style={{
                                        color: isViewed
                                            ? 'rgba(200,170,185,0.45)'
                                            : isHovered
                                                ? 'rgba(251,113,133,0.95)'
                                                : 'rgba(248,180,200,0.65)',
                                        textShadow: isHovered && !isViewed ? '0 0 12px rgba(251,113,133,0.3)' : 'none',
                                    }}
                                >
                                    {story.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Inline keyframes for spin */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
