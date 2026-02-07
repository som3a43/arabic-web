import React from "react";
import { AdminPanel } from "../components/AdminPanel";

interface User {
  email: string;
  username: string;
  role: "admin" | "user";
}

interface UserData {
  email: string;
  username: string;
  role: "admin" | "user";
  tablesCount: number;
}

interface AdminPageProps {
  users: UserData[];
}

export const AdminPage: React.FC<AdminPageProps> = ({ users }) => {
  return (
    <div>
      <AdminPanel users={users} />
    </div>
  );
};

export default AdminPage;
