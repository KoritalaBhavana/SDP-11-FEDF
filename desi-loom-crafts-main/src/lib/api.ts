const API_URL = 'http://localhost:3001/api';

export const api = {
  // User APIs
  signup: async (email: string, password: string, name: string) => {
    const response = await fetch(`${API_URL}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    return response.json();
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  // Product APIs
  getProducts: async () => {
    const response = await fetch(`${API_URL}/products`);
    return response.json();
  },

  getProduct: async (id: string) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    return response.json();
  },

  // Order APIs
  createOrder: async (orderData: any) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return response.json();
  },

  getOrders: async (userId: string) => {
    const response = await fetch(`${API_URL}/orders/${userId}`, {
      headers: {
        // lightweight guard: send the user id in a header so backend can verify
        'X-User-Id': userId
      }
    });
    return response.json();
  }
  ,
  getOrdersByClient: async (clientId: string) => {
    const response = await fetch(`${API_URL}/orders/client/${clientId}`);
    return response.json();
  }
  ,
  // User update
  updateUser: async (userId: string, updates: any) => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return response.json();
  }
  ,
  // Product management
  createProduct: async (productData: any) => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return response.json();
  },
  updateProduct: async (id: string, updates: any) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return response.json();
  },
  deleteProduct: async (id: string) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};
