import axios, { AxiosInstance } from "axios";

/**
 * API Service for communicating with Laravel Backend
 * Database: arabicwebsite_db
 */

class ApiService {
  private api: AxiosInstance;
  // Use production API URL
  private baseURL = "https://b2005.com/api";
  private token: string | null = null;

  constructor() {
    // Initialize axios instance
    // Ensure global axios default uses the provided backend URL
    axios.defaults.baseURL = this.baseURL;

    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json", // ✅ هذا هو المفتاح
      },
    });

    // Load token from localStorage if exists
    this.token = localStorage.getItem("auth_token");
    if (this.token) {
      this.setAuthHeader();
    }

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor
    // NOTE: do NOT call `this.logout()` here because `logout()` issues
    // an API request which may itself receive a 401 and trigger recursion.
    // Instead just clear local auth state when a 401 is seen.
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Log failing request information for debugging (non-sensitive)
          try {
            // Keep the log concise and avoid dumping headers or tokens
            // which may contain sensitive information.
            // eslint-disable-next-line no-console
            console.warn("[apiService] 401 response for:", {
              url: error.config?.url,
              method: error.config?.method,
              status: error.response?.status,
              data: error.response?.data,
            });
          } catch (e) {
            // ignore logging errors
          }

          this.token = null;
          try {
            localStorage.removeItem("auth_token");
            delete this.api.defaults.headers.common["Authorization"];
          } catch (e) {
            // ignore
          }
        }
        return Promise.reject(error);
      },
    );
  }

  private setAuthHeader() {
    if (this.token) {
      this.api.defaults.headers.common["Authorization"] =
        `Bearer ${this.token}`;
    }
  }

  // Auth Methods
  async login(email: string, password: string) {
    const response = await this.api.post("/auth/login", { email, password });
    this.token = response.data.token;
    if (this.token) {
      localStorage.setItem("auth_token", this.token);
    }
    this.setAuthHeader();
    return response.data;
  }

  async register(
    name: string,
    username: string,
    email: string,
    password: string,
    passwordConfirmation: string,
  ) {
    const response = await this.api.post("/auth/register", {
      name,
      username,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    this.token = response.data.token;
    if (this.token) {
      localStorage.setItem("auth_token", this.token);
    }
    this.setAuthHeader();
    return response.data;
  }

  async logout() {
    try {
      await this.api.post("/auth/logout");
    } finally {
      this.token = null;
      localStorage.removeItem("auth_token");
      delete this.api.defaults.headers.common["Authorization"];
    }
  }

  async getProfile() {
    const response = await this.api.get("/auth/profile");
    return response.data;
  }

  // Table Methods
  async getTables() {
    const response = await this.api.get("/tables");
    return response.data;
  }

  async getTablesBySection(section: string) {
    const response = await this.api.get(`/tables`, { params: { section } });
    return response.data;
  }

  // Section Methods
  async getSections() {
    try {
      const headers: any = { Accept: "application/json" };
      if (this.token) headers.Authorization = `Bearer ${this.token}`;

      const response = await this.api.get("/sections", {
        // Ensure the server returns JSON and no request body is sent
        headers,
      });
      return response.data;
    } catch (error: any) {
      // Provide clear logging for 422 Unprocessable Entity responses
      if (error.response) {
        const status = error.response.status;
        const respData = error.response.data;
        if (status === 422) {
          // eslint-disable-next-line no-console
          console.error("[apiService] GET /sections returned 422:", {
            url: "/sections",
            status,
            data: respData,
            message: error.message,
          });
        } else {
          // eslint-disable-next-line no-console
          console.warn("[apiService] GET /sections failed:", {
            url: "/sections",
            status,
            data: respData,
            message: error.message,
          });
        }
      } else {
        // Network / unknown error
        // eslint-disable-next-line no-console
        console.error(
          "[apiService] Network error while fetching /sections:",
          error,
        );
      }
      throw error;
    }
  }

  async createSection(name: string) {
    try {
      const response = await this.api.post("/sections", { name });
      console.log("[apiService] POST /sections response:", {
        status: response.status,
        data: response.data,
        fullResponse: response,
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 422) {
          const message =
            data?.message ||
            (data?.errors && Object.values(data.errors).flat()[0]) ||
            "بيانات غير صحيحة لإنشاء القسم";
          // eslint-disable-next-line no-console
          console.error("[apiService] POST /sections 422:", { status, data });
          throw new Error(message);
        }
        // other non-422 errors: surface server message if present
        const otherMessage =
          data?.message || error.message || "فشل إنشاء القسم";
        // eslint-disable-next-line no-console
        console.warn("[apiService] POST /sections failed:", { status, data });
        throw new Error(otherMessage);
      }
      // Network or unknown
      // eslint-disable-next-line no-console
      console.error("[apiService] Network error on POST /sections:", error);
      throw error;
    }
  }

  async getTable(id: number) {
    const response = await this.api.get(`/tables/${id}`);
    return response.data;
  }

  async createTable(label: string, columnHeaders: string[]) {
    const response = await this.api.post("/tables", {
      label,
      column_headers: columnHeaders,
    });
    return response.data;
  }

  async createTableInSection(
    section: string,
    label?: string,
    data?: any,
    columnHeaders?: string[],
  ) {
    const response = await this.api.post("/tables", {
      section,
      label: label || null,
      data: data || null,
      column_headers: columnHeaders || null,
    });
    return response.data;
  }

  async updateTable(
    id: number,
    payload: {
      label?: string;
      data?: any; // table.data (rows)
      column_headers?: string[]; // table headers
      notes?: string;
    },
  ) {
    const response = await this.api.put(`/tables/${id}`, payload);
    return response.data;
  }

  async saveAllTables(section: string, tables: any[]) {
    const response = await this.api.post(`/tables/save-all`, {
      section,
      tables,
    });
    return response.data;
  }

  async deleteTable(id: number) {
    const response = await this.api.delete(`/tables/${id}`);
    return response.data;
  }

  // Section deletion
  async deleteSection(id: number) {
    const response = await this.api.delete(`/sections/${id}`);
    return response.data;
  }

  // Table Row Methods
  async addTableRow(tableId: number, rowData: string[]) {
    const response = await this.api.post(`/tables/${tableId}/rows`, {
      row_data: rowData,
    });
    return response.data;
  }

  async updateTableRow(rowId: number, rowData: string[]) {
    const response = await this.api.put(`/rows/${rowId}`, {
      row_data: rowData,
    });
    return response.data;
  }

  async deleteTableRow(rowId: number) {
    const response = await this.api.delete(`/rows/${rowId}`);
    return response.data;
  }

  // Image Methods
  async getImages() {
    const response = await this.api.get("/images");
    return response.data;
  }

  async uploadImage(file: File, description?: string) {
    const formData = new FormData();
    formData.append("file", file);
    if (description) {
      formData.append("description", description);
    }

    const response = await this.api.post("/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async deleteImage(id: number) {
    const response = await this.api.delete(`/images/${id}`);
    return response.data;
  }

  // PDF Export Methods
  /**
   * Export table to PDF with Arabic support
   * File name: "تصدير إلى PDF" (Export to PDF)
   */
  async exportTableToPdf(tableId: number) {
    const response = await this.api.get(`/tables/${tableId}/export-pdf`, {
      responseType: "blob",
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `table-export-${tableId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Admin Methods
  async getAllUsers() {
    const response = await this.api.get("/admin/users");
    return response.data;
  }

  async getUserDetails(userId: number) {
    const response = await this.api.get(`/admin/users/${userId}`);
    return response.data;
  }

  async deleteUser(userId: number) {
    const response = await this.api.delete(`/admin/users/${userId}`);
    return response.data;
  }

  // Utility Methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  // Notes Methods
  async saveNote(tableName: string, content: string) {
    const response = await this.api.post("/notes", {
      table_name: tableName,
      content,
    });
    return response.data;
  }

  async getAllNotes() {
    const response = await this.api.get("/notes");
    return response.data;
  }

  async getNotesByTable(tableName: string) {
    const response = await this.api.get(`/notes/${tableName}`);
    return response.data;
  }

  async updateNote(noteId: number, content: string) {
    const response = await this.api.put(`/notes/${noteId}`, { content });
    return response.data;
  }

  async deleteNote(noteId: number) {
    const response = await this.api.delete(`/notes/${noteId}`);
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Default export for legacy/default imports used across the app
export default apiService;
