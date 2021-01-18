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
    ],
    "./resources/views/"
);

// Select the first view (view-1) after 1 second
setTimeout(() => {
    views.navigate("main");
}, 0);
