import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Scene from './Scene';

const MESSAGE_TEXT = `Hello love love! Happy 3rd Valentines to us! We weren't avail to celebrate it in elegant way dahil nag asikaso at nagbenta tayo together ng araw na iyon, but i'm very happy and proud dahil ganon ang ginawa natin. New experience, and we did it together, first time together, and that's very very valuable to me! Sorry for not giving this to you in exact Valentines day. Damn we were so busy talaga, but thankyou for always understanding me, understanding my situation. Thankyou for not pressuring me, thankyou dahil Kahit hindi ko pa man mapantayan at mabigay ang magagara at special na bagay na binibigay mo sa akin, nandiyan ka pa rin at nakikinig. I know you don't want me to feel sorry for it, dahil you understand my situation, but I'm sorry po for that, for not being able to give you something special, for not being able to treat you ng kung ano-ano sa labas. Sorry po, dahil most of the time ikaw lang ang nakapagbibigay at madalas talagang nagbibigay, and hindi ko man lang mapantayan kahit kalahati. Palagi akong grateful sa kung paano mo ako tinatrato, sa kung paano mo ako minamahal at pinapahalagahan, at sa kung paano mo ako binibigyang pansin. Mahal na mahal po kita sobra! and pagnagkawork na talaga po tayo, babawi talaga po ako sayo. I love you so much, love love! you're very very special sa akin! Nalagpasan na natin ang 3rd Valentines natin, and next naman is 3rd Anniversary, wow talaga, ang bilis ng panahon pero hindi rin siya mabilis sa pakiramdam dahil we know kung ano ang struggle, ang pag-ibig, ang yakap, ang pag-unawa, ang pag-iyak na pinagdaanan natin together to be here, i'm very very glad that we are here! but simula pa lang naman, i have a feeling na aabot tayo dito at aabot tayo forever, dahil that's how we build this relationship. And that's why i'm very very proud sa kung ano ang mayroon tayo dahil we build this together. we held hands for this. Kaya ang sarap sa pakiramdam, dahil sa susunod, future na ang iisipin natin, sa kung paano tayo magsasama sa iisang bahay. Little steps, but sure ang patutunguhan. I love you so much love love!! dumating na si mama, baka mahuli pa akong naiyak wahahahahahahahaha happy 3rd valentines ulit!  peace for the wrong grammar! <3`;

export default function BottleExperience() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMessageOpen, setIsMessageOpen] = useState(false);
    const [isModalExpanded, setIsModalExpanded] = useState(false);
    const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
    const expandTimerRef = useRef<number | null>(null);
    const flapTimerRef = useRef<number | null>(null);

    const clearTimers = () => {
        if (expandTimerRef.current !== null) {
            window.clearTimeout(expandTimerRef.current);
            expandTimerRef.current = null;
        }
        if (flapTimerRef.current !== null) {
            window.clearTimeout(flapTimerRef.current);
            flapTimerRef.current = null;
        }
    };

    const closeModal = () => {
        clearTimers();
        setIsEnvelopeOpen(false);
        setIsModalExpanded(false);
        setIsMessageOpen(false);
    };

    useEffect(() => () => clearTimers(), []);

    return (
        <div className="relative flex w-full flex-col items-center gap-3 sm:gap-4" style={{ minHeight: '460px' }}>
            <div className="px-3 text-center text-xs uppercase tracking-[0.28em] sm:text-sm sm:tracking-[0.3em]" style={{ color: 'rgba(248,180,200,0.38)' }}>— message in a bottle —</div>
            <div className="relative h-[420px] w-full max-w-5xl sm:h-[520px]"
                style={{
                    background: 'transparent',
                    boxShadow: 'none',
                    border: 'none',
                }}
            >
                <Canvas
                    shadows
                    camera={{ position: [0, 2.5, 8], fov: 42, near: 0.1, far: 50 }}
                    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                    dpr={[1, 1.5]}
                    style={{ background: 'transparent', touchAction: 'none' }}
                    onCreated={({ gl }) => {
                        gl.toneMapping = THREE.ACESFilmicToneMapping;
                        gl.toneMappingExposure = 1.05;
                        gl.shadowMap.enabled = true;
                        gl.shadowMap.type = THREE.PCFSoftShadowMap;
                    }}
                >
                    <Scene
                        isOpen={isOpen}
                        onOpen={() => setIsOpen(true)}
                        onPaperClick={() => {
                            clearTimers();
                            setIsMessageOpen(true);
                            setIsModalExpanded(false);
                            setIsEnvelopeOpen(false);

                            // Grow from small envelope card into full modal first.
                            expandTimerRef.current = window.setTimeout(() => {
                                setIsModalExpanded(true);
                            }, 40);

                            // Then open the envelope flap and reveal message.
                            flapTimerRef.current = window.setTimeout(() => {
                                setIsEnvelopeOpen(true);
                            }, 320);
                        }}
                    />
                </Canvas>
            </div>

            {isMessageOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-4"
                    style={{
                        background: `rgba(12, 8, 16, ${isModalExpanded ? 0.72 : 0.1})`,
                        transition: 'background 360ms ease',
                    }}
                >
                    <button
                        type="button"
                        onClick={closeModal}
                        aria-label="Close envelope"
                        className="absolute left-1/2 top-3 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full sm:h-16 sm:w-16"
                        style={{
                            zIndex: 3,
                            border: '3px double rgba(123, 23, 44, 0.92)',
                            background: 'radial-gradient(circle at 30% 30%, #c65f78 0%, #9b1f3c 60%, #78122a 100%)',
                            boxShadow: '0 12px 24px rgba(0,0,0,0.32), inset 0 1px 8px rgba(255,255,255,0.2)',
                            color: '#ffe8ef',
                            letterSpacing: '0.08em',
                            fontWeight: 800,
                            cursor: 'pointer',
                        }}
                        title="Close letter"
                    >
                        <span
                            style={{
                                fontSize: 18,
                                lineHeight: 1,
                                transform: 'translateY(-1px)',
                                textShadow: '0 1px 2px rgba(0,0,0,0.35)',
                            }}
                        >
                            X
                        </span>
                    </button>

                    <div
                        className="relative mx-auto"
                        style={{
                            width: 'min(92vw, 860px)',
                            perspective: '1200px',
                            transformOrigin: 'center center',
                            transform: `translateY(${isModalExpanded ? '0' : '22px'}) scale(${isModalExpanded ? 1 : 0.35})`,
                            opacity: isModalExpanded ? 1 : 0.2,
                            transition: 'transform 440ms cubic-bezier(.2,.9,.2,1), opacity 440ms ease',
                        }}
                    >
                        {/* Letter content inside envelope */}
                        <div
                            style={{
                                background: '#fff9ef',
                                border: '1px solid rgba(90,66,40,0.18)',
                                borderRadius: '14px',
                                padding: 'clamp(14px, 3.8vw, 30px) clamp(14px, 4.4vw, 32px)',
                                height: 'min(64vh, 520px)',
                                maxHeight: 'min(64vh, 520px)',
                                display: 'flex',
                                alignItems: 'stretch',
                                transform: `translateY(${isEnvelopeOpen ? '0' : '26px'}) scale(${isEnvelopeOpen ? 1 : 0.98})`,
                                opacity: isEnvelopeOpen ? 1 : 0,
                                transition: 'all 620ms ease',
                                boxShadow: '0 18px 44px rgba(0,0,0,0.24)',
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                    overflowY: 'auto',
                                    paddingRight: 8,
                                    scrollbarWidth: 'thin',
                                }}
                            >
                                <p
                                    className="whitespace-pre-wrap text-[14px] leading-6 sm:text-[15px] sm:leading-7 md:text-[17px] md:leading-8"
                                    style={{
                                        color: '#2d2013',
                                        overflowWrap: 'anywhere',
                                        wordBreak: 'break-word',
                                        margin: 0,
                                    }}
                                >
                                    {MESSAGE_TEXT}
                                </p>
                            </div>
                        </div>

                        {/* Big envelope flap */}
                        <div
                            style={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                top: 0,
                                height: 'min(210px, 26vw)',
                                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                                background: '#efd9b3',
                                transformOrigin: 'top center',
                                transform: `rotateX(${isEnvelopeOpen ? '-165deg' : '0deg'})`,
                                transition: 'transform 700ms cubic-bezier(.2,.85,.2,1)',
                                borderTopLeftRadius: '14px',
                                borderTopRightRadius: '14px',
                                boxShadow: 'inset 0 -10px 24px rgba(0,0,0,0.08)',
                                pointerEvents: 'none',
                            }}
                        />

                        {/* Big envelope body */}
                        <div
                            style={{
                                marginTop: '-1px',
                                height: 'min(240px, 30vw)',
                                background: 'linear-gradient(180deg, #f3dfbd 0%, #e7cea3 100%)',
                                clipPath: 'polygon(0 0, 100% 0, 50% 92%)',
                                borderBottomLeftRadius: '14px',
                                borderBottomRightRadius: '14px',
                                boxShadow: '0 8px 18px rgba(0,0,0,0.18)',
                            }}
                        />

                        {/* Bottom-edge stamp */}
                        <div
                            style={{
                                position: 'absolute',
                                left: '50%',
                                bottom: 10,
                                transform: 'translateX(-50%) rotate(-9deg)',
                                width: 88,
                                height: 88,
                                borderRadius: '999px',
                                border: '3px double rgba(150, 23, 51, 0.9)',
                                color: 'rgba(150, 23, 51, 0.9)',
                                fontSize: 18,
                                fontWeight: 800,
                                letterSpacing: '0.08em',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                lineHeight: 1.05,
                                background: 'transparent',
                                boxShadow: 'inset 0 0 0 2px rgba(150,23,51,0.26), inset 0 0 18px rgba(150,23,51,0.22)',
                                textShadow: '0 0 1px rgba(150,23,51,0.55)',
                                opacity: 0.82,
                                pointerEvents: 'none',
                            }}
                        >
                            <span style={{ fontSize: 8, letterSpacing: '0.22em', marginBottom: 3 }}>SEALED</span>
                            <span>R&K</span>
                            <span style={{ fontSize: 8, letterSpacing: '0.12em', marginTop: 3 }}>LETTER</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}