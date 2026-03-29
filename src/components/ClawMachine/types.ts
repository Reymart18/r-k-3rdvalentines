export interface HeartConfig {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: number;
    color: string;
    innerColor: string;
    message: string;
}

export type GamePhase =
    | 'ready'       // waiting for player to move
    | 'moving'      // player is moving the claw with buttons
    | 'dropping'    // claw descending
    | 'grabbing'    // claw closing on a heart
    | 'rising'      // claw ascending with heart
    | 'delivering'  // claw moving to drop zone
    | 'releasing'   // claw opening, heart falling
    | 'won'         // showing prize message
    | 'resetting';  // claw returning to start

export interface GameState {
    phase: GamePhase;
    clawX: number;
    clawZ: number;
    clawY: number;
    clawOpen: number; // 0 = closed, 1 = open
    grabbedHeartIndex: number | null;
    wonMessage: string | null;
}

export interface GlassPanelProps {
    position: [number, number, number];
    rotation?: [number, number, number];
    size: [number, number];
}
