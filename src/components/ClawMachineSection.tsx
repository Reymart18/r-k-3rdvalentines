import { Suspense } from 'react';
import ClawMachine from './ClawMachine';

export default function ClawMachineSection() {
    return (
        <div className="relative mx-auto flex w-full max-w-[1260px] flex-col items-center gap-5 px-4 sm:px-6 md:flex-row md:gap-16" style={{ minHeight: 'min(85vh, 780px)' }}>
            {/* Left Panel — 3D Claw Machine */}
            <div className="relative w-full flex-1" style={{ height: 'min(74vh, 740px)', minHeight: '360px' }}>
                <Suspense fallback={
                    <div className="flex items-center justify-center h-full">
                        <p className="text-sm animate-pulse" style={{ color: 'rgba(248,180,200,0.45)' }}>Loading claw machine...</p>
                    </div>
                }>
                    <ClawMachine />
                </Suspense>
            </div>

            {/* Right Panel — Text */}
            <div className="relative w-full flex-shrink-0 py-6 text-center md:w-[42%] md:py-0 md:text-left">
                <p className="text-sm md:text-base uppercase tracking-[0.3em] mb-5" style={{ color: 'rgba(248,180,200,0.35)' }}>— just for you —</p>
                <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl" style={{
                    fontFamily: "'Georgia', serif",
                    color: '#f9a8c8',
                    textShadow: '0 0 30px rgba(225,29,72,0.25), 0 4px 12px rgba(190,24,93,0.15)',
                }}>
                    I'd pick you{' '}
                    <span style={{ color: '#fb7185', textShadow: '0 0 40px rgba(244,63,94,0.35)' }}>every single time</span>
                </h2>
                <div className="my-6 flex items-center gap-3 justify-center md:justify-start" style={{ color: 'rgba(248,180,200,0.25)' }}>
                    <span style={{ width: '50px', height: '1px', background: 'rgba(248,180,200,0.18)', display: 'inline-block' }} />
                    <span className="text-sm">🎀</span>
                    <span style={{ width: '50px', height: '1px', background: 'rgba(248,180,200,0.18)', display: 'inline-block' }} />
                </div>
                <p className="mx-auto max-w-lg text-sm leading-relaxed sm:text-base md:mx-0 md:text-lg" style={{
                    fontFamily: "'Georgia', serif",
                    fontStyle: 'italic',
                    color: 'rgba(248,180,200,0.55)',
                    lineHeight: '1.9',
                }}>
                    Out of all the hearts in the world, my claw would always find its way to yours.
                    You're not just a prize, Angela Kate — you're the only one I'd ever want. 💕
                </p>
            </div>
        </div>
    );
}
