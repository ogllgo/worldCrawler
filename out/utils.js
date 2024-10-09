import * as constants from "./constants.js";
import { genWorld, chunkSize } from "./worldgen.js";
export function getTerminalWidth() {
    return process.stdout.columns;
}
export function getTerminalHeight() {
    return process.stdout.rows;
}
console.log(getTerminalWidth(), getTerminalHeight());
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export var Direction;
(function (Direction) {
    Direction[Direction["down"] = 0] = "down";
    Direction[Direction["left"] = 1] = "left";
    Direction[Direction["up"] = 2] = "up";
    Direction[Direction["right"] = 3] = "right";
})(Direction || (Direction = {}));
export function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}
export class Colour {
    r;
    g;
    b;
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    toString() {
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
    string;
    colour;
    x;
    y;
    constructor(string, colour, x = 0, y = 0) {
        this.string = string;
        this.colour = colour;
        this.x = x;
        this.y = y;
    }
    print(doColour = true) {
        if (doColour)
            process.stdout.write(this.colour.toString());
        process.stdout.write(this.string);
        process.stdout.write(constants.ColourCodes.reset);
    }
}
export class Projectile extends Square {
    direction;
    speed;
    constructor(x, y, direction, speed) {
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
export class Land {
    land;
    constructor() {
        this.land = genWorld();
    }
    get(chunkX, chunkY) {
        return this.land[chunkY * (Math.floor(getTerminalWidth() / chunkSize) + 1) + chunkX];
    }
    set(chunkX, chunkY, chunk) {
        this.land[chunkY * (Math.floor(getTerminalWidth() / chunkSize) + 1) + chunkX] = chunk;
    }
    print(doColour = true) {
        for (let tileY = 0; tileY < getTerminalHeight(); tileY++) {
            for (let tileX = 0; tileX < getTerminalWidth(); tileX++) {
                const chunkX = Math.floor(tileX / chunkSize);
                const chunkY = Math.floor(tileY / chunkSize);
                const chunk = this.get(chunkX, chunkY);
                const localTileX = tileX % chunkSize;
                const localTileY = tileY % chunkSize;
                const square = chunk.get(localTileX, localTileY);
                square.print(doColour);
            }
        }
    }
}
export class World {
    land = new Land();
    creatures;
    constructor(creatures) {
        this.creatures = creatures;
    }
}
