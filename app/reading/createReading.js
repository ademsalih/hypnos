export const createReading = (sensorName, timestamps, readings) => {
    return {
        "sensor": sensorName,
        "timestamps": timestamps,
        "values": [readings.f]
    }
}