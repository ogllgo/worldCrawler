export function getTerminalWidth(): number {
    return process.stdout.columns;
}

export function getTerminalHeight(): number {
    return process.stdout.rows;
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function clamp(num: number, min: number, max: number) {
    return Math.max(min, Math.min(num, max));
}

export enum Direction {
    down,
    left,
    up,
    right
}