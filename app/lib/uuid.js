export const getUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            var r = (16 * Math.random()) | 0,
                v;
            return ("x" == c ? r : (3 & r) | 8).toString(16);
        }
    );
}