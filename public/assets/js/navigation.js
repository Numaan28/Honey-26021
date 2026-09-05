/**
 * HONEYCHAIN — Navigation & Global Header Controller (SIH 2026)
 * Coordinates sidebars, mobile menus, notification center, and demo reset modal.
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initNotificationCenter();
  initGlobalSearch();
  initResetDemoModal();
});

/**
 * Initializes sidebar links, active highlights, and mobile menu
 */
function initNavigation() {
  const currentPath = window.location.pathname;
  
  // Highlight active sidebar links in Seller
  const sidebarLinks = document.querySelectorAll(".sidebar-link");
  sidebarLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href && currentPath.endsWith(href)) {
      link.classList.add("active");
    }
  });

  // Highlight active header links in Buyer & Main
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href && currentPath.endsWith(href)) {
      link.classList.add("active");
    }
  });

  // Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.querySelector(".app-sidebar");
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!sidebar.contains(e.target) && !menuToggle.contains(e.target) && sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
      }
    });
  }
}

/**
 * Initializes notification dropdown with live unread badge
 */
function initNotificationCenter() {
  const notifBtn = document.getElementById("notif-btn");
  const notifDropdown = document.getElementById("notif-dropdown");
  const notifBadge = document.getElementById("notif-badge");
  const notifList = document.getElementById("notif-list");

  if (!notifBtn || !notifDropdown) return;

  function renderNotifs() {
    const notifs = getNotifications();
    const unreadCount = notifs.filter(n => !n.read).length;

    if (notifBadge) {
      if (unreadCount > 0) {
        notifBadge.style.display = "flex";
        notifBadge.textContent = unreadCount > 9 ? "9+" : unreadCount;
      } else {
        notifBadge.style.display = "none";
      }
    }

    if (notifList) {
      if (notifs.length === 0) {
        notifList.innerHTML = `<div style="padding:1.5rem;text-align:center;color:var(--text-muted);font-size:0.85rem;">No new notifications</div>`;
        return;
      }

      notifList.innerHTML = notifs.map(n => `
        <a href="${n.link || '#'}" class="notif-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
          <div class="notif-title">${n.title}</div>
          <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.2rem;">${n.message}</div>
          <div class="notif-time">${n.timestamp}</div>
        </a>
      `).join("");
    }
  }

  renderNotifs();

  notifBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    notifDropdown.classList.toggle("active");
    if (notifDropdown.classList.contains("active")) {
      markAllNotificationsRead();
      if (notifBadge) notifBadge.style.display = "none";
    }
  });

  document.addEventListener("click", (e) => {
    if (!notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
      notifDropdown.classList.remove("active");
    }
  });
}

/**
 * Initializes global search in Seller top bar
 */
function initGlobalSearch() {
  const searchInput = document.getElementById("seller-global-search");
  if (!searchInput) return;

  let resultsDropdown = document.getElementById("search-results-dropdown");
  if (!resultsDropdown) {
    resultsDropdown = document.createElement("div");
    resultsDropdown.id = "search-results-dropdown";
    resultsDropdown.style.cssText = "position:absolute;top:100%;left:0;right:0;background:var(--bg-surface);border:1px solid var(--border-strong);border-radius:var(--radius-md);box-shadow:var(--shadow-lg);z-index:60;display:none;max-height:280px;overflow-y:auto;margin-top:0.35rem;";
    searchInput.parentElement.style.position = "relative";
    searchInput.parentElement.appendChild(resultsDropdown);
  }

  searchInput.addEventListener("input", (e) => {
    const q = e.target.value.trim().toUpperCase();
    if (!q) {
      resultsDropdown.style.display = "none";
      return;
    }

    const batches = getAllBatches();
    const hives = getAllHives();

    const matchedBatches = batches.filter(b => b.batchId.includes(q) || (b.honeyType && b.honeyType.toUpperCase().includes(q)));
    const matchedHives = hives.filter(h => h.hiveId.includes(q) || (h.name && h.name.toUpperCase().includes(q)));

    if (matchedBatches.length === 0 && matchedHives.length === 0) {
      resultsDropdown.innerHTML = `<div style="padding:0.75rem 1rem;font-size:0.85rem;color:var(--text-muted);">No matching batch or hive</div>`;
      resultsDropdown.style.display = "block";
      return;
    }

    let html = "";
    if (matchedBatches.length > 0) {
      html += `<div style="padding:0.4rem 0.75rem;background:var(--bg-surface-muted);font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Batches</div>`;
      matchedBatches.forEach(b => {
        html += `<a href="batch-details.html?batch=${b.batchId}" style="display:flex;justify-content:space-between;padding:0.6rem 0.75rem;border-bottom:1px solid var(--border-subtle);font-size:0.85rem;">
          <strong>${b.batchId}</strong>
          <span style="color:var(--text-secondary);">${b.honeyType} (${b.quantity}kg)</span>
        </a>`;
      });
    }

    if (matchedHives.length > 0) {
      html += `<div style="padding:0.4rem 0.75rem;background:var(--bg-surface-muted);font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Hives</div>`;
      matchedHives.forEach(h => {
        html += `<a href="hives.html?hive=${h.hiveId}" style="display:flex;justify-content:space-between;padding:0.6rem 0.75rem;border-bottom:1px solid var(--border-subtle);font-size:0.85rem;">
          <strong>${h.hiveId}</strong>
          <span style="color:var(--text-secondary);">${h.name}</span>
        </a>`;
      });
    }

    resultsDropdown.innerHTML = html;
    resultsDropdown.style.display = "block";
  });

  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !resultsDropdown.contains(e.target)) {
      resultsDropdown.style.display = "none";
    }
  });
}

/**
 * Initializes Demo Reset Modal
 */
function initResetDemoModal() {
  const resetBtns = document.querySelectorAll(".btn-reset-demo");
  resetBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal("reset-demo-modal");
    });
  });

  const confirmBtn = document.getElementById("confirm-reset-btn");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      resetDemoData();
      closeModal("reset-demo-modal");
      showToast("Demo data restored to initial state", "success");
      setTimeout(() => {
        window.location.reload();
      }, 600);
    });
  }
}
