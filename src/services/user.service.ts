import { apiClient } from "@/services/api-client";
import { User, CreateUserDto, UpdateUserDto } from "@/types/user";
import { PaginatedResponse, QueryParams } from "@/types/api";
import { MOCK_USERS } from "@/mocks/users";
import { env } from "@/config/env";
import { delay } from "@/lib/utils";

export class UserService {
  private static readonly BASE_PATH = "/users";

  /**
   * Fetches paginated list of users.
   */
  static async getUsers(params?: QueryParams): Promise<PaginatedResponse<User>> {
    try {
      return await apiClient.get<PaginatedResponse<User>>(this.BASE_PATH, {
        params: params as Record<string, string | number | boolean | undefined | null>,
      });
    } catch (error) {
      if (env.enableMockFallback) {
        await delay(300);
        return {
          data: MOCK_USERS,
          pagination: {
            page: params?.page ?? 1,
            limit: params?.limit ?? 10,
            total: MOCK_USERS.length,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
          },
        };
      }
      throw error;
    }
  }

  /**
   * Fetches single user by ID.
   */
  static async getUserById(id: string): Promise<User> {
    try {
      return await apiClient.get<User>(`${this.BASE_PATH}/${id}`);
    } catch (error) {
      if (env.enableMockFallback) {
        await delay(200);
        const user = MOCK_USERS.find((u) => u.id === id);
        if (!user) {
          throw new Error(`User with ID ${id} not found.`);
        }
        return user;
      }
      throw error;
    }
  }

  /**
   * Creates a new user.
   */
  static async createUser(data: CreateUserDto): Promise<User> {
    try {
      return await apiClient.post<User>(this.BASE_PATH, data);
    } catch (error) {
      if (env.enableMockFallback) {
        await delay(300);
        const newUser: User = {
          id: `usr_${Date.now()}`,
          name: data.name,
          email: data.email,
          role: data.role,
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return newUser;
      }
      throw error;
    }
  }

  /**
   * Updates an existing user.
   */
  static async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    try {
      return await apiClient.patch<User>(`${this.BASE_PATH}/${id}`, data);
    } catch (error) {
      if (env.enableMockFallback) {
        await delay(200);
        const existing = MOCK_USERS.find((u) => u.id === id);
        if (!existing) throw new Error("User not found");
        return { ...existing, ...data, updatedAt: new Date().toISOString() };
      }
      throw error;
    }
  }

  /**
   * Deletes a user.
   */
  static async deleteUser(id: string): Promise<void> {
    try {
      await apiClient.delete<void>(`${this.BASE_PATH}/${id}`);
    } catch (error) {
      if (env.enableMockFallback) {
        await delay(200);
        return;
      }
      throw error;
    }
  }
}
