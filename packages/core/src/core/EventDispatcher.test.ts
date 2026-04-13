import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EventDispatcher } from './EventDispatcher';

describe('EventDispatcher & Utils', () => {
  let element: HTMLInputElement;

  beforeEach(() => {
    element = document.createElement('input');
    element.type = 'text';
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('triggers custom mouse events', () => {
    let triggered = false;
    element.addEventListener('mousedown', () => {
      triggered = true;
    });

    EventDispatcher.triggerMouseEvent(element, 'mousedown');
    expect(triggered).toBe(true);
  });

  it('sets native value overriding React setters', () => {
    let inputEventTriggered = false;
    let changeEventTriggered = false;

    element.addEventListener('input', () => {
      inputEventTriggered = true;
    });
    element.addEventListener('change', () => {
      changeEventTriggered = true;
    });

    EventDispatcher.triggerInputEvent(element, 'Hello World');

    expect(element.value).toBe('Hello World');
    expect(inputEventTriggered).toBe(true);
    expect(changeEventTriggered).toBe(true);
  });

  it('adds and removes mimic hover class', () => {
    EventDispatcher.toggleMimicHover(element, true);
    expect(element.classList.contains('actor-hover')).toBe(true);

    EventDispatcher.toggleMimicHover(element, false);
    expect(element.classList.contains('actor-hover')).toBe(false);
  });

  it('triggers a sequence of events on click', () => {
    let eventLog: string[] = [];
    const logEvent = (e: Event) => eventLog.push(e.type);

    const types = ['mouseenter', 'mouseover', 'mousedown', 'mouseup', 'click'];
    types.forEach((t) => element.addEventListener(t, logEvent));

    EventDispatcher.click(element);

    expect(eventLog).toEqual(expect.arrayContaining(types));

    // Fallback focus check
    expect(document.activeElement).toBe(element);
  });
});
