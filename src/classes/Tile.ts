import { Colour } from "./assorted.js";
import BaseGameObject from "./_GameObject.js";
import { ObjectType } from "../assets/objects.js";

export default class Tile extends BaseGameObject {
    public movementSpeedOnTile: number;
    public enemySightMultiplier: number;
    public readonly type: ObjectType = ObjectType.tile;

    constructor(movementSpeed: number, symbol: string, colour: Colour, name: string, desc: string, sightMulti: number, x: number = 0, y: number = 0) {
        super(name, symbol, colour, ObjectType.creature, desc, x, y);
        this.movementSpeedOnTile = movementSpeed;
        this.enemySightMultiplier = sightMulti;
    }
}