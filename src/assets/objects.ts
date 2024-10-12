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
    public sightRange: number;
    public tileUnder: Tile;
    public actions: Action[];
    public type: ObjectType = ObjectType.creature;

    constructor(symbol: string, colour: Colour, moveSpeed: number, actions: Action[], desc: string, name: string, x: number, y: number, sightRange: number, tileUnder: Tile = None) {
        super(name, symbol, colour, ObjectType.creature, desc, x, y);
        this.moveSpeed = moveSpeed;
        this.tileUnder = tileUnder;
        this.actions = actions;
        this.sightRange = sightRange;
    }
    
    wander(world: World) {
        let tilesToMove = Math.floor(Math.random() * this.moveSpeed) + 1;
        while (tilesToMove !== 0) {
            const allowedMovements: Map<string, boolean> = new Map();
    
            // Check movements in each direction
            if (this.y > 0) {
                const positionUp = world.getSquare(this.x, this.y - 1);
                if ('enemySightMultiplier' in positionUp) {
                    allowedMovements.set("up", positionUp.movementSpeedOnTile !== 0);
                } else {
                    allowedMovements.set("up", positionUp.tileUnder.movementSpeedOnTile !== 0);
                }
            }
            if (this.y < getTerminalHeight() - 1) {
                const positionDown = world.getSquare(this.x, this.y + 1);
                if ('enemySightMultiplier' in positionDown) {
                    allowedMovements.set("down", positionDown.movementSpeedOnTile !== 0);
                } else {
                    allowedMovements.set("down", positionDown.tileUnder.movementSpeedOnTile !== 0);
                }
            }
            if (this.x > 0) {
                const positionLeft = world.getSquare(this.x - 1, this.y);
                if ('enemySightMultiplier' in positionLeft) {
                    allowedMovements.set("left", positionLeft.movementSpeedOnTile !== 0);
                } else {
                    allowedMovements.set("left", positionLeft.tileUnder.movementSpeedOnTile !== 0);
                }
            }
            if (this.x < getTerminalWidth() - 1) {
                const positionRight = world.getSquare(this.x + 1, this.y);
                if ('enemySightMultiplier' in positionRight) {
                    allowedMovements.set("right", positionRight.movementSpeedOnTile !== 0);
                } else {
                    allowedMovements.set("right", positionRight.tileUnder.movementSpeedOnTile !== 0);
                }
            }
    
            // Create an array of allowed directions
            const directions = [...allowedMovements.entries()]
                .filter(([_, canMove]) => canMove) // Keep only directions with `true` value
                .map(([direction, _]) => direction); // Extract direction strings
    
            if (directions.length > 0) {
                // Pick a random direction
                const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    
                // Get the tileUnder of the new position
                let newPos: {x: number, y: number} = {x: this.x, y: this.y};
    
                switch (randomDirection) {
                    case "up":
                        newPos.y--;
                        break;
                    case "down":
                        newPos.y++;
                        this.y += 1;
                        break;
                    case "left":
                        newPos.x--;
                        this.x -= 1;
                        break;
                    case "right":
                        newPos.x++;
                        this.x += 1;
                        break;
                }
                const newSquare = world.getSquare(newPos.x, newPos.y);
                if ('enemySightMultiplier' in newSquare) {
                    const moveAmount = this.moveSpeed * newSquare.movementSpeedOnTile;
                    tilesToMove -= moveAmount;
                    tilesToMove = Math.max(0, tilesToMove);
                } else {
                    const moveAmount = this.moveSpeed * newSquare.tileUnder.movementSpeedOnTile;
                    tilesToMove -= moveAmount;
                    tilesToMove = Math.max(0, tilesToMove);
                }
            } else {
                // No allowed movements, exit the loop
                break;
            }
        }
    }
}

export class Tile extends GameObject {
    public movementSpeedOnTile: number;
    public enemySightMultiplier: number;
    public type: ObjectType = ObjectType.tile;

    constructor(movementSpeed: number, symbol: string, colour: Colour, name: string, desc: string, sightMulti: number, x: number = 0, y: number = 0) {
        super(name, symbol, colour, ObjectType.creature, desc, x, y);
        this.movementSpeedOnTile = movementSpeed;
        this.enemySightMultiplier = sightMulti;
    }
}