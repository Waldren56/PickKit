const API_BASE = 'http://localhost:8080/api';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function fetchWithHandle(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!res.ok) {
      throw new ApiError(`HTTP Error: ${res.status}`, res.status);
    }

    if (res.status === 204) return null; // No content

    return await res.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Connection failed. Backend might be offline.');
    }
    throw error;
  }
}

export const api = {
  getProducts: () => fetchWithHandle('/products'),
  
  getLists: () => fetchWithHandle('/lists'),
  
  createList: (name) => fetchWithHandle('/lists', {
    method: 'POST',
    body: JSON.stringify({ name })
  }),
  
  getListDetails: (id) => fetchWithHandle(`/lists/${id}`),
  
  deleteList: (id) => fetchWithHandle(`/lists/${id}`, { method: 'DELETE' }),
  
  addItemToList: (listId, data) => fetchWithHandle(`/lists/${listId}/items`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  toggleItemStatus: (listId, itemId) => fetchWithHandle(`/lists/${listId}/items/${itemId}/toggle`, {
    method: 'PATCH'
  }),
  
  deleteItem: (listId, itemId) => fetchWithHandle(`/lists/${listId}/items/${itemId}`, {
    method: 'DELETE'
  }),
};
