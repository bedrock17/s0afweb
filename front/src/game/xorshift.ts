class XORShift {
  private seed: number;
  private state: number;

  constructor(seed: number) {
    while (seed === 0) {
      seed = Date.now() & 0xffffffff;
    }

    this.seed = seed;
    this.state = seed;
  }

  public next(): number {
    let s = this.state;
    s = s ^ s << 13;
    s = s ^ s >> 17;
    s = s ^ s << 5;
    if (s < 0) {
      s += 2147483647;
    }
    this.state = s;
    return this.state;
  }
}

export default XORShift;
