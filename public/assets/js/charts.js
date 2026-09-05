/**
 * HONEYCHAIN — Standalone Zero-Dependency SVG Data Visualizer (Bold Typography Theme)
 * Renders crisp, responsive charts for IoT telemetry, honey yields, and batch metrics.
 */

(function(global) {
  const HoneyCharts = {
    /**
     * Renders a responsive line / area chart in an SVG container
     */
    renderLineChart: function(containerId, options) {
      const container = typeof containerId === "string" ? document.getElementById(containerId) : containerId;
      if (!container) return;

      const labels = options.labels || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const data = options.data || [34.5, 34.8, 35.0, 35.2, 34.9, 34.8, 35.1];
      const strokeColor = options.strokeColor || "#ff3e00";
      const fillColor = options.fillColor || "rgba(255, 62, 0, 0.2)";
      const unit = options.unit || "";
      const minVal = options.minVal !== undefined ? options.minVal : Math.min(...data) * 0.95;
      const maxVal = options.maxVal !== undefined ? options.maxVal : Math.max(...data) * 1.05;

      const width = options.width || 600;
      const height = options.height || 220;
      const padding = { top: 20, right: 30, bottom: 40, left: 50 };

      const chartW = width - padding.left - padding.right;
      const chartH = height - padding.top - padding.bottom;

      // Coordinate mapping
      const points = data.map((val, idx) => {
        const x = padding.left + (idx / (data.length - 1 || 1)) * chartW;
        const normalized = (val - minVal) / (maxVal - minVal || 1);
        const y = padding.top + (1 - normalized) * chartH;
        return { x, y, val, label: labels[idx] };
      });

      // SVG Path
      const pathD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? "M" : "L"} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`, "");
      const areaD = `${pathD} L ${points[points.length - 1].x},${padding.top + chartH} L ${points[0].x},${padding.top + chartH} Z`;

      // Y-axis gridlines
      const yTicks = 4;
      let gridSvg = "";
      for (let i = 0; i <= yTicks; i++) {
        const val = minVal + (i / yTicks) * (maxVal - minVal);
        const y = padding.top + (1 - i / yTicks) * chartH;
        gridSvg += `
          <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="rgba(245, 245, 245, 0.12)" stroke-width="1" stroke-dasharray="3,3" />
          <text x="${padding.left - 8}" y="${y + 4}" font-size="10" font-weight="700" fill="#a3a3a3" text-anchor="end" font-family="ui-monospace, monospace">${val.toFixed(1)}${unit}</text>
        `;
      }

      // X-axis labels
      let xLabelsSvg = "";
      points.forEach(pt => {
        xLabelsSvg += `
          <text x="${pt.x}" y="${height - 12}" font-size="10" font-weight="700" fill="#a3a3a3" text-anchor="middle" font-family="ui-monospace, monospace">${pt.label}</text>
        `;
      });

      // Data dots & tooltips
      let dotsSvg = "";
      points.forEach(pt => {
        dotsSvg += `
          <circle cx="${pt.x}" cy="${pt.y}" r="4.5" fill="#0a0a0a" stroke="${strokeColor}" stroke-width="2.5" class="chart-dot">
            <title>${pt.label}: ${pt.val}${unit}</title>
          </circle>
        `;
      });

      const svg = `
        <svg viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;display:block;">
          <defs>
            <linearGradient id="areaGrad-${containerId}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.35" />
              <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0.0" />
            </linearGradient>
          </defs>
          ${gridSvg}
          ${xLabelsSvg}
          <path d="${areaD}" fill="url(#areaGrad-${containerId})" />
          <path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          ${dotsSvg}
        </svg>
      `;

      container.innerHTML = svg;
    },

    /**
     * Renders a responsive bar chart
     */
    renderBarChart: function(containerId, options) {
      const container = typeof containerId === "string" ? document.getElementById(containerId) : containerId;
      if (!container) return;

      const items = options.items || [
        { label: "Verified", value: 12, color: "#10b981" },
        { label: "Processing", value: 5, color: "#f59e0b" },
        { label: "Pending", value: 3, color: "#ff3e00" }
      ];

      const maxVal = Math.max(...items.map(i => i.value), 1) * 1.15;
      const width = options.width || 400;
      const height = options.height || 200;
      const padding = { top: 20, right: 20, bottom: 35, left: 40 };

      const chartW = width - padding.left - padding.right;
      const chartH = height - padding.top - padding.bottom;
      const barWidth = Math.min(chartW / items.length - 20, 50);

      let barsSvg = "";
      items.forEach((item, idx) => {
        const x = padding.left + idx * (chartW / items.length) + (chartW / items.length - barWidth) / 2;
        const barH = (item.value / maxVal) * chartH;
        const y = padding.top + chartH - barH;

        barsSvg += `
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="3" fill="${item.color}">
            <title>${item.label}: ${item.value}</title>
          </rect>
          <text x="${x + barWidth / 2}" y="${y - 6}" font-size="12" font-weight="900" fill="#f5f5f5" text-anchor="middle" font-family="ui-monospace, monospace">${item.value}</text>
          <text x="${x + barWidth / 2}" y="${height - 10}" font-size="10" font-weight="800" letter-spacing="0.1em" fill="#a3a3a3" text-anchor="middle" text-transform="uppercase">${item.label}</text>
        `;
      });

      const svg = `
        <svg viewBox="0 0 ${width} ${height}" style="width:100%;height:auto;display:block;">
          <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${width - padding.right}" y2="${padding.top + chartH}" stroke="rgba(245, 245, 245, 0.2)" stroke-width="1.5" />
          ${barsSvg}
        </svg>
      `;

      container.innerHTML = svg;
    },

    /**
     * Renders a responsive donut chart for floral origins
     */
    renderDonutChart: function(containerId, options) {
      const container = typeof containerId === "string" ? document.getElementById(containerId) : containerId;
      if (!container) return;

      const segments = options.segments || [
        { label: "Mustard", percent: 45, color: "#ff3e00" },
        { label: "Acacia", percent: 25, color: "#f59e0b" },
        { label: "Multifloral", percent: 20, color: "#10b981" },
        { label: "Sidr", percent: 10, color: "#38bdf8" }
      ];

      const size = options.size || 200;
      const strokeW = 26;
      const radius = (size - strokeW) / 2;
      const center = size / 2;
      const circumference = 2 * Math.PI * radius;

      let currentOffset = 0;
      let segmentsSvg = "";
      let legendHtml = '<div style="display:flex;flex-wrap:wrap;gap:0.75rem;justify-content:center;margin-top:1rem;">';

      segments.forEach(seg => {
        const strokeDash = (seg.percent / 100) * circumference;
        const gap = circumference - strokeDash;

        segmentsSvg += `
          <circle cx="${center}" cy="${center}" r="${radius}" fill="transparent"
            stroke="${seg.color}" stroke-width="${strokeW}"
            stroke-dasharray="${strokeDash} ${gap}"
            stroke-dashoffset="${-currentOffset}"
            transform="rotate(-90 ${center} ${center})">
            <title>${seg.label}: ${seg.percent}%</title>
          </circle>
        `;

        currentOffset += strokeDash;

        legendHtml += `
          <div style="display:flex;align-items:center;gap:0.4rem;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.08em;">
            <span style="width:8px;height:8px;border-radius:2px;background:${seg.color};display:inline-block;"></span>
            <span style="font-weight:700;color:#f5f5f5;">${seg.label}</span>
            <span style="color:#a3a3a3;">(${seg.percent}%)</span>
          </div>
        `;
      });

      legendHtml += '</div>';

      const svg = `
        <div style="display:flex;flex-direction:column;align-items:center;">
          <svg width="${size}" height="${size}" viewBox="0 0 ${size}" style="max-width:100%;height:auto;">
            ${segmentsSvg}
            <text x="${center}" y="${center + 5}" font-size="14" font-weight="900" letter-spacing="0.1em" fill="#f5f5f5" text-anchor="middle" text-transform="uppercase">Origins</text>
          </svg>
          ${legendHtml}
        </div>
      `;

      container.innerHTML = svg;
    }
  };

  global.HoneyCharts = HoneyCharts;
})(window);
