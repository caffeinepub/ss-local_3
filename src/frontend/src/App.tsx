import AdminPanel from "@/components/AdminPanel";
import LoginPage from "@/components/LoginPage";
import SignUpPage from "@/components/SignUpPage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { useActor } from "@/hooks/useActor";
import {
  Check,
  Lock,
  LogOut,
  Maximize,
  Menu,
  Pencil,
  Radio,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface Channel {
  name: string;
  videoId?: string;
  channelUrl?: string;
  isLive?: boolean;
  color: string;
  logo?: string;
}

interface CurrentUser {
  role: string;
  mobile: string;
  fullName: string;
  village: string;
  validityDate: string | null;
}

type View = "login" | "signup" | "admin" | "main";
type TabId = "news" | "devotional" | "youtube";

interface UserActor {
  updatePassword(
    mobile: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<{ ok: null } | { err: string }>;
  updateUserInfo(
    mobile: string,
    fullName: string,
    village: string,
  ): Promise<{ ok: null } | { err: string }>;
}

const NEWS_CHANNELS: Channel[] = [
  {
    name: "TV9",
    videoId: "II_m28Bm-iM",
    isLive: true,
    color: "#E53935",
    logo: "/assets/uploads/tv9-019d3d1d-95e8-71bf-8413-182f777da941-13.jpeg",
  },
  {
    name: "V6",
    videoId: "U58aDf-zfmY",
    isLive: true,
    color: "#1565C0",
    logo: "/assets/uploads/v6-019d3d1d-966c-724d-9be5-435084c31aca-14.jpeg",
  },
  {
    name: "T NEWS",
    videoId: "ANU5_XHW2wA",
    isLive: true,
    color: "#2E7D32",
    logo: "/assets/uploads/tnews-019d3d1d-98bb-7218-8b4f-d59158fcdade-18.jpeg",
  },
  {
    name: "N TV",
    videoId: "L0RktSIM980",
    isLive: true,
    color: "#E65100",
    logo: "/assets/uploads/ntv-019d3d1d-9729-759f-919f-017fd8efb94f-16.jpeg",
  },
  {
    name: "SITI News",
    videoId: "UUYIH99c3wA",
    isLive: true,
    color: "#00838F",
    logo: "/assets/uploads/siti_news-019d3d1d-88cc-710a-bfb4-f825ae3bf25d-1.jpeg",
  },
  {
    name: "Mahaa News",
    videoId: "HL8IgeQwPMc",
    isLive: true,
    color: "#D32F2F",
    logo: "/assets/uploads/mahaa_news-019d3d71-e0af-7171-aa5e-9c8604d1fc83-1.png",
  },
  {
    name: "Zee Telugu News",
    videoId: "ffI9-IioJK8",
    isLive: true,
    color: "#1976D2",
    logo: "/assets/uploads/zee_telugu_news-019d3d1d-9416-7109-9373-e2b4e3674594-10.jpeg",
  },
  {
    name: "ABN Andhra Jyothi",
    videoId: "HoYsWagMFfE",
    isLive: true,
    color: "#C62828",
    logo: "/assets/uploads/abn_andhra_jyothi-019d3d1d-8e15-74be-aba4-a01f3b9e4959-6.jpeg",
  },
  {
    name: "TV5",
    videoId: "NdmSb1MnSR0",
    isLive: true,
    color: "#2E7D32",
    logo: "/assets/uploads/tv5-019d3d1d-8a6d-7613-830d-fc095c3e60ba-5.jpeg",
  },
  {
    name: "HMTV",
    videoId: "r3484y1SD7Y",
    isLive: true,
    color: "#E65100",
    logo: "/assets/uploads/hmtv-019d3d1d-8a54-710b-9ebc-d8efc92edd6c-4.png",
  },
  {
    name: "Raj News Telugu",
    videoId: "tzngk8fvxFs",
    isLive: true,
    color: "#AD1457",
    logo: "/assets/uploads/raj_news_telugu-019d3d1d-8970-7311-b2f2-feb844b735f3-3.png",
  },
  {
    name: "10 TV",
    videoId: "byG7EGw9NPs",
    isLive: true,
    color: "#F57F17",
    logo: "/assets/uploads/10tv-019d3d1d-8f29-729f-9c02-2cfc46d76468-7.jpeg",
  },
];

const BHAKTHI_CHANNELS: Channel[] = [
  {
    name: "Bhakthi TV",
    videoId: "d0dB3kSCMmM",
    isLive: true,
    color: "#6A1B9A",
    logo: "/assets/uploads/bhakthitv-019d3d1d-942c-75bb-97eb-c594a7594d7a-9.jpeg",
  },
  {
    name: "SVBC",
    videoId: "L5WTm0DVvdk",
    isLive: true,
    color: "#AD1457",
    logo: "/assets/uploads/svbc-019d3d1d-8935-71fe-938a-427dafc993f5-2.jpeg",
  },
  {
    name: "Hindhu Dharmam",
    videoId: "r-VKXUVmytU",
    isLive: true,
    color: "#F57F17",
    logo: "/assets/uploads/hindu_dharmam-019d3d1d-9467-7777-b170-c5b145802a83-11.jpeg",
  },
  {
    name: "CVR OM",
    videoId: "2FtpKyiHgvk",
    isLive: true,
    color: "#0277BD",
    logo: "/assets/uploads/cvr_om-019d3d1d-943b-704e-8f43-87c10165b4b6-12.jpeg",
  },
];

const YOUTUBE_CHANNELS: Channel[] = [
  {
    name: "SS Local",
    channelUrl: "https://youtube.com/@sslocal264",
    color: "#27C4B8",
    logo: "/assets/uploads/ss_local-019d3cf2-cb33-77b6-80dc-021c2b6b1286-1.png",
  },
  {
    name: "RB News",
    channelUrl: "https://youtube.com/@rbnews123",
    color: "#C62828",
    logo: "/assets/uploads/rb-019d3d1d-a227-754f-87c0-262134c6834c-19.png",
  },
  {
    name: "DJ Songs",
    videoId: "4lbtCVHm6R0",
    color: "#4527A0",
    logo: "/assets/uploads/dj_songs-019d3d1d-9872-725e-924f-f28c737a238c-17.jpeg",
  },
  {
    name: "Folk Songs",
    videoId: "_r0Ct38-gUU",
    color: "#558B2F",
    logo: "/assets/uploads/folk_songs-019d3d1d-9417-7661-96d6-71fc40d7a03c-8.jpeg",
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function isUserActivated(validityDate: string | null): boolean {
  if (!validityDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const validity = new Date(validityDate);
  return validity >= today;
}

interface ChannelCardProps {
  channel: Channel;
  isActive: boolean;
  index: number;
  isLocked: boolean;
  onPlay: (channel: Channel) => void;
}

function ChannelCard({
  channel,
  isActive,
  index,
  isLocked,
  onPlay,
}: ChannelCardProps) {
  const isExternalOnly = !!channel.channelUrl && !channel.videoId;

  const handleClick = () => {
    if (isLocked) {
      toast.error("Subscribe to access this channel", {
        description: "Please contact admin to activate your account.",
      });
      return;
    }
    if (isExternalOnly) {
      window.open(channel.channelUrl, "_blank", "noopener,noreferrer");
    } else {
      onPlay(channel);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      onClick={handleClick}
      data-ocid={`channel.item.${index + 1}`}
      className={`
        group relative cursor-pointer rounded-xl overflow-hidden shadow-card
        transition-all duration-300 hover:scale-[1.03] hover:shadow-glow
        ${isActive ? "ring-2 ring-primary shadow-glow" : "ring-1 ring-border"}
      `}
      style={{ backgroundColor: "oklch(0.22 0.035 200)" }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: 55,
          backgroundColor: `${channel.color}22`,
          borderBottom: `2px solid ${channel.color}44`,
        }}
      >
        {channel.logo ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: channel.color, fontSize: 22 }}
          >
            {getInitials(channel.name)}
          </div>
        )}

        {channel.isLive && (
          <span className="absolute top-1 left-1 flex items-center gap-0.5 bg-red-600 text-white text-[7px] font-bold px-1 py-0.5 rounded-full live-pulse">
            <span className="w-1 h-1 bg-white rounded-full inline-block" />
            LIVE
          </span>
        )}

        {/* External link indicator for channel-only URLs */}
        {isExternalOnly && !isLocked && (
          <div className="absolute bottom-1 right-1 bg-black/60 rounded-full p-0.5">
            <svg
              viewBox="0 0 24 24"
              className="w-3 h-3 fill-none stroke-white stroke-2"
              aria-label="Open link"
              role="img"
            >
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </div>
        )}

        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Lock className="w-4 h-4 text-white/80" />
          </div>
        )}

        {isActive && !isLocked && (
          <span className="absolute top-1 right-1 bg-primary/80 text-primary-foreground text-[7px] font-bold px-1 py-0.5 rounded-full">
            ▶
          </span>
        )}
      </div>

      <div className="px-1.5 py-1">
        <span className="text-foreground font-semibold text-xs truncate block text-center">
          {channel.name}
        </span>
      </div>
    </motion.div>
  );
}

interface ChannelGridProps {
  channels: Channel[];
  activeVideoId: string | null;
  isLocked: boolean;
  onPlay: (channel: Channel) => void;
  sectionId: string;
}

function ChannelGrid({
  channels,
  activeVideoId,
  isLocked,
  onPlay,
  sectionId,
}: ChannelGridProps) {
  return (
    <div
      data-ocid={`${sectionId}.list`}
      className="grid grid-cols-4 gap-2 py-3"
    >
      {channels.map((ch, i) => (
        <ChannelCard
          key={ch.name}
          channel={ch}
          isActive={!!activeVideoId && activeVideoId === ch.videoId}
          index={i}
          isLocked={isLocked}
          onPlay={onPlay}
        />
      ))}
    </div>
  );
}

// User side menu
interface UserMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: CurrentUser;
  onUserUpdate: (updated: Partial<CurrentUser>) => void;
  onLogout: () => void;
  actor: UserActor | null;
}

function UserMenu({
  open,
  onOpenChange,
  currentUser,
  onUserUpdate,
  onLogout,
  actor,
}: UserMenuProps) {
  const [editingFullName, setEditingFullName] = useState(false);
  const [editingVillage, setEditingVillage] = useState(false);
  const [fullNameVal, setFullNameVal] = useState(currentUser.fullName);
  const [villageVal, setVillageVal] = useState(currentUser.village);
  const [savingInfo, setSavingInfo] = useState(false);

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);

  const handleSaveFullName = async () => {
    if (!actor) return;
    setSavingInfo(true);
    try {
      const result = await actor.updateUserInfo(
        currentUser.mobile,
        fullNameVal,
        currentUser.village,
      );
      if ("ok" in result) {
        onUserUpdate({ fullName: fullNameVal });
        setEditingFullName(false);
        toast.success("Full name updated.");
      } else {
        toast.error(result.err);
      }
    } catch {
      toast.error("Failed to update full name.");
    } finally {
      setSavingInfo(false);
    }
  };

  const handleSaveVillage = async () => {
    if (!actor) return;
    setSavingInfo(true);
    try {
      const result = await actor.updateUserInfo(
        currentUser.mobile,
        currentUser.fullName,
        villageVal,
      );
      if ("ok" in result) {
        onUserUpdate({ village: villageVal });
        setEditingVillage(false);
        toast.success("Village updated.");
      } else {
        toast.error(result.err);
      }
    } catch {
      toast.error("Failed to update village.");
    } finally {
      setSavingInfo(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPwd !== confirmPwd) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPwd.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (!actor) return;
    setSavingPwd(true);
    try {
      const result = await actor.updatePassword(
        currentUser.mobile,
        currentPwd,
        newPwd,
      );
      if ("ok" in result) {
        toast.success("Password updated successfully.");
        setCurrentPwd("");
        setNewPwd("");
        setConfirmPwd("");
      } else {
        toast.error(result.err);
      }
    } catch {
      toast.error("Failed to update password.");
    } finally {
      setSavingPwd(false);
    }
  };

  const activated = isUserActivated(currentUser.validityDate);
  const validityDate = currentUser.validityDate;
  let subscriptionStatus: React.ReactNode;
  if (!validityDate) {
    subscriptionStatus = (
      <Badge className="bg-red-600/20 text-red-400 border-red-600/40">
        Not Activated
      </Badge>
    );
  } else if (activated) {
    subscriptionStatus = (
      <div>
        <Badge className="bg-green-600/20 text-green-400 border-green-600/40">
          Active
        </Badge>
        <div className="text-xs text-muted-foreground mt-1">
          Active until: {validityDate}
        </div>
      </div>
    );
  } else {
    subscriptionStatus = (
      <div>
        <Badge className="bg-orange-600/20 text-orange-400 border-orange-600/40">
          Expired
        </Badge>
        <div className="text-xs text-muted-foreground mt-1">
          Expired on: {validityDate}
        </div>
      </div>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-80 flex flex-col gap-0 p-0 overflow-y-auto"
        style={{
          backgroundColor: "oklch(0.15 0.04 200)",
          borderColor: "oklch(0.25 0.04 200)",
        }}
        data-ocid="user.sheet"
      >
        <SheetHeader className="px-5 pt-6 pb-4 border-b border-border">
          <SheetTitle className="text-foreground text-lg font-bold">
            My Account
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 px-5 py-4 space-y-6">
          {/* User Info Section */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              User Info
            </h3>
            <div className="space-y-3">
              {/* Full Name */}
              <div
                className="rounded-lg p-3 ring-1 ring-border"
                style={{ backgroundColor: "oklch(0.20 0.035 200)" }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">
                    Full Name
                  </span>
                  {!editingFullName ? (
                    <button
                      type="button"
                      data-ocid="user.edit_button"
                      onClick={() => {
                        setFullNameVal(currentUser.fullName);
                        setEditingFullName(true);
                      }}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditingFullName(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {editingFullName ? (
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={fullNameVal}
                      onChange={(e) => setFullNameVal(e.target.value)}
                      className="h-7 text-sm"
                      data-ocid="user.input"
                    />
                    <button
                      type="button"
                      data-ocid="user.save_button"
                      onClick={handleSaveFullName}
                      disabled={savingInfo}
                      className="flex items-center gap-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md hover:bg-primary/80 disabled:opacity-50"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-foreground font-medium">
                    {currentUser.fullName || (
                      <span className="text-muted-foreground italic">
                        Not set
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Mobile Number (read-only) */}
              <div
                className="rounded-lg p-3 ring-1 ring-border"
                style={{ backgroundColor: "oklch(0.20 0.035 200)" }}
              >
                <div className="mb-1">
                  <span className="text-xs text-muted-foreground">
                    Mobile Number
                  </span>
                </div>
                <p className="text-sm text-foreground font-mono">
                  {currentUser.mobile}
                </p>
              </div>

              {/* Village */}
              <div
                className="rounded-lg p-3 ring-1 ring-border"
                style={{ backgroundColor: "oklch(0.20 0.035 200)" }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Village</span>
                  {!editingVillage ? (
                    <button
                      type="button"
                      data-ocid="user.edit_button"
                      onClick={() => {
                        setVillageVal(currentUser.village);
                        setEditingVillage(true);
                      }}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditingVillage(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {editingVillage ? (
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={villageVal}
                      onChange={(e) => setVillageVal(e.target.value)}
                      className="h-7 text-sm"
                      data-ocid="user.input"
                    />
                    <button
                      type="button"
                      data-ocid="user.save_button"
                      onClick={handleSaveVillage}
                      disabled={savingInfo}
                      className="flex items-center gap-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md hover:bg-primary/80 disabled:opacity-50"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-foreground font-medium">
                    {currentUser.village || (
                      <span className="text-muted-foreground italic">
                        Not set
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Update Password Section */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Update Password
            </h3>
            <div
              className="rounded-lg p-3 ring-1 ring-border space-y-2"
              style={{ backgroundColor: "oklch(0.20 0.035 200)" }}
            >
              <Input
                type="password"
                placeholder="Current Password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                className="h-8 text-sm"
                data-ocid="user.input"
              />
              <Input
                type="password"
                placeholder="New Password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                className="h-8 text-sm"
                data-ocid="user.input"
              />
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                className="h-8 text-sm"
                data-ocid="user.input"
              />
              <Button
                data-ocid="user.submit_button"
                size="sm"
                disabled={savingPwd || !currentPwd || !newPwd || !confirmPwd}
                onClick={handleUpdatePassword}
                className="w-full h-8 text-sm mt-1"
              >
                {savingPwd ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </div>

          {/* Subscription History Section */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Subscription History
            </h3>
            <div
              className="rounded-lg p-3 ring-1 ring-border"
              style={{ backgroundColor: "oklch(0.20 0.035 200)" }}
            >
              {subscriptionStatus}
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="px-5 pb-6 border-t border-border pt-4">
          <Button
            data-ocid="user.button"
            variant="destructive"
            className="w-full"
            onClick={() => {
              onOpenChange(false);
              onLogout();
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Per-tab video player
interface TabPlayerProps {
  videoId: string;
  title: string;
  isMuted: boolean;
  volume: number;
  activated: boolean;
  onUnmute: () => void;
  onVolumeChange: (v: number) => void;
  playerRef: React.RefObject<HTMLDivElement | null>;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

function TabPlayer({
  videoId,
  title,
  isMuted,
  volume,
  activated,
  onUnmute,
  onVolumeChange,
  playerRef,
  iframeRef,
}: TabPlayerProps) {
  // Build embed URL -- fs=0 disables YouTube fullscreen button (we have our own)
  const origin =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.origin)
      : "";
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&cc_load_policy=0&fs=0&controls=1&enablejsapi=1&origin=${origin}`;

  const containerRef = useRef<HTMLDivElement>(null);

  const handleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    // Request fullscreen on the container div
    const reqFS =
      el.requestFullscreen ||
      (el as HTMLDivElement & { webkitRequestFullscreen?: () => void })
        .webkitRequestFullscreen ||
      (el as HTMLDivElement & { mozRequestFullScreen?: () => void })
        .mozRequestFullScreen ||
      (el as HTMLDivElement & { msRequestFullscreen?: () => void })
        .msRequestFullscreen;

    if (reqFS) {
      reqFS
        .call(el)
        .then(() => {
          // Try to lock to landscape on mobile
          try {
            const screen = window.screen as Screen & {
              orientation?: { lock?: (o: string) => Promise<void> };
            };
            if (screen.orientation?.lock) {
              screen.orientation.lock("landscape").catch(() => {});
            }
          } catch {
            // not supported, ignore
          }
        })
        .catch(() => {
          // If fullscreen fails, try opening the iframe's src directly in fullscreen
          const iframe = iframeRef.current;
          if (iframe) {
            const reqIFS =
              iframe.requestFullscreen ||
              (
                iframe as HTMLIFrameElement & {
                  webkitRequestFullscreen?: () => void;
                }
              ).webkitRequestFullscreen;
            if (reqIFS) {
              reqIFS.call(iframe).catch(() => {});
            }
          }
        });
    }
  };

  const handleVolumeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    onVolumeChange(v);
    // If volume > 0, also unmute
    if (v > 0 && isMuted) {
      onUnmute();
    }
  };

  return (
    <section ref={playerRef} className="pt-4 pb-2" id="player">
      {/* Player wrapper -- overflow hidden clips the iframe so overlays can mask YouTube UI */}
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl overflow-hidden shadow-card ring-1 ring-border"
        style={{ background: "#000" }}
      >
        {/* LIVE badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-full live-pulse pointer-events-none">
          <span className="w-2 h-2 bg-white rounded-full inline-block" />
          LIVE
        </div>

        {/* Top-right overlay: blocks YouTube logo / "Watch on YouTube" button and settings gear */}
        <div
          className="absolute top-0 right-0 z-10"
          style={{
            width: "30%",
            height: "48px",
            background: "transparent",
            cursor: "default",
            pointerEvents: "auto",
          }}
        />

        {/* Bottom overlay: blocks YouTube channel name, logo, and branding bar */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10"
          style={{
            width: "100%",
            height: "40px",
            background: "transparent",
            cursor: "default",
            pointerEvents: "auto",
          }}
        />

        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          {activated ? (
            <iframe
              ref={iframeRef}
              key={`${videoId}-${isMuted}`}
              src={embedUrl}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
              style={{ pointerEvents: "auto" }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
              <Lock className="w-12 h-12 text-white/40 mb-3" />
              <p className="text-white font-semibold text-lg">
                Subscribe to Watch
              </p>
              <p className="text-white/60 text-sm mt-1">
                Contact admin to activate your account
              </p>
            </div>
          )}
          {activated && isMuted && (
            <button
              type="button"
              className="absolute inset-0 flex items-center justify-center cursor-pointer z-20 w-full h-full"
              style={{ background: "rgba(0,0,0,0.35)", border: "none" }}
              onClick={onUnmute}
            >
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-3"
              >
                <div
                  className="rounded-full flex items-center justify-center"
                  style={{
                    width: 48,
                    height: 48,
                    background: "rgba(255,255,255,0.15)",
                    border: "3px solid rgba(255,255,255,0.7)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <VolumeX
                    style={{ width: 15, height: 15 }}
                    className="text-white"
                  />
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full">
                  <Volume2
                    style={{ width: 15, height: 15 }}
                    className="text-white"
                  />
                  <span className="text-white font-bold text-base tracking-wide">
                    Tap to Unmute
                  </span>
                </div>
              </motion.div>
            </button>
          )}
        </div>
      </div>

      {/* Player controls bar */}
      <div className="flex items-center gap-3 mt-2 px-1">
        {/* Now Playing */}
        <Radio
          style={{ width: 15, height: 15 }}
          className="text-primary live-pulse flex-shrink-0"
        />
        <span className="text-muted-foreground text-xs flex-shrink-0">
          Now:
        </span>
        <span className="text-foreground font-semibold text-xs truncate flex-1">
          {title}
        </span>

        {/* Volume control */}
        {activated && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                if (isMuted) {
                  onUnmute();
                } else {
                  onVolumeChange(0);
                }
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX style={{ width: 15, height: 15 }} />
              ) : (
                <Volume2 style={{ width: 15, height: 15 }} />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeInput}
              className="w-20 h-1.5 accent-primary cursor-pointer"
              style={{
                WebkitAppearance: "none",
                appearance: "none",
                background: `linear-gradient(to right, var(--primary, #27C4B8) 0%, var(--primary, #27C4B8) ${
                  isMuted ? 0 : volume
                }%, rgba(255,255,255,0.2) ${
                  isMuted ? 0 : volume
                }%, rgba(255,255,255,0.2) 100%)`,
                borderRadius: "9999px",
              }}
            />
          </div>
        )}

        {/* Fullscreen / Landscape button */}
        {activated && (
          <button
            type="button"
            onClick={handleFullscreen}
            title="Fullscreen (Landscape)"
            className="flex items-center justify-center w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
          >
            <Maximize
              style={{ width: 14, height: 14 }}
              className="text-white"
            />
          </button>
        )}
      </div>
    </section>
  );
}

export default function App() {
  const [view, setView] = useState<View>("login");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("news");

  const { actor } = useActor();
  const userActor = actor as unknown as UserActor | null;

  // Per-tab video state
  const [newsVideoId, setNewsVideoId] = useState<string>("II_m28Bm-iM");
  const [newsTitle, setNewsTitle] = useState<string>("TV9");
  const [devotionalVideoId, setDevotionalVideoId] =
    useState<string>("d0dB3kSCMmM");
  const [devotionalTitle, setDevotionalTitle] = useState<string>("Bhakthi TV");
  const [youtubeVideoId, setYoutubeVideoId] = useState<string>("4lbtCVHm6R0");
  const [youtubeTitle, setYoutubeTitle] = useState<string>("DJ Songs");

  // Shared mute + volume state
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(80);

  const playerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleLoginSuccess = (user: {
    role: string;
    mobile: string;
    fullName: string;
    village: string;
    validityDate: string | null;
  }) => {
    setCurrentUser(user);
    if (user.role === "admin") {
      setView("admin");
    } else {
      setView("main");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView("login");
  };

  const handleUserUpdate = (updated: Partial<CurrentUser>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...updated } : prev));
  };

  const handlePlayNews = (channel: Channel) => {
    if (channel.videoId) {
      setNewsVideoId(channel.videoId);
      setNewsTitle(channel.name);
      playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePlayDevotional = (channel: Channel) => {
    if (channel.videoId) {
      setDevotionalVideoId(channel.videoId);
      setDevotionalTitle(channel.name);
      playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePlayYoutube = (channel: Channel) => {
    if (channel.videoId) {
      setYoutubeVideoId(channel.videoId);
      setYoutubeTitle(channel.name);
      playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleUnmute = () => setIsMuted(false);

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    if (v === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const activated = currentUser
    ? isUserActivated(currentUser.validityDate)
    : false;

  const currentYear = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";

  const TABS: { id: TabId; label: string }[] = [
    { id: "news", label: "News" },
    { id: "devotional", label: "Devotional" },
    { id: "youtube", label: "Youtube" },
  ];

  if (view === "login") {
    return (
      <>
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onSignUp={() => setView("signup")}
        />
        <Toaster />
      </>
    );
  }

  if (view === "signup") {
    return (
      <>
        <SignUpPage
          onBack={() => setView("login")}
          onSuccess={() => setView("login")}
        />
        <Toaster />
      </>
    );
  }

  if (view === "admin") {
    return (
      <>
        <AdminPanel onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  // Main view
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.16 0.045 200) 0%, oklch(0.12 0.04 200) 100%)",
      }}
    >
      <Toaster />

      {currentUser && (
        <UserMenu
          open={menuOpen}
          onOpenChange={setMenuOpen}
          currentUser={currentUser}
          onUserUpdate={handleUserUpdate}
          onLogout={handleLogout}
          actor={userActor}
        />
      )}

      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b border-border"
        style={{
          backgroundColor: "oklch(0.15 0.04 200 / 0.95)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Top row: hamburger + logo + user info */}
        <div className="flex items-center gap-3 px-4 py-2">
          {/* Hamburger menu button */}
          <button
            type="button"
            data-ocid="main.open_modal_button"
            onClick={() => setMenuOpen(true)}
            className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors flex-shrink-0"
          >
            <Menu style={{ width: 20, height: 20 }} />
          </button>

          <div className="flex items-center gap-2.5">
            <img
              src="/assets/uploads/ss_local-019d3cf2-cb33-77b6-80dc-021c2b6b1286-1.png"
              alt="SS Local"
              style={{ height: 38 }}
              className="w-auto object-contain"
            />
          </div>
          <div className="flex-1" />
          <span className="text-muted-foreground text-xs hidden sm:block">
            {currentUser?.mobile}
          </span>
          {!activated && (
            <a
              href="https://wa.me/919949176737"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-green-600/20 text-green-400 border border-green-600/40 text-xs px-2 py-1 rounded-full hover:bg-green-600/30 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 fill-current flex-shrink-0"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>WhatsApp</title>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              9949176737 to Unlock
            </a>
          )}
          {activated && currentUser?.fullName && (
            <span className="text-green-400 font-semibold text-sm hidden sm:block">
              {currentUser.fullName}
            </span>
          )}
        </div>

        {/* Tab navigation row */}
        <div
          className="flex w-full"
          role="tablist"
          aria-label="Channel sections"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              data-ocid={`nav.${tab.id}.tab`}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 py-2.5 text-sm font-semibold tracking-wide transition-all duration-200
                border-b-2 focus:outline-none
                ${
                  activeTab === tab.id
                    ? "border-primary text-primary bg-primary/10"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* News Tab */}
        {activeTab === "news" && (
          <motion.div
            key="news"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <TabPlayer
              videoId={newsVideoId}
              title={newsTitle}
              isMuted={isMuted}
              volume={volume}
              activated={activated}
              onUnmute={handleUnmute}
              onVolumeChange={handleVolumeChange}
              playerRef={playerRef}
              iframeRef={iframeRef}
            />
            <ChannelGrid
              channels={NEWS_CHANNELS}
              activeVideoId={newsVideoId}
              isLocked={!activated}
              onPlay={handlePlayNews}
              sectionId="news"
            />
          </motion.div>
        )}

        {/* Devotional Tab */}
        {activeTab === "devotional" && (
          <motion.div
            key="devotional"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <TabPlayer
              videoId={devotionalVideoId}
              title={devotionalTitle}
              isMuted={isMuted}
              volume={volume}
              activated={activated}
              onUnmute={handleUnmute}
              onVolumeChange={handleVolumeChange}
              playerRef={playerRef}
              iframeRef={iframeRef}
            />
            <ChannelGrid
              channels={BHAKTHI_CHANNELS}
              activeVideoId={devotionalVideoId}
              isLocked={!activated}
              onPlay={handlePlayDevotional}
              sectionId="devotional"
            />
          </motion.div>
        )}

        {/* Youtube Tab */}
        {activeTab === "youtube" && (
          <motion.div
            key="youtube"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <TabPlayer
              videoId={youtubeVideoId}
              title={youtubeTitle}
              isMuted={isMuted}
              volume={volume}
              activated={activated}
              onUnmute={handleUnmute}
              onVolumeChange={handleVolumeChange}
              playerRef={playerRef}
              iframeRef={iframeRef}
            />
            <ChannelGrid
              channels={YOUTUBE_CHANNELS}
              activeVideoId={youtubeVideoId}
              isLocked={!activated}
              onPlay={handlePlayYoutube}
              sectionId="youtube"
            />
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-4 border-t border-border py-6 text-center text-muted-foreground text-sm">
        © {currentYear}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
