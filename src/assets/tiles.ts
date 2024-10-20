// this file exports all the lands
import { Colour } from "../classes/assorted.js";
import Tile from "../classes/Tile.js";

export const Grass = new Tile(
    3,
    "╷", 
    new Colour(0, 128, 0),
    "Grasslands",
    "Vast, open areas covered in tall grass.\nMovement is easy, with clear visibility, but there's little cover to hide behind.",
    1.2
);

export const Trees = new Tile(
    2,
    "╱", 
    new Colour(0, 82, 0),
    "Forests",
    "Dense, tree-covered areas with limited visibility.\nMovement is slower due to thick undergrowth and uneven terrain, making navigation tricky.",
    0.8
);

export const Rocks = new Tile(
    1,
    "░", 
    new Colour(79, 69, 53),
    "Highlands",
    "Elevated, rocky areas often near mountains.\nWhile you can move on them, you have to walk cautiously. The level terrain makes spotting enemies easier.",
    1.1
);

export const Mountains = new Tile(
    0,
    "▒", 
    new Colour(61, 60, 59),
    "Mountains",
    "Tall, impassable mountains.\nImpossible to walk on, but you do see far from that high up.",
    5
);

export const None = new Tile(
    0,
    " ",
    new Colour(0, 0, 0),
    "Empty tile",
    "This should not be seen. I messed up!",
    0
);