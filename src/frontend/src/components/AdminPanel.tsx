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
import { Loader2, LogOut, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type MutResult = { ok: null } | { err: string };

interface RawUserInfo {
  mobile: string;
  validityDate: [] | [string];
}

interface UserInfo {
  mobile: string;
  validityDate: string | null;
}

interface AdminActor {
  listAllUsers(): Promise<RawUserInfo[]>;
  setUserValidity(mobile: string, validityDate: string): Promise<MutResult>;
  removeUserValidity(mobile: string): Promise<MutResult>;
  deleteUser(mobile: string): Promise<MutResult>;
}

interface AdminPanelProps {
  onLogout: () => void;
}

function optToNull(opt: [] | [string]): string | null {
  return opt.length > 0 ? (opt[0] as string) : null;
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
  const adminActor = actor as unknown as AdminActor | null;
  const queryClient = useQueryClient();

  // Track per-row editing state: mobile -> selected date string
  const [editDates, setEditDates] = useState<Record<string, string>>({});
  const [savingMobile, setSavingMobile] = useState<string | null>(null);
  const [deletingMobile, setDeletingMobile] = useState<string | null>(null);

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-users"] as const,
    queryFn: async (): Promise<UserInfo[]> => {
      if (!adminActor) return [];
      const raw = await adminActor.listAllUsers();
      return raw.map((u) => ({
        mobile: u.mobile,
        validityDate: optToNull(u.validityDate),
      }));
    },
    enabled: !!adminActor,
  });

  const handleDateChange = (mobile: string, date: string) => {
    setEditDates((prev) => ({ ...prev, [mobile]: date }));
  };

  const handleUpdate = async (user: UserInfo) => {
    if (!adminActor) return;
    const date = editDates[user.mobile];
    if (!date) {
      toast.error("Please select a validity date first.");
      return;
    }
    setSavingMobile(user.mobile);
    try {
      const result = await adminActor.setUserValidity(user.mobile, date);
      if ("ok" in result) {
        toast.success(`Validity updated for ${user.mobile}`);
        // Clear the edit date for this row
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
    if (!adminActor) return;
    setDeletingMobile(mobile);
    try {
      const result = await adminActor.deleteUser(mobile);
      if ("ok" in result) {
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
        className="sticky top-0 z-50 flex items-center gap-3 px-6 py-4 border-b border-border"
        style={{
          backgroundColor: "oklch(0.15 0.04 200 / 0.95)",
          backdropFilter: "blur(12px)",
        }}
      >
        <img
          src="/assets/uploads/ss_local-019d3cf2-cb33-77b6-80dc-021c2b6b1286-1.png"
          alt="SS Local"
          style={{ height: 46 }}
          className="w-auto object-contain"
        />
        <span className="text-foreground font-bold text-lg ml-2">
          Admin Panel
        </span>
        <div className="flex-1" />
        <Button
          data-ocid="admin.secondary_button"
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="border-border text-muted-foreground"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
        <Button
          data-ocid="admin.button"
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="border-border text-muted-foreground"
        >
          <LogOut className="w-4 h-4 mr-1" />
          Logout
        </Button>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {/* Summary counts */}
        <div className="flex gap-4 mb-6">
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
          ) : !users || users.length === 0 ? (
            <div
              data-ocid="admin.empty_state"
              className="text-center py-16 text-muted-foreground"
            >
              No users registered yet.
            </div>
          ) : (
            <Table data-ocid="admin.table">
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">#</TableHead>
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
                {users.map((user, i) => {
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
                        {/* Inline date picker + Update button */}
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
                            data-ocid={`admin.update_button.${i + 1}`}
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
          )}
        </div>
      </main>
    </div>
  );
}
