import { Projectile, Colour, Square } from "../utils.js";

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
    interact: (type: InteractAction, allowedObjects: GameObject[]) => void;
}

interface MeleeAttackAction {
    readonly type: ActionType.meleeAttack;
    attack: () => Projectile;
}

interface RangedAttackAction {
    readonly type: ActionType.rangedAttack;
    attack: () => Projectile;
}

interface MagicAttackAction {
    readonly type: ActionType.magicAttack;
    attack: () => Projectile;
}

export type Action = InteractAction | MeleeAttackAction | RangedAttackAction | MagicAttackAction;
/**
 * Provides generic functionality for all game objects
 */
export class GameObject extends Square {
    public name: string;
    public description: string;
    public actions: Action[];
    public type: ObjectType;

    constructor(name: string, symbol: string, colour: Colour, actions: Action[], type: ObjectType, description: string = "", x: number = 0, y: number = 0) {
        super(symbol, colour);
        this.name = name;
        this.description = description === "" ? "No description" : description;
        this.actions = actions;
        this.type = type;

    }

}
/**
 * Provides functionality for all creatures.
 */
export class Creature extends GameObject {
    public moveSpeed: number;
    public tileBelow: Tile;
    constructor(symbol: string, colour: Colour, moveSpeed: number, actions: Action[], desc: string, name: string, x: number = 0, y: number = 0) {
        super(name, symbol, colour, actions, ObjectType.creature, desc, x, y);
        this.moveSpeed = moveSpeed;
    }
}

export class Tile extends Square {
    public movementSpeedOnTile: number;

    constructor(movementSpeed: number, string: string, colour: Colour, x: number = 0, y: number = 0) {
        super(string, colour, x, y);
        this.movementSpeedOnTile = movementSpeed;
    }
}