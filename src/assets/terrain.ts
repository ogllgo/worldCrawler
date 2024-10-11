// this file exports all the lands
import { Square, Colour } from "../utils.js";
import { Tile } from "./objects.js";

export const Grass = new Tile(
    3, // you run around at the speed of sound
    "╷", 
    new Colour(0, 128, 0)
);

export const Trees = new Tile(
    2, // you have to evade the trees
    "╱", 
    new Colour(0, 82, 0)
);

export const Rocks = new Tile(
    1, // you have to deal with tripping, so you walk slowly
    "░", 
    new Colour(79, 69, 53)
);

export const Mountains = new Tile(
    0, // impassable
    "▒", 
    new Colour(61, 60, 59)
);

export const None = new Tile(
    0, // defaukt
    " ", // default
    new Colour(0, 0, 0) // default
);