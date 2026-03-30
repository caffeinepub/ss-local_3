import AdminPanel from "@/components/AdminPanel";
import LoginPage from "@/components/LoginPage";
import SignUpPage from "@/components/SignUpPage";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { Lock, LogOut, Play, Radio, Tv, Volume2, VolumeX } from "lucide-react";
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
  validityDate: string | null;
}

type View = "login" | "signup" | "admin" | "main";

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
      {/* Logo / thumbnail area */}
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

        {/* LIVE badge */}
        {channel.isLive && (
          <span className="absolute top-1 left-1 flex items-center gap-0.5 bg-red-600 text-white text-[7px] font-bold px-1 py-0.5 rounded-full live-pulse">
            <span className="w-1 h-1 bg-white rounded-full inline-block" />
            LIVE
          </span>
        )}

        {/* Lock overlay when not activated */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Lock className="w-4 h-4 text-white/80" />
          </div>
        )}

        {/* Active indicator */}
        {isActive && !isLocked && (
          <span className="absolute top-1 right-1 bg-primary/80 text-primary-foreground text-[7px] font-bold px-1 py-0.5 rounded-full">
            ▶
          </span>
        )}
      </div>

      {/* Card footer */}
      <div className="px-1.5 py-1">
        <span className="text-foreground font-semibold text-xs truncate block text-center">
          {channel.name}
        </span>
      </div>
    </motion.div>
  );
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  channels: Channel[];
  activeVideoId: string | null;
  isLocked: boolean;
  onPlay: (channel: Channel) => void;
  sectionId: string;
}

function Section({
  title,
  icon,
  channels,
  activeVideoId,
  isLocked,
  onPlay,
  sectionId,
}: SectionProps) {
  return (
    <section className="py-3">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-primary">{icon}</div>
        <h2 className="text-xl font-bold text-foreground tracking-tight">
          {title}
        </h2>
        <div className="flex-1 h-px bg-border ml-2" />
      </div>
      <div data-ocid={`${sectionId}.list`} className="grid grid-cols-4 gap-2">
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
    </section>
  );
}

export default function App() {
  const [view, setView] = useState<View>("login");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Main view state
  const [currentVideoId, setCurrentVideoId] = useState<string>("II_m28Bm-iM");
  const [currentTitle, setCurrentTitle] = useState<string>("TV9");
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const playerRef = useRef<HTMLDivElement>(null);

  const handleLoginSuccess = (user: {
    role: string;
    mobile: string;
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

  const handlePlay = (channel: Channel) => {
    if (channel.videoId) {
      setCurrentVideoId(channel.videoId);
      setCurrentTitle(channel.name);
      playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleUnmute = () => {
    setIsMuted(false);
  };

  const activated = currentUser
    ? isUserActivated(currentUser.validityDate)
    : false;
  const embedUrl = `https://www.youtube.com/embed/${currentVideoId}?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0`;
  const currentYear = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";

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

      {/* Header */}
      <header
        className="sticky top-0 z-50 flex items-center gap-3 px-6 py-4 border-b border-border"
        style={{
          backgroundColor: "oklch(0.15 0.04 200 / 0.95)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/uploads/ss_local-019d3cf2-cb33-77b6-80dc-021c2b6b1286-1.png"
            alt="SS Local"
            style={{ height: 46 }}
            className="w-auto object-contain"
          />
        </div>
        <div className="flex-1" />
        <span className="text-muted-foreground text-xs hidden sm:block">
          {currentUser?.mobile}
        </span>
        {!activated && (
          <Badge className="bg-red-600/20 text-red-400 border-red-600/40 text-xs">
            Subscribe to Unlock
          </Badge>
        )}
        {activated && (
          <Badge
            variant="outline"
            className="border-primary/40 text-primary text-xs"
          >
            Telugu Media
          </Badge>
        )}
        <button
          type="button"
          data-ocid="main.button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-white/5"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Section 1 — Video Player */}
        <section ref={playerRef} className="pt-4 pb-2" id="player">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-card ring-1 ring-border">
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-full live-pulse">
              <span className="w-2 h-2 bg-white rounded-full inline-block" />
              LIVE
            </div>
            <div
              className="relative w-full"
              style={{ paddingBottom: "56.25%" }}
            >
              {activated ? (
                <iframe
                  key={`${currentVideoId}-${isMuted}`}
                  src={embedUrl}
                  title={currentTitle}
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
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
                  onClick={handleUnmute}
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
          <div className="flex items-center gap-2 mt-3 px-1">
            <Radio
              style={{ width: 15, height: 15 }}
              className="text-primary live-pulse"
            />
            <span className="text-muted-foreground text-sm">Now Playing:</span>
            <span className="text-foreground font-semibold text-sm">
              {currentTitle}
            </span>
            {activated && isMuted && (
              <button
                type="button"
                onClick={handleUnmute}
                className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <VolumeX style={{ width: 15, height: 15 }} />
                Muted
              </button>
            )}
          </div>
        </section>

        {/* Section 2 — News Channels */}
        <Section
          title="News Channels"
          icon={<Tv style={{ width: 15, height: 15 }} />}
          channels={NEWS_CHANNELS}
          activeVideoId={currentVideoId}
          isLocked={!activated}
          onPlay={handlePlay}
          sectionId="news"
        />

        {/* Section 3 — Bhakthi Channels */}
        <Section
          title="Bhakthi Channels"
          icon={<span style={{ fontSize: 20, lineHeight: 1 }}>🕉️</span>}
          channels={BHAKTHI_CHANNELS}
          activeVideoId={currentVideoId}
          isLocked={!activated}
          onPlay={handlePlay}
          sectionId="bhakthi"
        />

        {/* Section 4 — YouTube */}
        <Section
          title="YouTube"
          icon={<Play style={{ width: 15, height: 15 }} />}
          channels={YOUTUBE_CHANNELS}
          activeVideoId={currentVideoId}
          isLocked={!activated}
          onPlay={handlePlay}
          sectionId="youtube"
        />
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
