import { getTerminalHeight, getTerminalWidth } from "./utils.js";
import * as Noise from "./noise.js";
import * as Terrain from "./assets/tiles.js";
import Creature from "classes/Creature.js";
import Tile from "./classes/Tile.js";

export const chunkSize = 3;
export class Chunk {
    land: (Tile | Creature)[][];
    chunkX: number;
    chunkY: number;
    constructor(noise: Noise.Perlin, chunkX: number, chunkY: number) {
        this.chunkX = chunkX;
        this.chunkY = chunkY;
        this.land = [];
        for (let y = 0; y < chunkSize; y++) {
            this.land.push([]);
            for (let x = 0; x < chunkSize; x++) {
                const terrain: Tile = genPerlin(noise, chunkX * chunkSize + x, chunkY * chunkSize + y);
                this.land[y].push(terrain);
            }
        }
    }
    get(x: number, y: number): (Tile | Creature) {
        return this.land[y][x];
    }
    set(x: number, y: number, object: (Tile | Creature)): void {
        this.land[y][x] = object;
    }
}

function genPerlin(noise: Noise.Perlin, x: number, y: number): Tile {
    const noiseValue = noise.noise(x * 0.05, y * 0.05);
    const normalizedValue = Math.pow((noiseValue + 1) / 2, 2); 
    const terrainOptions = [Terrain.Grass, Terrain.Trees, Terrain.Rocks, Terrain.Mountains];
    for (let i = 0; i < terrainOptions.length; i++) {
        if (normalizedValue < (i + 1) / terrainOptions.length) return terrainOptions[i];
    }
    return terrainOptions[0];
}
export function genWorld() {
    let seed = Date.now() * Math.random(); // 2 million
    
    const noise: Noise.Perlin = new Noise.Perlin(seed);
    const world: Chunk[] = [];
    const maxChunkX = Math.floor(getTerminalWidth() / chunkSize);
    const maxChunkY = Math.floor(getTerminalHeight() / chunkSize);
    for (let chunkY = 0; chunkY <= maxChunkY; chunkY++) {
        for (let chunkX = 0; chunkX <= maxChunkX; chunkX++) {
            world.push(new Chunk(noise, chunkX, chunkY));
        }
    }

    return world;
}


/**
 * This is, essentially, an interface for Chunk[].
 */
export default class World {
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