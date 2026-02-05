// API Service for Backend Communication
// This file contains all API calls to the Laravel backend

const API_BASE_URL = "https://b2005.com/api";

// Helper function to get auth token
function getAuthToken(): string | null {
  return localStorage.getItem("auth_token");
}

// Helper function to set auth token
function setAuthToken(token: string): void {
  localStorage.setItem("auth_token", token);
}

// Helper function to remove auth token
function removeAuthToken(): void {
  localStorage.removeItem("auth_token");
}

// Helper function for API requests
async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body?: any,
): Promise<any> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (response.status === 401) {
    removeAuthToken();
    window.location.href = "/login";
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API request failed");
  }

  return response.json();
}

// ==================== AUTHENTICATION ====================

export const AuthService = {
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    setAuthToken(data.token);
    return data.user;
  },

  async register(
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      }),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    const data = await response.json();
    setAuthToken(data.token);
    return data.user;
  },

  async logout() {
    await apiRequest("/auth/logout", "POST");
    removeAuthToken();
  },

  async getProfile() {
    return apiRequest("/auth/profile");
  },
};

// ==================== TABLES ====================

export const TableService = {
  async getAllTables() {
    return apiRequest("/tables");
  },

  async createTable(label: string, columnHeaders: string[]) {
    return apiRequest("/tables", "POST", {
      label,
      column_headers: columnHeaders,
    });
  },

  async getTable(tableId: string) {
    return apiRequest(`/tables/${tableId}`);
  },

  async updateTable(tableId: string, data: any) {
    return apiRequest(`/tables/${tableId}`, "PUT", data);
  },

  async deleteTable(tableId: string) {
    return apiRequest(`/tables/${tableId}`, "DELETE");
  },

  async addRow(tableId: string, rowData: string[]) {
    return apiRequest(`/tables/${tableId}/rows`, "POST", { row_data: rowData });
  },

  async updateRow(rowId: string, rowData: string[]) {
    return apiRequest(`/rows/${rowId}`, "PUT", { row_data: rowData });
  },

  async deleteRow(rowId: string) {
    return apiRequest(`/rows/${rowId}`, "DELETE");
  },
};

// ==================== IMAGES ====================

export const ImageService = {
  async getAllImages() {
    return apiRequest("/images");
  },

  async uploadImage(file: File, description?: string) {
    const formData = new FormData();
    formData.append("file", file);
    if (description) {
      formData.append("description", description);
    }

    const token = getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/images`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    return response.json();
  },

  async deleteImage(imageId: string) {
    return apiRequest(`/images/${imageId}`, "DELETE");
  },
};

// ==================== PDF EXPORT ====================

export const PdfService = {
  async exportTablePdf(tableId: string, tableName: string) {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(
      `${API_BASE_URL}/tables/${tableId}/export-pdf`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/pdf",
        },
      },
    );

    if (!response.ok) {
      throw new Error("PDF export failed");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${tableName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

// ==================== ADMIN ====================

export const AdminService = {
  async getAllUsers() {
    return apiRequest("/admin/users");
  },

  async getUserDetails(userId: string) {
    return apiRequest(`/admin/users/${userId}`);
  },

  async deleteUser(userId: string) {
    return apiRequest(`/admin/users/${userId}`, "DELETE");
  },
};

export default {
  AuthService,
  TableService,
  ImageService,
  PdfService,
  AdminService,
};
