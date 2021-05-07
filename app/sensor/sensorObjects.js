import { accelerometer } from './sensors/accelerometer';
import { barometer } from './sensors/barometer';
import { battery } from './sensors/battery';
import { gyroscope } from './sensors/gyroscope';
import { heartrate } from './sensors/heartrate';
import { memory } from './sensors/memory';

export const SENSORS = [accelerometer, gyroscope, heartrate, battery, memory, barometer];