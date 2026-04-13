export function bezierCurve(
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number,
): number {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  let p = uuu * p0; // (1-t)^3 * p0
  p += 3 * uu * t * p1; // 3 * (1-t)^2 * t * p1
  p += 3 * u * tt * p2; // 3 * (1-t) * t^2 * p2
  p += ttt * p3; // t^3 * p3

  return p;
}

export function generateHumanPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
) {
  const distance = Math.sqrt(
    Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2),
  );

  // Control points based on distance for curvature
  const cp1X =
    startX + (endX - startX) * 0.25 + (Math.random() - 0.5) * distance * 0.2;
  const cp1Y =
    startY + (endY - startY) * 0.25 + (Math.random() - 0.5) * distance * 0.2;

  const cp2X =
    startX + (endX - startX) * 0.75 + (Math.random() - 0.5) * distance * 0.2;
  const cp2Y =
    startY + (endY - startY) * 0.75 + (Math.random() - 0.5) * distance * 0.2;

  const points = [];
  // Number of steps based on distance
  const steps = Math.max(10, Math.floor(distance / 5));

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Ease-in-out time calculation
    const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    points.push({
      x: bezierCurve(easeT, startX, cp1X, cp2X, endX),
      y: bezierCurve(easeT, startY, cp1Y, cp2Y, endY),
    });
  }

  return points;
}

// React 16+ native setter wrapper
export function setNativeValue(
  element: HTMLInputElement | HTMLTextAreaElement,
  value: string,
) {
  const valueSetter = Object.getOwnPropertyDescriptor(element, "value")?.set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(
    prototype,
    "value",
  )?.set;

  if (valueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter?.call(element, value);
  } else if (valueSetter) {
    valueSetter.call(element, value);
  } else {
    element.value = value;
  }
}
