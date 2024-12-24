import { Flags } from '../src/flags';

describe('Flags', () => {
  let flags: Flags;

  beforeEach(() => {
    flags = new Flags();
  });

  it('should initialize flags to default values', () => {
    expect(flags.getZero()).toBe(false);
    expect(flags.getCout()).toBe(false);
    expect(flags.getMsb()).toBe(false);
    expect(flags.getEven()).toBe(false);
  });

  it('should set individual flags correctly', () => {
    flags.setZero(true);
    expect(flags.getZero()).toBe(true);

    flags.setCout(true);
    expect(flags.getCout()).toBe(true);

    flags.setMsb(true);
    expect(flags.getMsb()).toBe(true);

    flags.setEven(true);
    expect(flags.getEven()).toBe(true);
  });

  it('should calculate flags using setFlags with result 0', () => {
    flags.setFlags(0);
    expect(flags.getZero()).toBe(true);
    expect(flags.getCout()).toBe(false);
    expect(flags.getMsb()).toBe(false);
    expect(flags.getEven()).toBe(true);
  });

  it('should calculate flags using setFlags with an odd number', () => {
    flags.setFlags(5); // Binary: 00000101
    expect(flags.getZero()).toBe(false);
    expect(flags.getCout()).toBe(false);
    expect(flags.getMsb()).toBe(false);
    expect(flags.getEven()).toBe(false);
  });

  it('should calculate flags using setFlags with an even number', () => {
    flags.setFlags(4); // Binary: 00000100
    expect(flags.getZero()).toBe(false);
    expect(flags.getCout()).toBe(false);
    expect(flags.getMsb()).toBe(false);
    expect(flags.getEven()).toBe(true);
  });

  it('should calculate flags using setFlags with an overflow value', () => {
    flags.setFlags(0b110000000); // Binary: 100101100 (overflow for 8-bit)
    expect(flags.getZero()).toBe(false);
    expect(flags.getCout()).toBe(true); // > 255
    expect(flags.getMsb()).toBe(true); // Most significant bit is 1
    expect(flags.getEven()).toBe(true); // Odd number
  });

  it('should return a correct string representation', () => {
    flags.setZero(true);
    flags.setCout(false);
    flags.setMsb(true);
    flags.setEven(true);
    expect(flags.toString()).toBe('Flags: { zero: true, cout: false, msb: true, even: true }');
  });
});
