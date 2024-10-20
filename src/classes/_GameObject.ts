import { Colour } from "./assorted.js";
import { ObjectType } from "../assets/objects.js";
import Square from "./Square.js";

/**
 * Provides generic functionality for all game objects
 */
export default class BaseGameObject extends Square {
    public name: string;
    public description: string;
    public type: ObjectType;

    constructor(name: string, symbol: string, colour: Colour, type: ObjectType, description: string = "", x: number = 0, y: number = 0) {
        super(symbol, colour);
        this.name = name;
        this.description = description === "" ? "No description" : description;
        this.type = type;
    }
}