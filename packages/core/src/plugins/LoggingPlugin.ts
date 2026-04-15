import type { Cursor } from '../core/Cursor';
import type { CursorPlugin } from './CursorPlugin';

export class LoggingPlugin implements CursorPlugin {
  name = 'LoggingPlugin';

  install(_cursor: Cursor) {
    console.log('[LoggingPlugin] Installed on Cursor instance.');
  }

  onMoveStart(x: number, y: number) {
    console.log(`[LoggingPlugin] Moving to (${x}, ${y})`);
  }

  onClickStart(target: Element) {
    console.log('[LoggingPlugin] Clicking on element:', target);
  }

  onHoverStart(target: Element) {
    console.log('[LoggingPlugin] Hovering on element:', target);
  }

  onTypeStart(text: string) {
    console.log(`[LoggingPlugin] Typing text: "${text}"`);
  }

  onDestroy() {
    console.log('[LoggingPlugin] Destroyed. Cleaning up...');
  }
}
