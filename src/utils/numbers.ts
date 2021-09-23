export const deltaPercentage = ({ from, to }: { from: number; to: number }) => {
    return Number((((to - from) / from) * 100).toFixed(2));
};

export const average = (numbers: Array<number>): number => {
    return Number((numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(2));
};

export const isAWithinRangeXOfB = ({
    a,
    b,
    range,
    inclusive = true,
}: {
    a: number;
    b: number;
    range: number;
    inclusive?: boolean;
}) => {
    const left_boundry = b - range;
    const right_boundry = b + range;

    if (inclusive) {
        return a >= left_boundry && a <= right_boundry;
    } else {
        return a > left_boundry && a < right_boundry;
    }
};
