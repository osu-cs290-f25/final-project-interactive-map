// Client-side helper for hybrid storage
export function isLoggedIn(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("session=");
}

export function showWarningBanner(message: string) {
  const existing = document.getElementById("warning-banner");
  if (existing) return;

  const banner = document.createElement("div");
  banner.id = "warning-banner";
  banner.className = "warning-banner";
  banner.innerHTML = `
    <span>⚠️ ${message}</span>
    <button onclick="this.parentElement.remove()">✕</button>
  `;
  document.body.prepend(banner);
}

// Marker operations
export async function saveMarker(data: any, mapType: "elden" | "earth") {
  if (isLoggedIn()) {
    const endpoint = mapType === "elden" ? "/api/markers/create" : "/api/earth/create";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return await response.json();
  } else {
    const key = `${mapType}_markers`;
    const markers = JSON.parse(localStorage.getItem(key) || "[]");
    markers.push({ ...data, id: Date.now() });
    localStorage.setItem(key, JSON.stringify(markers));
    showWarningBanner("Not logged in - your markers won't be saved permanently");
    return { success: true, temporary: true };
  }
}

export async function loadMarkers(mapType: "elden" | "earth") {
  if (isLoggedIn()) {
    const endpoint = mapType === "elden" ? "/api/markers/list" : "/api/earth/list";
    const response = await fetch(endpoint, { credentials: "include" });
    return await response.json();
  } else {
    const key = `${mapType}_markers`;
    return JSON.parse(localStorage.getItem(key) || "[]");
  }
}

export async function deleteMarker(id: number, mapType: "elden" | "earth") {
  if (isLoggedIn()) {
    const endpoint = mapType === "elden" ? "/api/markers/delete" : "/api/earth/delete";
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
      credentials: "include",
    });
  } else {
    const key = `${mapType}_markers`;
    const markers = JSON.parse(localStorage.getItem(key) || "[]");
    localStorage.setItem(key, JSON.stringify(markers.filter((m: any) => m.id !== id)));
  }
}

// Drawing operations (similar pattern)
export async function saveDrawing(data: any) {
  if (isLoggedIn()) {
    const response = await fetch("/api/drawings/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    return await response.json();
  } else {
    const drawings = JSON.parse(localStorage.getItem("elden_drawings") || "[]");
    drawings.push({ ...data, id: Date.now() });
    localStorage.setItem("elden_drawings", JSON.stringify(drawings));
    showWarningBanner("Not logged in - your drawings won't be saved permanently");
    return { success: true, temporary: true };
  }
}

export async function loadDrawings() {
  if (isLoggedIn()) {
    const response = await fetch("/api/drawings/list", { credentials: "include" });
    return await response.json();
  } else {
    return JSON.parse(localStorage.getItem("elden_drawings") || "[]");
  }
}
