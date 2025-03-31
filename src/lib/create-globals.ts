export const createGlobals = (): Globals => {
  const globals = {};
  return {
    set: (key, value) => {
      globals[key] = value;
    },
    get: (key) => {
      return globals[key];
    },
  };
};

export type Globals = {
  set: (key: string, value: any) => void;
  get: (key: string) => any;
};
