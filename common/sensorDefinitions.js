/**
 * Sensors of the smart watch must be defined here such
 * that they may be used in Hypnos.
 * 
 * The "sensor" property defines the identifier used for
 * data transfer, "displayName" property defines the
 * sensor name visible in Hypnos preferences. Properties
 * "typeCount" and "types" define the number of attributes
 * and the identifier for the attributes, respectively.
 */

export const SENSOR_DEFINITIONS = [
    {
        "sensor": "ACCELEROMETER",
        "displayName": "Accelerometer",
        "typeCount": 3,
        "types": [
            'X',
            'Y',
            'Z'
        ]
    },
    {
        "sensor": "HEARTRATE",
        "displayName": "Heart Rate",
        "maxFrequency": 1,
        "typeCount": 1,
        "types": [
            'BPM'
        ]
    },
    {
        "sensor": "BATTERY",
        "displayName": "Battery",
        "typeCount": 1,
        "types": [
            'PERCENT'
        ]
    },
    {
        "sensor": "GYROSCOPE",
        "displayName": "Gyroscope",
        "typeCount": 3,
        "types": [
            'X',
            'Y',
            'Z'
        ]
    },
    {
        "sensor": "MEMORY",
        "displayName": "Memory",
        "typeCount": 1,
        "types": [
            'PERCENT'
        ]
    },
    {
        "sensor": "BAROMETER",
        "displayName": "Barometer",
        "typeCount": 1,
        "types": [
            'PASCAL'
        ]
    }
]