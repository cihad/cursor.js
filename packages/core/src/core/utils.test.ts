import { describe, it, expect } from "vitest";
import { bezierCurve, generateHumanPath } from "./utils";

describe("utils (Math / Coordinates)", () => {
  it("should interpolate correctly with bezierCurve", () => {
    // 0 = p0, 1 = p3
    expect(bezierCurve(0, 0, 10, 20, 100)).toBeCloseTo(0);
    expect(bezierCurve(1, 0, 10, 20, 100)).toBeCloseTo(100);
  });

  it("should generate humanized path between two points", () => {
    const startX = 0,
      startY = 0,
      endX = 100,
      endY = 100;
    const path = generateHumanPath(startX, startY, endX, endY);

    // Check points
    expect(path.length).toBeGreaterThan(5); // At least some control points
    expect(path[0].x).toBeCloseTo(startX);
    expect(path[0].y).toBeCloseTo(startY);

    // Final point should reach approx the destination
    const last = path[path.length - 1];
    expect(last.x).toBeCloseTo(endX);
    expect(last.y).toBeCloseTo(endY);
  });
});
