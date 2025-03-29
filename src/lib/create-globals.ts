export const createGlobals = () => {
    const globals = {};
    return {
        set: (key, value) => {
            globals[key] = value;
        },
        get: (key) => {
            return globals[key];
        }
    }
}