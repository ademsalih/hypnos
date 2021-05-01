export const createReading = (sensorName, timestamps, types, items) => {

    let values = []

    types.forEach((element, index) => {
        values.push({
            type: element,
            items: items[index]
        })
    });

    return {
        "sensor": sensorName,
        "timestamps": timestamps,
        "values": values
    }

}