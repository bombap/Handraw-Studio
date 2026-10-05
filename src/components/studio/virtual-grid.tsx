import { useEffect, useRef, useState, type ReactNode } from "react";

export function VirtualGrid({
  count,
  rowHeight,
  minColWidth,
  maxCols,
  gap = 12,
  padding = 16,
  scrollToIndex,
  render,
}: {
  count: number;
  rowHeight: (colWidth: number) => number;
  minColWidth: number;
  maxCols: number;
  gap?: number;
  padding?: number;
  scrollToIndex?: number | null;
  render: (index: number) => ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [viewH, setViewH] = useState(640);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      setWidth(el.clientWidth);
      setViewH(el.clientHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const inner = Math.max(0, width - padding * 2);
  const cols = Math.max(1, Math.min(maxCols, Math.floor((inner + gap) / (minColWidth + gap)) || 1));
  const colW = cols > 0 ? (inner - gap * (cols - 1)) / cols : inner;
  const rh = rowHeight(Math.max(colW, 1));
  const stride = rh + gap;
  const rows = Math.ceil(count / cols);
  const total = padding * 2 + rows * rh + Math.max(0, rows - 1) * gap;
  const overscan = 2;
  const startRow = Math.max(0, Math.floor((scrollTop - padding) / stride) - overscan);
  const endRow = Math.min(rows, Math.ceil((scrollTop + viewH - padding) / stride) + overscan);

  useEffect(() => {
    const el = ref.current;
    if (scrollToIndex == null || scrollToIndex < 0 || !el || cols < 1) return;
    const row = Math.floor(scrollToIndex / cols);
    el.scrollTo({ top: Math.max(0, padding + row * stride - 8), behavior: "smooth" });
  }, [scrollToIndex, cols, stride, padding]);

  const cells: ReactNode[] = [];
  for (let row = startRow; row < endRow; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col;
      if (index >= count) break;
      cells.push(
        <div
          key={index}
          style={{
            position: "absolute",
            top: padding + row * stride,
            left: padding + col * (colW + gap),
            width: colW,
            height: rh,
          }}
        >
          {render(index)}
        </div>,
      );
    }
  }

  return (
    <div
      ref={ref}
      className="min-h-0 flex-1 overflow-y-auto"
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
    >
      <div style={{ position: "relative", height: total }}>{width > 0 ? cells : null}</div>
    </div>
  );
}
