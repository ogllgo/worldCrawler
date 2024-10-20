export class Perlin {
    private p: number[];
    private perm: number[];
    public seed: number;

    constructor(seed: number) {
        this.seed = seed;
        this.p = [];
        this.perm = [];
        this.initialize(seed);
    }

    private initialize(seed: number) {
        // Initialize the permutation array
        seed = hashSingle(seed);
        for (let i = 0; i < 256; i++) {
            seed = hashSingle(seed);
            this.p[i] = i;
        }
        // Duplicate the permutation array to avoid overflows when indexing over 255
        this.perm = [...this.p, ...this.p];
        this.seed = seed;
    }

    private fade(t: number): number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    private lerp(a: number, b: number, t: number): number {
        return a + t * (b - a);
    }

    private grad(hash: number, x: number, y: number): number {
        const h = hash & 3; // Determine the gradient index
        const u = h < 2 ? x : y;
        const v = h < 2 ? y : x;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    public noise(x: number, y: number): number {
        const xi = Math.floor(x) & 255;
        const yi = Math.floor(y) & 255;

        const xf = x - Math.floor(x);
        const yf = y - Math.floor(y);

        const u = this.fade(xf);
        const v = this.fade(yf);

        const aa = this.perm[this.perm[xi] + yi];
        const ab = this.perm[this.perm[xi] + yi + 1];
        const ba = this.perm[this.perm[xi + 1] + yi];
        const bb = this.perm[this.perm[xi + 1] + yi + 1];

        const x1 = this.lerp(this.grad(aa, xf, yf), this.grad(ba, xf - 1, yf), u);
        const x2 = this.lerp(this.grad(ab, xf, yf - 1), this.grad(bb, xf - 1, yf - 1), u);

        return this.lerp(x1, x2, v);
    }
}
// https://stackoverflow.com/questions/35376941/a-pseudo-random-number-generator-based-on-2-inputs
export function hashTwo(x: number, y: number): number {
    x = x * 3266489917 + 374761393;
    x = (x << 17) | (x >> 15);

    /* mix around the bits in y and mix those into x: */
    x += y * 3266489917;

    /* Give x a good stir: */
    x *= 668265263;
    x ^= x >> 15;
    x *= 2246822519;
    x ^= x >> 13;
    x *= 3266489917;
    x ^= x >> 16;

    /* trim the result and scale it to a float in [0,1): */
    const scale = 1;  // Controls the frequency of the pools
    let mod = Math.sin(x * scale) + Math.sin(x * scale);

    // Normalize the mod value between [0, 1]
    mod = (mod + 2) / 4; 

    // Scale and trim the result to a float in [0,1):
    const baseValue = Math.pow((x & 0x00ffffff) * (1 / 0x1000000), 1);

    // Combine the base hash with the modulation for the "pools" effect
    return baseValue * mod;
}

export function hashSingle(x: number): number {
    // Mixing the bits of x
    x = x * 3266489917 + 374761393;
    x = (x << 17) | (x >> 15); // Bitwise rotation

    // Stir the bits of x
    x *= 668265263;
    x ^= x >> 15;
    x *= 2246822519;
    x ^= x >> 13;
    x *= 3266489917;
    x ^= x >> 16;

    // Normalize to a float in [0, 1)
    const baseValue = (x & 0x00ffffff) * (1 / 0x1000000); // Scale down to [0, 1)

    // Optional modulation for added variability
    const scale = 1;  // Controls the frequency of modulation
    const mod = (Math.sin(x * scale) + Math.sin(x * scale)) / 2 + 0.5; // Normalize between [0, 1]

    // Combine the base hash with the modulation effect
    return baseValue * mod;
}