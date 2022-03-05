class XORShift {
  private seed: bigint;
  private state: bigint;

  constructor(seed: number) {
    while (seed === 0) {
      seed = Date.now() & 0xffffffff;
    }

    this.seed = BigInt(seed);
    this.state = BigInt(seed);
  }

  public next(): bigint {
    let s = this.state;

    s = BigInt.asUintN(64, s ^ s << 13n);
    s = BigInt.asUintN(64, s ^ s >> 7n);
    s = BigInt.asUintN(64, s ^ s << 17n);

    this.state = s;
    return this.state;
  }
}

export default XORShift;
