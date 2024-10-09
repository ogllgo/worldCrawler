import { Square, Colour } from "../utils";
var ActionType;
(function (ActionType) {
    ActionType[ActionType["interact"] = 0] = "interact";
    ActionType[ActionType["meleeAttack"] = 1] = "meleeAttack";
    ActionType[ActionType["rangedAttack"] = 2] = "rangedAttack";
    ActionType[ActionType["magicAttack"] = 3] = "magicAttack";
})(ActionType || (ActionType = {}));
var InteractionType;
(function (InteractionType) {
    InteractionType[InteractionType["open"] = 0] = "open";
    InteractionType[InteractionType["talk"] = 1] = "talk";
    InteractionType[InteractionType["collect"] = 2] = "collect";
    InteractionType[InteractionType["buy"] = 3] = "buy";
})(InteractionType || (InteractionType = {}));
export class Creature extends Square {
    moveSpeed;
    isPlayer;
    actions;
    description;
    name;
    constructor(string, colour, moveSpeed, actions, desc, name, isPlayer = false, x = 0, y = 0) {
        super(string, colour, x, y);
        this.moveSpeed = moveSpeed;
        this.isPlayer = isPlayer;
        this.actions = actions;
        this.description = desc;
        this.name = name;
    }
    wander(board) {
    }
}
export const Creatures = {
    player: new Creature("p", Colour(255, 153, 204), 1.5, [
        {
            interact: (InteractionType.open, [])
        }
    ])
};
