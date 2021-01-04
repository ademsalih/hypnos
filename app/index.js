import { Accelerometer } from "accelerometer";

if (Accelerometer) {
    console.log("This device has an accelerometer!")

    const acc = new Accelerometer({ frequency: 100 });

    acc.addEventListener("reading", () => {
        console.log(`${acc.x},${acc.y},${acc.z}`);
    });

    acc.start();
} else {
    console.log("No accelerometer detected :(")
}