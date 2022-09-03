module.exports = class BH1750 {
  static POWER_DOWN = new Uint8Array([0x00]); // No active state
  static POWER_ON = new Uint8Array([0x01]); // Power on
  static RESET = new Uint8Array([0x07]); // Reset data register value
  static CONTINUOUS_LOW_RES_MODE = 'CONTINUOUS_LOW_RES_MODE';
  static CONTINUOUS_HIGH_RES_MODE_1 = 'CONTINUOUS_HIGH_RES_MODE_1';
  static CONTINUOUS_HIGH_RES_MODE_2 = 'CONTINUOUS_HIGH_RES_MODE_2';
  static ONE_TIME_LOW_RES_MODE = 'ONE_TIME_LOW_RES_MODE';
  static ONE_TIME_HIGH_RES_MODE_1 = 'ONE_TIME_HIGH_RES_MODE_1';
  static ONE_TIME_HIGH_RES_MODE_2 = 'ONE_TIME_HIGH_RES_MODE_2';

  static CONTINUOUS_MODES = {
    CONTINUOUS_LOW_RES_MODE: new Uint8Array([0x13]), // Start measurement at 4lx resolution. Time typically 16ms.
    CONTINUOUS_HIGH_RES_MODE_1: new Uint8Array([0x10]), // Start measurement at 1lx resolution. Time typically 120ms
    CONTINUOUS_HIGH_RES_MODE_2: new Uint8Array([0x11]), // Start measurement at 0.5lx resolution. Time typically 120ms
  };

  static ONE_TIME_MODES = {
    ONE_TIME_LOW_RES_MODE: new Uint8Array([0x23]), // Start measurement at 4lx resolution. Time typically 16ms. Device is automatically set to Power Down after measurement.
    ONE_TIME_HIGH_RES_MODE_1: new Uint8Array([0x20]), // Start measurement at 1lx resolution. Time typically 120ms. Device is automatically set to Power Down after measurement.
    ONE_TIME_HIGH_RES_MODE_2: new Uint8Array([0x21]), // Start measurement at 0.5lx resolution. Time typically 120ms.  Device is automatically set to Power Down after measurement.
  };

  constructor(bus, addr = 0x23) {
    this.bus = bus;
    this.addr = addr;

    this.reset();
    this.setSensitivity();
    this.powerDown();
  }

  _sendCommand(c) {
    this.bus.write(c, this.addr);
  }

  powerDown() {
    this._sendCommand(BH1750.POWER_DOWN);
  }

  powerOn() {
    this._sendCommand(BH1750.POWER_ON);
  }

  reset() {
    this.powerOn(); // It has to be powered on before resetting
    this._sendCommand(BH1750.RESET);
  }

  setContinuousMode(mode) {
    this._sendCommand(
      BH1750.CONTINUOUS_MODES[mode] ||
      BH1750.CONTINUOUS_MODES[BH1750.CONTINUOUS_LOW_RES_MODE]
    );
  }

  setOneTimeMode(mode) {
    this._sendCommand(
      BH1750.ONE_TIME_MODES[mode] ||
      BH1750.ONE_TIME_MODES[BH1750.ONE_TIME_LOW_RES_MODE]
    );
  }

  setSensitivity(v = 69) {
    // Valid values are 31 (lowest) to 254 (highest).
    this.sensitivity = v < 31 ? 31 :
      v > 254 ? 254 :
        v;
    this._sendCommand(new Uint8Array([0x40 | (this.sensitivity >> 5)]));
    this._sendCommand(new Uint8Array([0x60 | (this.sensitivity & 0x1f)]));
  }

  getResult() {
    return Number(this.bus.read(2, this.addr).reduce((memo, i) => memo + ('0' + i.toString(16)).slice(-2), '0x'));
  }

  oneTimeMeasurement(mode, additionalTime = 0) {
    this.reset();
    this.setOneTimeMode(mode);
    delay(
      (mode === BH1750.ONE_TIME_LOW_RES_MODE ? 25 : 135) *
      (this.sensitivity / 69) +
      additionalTime
    );
    return this.getResult();
  }
}
