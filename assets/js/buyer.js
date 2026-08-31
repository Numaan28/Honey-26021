/**
 * HONEYCHAIN — Buyer Verification & Experience Logic (SIH 2026)
 * Handles instant batch verification, certificate rendering, journey timeline, and verification logs.
 */

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  switch (page) {
    case "buyer-verify":
      initVerifySearch();
      break;
    case "buyer-result":
      initVerifyResult();
      break;
    case "buyer-journey":
      initBuyerJourney();
      break;
    case "buyer-quality":
      initBuyerQuality();
      break;
    case "buyer-history":
      initBuyerHistory();
      break;
  }
});

/**
 * 1. BUYER VERIFY SEARCH CONTROLLER
 */
function initVerifySearch() {
  const form = document.getElementById("verify-batch-form");
  const input = document.getElementById("verify-batch-input");
  const errorContainer = document.getElementById("verify-error-box");
  const searchCard = document.getElementById("verify-search-card");
  const tryAgainBtn = document.getElementById("btn-verify-try-again");
  const chipBtns = document.querySelectorAll(".chip-btn");

  // Chips click fill
  chipBtns.forEach(chip => {
    chip.addEventListener("click", () => {
      if (input) {
        input.value = chip.dataset.batchId;
        input.focus();
      }
    });
  });

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const rawInput = input ? input.value.trim().toUpperCase() : "";
      if (!rawInput) return;

      const batch = getBatch(rawInput);
      if (batch) {
        // Save to verification history
        saveVerification(batch);
        window.location.href = `result.html?batch=${batch.batchId}`;
      } else {
        // Display user-friendly error state
        if (searchCard) searchCard.style.display = "none";
        if (errorContainer) errorContainer.style.display = "block";
      }
    });
  }

  if (tryAgainBtn) {
    tryAgainBtn.addEventListener("click", () => {
      if (errorContainer) errorContainer.style.display = "none";
      if (searchCard) searchCard.style.display = "block";
      if (input) {
        input.value = "";
        input.focus();
      }
    });
  }
}

/**
 * 2. BUYER RESULT CERTIFICATE CONTROLLER
 */
function initVerifyResult() {
  const urlParams = new URLSearchParams(window.location.search);
  const batchId = urlParams.get("batch") || "HC-2026-00125";
  const batch = getBatch(batchId);

  const resultContainer = document.getElementById("buyer-result-container");
  const notFoundContainer = document.getElementById("buyer-not-found-container");

  if (!batch) {
    if (resultContainer) resultContainer.style.display = "none";
    if (notFoundContainer) notFoundContainer.style.display = "block";
    return;
  }

  // Auto-log to history on direct URL visit
  saveVerification(batch);

  // Populate dynamic elements
  const fields = {
    "r-batch-id": batch.batchId,
    "r-honey-type": batch.honeyType || "Raw Pure Honey",
    "r-status-badge": batch.qualityStatus || "Verified",
    "r-floral-origin": batch.floralOrigin || "Natural Blossom",
    "r-source-hive": batch.sourceHive || "HIVE-001",
    "r-harvest-date": batch.harvestDate || "2026-08-15",
    "r-quantity": `${batch.quantity} kg`,
    "r-location": batch.location || "Certified Apiary",
    "r-quality-status": batch.qualityStatus || "Verified",
    "r-moisture": `${batch.moisture}%`,
    "r-purity": `${batch.purity || 99.4}%`,
    "r-cert-id": batch.labCertificateId || "CERT-IND-90241",
    "r-processing": batch.processingStatus || "Completed",
    "r-hash": batch.blockchainHash || "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9060"
  };

  for (const [id, val] of Object.entries(fields)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  // Update status badge style
  const badgeEl = document.getElementById("r-status-badge");
  if (badgeEl) {
    badgeEl.className = `stamp-badge badge-${(batch.qualityStatus || 'verified').toLowerCase()}`;
  }

  // Update button links
  const journeyBtn = document.getElementById("btn-buyer-journey");
  const qualityBtn = document.getElementById("btn-buyer-quality");
  if (journeyBtn) journeyBtn.href = `journey.html?batch=${batch.batchId}`;
  if (qualityBtn) qualityBtn.href = `quality.html?batch=${batch.batchId}`;
}

/**
 * 3. BUYER JOURNEY TIMELINE CONTROLLER
 */
function initBuyerJourney() {
  const urlParams = new URLSearchParams(window.location.search);
  const batchId = urlParams.get("batch") || "HC-2026-00125";
  const batch = getBatch(batchId) || getBatch("HC-2026-00125");

  const titleEl = document.getElementById("journey-batch-title");
  const container = document.getElementById("journey-events-container");

  if (titleEl) titleEl.textContent = `Batch ${batch.batchId} Honey Journey`;

  if (container && batch && batch.events) {
    const stageIcons = {
      "Hive Origin": "🐝",
      "Harvest": "🍯",
      "Processing": "🏭",
      "Quality": "🧪",
      "Packaging": "📦",
      "Distribution": "🚚"
    };

    container.innerHTML = batch.events.map((evt, idx) => `
      <div class="card mb-4" style="border-left: 4px solid var(--honey-600); cursor: pointer;" onclick="this.querySelector('.evt-desc').classList.toggle('expanded');">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.35rem;">
          <div style="display:flex;align-items:center;gap:0.5rem;">
            <span style="font-size:1.4rem;">${stageIcons[evt.stage] || '✨'}</span>
            <strong style="font-size:1.1rem;">${evt.stage}: ${evt.title}</strong>
          </div>
          <span class="badge badge-success">${evt.status}</span>
        </div>
        <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:0.5rem;">
          📅 ${evt.date} &nbsp;•&nbsp; 📍 ${evt.location}
        </div>
        <p class="evt-desc" style="font-size:0.92rem;color:var(--text-secondary);margin:0;">
          ${evt.description}
        </p>
      </div>
    `).join("");
  }
}

/**
 * 4. BUYER QUALITY CERTIFICATE CONTROLLER
 */
function initBuyerQuality() {
  const urlParams = new URLSearchParams(window.location.search);
  const batchId = urlParams.get("batch") || "HC-2026-00125";
  const batch = getBatch(batchId) || getBatch("HC-2026-00125");

  const fields = {
    "bq-batch-id": batch.batchId,
    "bq-purity": `${batch.purity || 99.4}%`,
    "bq-moisture": `${batch.moisture}%`,
    "bq-cert-id": batch.labCertificateId || "CERT-IND-90241",
    "bq-status": batch.qualityStatus || "Verified",
    "bq-tested-date": batch.labTestedDate || "2026-08-18",
    "bq-pollen": batch.pollenCount || "45,000 grains/g",
    "bq-ratio": batch.fructoseGlucoseRatio || "1.22",
    "bq-notes": batch.notes || "Standard cold extracted raw natural honey."
  };

  for (const [id, val] of Object.entries(fields)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
}

/**
 * 5. BUYER HISTORY LOG CONTROLLER
 */
function initBuyerHistory() {
  const container = document.getElementById("history-list-container");
  const clearBtn = document.getElementById("btn-clear-history");
  const confirmClearBtn = document.getElementById("confirm-clear-history-btn");

  function renderHistory() {
    const history = getVerificationHistory();
    if (!container) return;

    if (history.length === 0) {
      container.innerHTML = `
        <div class="card" style="text-align:center;padding:3rem 1.5rem;">
          <p style="color:var(--text-muted);margin-bottom:1rem;">No verification records saved yet.</p>
          <a href="verify.html" class="btn btn-primary">Verify a Batch Now</a>
        </div>
      `;
      if (clearBtn) clearBtn.style.display = "none";
      return;
    }

    if (clearBtn) clearBtn.style.display = "inline-flex";

    container.innerHTML = history.map(item => `
      <a href="result.html?batch=${item.batchId}" class="history-item-card">
        <div>
          <div style="font-weight:800;font-size:1.1rem;color:var(--honey-800);">${item.batchId}</div>
          <div style="font-size:0.85rem;color:var(--text-secondary);">${item.honeyType} • ${item.floralOrigin} (${item.quantity} kg)</div>
          <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.2rem;">Verified: ${new Date(item.verifiedAt).toLocaleString()}</div>
        </div>
        <div style="text-align:right;">
          <span class="badge badge-${(item.qualityStatus || 'verified').toLowerCase()}">${item.qualityStatus}</span>
          <div style="font-size:0.85rem;font-weight:700;color:var(--honey-700);margin-top:0.4rem;">View Certificate →</div>
        </div>
      </a>
    `).join("");
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      openModal("clear-history-modal");
    });
  }

  if (confirmClearBtn) {
    confirmClearBtn.addEventListener("click", () => {
      clearVerificationHistory();
      closeModal("clear-history-modal");
      showToast("✓ Verification history cleared", "info");
      renderHistory();
    });
  }

  renderHistory();
}
