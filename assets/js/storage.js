/**
 * HONEYCHAIN — LocalStorage Data Management Layer (SIH 2026)
 * Single source of truth persistence between Seller and Buyer experiences.
 */

const STORAGE_KEYS = {
  APP_DATA: "honeychain_app_data",
  VERIFICATIONS: "honeychain_verifications",
  NOTIFICATIONS: "honeychain_notifications"
};

// In-memory fallback if LocalStorage is disabled or throws
let memoryFallback = null;

function isLocalStorageAvailable() {
  try {
    const testKey = "__hc_test__";
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Initializes and retrieves centralized application data
 */
function loadAppData() {
  try {
    if (isLocalStorageAvailable()) {
      const stored = localStorage.getItem(STORAGE_KEYS.APP_DATA);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.batches && parsed.batches["HC-2026-00125"]) {
          return parsed;
        }
      }
    } else if (memoryFallback) {
      return memoryFallback;
    }
  } catch (err) {
    console.warn("HoneyChain: Error loading from localStorage, resetting to defaults", err);
  }

  // Clone default data deeply
  const initialData = JSON.parse(JSON.stringify(DEFAULT_HONEYCHAIN_DATA));
  saveAppData(initialData);
  return initialData;
}

/**
 * Persists app data
 */
function saveAppData(data) {
  if (!data) return;
  try {
    if (isLocalStorageAvailable()) {
      localStorage.setItem(STORAGE_KEYS.APP_DATA, JSON.stringify(data));
    } else {
      memoryFallback = data;
    }
  } catch (err) {
    console.error("HoneyChain: Failed to save to localStorage", err);
  }
}

/**
 * Batch Operations
 */
function getBatch(batchId) {
  const data = loadAppData();
  if (!batchId) return data.batches["HC-2026-00125"] || null;
  const cleanId = String(batchId).trim().toUpperCase();
  return data.batches[cleanId] || null;
}

function getAllBatches() {
  const data = loadAppData();
  return Object.values(data.batches || {});
}

function updateBatch(batchId, updates) {
  const data = loadAppData();
  const cleanId = String(batchId || updates.batchId || "HC-2026-00125").trim().toUpperCase();
  
  if (!data.batches[cleanId]) {
    data.batches[cleanId] = { batchId: cleanId, events: [] };
  }

  data.batches[cleanId] = {
    ...data.batches[cleanId],
    ...updates,
    batchId: cleanId // Guarantee batchId immutability
  };

  saveAppData(data);

  // Auto-log notification
  addNotification({
    title: `Batch ${cleanId} updated`,
    message: `Specifications for batch ${cleanId} were updated in the ledger.`,
    type: "info",
    link: `batch-details.html?batch=${cleanId}`
  });

  return data.batches[cleanId];
}

/**
 * Hive Operations
 */
function getHive(hiveId) {
  const data = loadAppData();
  if (!hiveId) return data.hives["HIVE-001"] || null;
  const cleanId = String(hiveId).trim().toUpperCase();
  return data.hives[cleanId] || null;
}

function getAllHives() {
  const data = loadAppData();
  return Object.values(data.hives || {});
}

function updateHive(hiveId, updates) {
  const data = loadAppData();
  const cleanId = String(hiveId).trim().toUpperCase();
  if (data.hives[cleanId]) {
    data.hives[cleanId] = {
      ...data.hives[cleanId],
      ...updates
    };
    saveAppData(data);
    return data.hives[cleanId];
  }
  return null;
}

/**
 * AI Analysis Operations
 */
function getAIAnalysis(hiveId) {
  const data = loadAppData();
  const cleanId = String(hiveId || "HIVE-003").trim().toUpperCase();
  return data.aiAnalysis[cleanId] || null;
}

function updateAIAnalysis(hiveId, updates) {
  const data = loadAppData();
  const cleanId = String(hiveId || "HIVE-003").trim().toUpperCase();
  if (data.aiAnalysis[cleanId]) {
    data.aiAnalysis[cleanId] = {
      ...data.aiAnalysis[cleanId],
      ...updates
    };
    saveAppData(data);
    return data.aiAnalysis[cleanId];
  }
  return null;
}

/**
 * Traceability Event Operations
 */
function addTraceabilityEvent(batchId, eventData) {
  const data = loadAppData();
  const cleanId = String(batchId || "HC-2026-00125").trim().toUpperCase();
  const batch = data.batches[cleanId];
  if (!batch) return null;

  if (!batch.events) batch.events = [];
  
  const newEvent = {
    id: "evt-" + Date.now(),
    stage: eventData.stage || "Processing",
    title: eventData.title || "Quality Checkpoint Logged",
    date: eventData.date || new Date().toISOString().split("T")[0],
    location: eventData.location || "Certified Apiary Facility",
    description: eventData.description || "Milestone verified by apiary inspector.",
    status: eventData.status || "Verified"
  };

  batch.events.push(newEvent);
  saveAppData(data);

  addNotification({
    title: `New event added to ${cleanId}`,
    message: `${newEvent.title} (${newEvent.stage}) logged.`,
    type: "success",
    link: `traceability.html?batch=${cleanId}`
  });

  return newEvent;
}

/**
 * Verification Logs (Buyer history)
 */
function getVerificationHistory() {
  const data = loadAppData();
  return data.verifications || [];
}

function saveVerification(batch) {
  if (!batch) return;
  const data = loadAppData();
  if (!data.verifications) data.verifications = [];

  const existingIdx = data.verifications.findIndex(v => v.batchId === batch.batchId);
  const record = {
    id: "v-" + Date.now(),
    batchId: batch.batchId,
    honeyType: batch.honeyType || "Pure Honey",
    floralOrigin: batch.floralOrigin || "Natural Flora",
    quantity: batch.quantity || 0,
    qualityStatus: batch.qualityStatus || "Verified",
    moisture: batch.moisture || 17.5,
    verifiedAt: new Date().toISOString(),
    displayTime: "Just now"
  };

  if (existingIdx >= 0) {
    data.verifications.splice(existingIdx, 1);
  }
  data.verifications.unshift(record);

  saveAppData(data);
  return record;
}

function clearVerificationHistory() {
  const data = loadAppData();
  data.verifications = [];
  saveAppData(data);
}

/**
 * Notifications
 */
function getNotifications() {
  const data = loadAppData();
  return data.notifications || [];
}

function addNotification({ title, message, type = "info", link = "#" }) {
  const data = loadAppData();
  if (!data.notifications) data.notifications = [];
  
  const notif = {
    id: "notif-" + Date.now(),
    title,
    message,
    type,
    timestamp: "Just now",
    read: false,
    link
  };

  data.notifications.unshift(notif);
  if (data.notifications.length > 20) data.notifications.pop();
  saveAppData(data);
  return notif;
}

function markAllNotificationsRead() {
  const data = loadAppData();
  if (data.notifications) {
    data.notifications.forEach(n => { n.read = true; });
    saveAppData(data);
  }
}

/**
 * Global Demo Reset
 */
function resetDemoData() {
  const fresh = JSON.parse(JSON.stringify(DEFAULT_HONEYCHAIN_DATA));
  saveAppData(fresh);
  return fresh;
}

/**
 * UI Utilities (Toasts & Modals)
 */
function showToast(message, type = "success", duration = 3500) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  const iconSvg = type === "success" ? "✓ " : type === "error" ? "✕ " : "ℹ ";
  toast.innerHTML = `<span>${iconSvg}</span><span>${message}</span>`;
  
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, duration);
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
  }
}

// Global initialization check on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  loadAppData();
});
