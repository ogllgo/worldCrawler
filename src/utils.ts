import { Creature, GameObject, Tile } from "./assets/objects.js";
import * as constants from "./constants.js";
import { Chunk, genWorld, chunkSize } from "./worldgen.js";
export function getTerminalWidth(): number {
    return process.stdout.columns;
}
export function getTerminalHeight(): number {
    return process.stdout.rows;
}
console.log(getTerminalWidth(),getTerminalHeight());
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export enum Direction {
    down,
    left,
    up,
    right
}

export function clamp(num: number, min: number, max: number) {
    return Math.max(min, Math.min(num, max));
}

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
/**
 * This class allows base functionality for things in the game world.
 */
export class Square {
    public string: string;
    public colour: Colour;
    public x: number;
    public y: number;
    
    constructor(string: string, colour: Colour, x: number = 0, y: number = 0) {
        this.string = string;
        this.colour = colour;
        this.x = x;
        this.y = y;
    }

    public print(doColour: boolean = true) {
        if (doColour)
            process.stdout.write(this.colour.toString());
        process.stdout.write(this.string);
        process.stdout.write(constants.ColourCodes.reset);
    }
}

export class Projectile extends Square {
    private direction: Direction;
    private speed: number;
    constructor(x: number, y: number, direction: Direction, speed: number) {
        super("+", new Colour(133, 34, 1), x, y);
        this.direction = direction;
        this.speed = speed;
        this.update();
    }
    update() {
        switch (this.direction) {
            case (Direction.up): {
                this.y -= this.speed;
                break;
            }
            case Direction.down: {
                this.y += this.speed;
                break;
            }
            case Direction.left: {
                this.x -= this.speed;
                break;
            }
            case Direction.right: {
                this.x += this.speed;
                break;
            }
        }
    }
}


/**
 * This is, essentially, an interface for Chunk[].
 */
export class World {
    land: Chunk[] = genWorld();
    width: number = (Math.floor(getTerminalWidth() / chunkSize) + 1);
    
    /**
     * Get a chunk at the given X and Y position
     * @param chunkX The X position of the chunk
     * @param chunkY The Y position of the chunk
     * @returns The chunk at the X and Y
     */
    getChunk(chunkX: number, chunkY: number): Chunk {
        return this.land[chunkY * this.width + chunkX];
    }

    /**
     * Set a given chunk at the given X and Y position
     * @param chunkX The X position of the chunk
     * @param chunkY The Y position of the chunk
     * @param chunk The new chunk
     */
    setChunk(chunkX: number, chunkY: number, chunk: Chunk): void {
        this.land[chunkY * this.width + chunkX] = chunk;
    }
    
    /**
     * Get a tile in the world by the global X and Y position
     * @param globalX The global X position of the object relative to the top-left
     * @param globalY The global Y position of the object relative to the top-left
     * @returns the GameObject at the X and Y
     */
    getSquare(globalX: number, globalY: number): (Tile | Creature) {
        const chunk = this.land[Math.floor(globalY / chunkSize) * this.width + Math.floor(globalX / chunkSize)];
        return chunk.get(globalX % chunkSize, globalY % chunkSize);
    }

    /**
     * Set a tile in the world by the global X and Y position
     * @param globalX The global X position of the object relative to the top-left
     * @param globalY The global Y position of the object relative to the top-left
     * @param object The new object
     */
    setSquare(globalX: number, globalY: number, object: (Tile | Creature)): void {
        const chunk = this.land[Math.floor(globalY / chunkSize) * this.width + Math.floor(globalX / chunkSize)];
        chunk.set(globalX % chunkSize, globalY % chunkSize, object);
    }
    print(doColour: boolean = true): void {
        for (let tileY = 0; tileY < getTerminalHeight(); tileY++) {
            for (let tileX = 0; tileX < getTerminalWidth(); tileX++) {
                const chunkX = Math.floor(tileX / chunkSize);
                const chunkY = Math.floor(tileY / chunkSize);

                const chunk = this.getChunk(chunkX, chunkY);
                const localTileX = tileX % chunkSize;
                const localTileY = tileY % chunkSize;
                const square = chunk.get(localTileX, localTileY);
                square.print(doColour);
            }
        }
    }
}