"use client";

import { useEffect, useRef } from "react";

export default function GridBackground() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const cellSize = 95;
  const squareSize = 93;

  useEffect(() => {
    const svg = svgRef.current as SVGSVGElement;
    if (!svg) return;

    let squares: SVGRectElement[] = [];

    function buildGrid() {
      svg.innerHTML = "";
      squares = [];

      const width = window.innerWidth;
      const height = window.innerHeight;

      const cols = Math.ceil(width / cellSize);
      const rows = Math.ceil(height / cellSize);

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

      // 🔹 Vertical lines
      for (let i = 0; i <= cols; i++) {
        const x = i * cellSize;
        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );
        line.setAttribute("x1", x.toString());
        line.setAttribute("y1", "0");
        line.setAttribute("x2", x.toString());
        line.setAttribute("y2", height.toString());
        line.setAttribute("stroke", "#e5e5e5");
        line.setAttribute("stroke-width", "1");
        svg.appendChild(line);
      }

      // 🔹 Horizontal lines
      for (let i = 0; i <= rows; i++) {
        const y = i * cellSize;
        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );
        line.setAttribute("x1", "0");
        line.setAttribute("y1", y.toString());
        line.setAttribute("x2", width.toString());
        line.setAttribute("y2", y.toString());
        line.setAttribute("stroke", "#e5e5e5");
        line.setAttribute("stroke-width", "1");
        svg.appendChild(line);
      }

      // 🔹 Squares
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const rect = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
          ) as SVGRectElement;

          rect.setAttribute("x", (x * cellSize + 1).toString());
          rect.setAttribute("y", (y * cellSize + 1).toString());
          rect.setAttribute("width", squareSize.toString());
          rect.setAttribute("height", squareSize.toString());
          rect.setAttribute("fill", "#1e8279");
          rect.setAttribute("opacity", "0");
          rect.style.transition = "opacity 1.5s ease-in-out";

          svg.appendChild(rect);
          squares.push(rect);
        }
      }
    }

    function animateSquares() {
      squares.forEach((rect) => {
        if (Math.random() > 0.90) {
          rect.setAttribute("opacity", (Math.random() * 0.3).toString());
        } else {
          rect.setAttribute("opacity", "0");
        }
      });
    }

    buildGrid();
    animateSquares();

    const interval = setInterval(animateSquares, 1200);
    window.addEventListener("resize", buildGrid);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", buildGrid);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
    />
  );
}
