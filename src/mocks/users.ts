import { User } from "@/types/user";

export const MOCK_USERS: User[] = [
  {
    id: "usr_01",
    name: "Eleanor Vance",
    email: "eleanor.vance@example.com",
    role: "admin",
    status: "active",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-02-10T14:30:00Z",
  },
  {
    id: "usr_02",
    name: "Marcus Thorne",
    email: "marcus.thorne@example.com",
    role: "member",
    status: "active",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    createdAt: "2025-02-01T09:15:00Z",
    updatedAt: "2025-02-20T11:45:00Z",
  },
  {
    id: "usr_03",
    name: "Aria Montgomery",
    email: "aria.montgomery@example.com",
    role: "member",
    status: "pending",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    createdAt: "2025-03-01T08:00:00Z",
    updatedAt: "2025-03-01T08:00:00Z",
  },
  {
    id: "usr_04",
    name: "Julian Croft",
    email: "julian.croft@example.com",
    role: "viewer",
    status: "inactive",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    createdAt: "2024-11-20T16:20:00Z",
    updatedAt: "2025-01-10T09:00:00Z",
  },
];
