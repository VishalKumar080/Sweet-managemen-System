import api from "./api";
import { ApiResponse, Sweet, PaginatedResponse } from "../types";

export const sweetService = {
  getAllSweets: async (page = 1, limit = 10) => {
    const response = await api.get<ApiResponse<PaginatedResponse<Sweet>>>(
      `/sweets?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  searchSweets: async (params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params.name) queryParams.append("name", params.name);
    if (params.category) queryParams.append("category", params.category);
    if (params.minPrice)
      queryParams.append("minPrice", params.minPrice.toString());
    if (params.maxPrice)
      queryParams.append("maxPrice", params.maxPrice.toString());

    const response = await api.get<ApiResponse<{ sweets: Sweet[] }>>(
      `/sweets/search?${queryParams}`
    );
    return response.data;
  },

  addSweet: async (sweetData: Partial<Sweet>) => {
    const response = await api.post<ApiResponse<{ sweet: Sweet }>>(
      "/sweets",
      sweetData
    );
    return response.data;
  },

  updateSweet: async (id: string, sweetData: Partial<Sweet>) => {
    const response = await api.put<ApiResponse<{ sweet: Sweet }>>(
      `/sweets/${id}`,
      sweetData
    );
    return response.data;
  },

  deleteSweet: async (id: string) => {
    const response = await api.delete<ApiResponse<{ sweet: Sweet }>>(
      `/sweets/${id}`
    );
    return response.data;
  },

  purchaseSweet: async (id: string, quantity: number) => {
    const response = await api.post<ApiResponse<{ sweet: Sweet }>>(
      `/sweets/${id}/purchase`,
      {
        quantity,
      }
    );
    return response.data;
  },

  restockSweet: async (id: string, quantity: number) => {
    const response = await api.post<ApiResponse<{ sweet: Sweet }>>(
      `/sweets/${id}/restock`,
      {
        quantity,
      }
    );
    return response.data;
  },
};
