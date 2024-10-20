import { ColourCodes } from "../constants.js";
import { Colour } from "./assorted.js";
/**
 * This class allows base functionality for things in the game world.
 */
export default class Square {
    public symbol: string;
    public colour: Colour;
    public x: number;
    public y: number;
    
    constructor(symbol: string, colour: Colour, x: number = 0, y: number = 0) {
        this.symbol = symbol;
        this.colour = colour;
        this.x = x;
        this.y = y;
    }

    public print(doColour: boolean = true) {
        if (doColour)
            process.stdout.write(this.colour.toString());
        process.stdout.write(this.symbol);
        process.stdout.write(ColourCodes.reset);
    }
}