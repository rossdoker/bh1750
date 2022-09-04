# BH1750
Kaluma library for BH1750 light sensor

## Install
```bash
npm install https://github.com/rossdoker/bh1750
```

## Wiring
| Pi Pico | BH1750 |
| ------ | ------ |
| VBUS | VCC |
| GND | GND |
| SCL | SCL |
| SDA | SDA |

## Usage
```js
const { I2C } = require('i2c');
const BH1750 = require('bh1750')

const bus = new I2C(1, { mode: I2C.MASTER });
const bh1750 = new BH1750(bus);
bh1750.setContinuousMode(BH1750.CONTINUOUS_HIGH_RES_MODE_1);
setInterval(() => {
  console.log(bh1750.getResult());
}, 1000);
```

## API
### Class
A class for bh1750 sensor communicating with I2C interface.

#### new BH1750(bus, address)
Create an instance of bh1750 sensor.
- **`bus`** `<I2C>` An instance of `I2C` to communicate.
- **`address`** `<number>` I2C slave address. (7bit). Default: `0x23`.

#### bh1750.powerDown()
Turns off the bh1750 sensor.

#### bh1750.powerOn()
Turns on the bh1750 sensor.

#### bh1750.reset()
Resets the bh1750 sensor.

#### bh1750.setContinuousMode(mode)
Sets bh1750 to work in continuous measurement mode.
- **`mode`** `<string>` Continuous measurement mode. Use one of next: `BH1750.CONTINUOUS_LOW_RES_MODE`, `BH1750.CONTINUOUS_HIGH_RES_MODE_1`, `BH1750.CONTINUOUS_HIGH_RES_MODE_2`.

#### bh1750.setOneTimeMode(mode)
Sets bh1750 to work in one time measurement mode.
- **`mode`** `<string>` One time measurement mode. Use one of next: `BH1750.ONE_TIME_LOW_RES_MODE`, `BH1750.ONE_TIME_HIGH_RES_MODE_1`, `BH1750.ONE_TIME_HIGH_RES_MODE_2`.

#### bh1750.setSensitivity(v)
Sets sensitivity of measurement.
- **`v`** `<number>`Min: `31`. Max: `254`. Default: `69`.

#### bh1750.getResult()
Returns result of measurement.
- **`Returns`** `<number>` Result of measurement in lx.

#### bh1750.oneTimeMeasurement(mode, additionalTime)
Sets bh1750 to work in one time measurement mode and returns result of measurement.
- **`mode`** `<string>` One time measurement mode. Use one of next: `BH1750.ONE_TIME_LOW_RES_MODE`, `BH1750.ONE_TIME_HIGH_RES_MODE_1`, `BH1750.ONE_TIME_HIGH_RES_MODE_2`.
- **`additionalTime`** `<number>` Additional time in millisecond to wait before read the  result of measurement. Default: `0`.
