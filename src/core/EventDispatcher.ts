import { setNativeValue } from "./utils";

export class EventDispatcher {
  static triggerMouseEvent(
    element: Element,
    eventType: string,
    options: MouseEventInit = {},
  ) {
    const defaultOptions: MouseEventInit = {
      bubbles: true,
      cancelable: true,
      detail: 1,
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      button: 0,
      relatedTarget: null,
    };

    const event = new MouseEvent(eventType, { ...defaultOptions, ...options });
    element.dispatchEvent(event);
  }

  static triggerInputEvent(
    element: HTMLInputElement | HTMLTextAreaElement,
    value: string,
  ) {
    // Override React 16+ native setters
    setNativeValue(element, value);

    const inputEvent = new Event("input", { bubbles: true });
    element.dispatchEvent(inputEvent);

    const changeEvent = new Event("change", { bubbles: true });
    element.dispatchEvent(changeEvent);
  }

  static toggleMimicHover(element: Element, state: boolean) {
    if (state) {
      // It can add mimic-hover class or try simulating
      element.classList.add("actor-hover");
    } else {
      element.classList.remove("actor-hover");
    }
  }

  static click(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    this.triggerMouseEvent(element, "mouseenter", { clientX: x, clientY: y });
    this.triggerMouseEvent(element, "mouseover", { clientX: x, clientY: y });
    this.triggerMouseEvent(element, "mousedown", { clientX: x, clientY: y });
    this.triggerMouseEvent(element, "mouseup", { clientX: x, clientY: y });

    // Simulate a native click
    this.triggerMouseEvent(element, "click", { clientX: x, clientY: y });

    // Node: Removed duplicate native element.click() fallback because
    // it doubles the click events triggered in event listeners.

    if (document.activeElement !== element) {
      try {
        element.focus();
      } catch (e) {}
    }
  }
}
