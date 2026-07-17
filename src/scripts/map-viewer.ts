// Shared pan/zoom/tooltip behavior for the region map and the local
// sub-maps. Pure viewBox manipulation on an inline SVG: wheel and pinch to
// zoom, drag to pan, plus +/−/reset buttons and a hover tooltip for any
// element carrying data-tip-title / data-tip-sub.

export interface MapViewerConfig {
  svg: SVGSVGElement;
  frame: HTMLElement;
  tooltip: HTMLElement;
  width: number;
  height: number;
  /** Maximum zoom-in factor relative to the full view (default 5). */
  maxZoom?: number;
  zoomInBtn?: HTMLElement | null;
  zoomOutBtn?: HTMLElement | null;
  resetBtn?: HTMLElement | null;
  /** Called with the current zoom factor (1 = full view) whenever it changes. */
  onZoom?: (scale: number) => void;
}

export interface MapViewer {
  /** True while the pointer interaction that just ended was a pan, not a click. */
  wasDrag(): boolean;
  reset(): void;
}

export function initMapViewer(config: MapViewerConfig): MapViewer {
  const { svg, frame, tooltip } = config;
  const BASE = { x: 0, y: 0, w: config.width, h: config.height };
  const MIN_W = BASE.w / (config.maxZoom ?? 5);
  let vb = { ...BASE };

  function hideTip() {
    tooltip.hidden = true;
  }

  function applyViewBox() {
    const maxX = BASE.x + BASE.w - vb.w + 60;
    const maxY = BASE.y + BASE.h - vb.h + 60;
    vb.x = Math.min(Math.max(vb.x, BASE.x - 60), Math.max(maxX, BASE.x - 60));
    vb.y = Math.min(Math.max(vb.y, BASE.y - 60), Math.max(maxY, BASE.y - 60));
    svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
    hideTip();
    config.onZoom?.(BASE.w / vb.w);
  }

  function clientToMap(clientX: number, clientY: number) {
    const rect = svg.getBoundingClientRect();
    return {
      x: vb.x + ((clientX - rect.left) / rect.width) * vb.w,
      y: vb.y + ((clientY - rect.top) / rect.height) * vb.h,
    };
  }

  function zoomAt(clientX: number, clientY: number, factor: number) {
    const focus = clientToMap(clientX, clientY);
    const w = Math.min(Math.max(vb.w / factor, MIN_W), BASE.w);
    const h = w * (BASE.h / BASE.w);
    vb = {
      x: focus.x - ((focus.x - vb.x) / vb.w) * w,
      y: focus.y - ((focus.y - vb.y) / vb.h) * h,
      w,
      h,
    };
    applyViewBox();
  }

  svg.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.0016));
    },
    { passive: false }
  );

  const pointers = new Map<number, { x: number; y: number }>();
  let dragDistance = 0;

  svg.addEventListener('pointerdown', (e) => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) dragDistance = 0;
  });

  svg.addEventListener('pointermove', (e) => {
    const prev = pointers.get(e.pointerId);
    if (!prev) return;
    const rect = svg.getBoundingClientRect();
    const scale = vb.w / rect.width;

    if (pointers.size === 1) {
      dragDistance += Math.hypot(e.clientX - prev.x, e.clientY - prev.y);
      // Capture only once a real drag starts — capturing on pointerdown would
      // retarget the click event to the svg and break marker clicks.
      if (dragDistance > 5 && !svg.hasPointerCapture(e.pointerId)) {
        svg.setPointerCapture(e.pointerId);
      }
      vb.x -= (e.clientX - prev.x) * scale;
      vb.y -= (e.clientY - prev.y) * scale;
      applyViewBox();
    } else if (pointers.size === 2) {
      if (!svg.hasPointerCapture(e.pointerId)) svg.setPointerCapture(e.pointerId);
      const other = [...pointers.entries()].find(([id]) => id !== e.pointerId)![1];
      const prevDist = Math.hypot(prev.x - other.x, prev.y - other.y);
      const newDist = Math.hypot(e.clientX - other.x, e.clientY - other.y);
      const midX = (e.clientX + other.x) / 2;
      const midY = (e.clientY + other.y) / 2;
      dragDistance += 10;
      if (prevDist > 0) zoomAt(midX, midY, newDist / prevDist);
      vb.x -= (midX - (prev.x + other.x) / 2) * scale;
      vb.y -= (midY - (prev.y + other.y) / 2) * scale;
      applyViewBox();
    }
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  });

  const releasePointer = (e: PointerEvent) => pointers.delete(e.pointerId);
  svg.addEventListener('pointerup', releasePointer);
  svg.addEventListener('pointercancel', releasePointer);

  const zoomAtCenter = (factor: number) => {
    const rect = svg.getBoundingClientRect();
    zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor);
  };
  config.zoomInBtn?.addEventListener('click', () => zoomAtCenter(1.4));
  config.zoomOutBtn?.addEventListener('click', () => zoomAtCenter(1 / 1.4));
  config.resetBtn?.addEventListener('click', () => {
    vb = { ...BASE };
    applyViewBox();
  });

  for (const el of svg.querySelectorAll<SVGGraphicsElement>('[data-tip-title]')) {
    el.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      tooltip.querySelector('.tip-title')!.textContent = el.dataset.tipTitle ?? '';
      tooltip.querySelector('.tip-sub')!.textContent = el.dataset.tipSub ?? '';
      const elRect = el.getBoundingClientRect();
      const frameRect = frame.getBoundingClientRect();
      tooltip.hidden = false;
      tooltip.style.left = `${elRect.left + elRect.width / 2 - frameRect.left}px`;
      tooltip.style.top = `${elRect.top - frameRect.top}px`;
    });
    el.addEventListener('pointerleave', hideTip);
  }

  config.onZoom?.(1);

  return {
    wasDrag: () => dragDistance > 5,
    reset: () => {
      vb = { ...BASE };
      applyViewBox();
    },
  };
}
