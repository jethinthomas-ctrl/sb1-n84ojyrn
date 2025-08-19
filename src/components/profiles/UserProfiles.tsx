import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { User, Role, Location } from "../../types";
import {
  Users,
  Plus,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Music,
  X,
  Shield,
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient"; // ✅ supabase client setup

const UserProfiles: React.FC = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoleUserId, setEditingRoleUserId] = useState<string | null>(
    null
  );

  const [newUser, setNewUser] = useState({
    name: "",
    roles: [] as Role[],
    baseLocation: "Kharadi" as Location,
    mobileNumber: "",
    email: "",
    userRole: "Member" as "Member" | "Admin",
  });

  const roleOptions: Role[] = [
    "Guitarist",
    "Vocalist",
    "Bass",
    "Keyboard",
    "Cajon",
  ];
  const locationOptions: Location[] = ["Kharadi", "Baner"];

  const isAdmin = currentUser?.userRole === "Admin";

  // 🔹 Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        // ✅ Ensure roles is always an array
        const formatted = (data || []).map((u: any) => ({
          ...u,
          roles: Array.isArray(u.roles)
            ? u.roles
            : u.roles
            ? Object.values(u.roles)
            : [],
        }));
        setUsers(formatted as User[]);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  // 🔹 Add new user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newUser.roles.length === 0) {
      alert("Please select at least one role");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .insert([
        {
          name: newUser.name,
          roles: newUser.roles, // ✅ Supabase handles array → jsonb
          baseLocation: newUser.baseLocation,
          mobileNumber: newUser.mobileNumber,
          email: newUser.email,
          userRole: newUser.userRole,
        },
      ])
      .select();

    if (error) {
      console.error("Error adding user:", error);
    } else {
      const formatted = (data || []).map((u: any) => ({
        ...u,
        roles: Array.isArray(u.roles)
          ? u.roles
          : u.roles
          ? Object.values(u.roles)
          : [],
      }));
      setUsers((prev) => [...formatted, ...prev]);
      setNewUser({
        name: "",
        roles: [],
        baseLocation: "Kharadi",
        mobileNumber: "",
        email: "",
        userRole: "Member",
      });
      setShowAddForm(false);
    }
  };

  // 🔹 Delete user
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) {
        console.error("Error deleting user:", error);
      } else {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    }
  };

  // 🔹 Update user role
  const handleUpdateUserRole = async (
    userId: string,
    newRole: "Member" | "Admin"
  ) => {
    if (userId === currentUser?.id && newRole === "Member") {
      if (
        !window.confirm(
          "You are about to remove your own admin privileges. Are you sure?"
        )
      ) {
        return;
      }
    }

    const { error } = await supabase
      .from("profiles")
      .update({ userRole: newRole })
      .eq("id", userId);

    if (error) {
      console.error("Error updating role:", error);
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, userRole: newRole } : u))
      );
      setEditingRoleUserId(null);
    }
  };

  const toggleRole = (role: Role) => {
    setNewUser((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  const getRoleColor = (role: Role) => {
    const colors = {
      Guitarist: "bg-blue-100 text-blue-800",
      Vocalist: "bg-purple-100 text-purple-800",
      Bass: "bg-green-100 text-green-800",
      Keyboard: "bg-orange-100 text-orange-800",
      Cajon: "bg-red-100 text-red-800",
    };
    return colors[role];
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 🔹 UI unchanged, only data handling improved */}
      {/* ... keep your JSX here exactly as before ... */}
    </div>
  );
};

export default UserProfiles;
