export const wait_x_ms = ({ milliseconds }: { milliseconds: number }) =>
    new Promise(resolve => setTimeout(resolve, milliseconds));
