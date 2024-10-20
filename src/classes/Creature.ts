import { Action, ObjectType } from "assets/objects";
import { None } from "assets/tiles";
import { getTerminalHeight, getTerminalWidth } from "utils";
import World from "worldgen";
import { Colour } from "./assorted";
import BaseGameObject from "./_GameObject";
import Tile from "./Tile";

/**
 * Provides functionality for all creatures.
 */
export default class Creature extends BaseGameObject {
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