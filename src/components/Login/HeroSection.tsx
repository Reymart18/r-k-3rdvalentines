interface HeroSectionProps {
    onVideoClick: (index: number) => void;
}

export default function HeroSection({ onVideoClick }: HeroSectionProps) {
    return (
        <div className="relative flex items-center justify-center px-4 pb-4 pt-10 sm:px-8 sm:pt-12 lg:w-1/2 lg:p-16">
            <div className="text-center lg:text-left">
                <h2 className="mb-3 text-4xl font-bold text-pink-500 sm:mb-4 sm:text-5xl lg:text-7xl" style={{
                    textShadow: '3px 3px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff'
                }}>
                    Happy
                </h2>
                <h1 className="mb-4 text-5xl font-bold text-red-500 sm:mb-6 sm:text-6xl lg:text-8xl" style={{
                    textShadow: '4px 4px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff'
                }}>
                    Valentine's
                </h1>
                <h2 className="mb-6 text-4xl font-bold text-pink-500 sm:mb-8 sm:text-5xl lg:text-7xl" style={{
                    textShadow: '3px 3px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff'
                }}>
                    Day!
                </h2>
                <div className="flex justify-center gap-3 text-3xl sm:gap-4 sm:text-4xl lg:justify-start lg:text-6xl">
                    <span className="animate-bounce cursor-pointer hover:scale-125 transition-transform" style={{ animationDelay: '0s' }} onClick={() => onVideoClick(0)}>💝</span>
                    <span className="animate-bounce cursor-pointer hover:scale-125 transition-transform" style={{ animationDelay: '0.2s' }} onClick={() => onVideoClick(1)}>💖</span>
                    <span className="animate-bounce cursor-pointer hover:scale-125 transition-transform" style={{ animationDelay: '0.4s' }} onClick={() => onVideoClick(2)}>💗</span>
                </div>
            </div>
        </div>
    );
}
