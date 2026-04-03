import type { RegisterResult } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActor } from "@/hooks/useActor";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  KeyRound,
  Loader2,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface UserInfo {
  mobile: string;
  fullName: string;
  village: string;
  validityDate: string | null;
}

interface AdminPanelProps {
  onLogout: () => void;
}

function getStatus(
  validityDate: string | null,
): "active" | "expired" | "inactive" {
  if (!validityDate) return "inactive";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const validity = new Date(validityDate);
  return validity >= today ? "active" : "expired";
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const [editDates, setEditDates] = useState<Record<string, string>>({});
  const [savingMobile, setSavingMobile] = useState<string | null>(null);
  const [deletingMobile, setDeletingMobile] = useState<string | null>(null);

  // Search state
  const [searchMobile, setSearchMobile] = useState("");
  const [searchVillage, setSearchVillage] = useState("");

  // Hamburger menu state
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Update password state
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-users"] as const,
    queryFn: async (): Promise<UserInfo[]> => {
      if (!actor) return [];
      const raw = await actor.listAllUsers();
      return raw.map((u) => ({
        mobile: u.mobile,
        fullName: u.fullName ?? "",
        village: u.village ?? "",
        validityDate: u.validUntil ?? null,
      }));
    },
    enabled: !!actor,
  });

  // Filtered users based on search inputs
  const filteredUsers = (users ?? []).filter((u) => {
    const mobileMatch = u.mobile
      .toLowerCase()
      .includes(searchMobile.toLowerCase());
    const villageMatch = u.village
      .toLowerCase()
      .includes(searchVillage.toLowerCase());
    return mobileMatch && villageMatch;
  });

  const handleDateChange = (mobile: string, date: string) => {
    setEditDates((prev) => ({ ...prev, [mobile]: date }));
  };

  const handleUpdate = async (user: UserInfo) => {
    if (!actor) return;
    const date = editDates[user.mobile];
    if (!date) {
      toast.error("Please select a validity date first.");
      return;
    }
    setSavingMobile(user.mobile);
    try {
      const result: RegisterResult = await actor.setUserValidity(
        user.mobile,
        date,
      );
      if (result.__kind__ === "ok") {
        toast.success(`Validity updated for ${user.mobile}`);
        setEditDates((prev) => {
          const next = { ...prev };
          delete next[user.mobile];
          return next;
        });
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      } else {
        toast.error(result.err);
      }
    } catch {
      toast.error("Failed to update validity.");
    } finally {
      setSavingMobile(null);
    }
  };

  const handleDelete = async (mobile: string) => {
    if (!actor) return;
    setDeletingMobile(mobile);
    try {
      const result: RegisterResult = await actor.deleteUser(mobile);
      if (result.__kind__ === "ok") {
        toast.success(`User ${mobile} deleted.`);
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      } else {
        toast.error(result.err);
      }
    } catch {
      toast.error("Failed to delete user.");
    } finally {
      setDeletingMobile(null);
    }
  };

  const handleUpdatePassword = async () => {
    if (!actor) return;
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    setUpdatingPassword(true);
    try {
      const result: RegisterResult = await actor.updatePassword(
        "admin",
        oldPassword,
        newPassword,
      );
      if (result.__kind__ === "ok") {
        toast.success("Admin password updated successfully.");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowUpdatePassword(false);
        setMenuOpen(false);
      } else {
        toast.error(result.err || "Failed to update password.");
      }
    } catch {
      toast.error("Failed to update password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const activatedUsers = (users ?? []).filter(
    (u) => getStatus(u.validityDate) === "active",
  );
  const notActivatedUsers = (users ?? []).filter(
    (u) => getStatus(u.validityDate) !== "active",
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.16 0.045 200) 0%, oklch(0.12 0.04 200) 100%)",
      }}
    >
      <header
        className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3 border-b border-border"
        style={{
          backgroundColor: "oklch(0.15 0.04 200 / 0.95)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Hamburger menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => {
              setMenuOpen((v) => !v);
              setShowUpdatePassword(false);
            }}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
            aria-label="Admin menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div
              className="absolute left-0 top-full mt-1 w-64 rounded-xl shadow-xl border border-border z-50 overflow-hidden"
              style={{ backgroundColor: "oklch(0.20 0.04 200)" }}
            >
              {/* Admin label */}
              <div className="px-4 py-3 border-b border-border">
                <div className="text-sm font-semibold text-foreground">
                  Admin
                </div>
                <div className="text-xs text-muted-foreground">
                  Administrator
                </div>
              </div>

              {!showUpdatePassword ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowUpdatePassword(true)}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-white/10 transition-colors text-left"
                  >
                    <KeyRound className="w-4 h-4 text-muted-foreground" />
                    Update Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left border-t border-border"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-foreground">
                      Update Password
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowUpdatePassword(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      type="password"
                      placeholder="Current password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="rounded-md border border-border bg-background text-foreground text-xs px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="rounded-md border border-border bg-background text-foreground text-xs px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="rounded-md border border-border bg-background text-foreground text-xs px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Button
                      size="sm"
                      onClick={handleUpdatePassword}
                      disabled={updatingPassword}
                      className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground w-full mt-1"
                    >
                      {updatingPassword ? (
                        <Loader2 className="w-3 h-3 animate-spin mr-1" />
                      ) : null}
                      Save Password
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <img
          src="/assets/uploads/ss_local-019d3cf2-cb33-77b6-80dc-021c2b6b1286-1.png"
          alt="SS Local"
          style={{ height: 36 }}
          className="w-auto object-contain"
        />
        <span className="text-foreground font-bold text-base ml-1">
          Admin Panel
        </span>
        <div className="flex-1" />
        <Button
          data-ocid="admin.secondary_button"
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="border-border text-muted-foreground h-8"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          Refresh
        </Button>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        {/* Summary counts */}
        <div className="flex gap-4 mb-5">
          <div
            className="rounded-xl px-5 py-3 flex flex-col items-center shadow-card ring-1 ring-border"
            style={{ backgroundColor: "oklch(0.22 0.035 200)" }}
          >
            <span className="text-2xl font-bold text-green-400">
              {activatedUsers.length}
            </span>
            <span className="text-xs text-muted-foreground">Activated</span>
          </div>
          <div
            className="rounded-xl px-5 py-3 flex flex-col items-center shadow-card ring-1 ring-border"
            style={{ backgroundColor: "oklch(0.22 0.035 200)" }}
          >
            <span className="text-2xl font-bold text-red-400">
              {notActivatedUsers.length}
            </span>
            <span className="text-xs text-muted-foreground">Not Activated</span>
          </div>
          <div
            className="rounded-xl px-5 py-3 flex flex-col items-center shadow-card ring-1 ring-border"
            style={{ backgroundColor: "oklch(0.22 0.035 200)" }}
          >
            <span className="text-2xl font-bold text-foreground">
              {(users ?? []).length}
            </span>
            <span className="text-xs text-muted-foreground">Total Users</span>
          </div>
        </div>

        {/* Search bar */}
        <div
          className="flex flex-col sm:flex-row gap-3 mb-4 p-4 rounded-xl ring-1 ring-border"
          style={{ backgroundColor: "oklch(0.22 0.035 200)" }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by mobile number..."
              value={searchMobile}
              onChange={(e) => setSearchMobile(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchMobile && (
              <button
                type="button"
                onClick={() => setSearchMobile("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by village name..."
              value={searchVillage}
              onChange={(e) => setSearchVillage(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchVillage && (
              <button
                type="button"
                onClick={() => setSearchVillage("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div
          className="rounded-2xl overflow-hidden shadow-card ring-1 ring-border"
          style={{ backgroundColor: "oklch(0.22 0.035 200)" }}
        >
          {isLoading ? (
            <div
              data-ocid="admin.loading_state"
              className="flex items-center justify-center py-16"
            >
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Loading users...
              </span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div
              data-ocid="admin.empty_state"
              className="text-center py-16 text-muted-foreground"
            >
              {(users ?? []).length === 0
                ? "No users registered yet."
                : "No users match the search."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table data-ocid="admin.table">
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">#</TableHead>
                    <TableHead className="text-muted-foreground">
                      Full Name
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Village
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Mobile Number
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Validity
                    </TableHead>
                    <TableHead className="text-muted-foreground text-right">
                      Delete
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user, i) => {
                    const status = getStatus(user.validityDate);
                    const rowDate = editDates[user.mobile] ?? "";
                    const isSaving = savingMobile === user.mobile;

                    return (
                      <TableRow
                        key={user.mobile}
                        data-ocid={`admin.item.${i + 1}`}
                        className="border-border hover:bg-white/5 align-top"
                      >
                        <TableCell className="text-muted-foreground text-sm pt-3">
                          {i + 1}
                        </TableCell>
                        <TableCell className="text-foreground text-sm pt-3">
                          {user.fullName || "-"}
                        </TableCell>
                        <TableCell className="text-foreground text-sm pt-3">
                          {user.village || "-"}
                        </TableCell>
                        <TableCell className="text-foreground font-mono text-sm pt-3">
                          {user.mobile}
                        </TableCell>
                        <TableCell className="pt-3">
                          {status === "active" && (
                            <Badge className="bg-green-600/20 text-green-400 border-green-600/40">
                              Activated
                            </Badge>
                          )}
                          {status === "expired" && (
                            <Badge className="bg-orange-600/20 text-orange-400 border-orange-600/40">
                              Expired
                            </Badge>
                          )}
                          {status === "inactive" && (
                            <Badge className="bg-red-600/20 text-red-400 border-red-600/40">
                              Not Activated
                            </Badge>
                          )}
                          {user.validityDate && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Till: {user.validityDate}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="pt-2">
                          <div className="flex flex-col gap-1.5">
                            <input
                              type="date"
                              value={rowDate}
                              min={new Date().toISOString().split("T")[0]}
                              onChange={(e) =>
                                handleDateChange(user.mobile, e.target.value)
                              }
                              className="rounded-md border border-border bg-background text-foreground text-xs px-2 py-1 w-36 focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <Button
                              data-ocid={`admin.save_button.${i + 1}`}
                              size="sm"
                              disabled={!rowDate || isSaving}
                              onClick={() => handleUpdate(user)}
                              className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white w-36"
                            >
                              {isSaving ? (
                                <Loader2 className="w-3 h-3 animate-spin mr-1" />
                              ) : null}
                              Update
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pt-3">
                          <Button
                            data-ocid={`admin.delete_button.${i + 1}`}
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(user.mobile)}
                            disabled={deletingMobile === user.mobile}
                            className="h-7 px-2 border-red-600/40 text-red-400 hover:bg-red-600/20"
                          >
                            {deletingMobile === user.mobile ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
