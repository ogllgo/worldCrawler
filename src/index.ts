import * as constants from "./constants.js";
import * as utils from "./utils.js";
import { genWorld, chunkSize, Chunk } from "./worldgen.js";

class Player extends utils.Square {
    constructor(x: number, y: number) {
        super("p", new utils.Colour(235, 171, 52));
    }
};

async function main() {
    let world: utils.World = new utils.World();
    console.clear();
    world.print();
    process.stdout.write(constants.ColourCodes.reset);
    while (true) {
        await utils.sleep(1000);
    }
}

main();