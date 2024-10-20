import { clamp } from "utils";

export class Colour {
    r: number;
    g: number;
    b: number;
    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    toString(): string {
        this.r = clamp(this.r, 0, 255);
        this.g = clamp(this.g, 0, 255);
        this.b = clamp(this.b, 0, 255);
        return `\u001b[38;2;${this.r};${this.g};${this.b}m`;
    }
}