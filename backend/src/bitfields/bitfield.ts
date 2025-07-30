export class BitField {
  public constructor(public _bitfield: number) {}

  public has(flag: number): boolean {
    return (this._bitfield & flag) === flag;
  }

  public add(flag: number) {
    this._bitfield |= flag;
  }
}
