/**
 * HONEYCHAIN — Seller Portal Logic (SIH 2026)
 * Handles dashboard, hive telemetry, AI diagnostics, batch editing, traceability, and QR generation.
 */

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  switch (page) {
    case "seller-dashboard":
      initDashboard();
      break;
    case "seller-hives":
      initHivesPage();
      break;
    case "seller-ai":
      initAiAnalysisPage();
      break;
    case "seller-batches":
      initBatchesPage();
      break;
    case "seller-batch-details":
      initBatchDetailsPage();
      break;
    case "seller-quality":
      initQualityPage();
      break;
    case "seller-traceability":
      initTraceabilityPage();
      break;
    case "seller-qr":
      initQrGeneratorPage();
      break;
    case "seller-analytics":
      initAnalyticsPage();
      break;
  }
});

/**
 * 1. DASHBOARD CONTROLLER
 */
function initDashboard() {
  const primaryBatch = getBatch("HC-2026-00125");
  if (!primaryBatch) return;

  const typeEl = document.getElementById("dash-batch-type");
  const originEl = document.getElementById("dash-batch-origin");
  const hiveEl = document.getElementById("dash-batch-hive");
  const dateEl = document.getElementById("dash-batch-date");
  const qtyEl = document.getElementById("dash-batch-qty");
  const qualityEl = document.getElementById("dash-batch-quality");

  if (typeEl) typeEl.textContent = primaryBatch.honeyType || "Raw Honey";
  if (originEl) originEl.textContent = primaryBatch.floralOrigin || "Mustard";
  if (hiveEl) hiveEl.textContent = primaryBatch.sourceHive || "HIVE-001";
  if (dateEl) dateEl.textContent = primaryBatch.harvestDate || "2026-08-15";
  if (qtyEl) qtyEl.textContent = `${primaryBatch.quantity} kg`;
  if (qualityEl) {
    qualityEl.textContent = primaryBatch.qualityStatus || "Verified";
    qualityEl.className = `badge badge-${(primaryBatch.qualityStatus || 'verified').toLowerCase()}`;
  }
}

/**
 * 2. HIVES MONITORING CONTROLLER
 */
function initHivesPage() {
  const urlParams = new URLSearchParams(window.location.search);
  let currentHiveId = urlParams.get("hive") || "HIVE-001";
  let currentStatusFilter = "all";
  let currentTimeFilter = "24H";

  const hiveCards = document.querySelectorAll(".hive-card");
  const statusFilterBtns = document.querySelectorAll(".hive-status-filter-btn");
  const timeFilterBtns = document.querySelectorAll(".time-filter-btn");
  const resolveAlertBtn = document.getElementById("resolve-alert-btn");
  const viewDetailsBtn = document.getElementById("view-hive-modal-btn");

  function renderSelectedHive(hiveId) {
    const hive = getHive(hiveId);
    if (!hive) return;

    currentHiveId = hive.hiveId;

    // Update active class on cards
    hiveCards.forEach(c => {
      if (c.dataset.hiveId === hive.hiveId) {
        c.classList.add("active");
      } else {
        c.classList.remove("active");
      }
    });

    // Update Telemetry Displays
    const nameEl = document.getElementById("hive-detail-name");
    const statusBadgeEl = document.getElementById("hive-detail-status");
    const tempEl = document.getElementById("hive-temp-val");
    const humidEl = document.getElementById("hive-humid-val");
    const weightEl = document.getElementById("hive-weight-val");
    const actEl = document.getElementById("hive-activity-val");
    const battEl = document.getElementById("hive-battery-val");
    const scoreEl = document.getElementById("hive-score-val");
    const syncEl = document.getElementById("hive-sync-val");
    const locEl = document.getElementById("hive-loc-val");
    const alertBanner = document.getElementById("hive-alert-banner");
    const alertMsgEl = document.getElementById("hive-alert-message");

    if (nameEl) nameEl.textContent = `${hive.name} (${hive.hiveId})`;
    if (statusBadgeEl) {
      statusBadgeEl.textContent = hive.status;
      statusBadgeEl.className = `badge badge-${hive.status.toLowerCase()}`;
    }
    if (tempEl) tempEl.textContent = `${hive.temp}°C`;
    if (humidEl) humidEl.textContent = `${hive.humidity}%`;
    if (weightEl) weightEl.textContent = `${hive.weight} kg`;
    if (actEl) actEl.textContent = hive.activity;
    if (battEl) battEl.textContent = `${hive.battery}%`;
    if (scoreEl) scoreEl.textContent = `${hive.healthScore}/100`;
    if (syncEl) syncEl.textContent = hive.lastSync;
    if (locEl) locEl.textContent = hive.location;

    // Alert Banner for HIVE-003
    if (alertBanner) {
      if (hive.status === "Warning" && !hive.alertResolved) {
        alertBanner.style.display = "flex";
        if (alertMsgEl) alertMsgEl.textContent = hive.alertMessage || "Abnormal temperature elevation detected.";
      } else {
        alertBanner.style.display = "none";
      }
    }

    // Render chart
    renderHiveChart(hive, currentTimeFilter);
  }

  function renderHiveChart(hive, period) {
    let labels, data, strokeColor, unit;
    if (period === "24H") {
      labels = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "Now"];
      data = hive.status === "Warning" ? [35.2, 35.8, 36.4, 37.8, 37.6, 37.9, 37.8] : [34.2, 34.4, 34.8, 35.1, 34.9, 34.7, 34.8];
      strokeColor = hive.status === "Warning" ? "#ef4444" : "#d97706";
      unit = "°C";
    } else if (period === "7D") {
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      data = hive.status === "Warning" ? [34.8, 35.0, 35.4, 36.8, 37.2, 37.5, 37.8] : [34.5, 34.6, 34.8, 34.7, 34.9, 34.8, 34.8];
      strokeColor = "#d97706";
      unit = "°C";
    } else {
      labels = ["Wk 1", "Wk 2", "Wk 3", "Wk 4"];
      data = [34.2, 34.6, 35.1, hive.temp];
      strokeColor = "#d97706";
      unit = "°C";
    }

    if (window.HoneyCharts) {
      window.HoneyCharts.renderLineChart("hive-telemetry-chart", {
        labels,
        data,
        strokeColor,
        unit,
        height: 230
      });
    }
  }

  // Card click events
  hiveCards.forEach(card => {
    card.addEventListener("click", () => {
      const hId = card.dataset.hiveId;
      renderSelectedHive(hId);
    });
  });

  // Status Filter click events
  statusFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      statusFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentStatusFilter = btn.dataset.status;

      hiveCards.forEach(card => {
        const cardStatus = card.dataset.status;
        if (currentStatusFilter === "all" || cardStatus === currentStatusFilter) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Time Filter click events
  timeFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      timeFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentTimeFilter = btn.dataset.period;
      const hive = getHive(currentHiveId);
      if (hive) renderHiveChart(hive, currentTimeFilter);
    });
  });

  // Resolve Alert Button (HIVE-003)
  if (resolveAlertBtn) {
    resolveAlertBtn.addEventListener("click", () => {
      updateHive("HIVE-003", {
        status: "Healthy",
        alertResolved: true,
        temp: 35.0,
        humidity: 60,
        activity: "Normalized (90%)",
        healthScore: 96
      });
      showToast("✓ Alert marked resolved for HIVE-003", "success");
      renderSelectedHive("HIVE-003");

      // Update badge on card
      const card3 = document.querySelector('.hive-card[data-hive-id="HIVE-003"]');
      if (card3) {
        card3.dataset.status = "Healthy";
        const badge = card3.querySelector(".badge");
        if (badge) {
          badge.className = "badge badge-healthy";
          badge.textContent = "Healthy";
        }
      }
    });
  }

  // View Details Modal
  if (viewDetailsBtn) {
    viewDetailsBtn.addEventListener("click", () => {
      const hive = getHive(currentHiveId);
      if (!hive) return;
      const title = document.getElementById("hive-modal-title");
      const body = document.getElementById("hive-modal-body");
      if (title) title.textContent = `Diagnostic Dossier: ${hive.name}`;
      if (body) {
        body.innerHTML = `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem;">
            <div><strong>Hive ID:</strong> ${hive.hiveId}</div>
            <div><strong>Status:</strong> ${hive.status}</div>
            <div><strong>Internal Temp:</strong> ${hive.temp}°C</div>
            <div><strong>Humidity:</strong> ${hive.humidity}%</div>
            <div><strong>Gross Weight:</strong> ${hive.weight} kg</div>
            <div><strong>Queen Status:</strong> ${hive.queenStatus || 'Active'}</div>
            <div><strong>Colony Age:</strong> ${hive.colonyAge || '12 months'}</div>
            <div><strong>Battery:</strong> ${hive.battery}%</div>
          </div>
          <div style="margin-top:1.25rem;padding:0.75rem;background:var(--bg-surface-muted);border-radius:var(--radius-md);font-size:0.85rem;">
            <strong>GPS Location:</strong> ${hive.location}
          </div>
        `;
      }
      openModal("hive-details-modal");
    });
  }

  // Initial load
  renderSelectedHive(currentHiveId);
}

/**
 * 3. AI HEALTH ANALYSIS CONTROLLER
 */
function initAiAnalysisPage() {
  const analysis = getAIAnalysis("HIVE-003");
  if (!analysis) return;

  const reviewedStatusEl = document.getElementById("ai-reviewed-status");
  const markReviewedBtn = document.getElementById("ai-mark-reviewed-btn");
  const runAgainBtn = document.getElementById("ai-run-again-btn");
  const signalsContainer = document.getElementById("ai-signals-container");

  function renderAnalysisUI() {
    const fresh = getAIAnalysis("HIVE-003");
    if (reviewedStatusEl) {
      if (fresh.reviewed) {
        reviewedStatusEl.innerHTML = `<span class="badge badge-success" style="font-size:0.9rem;padding:0.4rem 0.8rem;">✓ Analysis Reviewed</span>`;
        if (markReviewedBtn) {
          markReviewedBtn.textContent = "✓ Reviewed";
          markReviewedBtn.disabled = true;
          markReviewedBtn.classList.add("btn-secondary");
          markReviewedBtn.classList.remove("btn-primary");
        }
      } else {
        reviewedStatusEl.innerHTML = `<span class="badge badge-warning" style="font-size:0.9rem;padding:0.4rem 0.8rem;">Pending Review</span>`;
        if (markReviewedBtn) {
          markReviewedBtn.textContent = "Mark as Reviewed";
          markReviewedBtn.disabled = false;
          markReviewedBtn.classList.add("btn-primary");
          markReviewedBtn.classList.remove("btn-secondary");
        }
      }
    }

    if (signalsContainer && fresh.signals) {
      signalsContainer.innerHTML = fresh.signals.map(s => `
        <div style="padding:1rem;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-md);margin-bottom:0.75rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.25rem;">
            <strong style="font-size:0.95rem;">${s.title}</strong>
            <span class="badge badge-${s.severity}">${s.metric}</span>
          </div>
          <p style="font-size:0.85rem;color:var(--text-secondary);margin:0;">${s.detail}</p>
        </div>
      `).join("");
    }
  }

  if (markReviewedBtn) {
    markReviewedBtn.addEventListener("click", () => {
      updateAIAnalysis("HIVE-003", {
        reviewed: true,
        reviewedTimestamp: new Date().toISOString()
      });
      showToast("✓ AI Analysis marked as reviewed and logged to history", "success");
      renderAnalysisUI();
    });
  }

  if (runAgainBtn) {
    runAgainBtn.addEventListener("click", () => {
      runAgainBtn.disabled = true;
      runAgainBtn.textContent = "Analyzing telemetry signals...";
      setTimeout(() => {
        runAgainBtn.disabled = false;
        runAgainBtn.textContent = "Run Analysis Again";
        showToast("✓ AI diagnostic simulation completed with 87% confidence", "success");
        renderAnalysisUI();
      }, 750);
    });
  }

  renderAnalysisUI();
}

/**
 * 4. BATCHES LIST CONTROLLER
 */
function initBatchesPage() {
  const searchInput = document.getElementById("batch-table-search");
  const statusFilter = document.getElementById("batch-table-filter");
  const sortSelect = document.getElementById("batch-table-sort");
  const tableBody = document.getElementById("batch-table-body");

  if (!tableBody) return;

  function renderBatches() {
    let batches = getAllBatches();
    const q = searchInput ? searchInput.value.trim().toUpperCase() : "";
    const filter = statusFilter ? statusFilter.value : "all";
    const sort = sortSelect ? sortSelect.value : "date-desc";

    // Filter
    if (q) {
      batches = batches.filter(b => b.batchId.includes(q) || (b.honeyType && b.honeyType.toUpperCase().includes(q)) || (b.floralOrigin && b.floralOrigin.toUpperCase().includes(q)));
    }
    if (filter !== "all") {
      batches = batches.filter(b => (b.qualityStatus || "").toLowerCase() === filter.toLowerCase() || (b.processingStatus || "").toLowerCase() === filter.toLowerCase());
    }

    // Sort
    batches.sort((a, b) => {
      if (sort === "date-desc") return (b.harvestDate || "").localeCompare(a.harvestDate || "");
      if (sort === "date-asc") return (a.harvestDate || "").localeCompare(b.harvestDate || "");
      if (sort === "qty-desc") return (b.quantity || 0) - (a.quantity || 0);
      if (sort === "qty-asc") return (a.quantity || 0) - (b.quantity || 0);
      return 0;
    });

    if (batches.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text-muted);">No batches match your filter criteria.</td></tr>`;
      return;
    }

    tableBody.innerHTML = batches.map(b => `
      <tr style="cursor:pointer;" onclick="window.location.href='batch-details.html?batch=${b.batchId}'">
        <td><strong class="font-mono" style="color:var(--honey-700);">${b.batchId}</strong></td>
        <td><strong>${b.honeyType}</strong><br><span style="font-size:0.8rem;color:var(--text-muted);">${b.floralOrigin}</span></td>
        <td>${b.sourceHive}</td>
        <td>${b.harvestDate}</td>
        <td><strong>${b.quantity} kg</strong></td>
        <td><span class="badge badge-${(b.qualityStatus || 'verified').toLowerCase()}">${b.qualityStatus}</span></td>
        <td style="text-align:right;">
          <a href="batch-details.html?batch=${b.batchId}" class="btn btn-sm btn-secondary" onclick="event.stopPropagation();">Manage →</a>
        </td>
      </tr>
    `).join("");
  }

  if (searchInput) searchInput.addEventListener("input", renderBatches);
  if (statusFilter) statusFilter.addEventListener("change", renderBatches);
  if (sortSelect) sortSelect.addEventListener("change", renderBatches);

  renderBatches();
}

/**
 * 5. BATCH DETAILS & EDIT CONTROLLER
 */
function initBatchDetailsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const batchId = urlParams.get("batch") || "HC-2026-00125";
  let batch = getBatch(batchId);

  if (!batch) {
    showToast(`Batch ${batchId} not found, showing default`, "warning");
    batch = getBatch("HC-2026-00125");
  }

  const viewModeContainer = document.getElementById("batch-view-mode");
  const editModeContainer = document.getElementById("batch-edit-mode");
  const editBtn = document.getElementById("btn-edit-batch");
  const cancelBtn = document.getElementById("btn-cancel-edit");
  const saveBtn = document.getElementById("btn-save-batch");
  const editForm = document.getElementById("batch-edit-form");

  function renderView() {
    batch = getBatch(batch.batchId);
    if (!batch) return;

    // Header values
    const titleEl = document.getElementById("detail-batch-id");
    const statusBadge = document.getElementById("detail-quality-badge");
    if (titleEl) titleEl.textContent = batch.batchId;
    if (statusBadge) {
      statusBadge.textContent = batch.qualityStatus || "Verified";
      statusBadge.className = `badge badge-${(batch.qualityStatus || 'verified').toLowerCase()}`;
    }

    // View fields
    const fields = {
      "v-type": batch.honeyType,
      "v-origin": batch.floralOrigin,
      "v-hive": batch.sourceHive,
      "v-date": batch.harvestDate,
      "v-qty": `${batch.quantity} kg`,
      "v-location": batch.location,
      "v-processing": batch.processingStatus,
      "v-quality": batch.qualityStatus,
      "v-moisture": `${batch.moisture}%`,
      "v-cert": batch.certificateStatus || "Verified",
      "v-notes": batch.notes || "None"
    };

    for (const [id, val] of Object.entries(fields)) {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    }

    // Dynamic link updates with query parameter
    const journeyLink = document.getElementById("link-view-journey");
    const qualityLink = document.getElementById("link-view-quality");
    const qrLink = document.getElementById("link-view-qr");

    if (journeyLink) journeyLink.href = `traceability.html?batch=${batch.batchId}`;
    if (qualityLink) qualityLink.href = `quality.html?batch=${batch.batchId}`;
    if (qrLink) qrLink.href = `qr-generator.html?batch=${batch.batchId}`;
  }

  function populateEditForm() {
    if (!batch) return;
    const formFields = {
      "e-honey-type": batch.honeyType || "",
      "e-floral-origin": batch.floralOrigin || "",
      "e-source-hive": batch.sourceHive || "",
      "e-harvest-date": batch.harvestDate || "",
      "e-quantity": batch.quantity || 0,
      "e-location": batch.location || "",
      "e-processing": batch.processingStatus || "Completed",
      "e-quality": batch.qualityStatus || "Verified",
      "e-moisture": batch.moisture || 17.2,
      "e-notes": batch.notes || ""
    };

    for (const [id, val] of Object.entries(formFields)) {
      const el = document.getElementById(id);
      if (el) el.value = val;
    }
  }

  if (editBtn) {
    editBtn.addEventListener("click", () => {
      populateEditForm();
      if (viewModeContainer) viewModeContainer.style.display = "none";
      if (editModeContainer) editModeContainer.style.display = "block";
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      if (editModeContainer) editModeContainer.style.display = "none";
      if (viewModeContainer) viewModeContainer.style.display = "block";
    });
  }

  if (editForm) {
    editForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const updatedQty = parseFloat(document.getElementById("e-quantity").value) || 0;
      const updatedMoisture = parseFloat(document.getElementById("e-moisture").value) || 17.2;

      const updates = {
        honeyType: document.getElementById("e-honey-type").value.trim(),
        floralOrigin: document.getElementById("e-floral-origin").value.trim(),
        sourceHive: document.getElementById("e-source-hive").value.trim(),
        harvestDate: document.getElementById("e-harvest-date").value,
        quantity: updatedQty,
        location: document.getElementById("e-location").value.trim(),
        processingStatus: document.getElementById("e-processing").value,
        qualityStatus: document.getElementById("e-quality").value,
        moisture: updatedMoisture,
        notes: document.getElementById("e-notes").value.trim()
      };

      // Persist to central LocalStorage
      updateBatch(batch.batchId, updates);
      showToast("✓ Batch updated successfully", "success");

      // Switch back and render
      if (editModeContainer) editModeContainer.style.display = "none";
      if (viewModeContainer) viewModeContainer.style.display = "block";
      renderView();
    });
  }

  renderView();
}

/**
 * 6. QUALITY CONTROLLER
 */
function initQualityPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const batchId = urlParams.get("batch") || "HC-2026-00125";
  let batch = getBatch(batchId) || getBatch("HC-2026-00125");

  const saveQualityBtn = document.getElementById("btn-save-quality");
  const form = document.getElementById("quality-edit-form");

  function renderQuality() {
    batch = getBatch(batch.batchId);
    if (!batch) return;

    const titleEl = document.getElementById("q-batch-title");
    if (titleEl) titleEl.textContent = `Batch ${batch.batchId}`;

    const fields = {
      "q-purity": batch.purity || 99.4,
      "q-moisture": batch.moisture || 17.2,
      "q-origin": batch.floralOrigin || "Mustard",
      "q-harvest": batch.harvestDate || "2026-08-15",
      "q-status": batch.qualityStatus || "Verified",
      "q-cert-id": batch.labCertificateId || "CERT-IND-90241",
      "q-tested-date": batch.labTestedDate || "2026-08-18"
    };

    for (const [id, val] of Object.entries(fields)) {
      const el = document.getElementById(id);
      if (el) {
        if (el.tagName === "INPUT" || el.tagName === "SELECT") {
          el.value = val;
        } else {
          el.textContent = val;
        }
      }
    }
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const updates = {
        purity: parseFloat(document.getElementById("q-purity").value) || 99.4,
        moisture: parseFloat(document.getElementById("q-moisture").value) || 17.2,
        qualityStatus: document.getElementById("q-status").value,
        labCertificateId: document.getElementById("q-cert-id").value.trim()
      };
      updateBatch(batch.batchId, updates);
      showToast("✓ Quality parameters updated and synced to buyer portal", "success");
      renderQuality();
    });
  }

  renderQuality();
}

/**
 * 7. TRACEABILITY TIMELINE CONTROLLER
 */
function initTraceabilityPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const batchId = urlParams.get("batch") || "HC-2026-00125";
  let batch = getBatch(batchId) || getBatch("HC-2026-00125");

  const timelineContainer = document.getElementById("traceability-timeline");
  const addEventBtn = document.getElementById("btn-add-event");
  const addEventForm = document.getElementById("add-event-form");

  function renderTimeline() {
    batch = getBatch(batch.batchId);
    if (!batch || !timelineContainer) return;

    const titleEl = document.getElementById("trace-batch-title");
    if (titleEl) titleEl.textContent = `Lifecycle Journey for Batch ${batch.batchId}`;

    const events = batch.events || [];
    if (events.length === 0) {
      timelineContainer.innerHTML = `<p class="text-muted">No timeline events recorded.</p>`;
      return;
    }

    timelineContainer.innerHTML = events.map((evt, idx) => `
      <div class="timeline-item ${idx === 0 ? 'expanded' : ''}" data-idx="${idx}">
        <div class="timeline-marker ${evt.status === 'Verified' ? 'completed' : ''}">${idx + 1}</div>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.4rem;">
          <div>
            <span class="badge badge-neutral" style="font-size:0.75rem;margin-bottom:0.25rem;">${evt.stage}</span>
            <h4 style="font-size:1.1rem;margin:0;">${evt.title}</h4>
          </div>
          <span class="badge badge-${(evt.status || 'verified').toLowerCase()}">${evt.status}</span>
        </div>
        <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:0.5rem;">
          📅 ${evt.date} &nbsp;•&nbsp; 📍 ${evt.location}
        </div>
        <p style="font-size:0.92rem;color:var(--text-secondary);margin:0;">${evt.description}</p>
      </div>
    `).join("");

    // Click to toggle expansion
    timelineContainer.querySelectorAll(".timeline-item").forEach(item => {
      item.addEventListener("click", () => {
        item.classList.toggle("expanded");
      });
    });
  }

  if (addEventBtn) {
    addEventBtn.addEventListener("click", () => {
      openModal("add-event-modal");
    });
  }

  if (addEventForm) {
    addEventForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newEvt = {
        stage: document.getElementById("evt-stage").value,
        title: document.getElementById("evt-title").value.trim(),
        date: document.getElementById("evt-date").value,
        location: document.getElementById("evt-location").value.trim(),
        description: document.getElementById("evt-description").value.trim(),
        status: document.getElementById("evt-status").value
      };

      addTraceabilityEvent(batch.batchId, newEvt);
      closeModal("add-event-modal");
      addEventForm.reset();
      showToast("✓ Traceability milestone logged", "success");
      renderTimeline();
    });
  }

  renderTimeline();
}

/**
 * 8. QR CODE GENERATOR CONTROLLER
 */
function initQrGeneratorPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialBatchId = urlParams.get("batch") || "HC-2026-00125";
  
  const batchSelect = document.getElementById("qr-batch-select");
  const generateBtn = document.getElementById("btn-generate-qr");
  const previewBtn = document.getElementById("btn-preview-qr");
  const downloadBtn = document.getElementById("btn-download-qr");
  const qrHolder = document.getElementById("qr-canvas-container");
  const qrUrlDisplay = document.getElementById("qr-url-display");
  const qrBatchDisplay = document.getElementById("qr-batch-display");

  let currentCanvas = null;

  // Populate batch selector
  if (batchSelect) {
    const batches = getAllBatches();
    batchSelect.innerHTML = batches.map(b => `
      <option value="${b.batchId}" ${b.batchId === initialBatchId ? 'selected' : ''}>
        ${b.batchId} — ${b.honeyType} (${b.quantity}kg)
      </option>
    `).join("");

    batchSelect.addEventListener("change", () => {
      generateQR(batchSelect.value);
    });
  }

  function generateQR(batchId) {
    const batch = getBatch(batchId);
    if (!batch) return;

    if (qrBatchDisplay) qrBatchDisplay.textContent = batch.batchId;

    // Build buyer verification relative & absolute URLs
    const relativeUrl = `../buyer/result.html?batch=${batch.batchId}`;
    const fullUrl = `${window.location.origin}/buyer/result.html?batch=${batch.batchId}`;

    if (qrUrlDisplay) {
      qrUrlDisplay.textContent = fullUrl;
    }

    if (previewBtn) {
      previewBtn.onclick = () => {
        window.location.href = `../buyer/result.html?batch=${batch.batchId}`;
      };
    }

    // Render QR Code directly using standalone engine
    if (window.HoneyChainQR && qrHolder) {
      currentCanvas = window.HoneyChainQR.render(qrHolder, fullUrl, {
        size: 240,
        darkColor: "#18181b",
        lightColor: "#ffffff"
      });
      showToast(`✓ Generated QR for ${batch.batchId}`, "success");
    }
  }

  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      const selectedId = batchSelect ? batchSelect.value : initialBatchId;
      generateQR(selectedId);
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      if (currentCanvas && window.HoneyChainQR) {
        const selectedId = batchSelect ? batchSelect.value : "honeychain";
        window.HoneyChainQR.download(currentCanvas, `honeychain-qr-${selectedId}.png`);
        showToast("✓ QR Code downloaded", "success");
      } else {
        showToast("Please generate the QR code first", "warning");
      }
    });
  }

  // Initial QR Generation
  generateQR(initialBatchId);
}

/**
 * 9. ANALYTICS DASHBOARD CONTROLLER
 */
function initAnalyticsPage() {
  const filterBtns = document.querySelectorAll(".analytics-filter-btn");
  let currentPeriod = "30D";

  function renderAnalyticsCharts(period) {
    if (!window.HoneyCharts) return;

    // 1. Production History Line Chart
    let prodLabels, prodData;
    if (period === "7D") {
      prodLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      prodData = [58, 62, 70, 65, 80, 75, 82];
    } else if (period === "30D") {
      prodLabels = ["Wk 1", "Wk 2", "Wk 3", "Wk 4"];
      prodData = [110, 135, 120, 142];
    } else {
      prodLabels = ["Jun", "Jul", "Aug", "Sep"];
      prodData = [320, 390, 486, 520];
    }

    window.HoneyCharts.renderLineChart("chart-production-yield", {
      labels: prodLabels,
      data: prodData,
      strokeColor: "#d97706",
      unit: " kg",
      height: 220
    });

    // 2. Batch Status Bar Chart
    window.HoneyCharts.renderBarChart("chart-batch-status", {
      items: [
        { label: "Verified", value: 14, color: "#10b981" },
        { label: "Processing", value: 5, color: "#f59e0b" },
        { label: "Pending", value: 2, color: "#ef4444" }
      ],
      height: 220
    });

    // 3. Floral Origin Donut Chart
    window.HoneyCharts.renderDonutChart("chart-floral-origins", {
      segments: [
        { label: "Mustard", percent: 45, color: "#d97706" },
        { label: "Acacia", percent: 25, color: "#f59e0b" },
        { label: "Multifloral", percent: 20, color: "#10b981" },
        { label: "Sidr", percent: 10, color: "#6366f1" }
      ],
      size: 180
    });

    // 4. Consumer Scan Volume Line Chart
    window.HoneyCharts.renderLineChart("chart-qr-verifications", {
      labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4"],
      data: [42, 68, 95, 128],
      strokeColor: "#10b981",
      unit: " scans",
      height: 220
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentPeriod = btn.dataset.period;
      renderAnalyticsCharts(currentPeriod);
      showToast(`Showing analytics for past ${currentPeriod}`, "info");
    });
  });

  renderAnalyticsCharts(currentPeriod);
}
