import { Square } from "../utils.js";
var ActionType;
(function (ActionType) {
    ActionType[ActionType["interact"] = 0] = "interact";
    ActionType[ActionType["meleeAttack"] = 1] = "meleeAttack";
    ActionType[ActionType["rangedAttack"] = 2] = "rangedAttack";
    ActionType[ActionType["magicAttack"] = 3] = "magicAttack";
})(ActionType || (ActionType = {}));
var ObjectType;
(function (ObjectType) {
    ObjectType[ObjectType["creature"] = 0] = "creature";
    ObjectType[ObjectType["object"] = 1] = "object";
    ObjectType[ObjectType["tile"] = 2] = "tile";
})(ObjectType || (ObjectType = {}));
var InteractionType;
(function (InteractionType) {
    InteractionType[InteractionType["open"] = 0] = "open";
    InteractionType[InteractionType["talk"] = 1] = "talk";
    InteractionType[InteractionType["collect"] = 2] = "collect";
    InteractionType[InteractionType["buy"] = 3] = "buy";
})(InteractionType || (InteractionType = {}));
/**
 * Provides generic functionality for all game objects
 */
export class GameObject extends Square {
    name;
    description;
    actions;
    type;
    constructor(name, symbol, colour, actions, type, description = "", x = 0, y = 0) {
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
    moveSpeed;
    constructor(symbol, colour, moveSpeed, actions, desc, name, x = 0, y = 0) {
        super(name, symbol, colour, actions, ObjectType.creature, desc, x, y);
        this.moveSpeed = moveSpeed;
    }
}
export class Tile extends Square {
    movementSpeedOnTile;
    constructor(movementSpeed, string, colour, x = 0, y = 0) {
        super(string, colour, x, y);
        this.movementSpeedOnTile = movementSpeed;
    }
}
