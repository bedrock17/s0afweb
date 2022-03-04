class Lfsr64 {
  private seed: bigint;
  private state: bigint;

  constructor(seed: number) {
    while(seed == 0) {
      seed = Date.now() & 0xffffffff;
    }

    this.seed = BigInt(seed);
    this.state = BigInt(seed);
  }

  public next(): bigint {
    const s = this.state;
    const b = BigInt.asUintN(64, (s >> 0n) ^ (s >> 1n) ^ (s >> 3n) ^ (s >> 4n));
    this.state = BigInt.asUintN(64, (s >> 1n) | (b << 63n));
    return this.state;
  }
}

export default Lfsr64;
