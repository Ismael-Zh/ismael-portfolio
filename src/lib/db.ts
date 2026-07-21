export interface SavedItem {
  id: string;
  title: string;
  category: "design" | "3d" | "animation";
  type: "image" | "video" | "pdf";
  url: string; // Fallback or external URL
  blob?: Blob; // The actual uploaded file Blob
  description: string;
  createdAt: number;
  fileName?: string;
  fileSize?: number;
}

const DB_NAME = "behance_portfolio_db";
const STORE_NAME = "portfolio_items";
const DB_VERSION = 1;

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
}

export async function savePortfolioItem(item: {
  title: string;
  category: "design" | "3d" | "animation";
  type: "image" | "video" | "pdf";
  description: string;
  file?: File;
  externalUrl?: string;
}): Promise<SavedItem> {
  const db = await initDB();
  const id = `user-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const savedItem: SavedItem = {
    id,
    title: item.title,
    category: item.category,
    type: item.type,
    url: item.externalUrl || "",
    blob: item.file,
    description: item.description,
    createdAt: Date.now(),
    fileName: item.file?.name,
    fileSize: item.file?.size
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(savedItem);

    request.onsuccess = () => {
      resolve(savedItem);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

export async function getSavedPortfolioItems(): Promise<SavedItem[]> {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.error("IndexedDB failed to load, returning empty items:", err);
    return [];
  }
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}
