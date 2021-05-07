export const createReading = (uuid, sensor, types, data) => {

    let items = data.slice(1, data.length);

    let values = []

    types.forEach((element, index) => {
        values.push({
            type: element,
            items: items[index]
        })
    });

    return {
        command: "ADD_READING",
        payload: {
            sessionIdentifier: uuid,
            sensorIdentifier: sensor,
            timestamps: data[0],
            data: values
        }
    }
}