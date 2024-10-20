import { ColourCodes } from "./constants.js";
import { sleep } from "./utils.js";
import World from "worldgen.js";

async function main() {
    let world: World = new World();
    console.clear();
    world.print();
    process.stdout.write(ColourCodes.reset);
    while (true) {
        await sleep(1000);
    }
}

main();