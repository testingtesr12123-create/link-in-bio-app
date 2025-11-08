"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, ExternalLink } from "lucide-react";
import * as Icons from "lucide-react";

interface Link {
  id: number;
  title: string;
  url: string;
  icon: string | null;
  position: number;
  clicks: number;
  layout?: "default" | "icon-only" | "thumbnail" | "card" | "minimal" | "featured";
}

interface Theme {
  backgroundColor: string;
  buttonColor: string;
  buttonTextColor: string;
  buttonStyle: string;
  fontFamily: string;
  wallpaper?: string;
  wallpaperStyle?: string;
  wallpaperGradientStart?: string;
  wallpaperGradientEnd?: string;
  wallpaperImageUrl?: string;
  wallpaperVideoUrl?: string;
  wallpaperPattern?: string;
  profileImageLayout?: string;
  titleStyle?: string;
  titleFont?: string;
  titleColor?: string;
  titleSize?: string;
}

interface User {
  id: number;
  username: string;
  name: string | null;
  bio: string | null;
  profileImageUrl: string | null;
}

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [theme, setTheme] = useState<Theme>({
    backgroundColor: "#ffffff",
    buttonColor: "#000000",
    buttonTextColor: "#ffffff",
    buttonStyle: "rounded",
    fontFamily: "sans",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/${username}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError("Profile not found");
        } else {
          setError("Failed to load profile");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setUser(data);
      setLinks(data.links || []);
      if (data.theme) {
        setTheme(data.theme);
      }
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = async (link: Link) => {
    // Track click
    try {
      await fetch(`/api/links/${link.id}/click`, { method: "POST" });
    } catch (err) {
      console.error("Failed to track click:", err);
    }

    // Open link
    window.open(link.url, "_blank");
  };

  const getIcon = (iconName: string | null) => {
    if (!iconName) return null;
    
    const IconComponent = (Icons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="w-5 h-5" />;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">😕</h1>
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The profile you're looking for doesn't exist.
          </p>
          <a
            href="/onboard"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Your Own
          </a>
        </div>
      </div>
    );
  }

  const getFontFamily = () => {
    switch (theme.fontFamily) {
      case "serif":
        return "serif";
      case "mono":
        return "monospace";
      default:
        return "sans-serif";
    }
  };

  const getBorderRadius = () => {
    switch (theme.buttonStyle) {
      case "square":
        return "0.25rem";
      case "pill":
        return "9999px";
      default:
        return "0.5rem";
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 py-12 transition-colors relative overflow-hidden"
      style={{
        backgroundColor: theme.backgroundColor,
        fontFamily: getFontFamily(),
      }}
    >
      {/* Wallpaper Background Layer */}
      <div className="fixed inset-0 -z-10">
        {/* Fill/Gradient/Blur Background */}
        {(theme.wallpaperStyle === "fill" || theme.wallpaperStyle === "gradient" || theme.wallpaperStyle === "blur" || !theme.wallpaperStyle) && (
          <div 
            className="absolute inset-0"
            style={{ background: theme.wallpaper || theme.backgroundColor }}
          />
        )}
        
        {/* Blur Effect Overlay */}
        {theme.wallpaperStyle === "blur" && (
          <div className="absolute inset-0 backdrop-blur-md bg-white/10" />
        )}
        
        {/* Pattern Background */}
        {theme.wallpaperStyle === "pattern" && (
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundColor: theme.wallpaper || theme.backgroundColor,
              backgroundImage: theme.wallpaperPattern === "dots" 
                ? "radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)"
                : "none",
              backgroundSize: theme.wallpaperPattern === "dots" ? "16px 16px" : "auto"
            }}
          >
            {theme.wallpaperPattern === "grid" && (
              <div className="grid grid-cols-12 gap-3 p-3 w-full h-full">
                {[...Array(144)].map((_, i) => (
                  <div key={i} className="bg-black/5 rounded"></div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Image Background */}
        {theme.wallpaperStyle === "image" && theme.wallpaperImageUrl && (
          <img 
            src={theme.wallpaperImageUrl} 
            alt="Wallpaper" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        {/* Video Background */}
        {theme.wallpaperStyle === "video" && theme.wallpaperVideoUrl && (
          <video 
            src={theme.wallpaperVideoUrl} 
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        )}
      </div>

      <div className="w-full max-w-2xl mx-auto relative z-10">
        {/* Profile Header */}
        <div className="text-center mb-8 animate-fade-in">
          {user.profileImageUrl && (
            <img
              src={user.profileImageUrl}
              alt={user.name || user.username}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover mx-auto mb-4 shadow-lg border-4 border-white/50"
            />
          )}
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ color: theme.buttonColor }}
          >
            {user.name || user.username}
          </h1>
          {user.bio && (
            <p
              className="text-base sm:text-lg max-w-md mx-auto px-4"
              style={{ color: theme.buttonColor, opacity: 0.75 }}
            >
              {user.bio}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-4 w-full px-4">
          {links.map((link, index) => {
            // Default Layout
            if (!link.layout || link.layout === "default") {
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link)}
                  className="w-full px-6 py-4 font-medium transition-all hover:scale-105 hover:shadow-lg active:scale-95 flex items-center justify-center gap-3 group"
                  style={{
                    backgroundColor: theme.buttonColor,
                    color: theme.buttonTextColor,
                    borderRadius: getBorderRadius(),
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {getIcon(link.icon)}
                  <span className="text-base sm:text-lg">{link.title}</span>
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            }
            
            // Icon Only Layout
            if (link.layout === "icon-only") {
              return (
                <div key={link.id} className="flex justify-center">
                  <button
                    onClick={() => handleLinkClick(link)}
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                    style={{
                      backgroundColor: theme.buttonColor,
                      color: theme.buttonTextColor,
                    }}
                  >
                    {getIcon(link.icon) || <span className="text-lg font-bold">{link.title[0]}</span>}
                  </button>
                </div>
              );
            }
            
            // Thumbnail Layout
            if (link.layout === "thumbnail") {
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link)}
                  className="w-full p-4 flex items-center gap-4 transition-all hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: theme.buttonColor,
                    color: theme.buttonTextColor,
                    borderRadius: getBorderRadius(),
                  }}
                >
                  <div className="w-14 h-14 rounded bg-white/20 flex items-center justify-center flex-shrink-0">
                    {getIcon(link.icon)}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-bold text-base sm:text-lg truncate">{link.title}</div>
                    <div className="text-sm opacity-70 truncate">{link.url.replace(/^https?:\/\//, '')}</div>
                  </div>
                  <ExternalLink className="w-5 h-5 opacity-50 flex-shrink-0" />
                </button>
              );
            }
            
            // Card Layout
            if (link.layout === "card") {
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link)}
                  className="w-full rounded-lg overflow-hidden transition-all hover:scale-105 active:scale-95 text-left"
                  style={{
                    backgroundColor: theme.buttonColor,
                    color: theme.buttonTextColor,
                  }}
                >
                  <div className="w-full h-32 bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                    {getIcon(link.icon) && (
                      <div className="scale-150">{getIcon(link.icon)}</div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="font-bold text-base sm:text-lg mb-2">{link.title}</div>
                    <div className="text-sm opacity-70 flex items-center gap-2">
                      <span className="truncate">{link.url.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink className="w-4 h-4 flex-shrink-0" />
                    </div>
                  </div>
                </button>
              );
            }
            
            // Minimal Layout
            if (link.layout === "minimal") {
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link)}
                  className="w-full text-center py-3 transition-all hover:opacity-70 active:scale-95"
                >
                  <div className="text-lg font-bold mb-1" style={{ color: theme.buttonColor }}>
                    {link.title}
                  </div>
                  <div className="text-sm opacity-60 flex items-center justify-center gap-2" style={{ color: theme.buttonColor }}>
                    <span>{link.url.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </button>
              );
            }
            
            // Featured Layout
            if (link.layout === "featured") {
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link)}
                  className="w-full rounded-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${theme.buttonColor} 0%, ${theme.buttonColor}DD 100%)`,
                    color: theme.buttonTextColor,
                  }}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      {getIcon(link.icon) && (
                        <div className="scale-125">{getIcon(link.icon)}</div>
                      )}
                      <div className="font-bold text-xl">{link.title}</div>
                    </div>
                    <div className="text-sm opacity-80 flex items-center gap-2">
                      <span>{link.url.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </button>
              );
            }
            
            return null;
          })}
          {links.length === 0 && (
            <div className="text-center py-12">
              <p
                className="text-lg opacity-50"
                style={{ color: theme.buttonColor }}
              >
                No links yet
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 opacity-50">
          <a
            href="/onboard"
            className="text-sm hover:opacity-100 transition-opacity"
            style={{ color: theme.buttonColor }}
          >
            Create your own Link in Bio
          </a>
        </div>
      </div>
    </div>
  );
}