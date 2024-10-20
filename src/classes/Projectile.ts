import { ObjectType } from "assets/objects";
import BaseGameObject from "./_GameObject";
import { Colour } from "./assorted";

export default class Projectile extends BaseGameObject {
    public lifespan: number;

    constructor(lifespan: number, symbol: string, name: string, desc: string, type: ObjectType, colour: Colour, x: number, y: number) {
        super(name, symbol, colour, type, desc, x, y)
        this.lifespan = lifespan;
    }
}