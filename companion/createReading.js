export const createReading = (types, items) => {

    let values = []

    types.forEach((element, index) => {
        values.push({
            type: element,
            items: items[index]
        })
    });

    return values;
}