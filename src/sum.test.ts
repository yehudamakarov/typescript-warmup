import { sum } from "./sum";

test("Successfully adds numbers.", () => {
    expect(sum(1, 3)).toBe(4);
});
