import { init } from "./views"

/**
 * Definition for each view in the resources/views folder, and the associated
 * JavaScript module is lazily loaded alongside its view.
 */
const views = init(
    [
        ["main", () => import("./views/main")],
        ["record", () => import("./views/record")],
        ["history", () => import("./views/history")],
        ["detail", () => import("./views/detail")],

        ["settings/settings", () => import("./views/settings/settings")],
        ["settings/toggleSensor", () => import("./views/settings/toggleSensor")],
        ["settings/sensorSampling", () => import("./views/settings/sensorSampling")],
        ["settings/about", () => import("./views/settings/about")],
        ["settings/samplingTumbler", () => import("./views/settings/samplingTumbler")]
    ],
    "./resources/views/"
);

// Select the first view (view-1) after 1 second
setTimeout(() => {
    views.navigate("main");
}, 0);
