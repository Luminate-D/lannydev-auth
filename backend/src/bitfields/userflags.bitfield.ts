import { BitField } from './bitfield';

export class UserFlags extends BitField {
  static readonly System = 1 << 0;
  static readonly Disabled = 1 << 1;
  static readonly Verified = 1 << 2;
}
