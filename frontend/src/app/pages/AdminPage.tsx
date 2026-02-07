import React from "react";
import { AdminPanel } from "../components/AdminPanel";

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
