import { getTerminalHeight, getTerminalWidth } from "./utils.js";
import * as Noise from "./noise.js";
import * as Terrain from "./assets/terrain.js";
import { GameObject, Tile } from "./assets/objects.js";

export const chunkSize = 3;
export class Chunk {
    land: GameObject[][];
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
    get(x: number, y: number): Tile {
        return this.land[y][x];
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