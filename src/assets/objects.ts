// this file has all the object classses, like Creature or GameObject or Tile
import { Projectile, Colour, Square, World, getTerminalHeight, getTerminalWidth } from "../utils.js";
import { Chunk, chunkSize } from "../worldgen.js";
import { None } from "./terrain.js";
enum ActionType {
    interact,
    meleeAttack,
    rangedAttack,
    magicAttack
}

enum ObjectType {
    creature,
    object,
    tile
}

enum InteractionType {
    open,
    talk,
    collect,
    buy,
}

interface InteractAction {
    readonly type: ActionType.interact;
    interact: (type: InteractionType, allowedObjects: GameObject[], world: World) => void;
}

interface MeleeAttackAction {
    readonly type: ActionType.meleeAttack;
    attack: (range: number, stabbing: boolean, world: World) => Projectile;
}

interface RangedAttackAction {
    readonly type: ActionType.rangedAttack;
    attack: () => Projectile;
}

interface MagicAttackAction {
    readonly type: ActionType.magicAttack;
    attack: () => Projectile;
}

export type Action = {
    type: InteractAction | MeleeAttackAction | RangedAttackAction | MagicAttackAction; // this is the big part
    briefDesc: string; // a brief description of the action, like "stab" or "open a door"
                       // this is because the bottom has that `BIND:ACTION (DESC)`, which will use it
}
/**
 * Provides generic functionality for all game objects
 */
export class GameObject extends Square {
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
/**
 * Provides functionality for all creatures.
 */
export class Creature extends GameObject {
    public moveSpeed: number;
    public tileBelow: Tile;
    public actions: Action[];

    constructor(symbol: string, colour: Colour, moveSpeed: number, actions: Action[], desc: string, name: string, tileBelow: Tile = None, x: number, y: number) {
        super(name, symbol, colour, ObjectType.creature, desc, x, y);
        this.moveSpeed = moveSpeed;
        this.tileBelow = tileBelow;
        this.actions = actions;
    }
    
    wander(world: World) {
        let tilesToMove = Math.floor(Math.random() * this.moveSpeed) + 1;
        while (tilesToMove !== 0) {
            const chunkX: number = Math.floor(this.x / chunkSize);
            const chunkY: number = Math.floor(this.y / chunkSize);
            const chunksToCheck: Chunk[] = [];
            if (chunkX - 1 >= 0 && (chunkX - 1) * chunkSize < getTerminalWidth()) chunksToCheck.push(world.get(chunkX - 1, chunkY));
            if (chunkX + 1 >= 0 && (chunkX + 1) * chunkSize < getTerminalWidth()) chunksToCheck.push(world.get(chunkX + 1, chunkY));
            if (chunkY - 1 >= 0 && (chunkY - 1) * chunkSize < getTerminalWidth()) chunksToCheck.push(world.get(chunkX, chunkY - 1));
            if (chunkY + 1 >= 0 && (chunkY + 1) * chunkSize < getTerminalWidth()) chunksToCheck.push(world.get(chunkX, chunkY + 1));
        }
    }
}

export class Tile extends GameObject {
    public movementSpeedOnTile: number;

    constructor(movementSpeed: number, symbol: string, colour: Colour, name: string, desc: string, x: number = 0, y: number = 0) {
        super(name, symbol, colour, ObjectType.creature, desc, x, y);
        this.movementSpeedOnTile = movementSpeed;
    }
}