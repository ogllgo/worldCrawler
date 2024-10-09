// This file will have all the terrain types in the game.
import { Colour } from "../utils.js";
import { Terrain } from "./objects.js";
export const Grass = new Terrain(3, // you run around at the speed of sound
"╷", new Colour(0, 128, 0));
export const Trees = new Terrain(2, // you have to evade the trees
Math.random() < 0.5 ? "╱" : "╲", new Colour(0, 82, 0));
export const Rocks = new Terrain(1, // you have to deal with tripping, so you walk slowly
"░", new Colour(79, 69, 53));
export const Mountains = new Terrain(0, // impassable
"▒", new Colour(61, 60, 59));
