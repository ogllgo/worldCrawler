// this file has all the object classses, like Creature or GameObject or Tile
import { getTerminalHeight, getTerminalWidth } from "../utils.js";
import { None } from "./tiles.js";
import Tile from "../classes/Tile.js";
import GameObject from "../classes/_GameObject.js";
import { Colour } from "classes/assorted.js";
import World from "worldgen.js";
import Projectile from "classes/Projectile.js";

enum ActionType {
    interact,
    meleeAttack,
    rangedAttack,
    magicAttack
}

export enum ObjectType {
    creature,
    object,
    tile
}

export enum InteractionType {
    open,
    talk,
    collect,
    buy,
}

export interface InteractAction {
    readonly type: ActionType.interact;
    interact: (type: InteractionType, allowedObjects: GameObject[], world: World) => void;
}

export interface MeleeAttackAction {
    readonly type: ActionType.meleeAttack;
    attack: (range: number, stabbing: boolean, world: World) => Projectile;
}

export interface RangedAttackAction {
    readonly type: ActionType.rangedAttack;
    attack: () => Projectile;
}

export interface MagicAction {
    readonly type: ActionType.magicAttack;
    action: () => Projectile | void;
}

export type Action = {
    type: InteractAction | MeleeAttackAction | RangedAttackAction | MagicAction; // this is the big part
    briefDesc: string; // a brief description of the action, like "stab" or "open a door" or "teleport"
                       // this is because the bottom has that `BIND:ACTION (DESC)`, which will use it
}