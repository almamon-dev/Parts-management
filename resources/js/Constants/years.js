const currentYear = new Date().getFullYear();
const nextYear = currentYear + 1;
const startYear = 1980;

export const YEARS = Array.from({ length: nextYear - startYear + 1 }, (_, i) =>
    (nextYear - i).toString(),
);
