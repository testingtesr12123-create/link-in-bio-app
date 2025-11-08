"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2, GripVertical, ExternalLink, BarChart3, Palette, Settings, Eye, Link2, User, Image as ImageIcon, Wand2, Type, Square, CircleDot, Droplets, Grid3x3, Video, Upload } from "lucide-react";
import * as Icons from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Link {
  id: number;
  title: string;
  url: string;
  icon: string | null;
  position: number;
  clicks: number;
  isActive: boolean;
  layout?: string;
}

interface Theme {
  backgroundColor: string;
  buttonColor: string;
  buttonTextColor: string;
  buttonStyle: string;
  fontFamily: string;
  profileImageLayout: string;
  titleStyle: string;
  titleFont: string;
  titleColor: string;
  titleSize: string;
  wallpaper: string;
  wallpaperStyle: string;
  wallpaperGradientStart?: string;
  wallpaperGradientEnd?: string;
  wallpaperImageUrl?: string;
  wallpaperVideoUrl?: string;
  wallpaperPattern?: string;
  buttonStyleType?: string;
  buttonCornerRadius?: number;
  buttonShadow?: string;
}

interface User {
  id: number;
  username: string;
  name: string | null;
  bio: string | null;
  profileImageUrl: string | null;
}

// Curated theme presets
const CURATED_THEMES = [
  {
    name: "Agate",
    backgroundColor: "#1a4d3e",
    wallpaper: "linear-gradient(135deg, #1a4d3e 0%, #2d7a5f 100%)",
    buttonColor: "#d4ff00",
    buttonTextColor: "#000000",
    buttonStyle: "rounded",
    titleColor: "#d4ff00",
    titleFont: "Arial",
  },
  {
    name: "Air",
    backgroundColor: "#f5f5f7",
    wallpaper: "#f5f5f7",
    buttonColor: "#ffffff",
    buttonTextColor: "#000000",
    buttonStyle: "rounded",
    titleColor: "#000000",
    titleFont: "Arial",
  },
  {
    name: "Astrid",
    backgroundColor: "#0a0a0a",
    wallpaper: "#0a0a0a",
    buttonColor: "#1a1a1a",
    buttonTextColor: "#ffffff",
    buttonStyle: "rounded",
    titleColor: "#ffffff",
    titleFont: "Arial",
  },
  {
    name: "Aura",
    backgroundColor: "#e8e4dc",
    wallpaper: "#e8e4dc",
    buttonColor: "#f5f1e8",
    buttonTextColor: "#333333",
    buttonStyle: "rounded",
    titleColor: "#333333",
    titleFont: "Georgia",
  },
  {
    name: "Bliss",
    backgroundColor: "#f8f8f8",
    wallpaper: "linear-gradient(180deg, #4a4a4a 0%, #f8f8f8 50%)",
    buttonColor: "#ffffff",
    buttonTextColor: "#000000",
    buttonStyle: "rounded",
    titleColor: "#000000",
    titleFont: "Arial",
  },
  {
    name: "Blocks",
    backgroundColor: "#6b2ff5",
    wallpaper: "linear-gradient(180deg, #6b2ff5 0%, #ff3a9d 100%)",
    buttonColor: "#ff3a9d",
    buttonTextColor: "#ffffff",
    buttonStyle: "rounded",
    titleColor: "#ffffff",
    titleFont: "Arial",
  },
  {
    name: "Bloom",
    backgroundColor: "#8b4fc7",
    wallpaper: "linear-gradient(135deg, #ff4757 0%, #8b4fc7 100%)",
    buttonColor: "#ffffff",
    buttonTextColor: "#8b4fc7",
    buttonStyle: "pill",
    titleColor: "#ffffff",
    titleFont: "Arial",
  },
  {
    name: "Breeze",
    backgroundColor: "#ffb3d9",
    wallpaper: "linear-gradient(180deg, #ffb3d9 0%, #ffd9ec 100%)",
    buttonColor: "#ffd9ec",
    buttonTextColor: "#8b4789",
    buttonStyle: "rounded",
    titleColor: "#8b4789",
    titleFont: "Arial",
  },
  {
    name: "Encore",
    backgroundColor: "#1a1a1a",
    wallpaper: "#1a1a1a",
    buttonColor: "#0a0a0a",
    buttonTextColor: "#d4a574",
    buttonStyle: "rounded",
    titleColor: "#d4a574",
    titleFont: "Georgia",
  },
  {
    name: "Grid",
    backgroundColor: "#d4e89e",
    wallpaper: "#d4e89e",
    buttonColor: "#ffffff",
    buttonTextColor: "#000000",
    buttonStyle: "pill",
    titleColor: "#000000",
    titleFont: "Arial",
  },
  {
    name: "Groove",
    backgroundColor: "#ff6b9d",
    wallpaper: "linear-gradient(45deg, #ff6b9d 0%, #c471ed 50%, #12c2e9 100%)",
    buttonColor: "rgba(255, 255, 255, 0.2)",
    buttonTextColor: "#ffffff",
    buttonStyle: "pill",
    titleColor: "#ffffff",
    titleFont: "Arial",
  },
  {
    name: "Haven",
    backgroundColor: "#a08968",
    wallpaper: "linear-gradient(180deg, #a08968 0%, #f5f1e8 50%)",
    buttonColor: "#e8dcc8",
    buttonTextColor: "#5a4a3a",
    buttonStyle: "rounded",
    titleColor: "#5a4a3a",
    titleFont: "Georgia",
  },
  {
    name: "Lake",
    backgroundColor: "#0a1929",
    wallpaper: "#0a1929",
    buttonColor: "#132f4c",
    buttonTextColor: "#ffffff",
    buttonStyle: "rounded",
    titleColor: "#ffffff",
    titleFont: "Arial",
  },
  {
    name: "Mineral",
    backgroundColor: "#f5f1e8",
    wallpaper: "linear-gradient(180deg, #f5f1e8 0%, #e8dcc8 100%)",
    buttonColor: "#e8dcc8",
    buttonTextColor: "#5a4a3a",
    buttonStyle: "rounded",
    titleColor: "#5a4a3a",
    titleFont: "Georgia",
  },
  {
    name: "Nourish",
    backgroundColor: "#6b7c3a",
    wallpaper: "linear-gradient(180deg, #6b7c3a 0%, #d4e89e 50%)",
    buttonColor: "#d4e89e",
    buttonTextColor: "#3a4a1a",
    buttonStyle: "pill",
    titleColor: "#d4e89e",
    titleFont: "Arial",
  },
  {
    name: "Rise",
    backgroundColor: "#ff8a65",
    wallpaper: "linear-gradient(135deg, #ff8a65 0%, #ffab91 100%)",
    buttonColor: "#ffccbc",
    buttonTextColor: "#bf360c",
    buttonStyle: "pill",
    titleColor: "#ffffff",
    titleFont: "Arial",
  },
  {
    name: "Sweat",
    backgroundColor: "#2196f3",
    wallpaper: "linear-gradient(135deg, #ff4081 0%, #2196f3 100%)",
    buttonColor: "#64b5f6",
    buttonTextColor: "#ffffff",
    buttonStyle: "pill",
    titleColor: "#ffffff",
    titleFont: "Arial",
  },
  {
    name: "Tress",
    backgroundColor: "#8b7355",
    wallpaper: "linear-gradient(180deg, #8b7355 0%, #d4c4aa 50%)",
    buttonColor: "#d4c4aa",
    buttonTextColor: "#5a4a3a",
    buttonStyle: "rounded",
    titleColor: "#5a4a3a",
    titleFont: "Georgia",
  },
  {
    name: "Twilight",
    backgroundColor: "#4a5568",
    wallpaper: "linear-gradient(135deg, #4a5568 0%, #9f7aea 100%)",
    buttonColor: "#d8b4fe",
    buttonTextColor: "#4c1d95",
    buttonStyle: "pill",
    titleColor: "#ffffff",
    titleFont: "Arial",
  },
];

// Button and Font Presets
const BUTTON_FONT_PRESETS = [
  {
    name: "Custom",
    icon: "Palette",
    buttonStyle: "rounded",
    buttonColor: "#ffffff",
    buttonTextColor: "#000000",
    buttonBorder: "2px solid transparent",
    titleFont: "Arial",
    description: "Customize your own style"
  },
  {
    name: "Minimal",
    buttonStyle: "rounded",
    buttonColor: "transparent",
    buttonTextColor: "#000000",
    buttonBorder: "2px solid #000000",
    titleFont: "Arial",
    description: "Clean and simple outlined buttons"
  },
  {
    name: "Classic",
    buttonStyle: "rounded",
    buttonColor: "#ffffff",
    buttonTextColor: "#000000",
    buttonBorder: "none",
    titleFont: "Georgia",
    description: "Timeless white buttons with serif font"
  },
  {
    name: "Unique",
    buttonStyle: "rounded",
    buttonColor: "#ffffff",
    buttonTextColor: "#000000",
    buttonBorder: "none",
    titleFont: "Arial",
    description: "Soft rounded corners with sans-serif"
  },
  {
    name: "Zen",
    buttonStyle: "pill",
    buttonColor: "#ffffff",
    buttonTextColor: "#000000",
    buttonBorder: "none",
    titleFont: "Arial",
    description: "Smooth pill-shaped buttons"
  },
  {
    name: "Simple",
    buttonStyle: "pill",
    buttonColor: "#ffffff",
    buttonTextColor: "#000000",
    buttonBorder: "none",
    titleFont: "Verdana",
    description: "Easy on the eyes"
  },
  {
    name: "Precise",
    buttonStyle: "square",
    buttonColor: "transparent",
    buttonTextColor: "#000000",
    buttonBorder: "2px solid #000000",
    titleFont: "Arial",
    description: "Sharp corners and defined edges"
  },
  {
    name: "Retro",
    buttonStyle: "pill",
    buttonColor: "#000000",
    buttonTextColor: "#ffffff",
    buttonBorder: "3px solid #000000",
    titleFont: "Arial",
    description: "Bold vintage style"
  },
  {
    name: "Modern",
    buttonStyle: "pill",
    buttonColor: "#f5f5f5",
    buttonTextColor: "#000000",
    buttonBorder: "none",
    titleFont: "Arial",
    description: "Contemporary and sleek"
  },
  {
    name: "Industrial",
    buttonStyle: "pill",
    buttonColor: "transparent",
    buttonTextColor: "#000000",
    buttonBorder: "2px solid #000000",
    titleFont: "Courier New",
    description: "Technical monospace look"
  },
];

// Icon options for dropdown
const ICON_OPTIONS = [
  { value: "none", label: "No Icon" },
  { value: "Instagram", label: "Instagram" },
  { value: "Facebook", label: "Facebook" },
  { value: "Twitter", label: "Twitter / X" },
  { value: "Linkedin", label: "LinkedIn" },
  { value: "Youtube", label: "YouTube" },
  { value: "Github", label: "GitHub" },
  { value: "Globe", label: "Website" },
  { value: "Mail", label: "Email" },
  { value: "Phone", label: "Phone" },
  { value: "MessageCircle", label: "Message" },
  { value: "Music", label: "Music" },
  { value: "Camera", label: "Camera" },
  { value: "ShoppingBag", label: "Shop" },
  { value: "Link", label: "Link" },
  { value: "Twitch", label: "Twitch" },
  { value: "Discord", label: "Discord" },
  { value: "Slack", label: "Slack" },
  { value: "Figma", label: "Figma" },
  { value: "Dribbble", label: "Dribbble" },
  { value: "TiktokIcon", label: "TikTok" },
  { value: "Podcast", label: "Podcast" },
  { value: "Video", label: "Video" },
  { value: "MapPin", label: "Location" },
  { value: "Calendar", label: "Calendar" },
  { value: "BookOpen", label: "Blog" },
  { value: "Newspaper", label: "Newsletter" },
  { value: "Heart", label: "Favorite" },
  { value: "Star", label: "Featured" },
];

// Comprehensive font list
const FONT_OPTIONS = [
  // System Fonts
  { value: "Arial", label: "Arial" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Georgia", label: "Georgia" },
  { value: "Courier New", label: "Courier New" },
  { value: "Verdana", label: "Verdana" },
  { value: "Trebuchet MS", label: "Trebuchet MS" },
  { value: "Comic Sans MS", label: "Comic Sans MS" },
  { value: "Impact", label: "Impact" },
  
  // Google Fonts - Sans Serif
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Poppins", label: "Poppins" },
  { value: "Source Sans Pro", label: "Source Sans Pro" },
  { value: "Raleway", label: "Raleway" },
  { value: "Nunito", label: "Nunito" },
  { value: "Ubuntu", label: "Ubuntu" },
  { value: "Rubik", label: "Rubik" },
  { value: "Work Sans", label: "Work Sans" },
  { value: "DM Sans", label: "DM Sans" },
  { value: "Josefin Sans", label: "Josefin Sans" },
  { value: "IBM Plex Sans", label: "IBM Plex Sans" },
  { value: "Outfit", label: "Outfit" },
  { value: "Manrope", label: "Manrope" },
  { value: "Space Grotesk", label: "Space Grotesk" },
  
  // Google Fonts - Serif
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "Lora", label: "Lora" },
  { value: "PT Serif", label: "PT Serif" },
  { value: "Crimson Text", label: "Crimson Text" },
  { value: "EB Garamond", label: "EB Garamond" },
  { value: "Libre Baskerville", label: "Libre Baskerville" },
  { value: "Cormorant Garamond", label: "Cormorant Garamond" },
  
  // Google Fonts - Display
  { value: "Bebas Neue", label: "Bebas Neue" },
  { value: "Pacifico", label: "Pacifico" },
  { value: "Righteous", label: "Righteous" },
  { value: "Permanent Marker", label: "Permanent Marker" },
  { value: "Lobster", label: "Lobster" },
  { value: "Anton", label: "Anton" },
  { value: "Fjalla One", label: "Fjalla One" },
  { value: "Archivo Black", label: "Archivo Black" },
  
  // Google Fonts - Monospace
  { value: "Roboto Mono", label: "Roboto Mono" },
  { value: "Source Code Pro", label: "Source Code Pro" },
  { value: "JetBrains Mono", label: "JetBrains Mono" },
  { value: "Fira Code", label: "Fira Code" },
  { value: "IBM Plex Mono", label: "IBM Plex Mono" },
  { value: "Space Mono", label: "Space Mono" },
  
  // Special/Custom
  { value: "Link Sans", label: "Link Sans" },
];

// Helper function to get icon component
const getIcon = (iconName: string | null) => {
  if (!iconName || iconName === "none") return null;
  
  const IconComponent = (Icons as any)[iconName];
  if (IconComponent) {
    return <IconComponent className="w-5 h-5" />;
  }
  return null;
};

function SortableLink({ link, onEdit, onDelete }: { link: Link; onEdit: (link: Link) => void; onDelete: (id: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 p-4 bg-card border rounded-lg">
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </button>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{link.title}</p>
        <p className="text-sm text-muted-foreground truncate">{link.url}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground">
          <BarChart3 className="w-4 h-4 inline mr-1" />
          {link.clicks}
        </div>
        <Button variant="outline" size="sm" onClick={() => onEdit(link)}>
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(link.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [theme, setTheme] = useState<Theme>({
    backgroundColor: "#ffffff",
    buttonColor: "#000000",
    buttonTextColor: "#ffffff",
    buttonStyle: "rounded",
    fontFamily: "sans",
    profileImageLayout: "classic",
    titleStyle: "text",
    titleFont: "Link Sans",
    titleColor: "#000000",
    titleSize: "small",
    wallpaper: "#ffffff",
    wallpaperStyle: "solid",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [designSection, setDesignSection] = useState("header");
  const [activeTab, setActiveTab] = useState("links");
  const [presetTab, setPresetTab] = useState<"customizable" | "curated">("customizable");
  const [copied, setCopied] = useState(false);

  // Form states
  const [newLink, setNewLink] = useState({ title: "", url: "", icon: "none", layout: "default" });
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [profileForm, setProfileForm] = useState({ name: "", bio: "", profileImageUrl: "" });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}/${username}` : `/${username}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleShareTwitter = () => {
    const text = `Check out my links at ${publicUrl}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`, "_blank");
  };

  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`, "_blank");
  };

  const handleShareWhatsApp = () => {
    const text = `Check out my links: ${publicUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  useEffect(() => {
    fetchUserData();
  }, [username]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/users/${username}`);
      if (!response.ok) {
        if (response.status === 404) {
          router.push("/onboard");
        }
        return;
      }
      const data = await response.json();
      setUser(data);
      setLinks(data.links || []);
      if (data.theme) {
        setTheme({
          backgroundColor: data.theme.backgroundColor || "#ffffff",
          buttonColor: data.theme.buttonColor || "#000000",
          buttonTextColor: data.theme.buttonTextColor || "#ffffff",
          buttonStyle: data.theme.buttonStyle || "rounded",
          fontFamily: data.theme.fontFamily || "sans",
          profileImageLayout: data.theme.profileImageLayout || "classic",
          titleStyle: data.theme.titleStyle || "text",
          titleFont: data.theme.titleFont || "Link Sans",
          titleColor: data.theme.titleColor || "#000000",
          titleSize: data.theme.titleSize || "small",
          wallpaper: data.theme.wallpaper || "#ffffff",
          wallpaperStyle: data.theme.wallpaperStyle || "solid",
        });
      }
      setProfileForm({
        name: data.name || "",
        bio: data.bio || "",
        profileImageUrl: data.profileImageUrl || "",
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          title: newLink.title,
          url: newLink.url,
          icon: newLink.icon === "none" ? null : newLink.icon,
          layout: newLink.layout || "default",
          position: links.length,
        }),
      });

      if (response.ok) {
        const createdLink = await response.json();
        setLinks([...links, createdLink]);
        setNewLink({ title: "", url: "", icon: "none", layout: "default" });
      }
    } catch (error) {
      console.error("Failed to add link:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateLink = async () => {
    if (!editingLink) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/links/${editingLink.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingLink.title,
          url: editingLink.url,
          icon: editingLink.icon,
          layout: editingLink.layout || "default",
        }),
      });

      if (response.ok) {
        const updatedLink = await response.json();
        setLinks(links.map((l) => (l.id === updatedLink.id ? updatedLink : l)));
        setEditingLink(null);
      }
    } catch (error) {
      console.error("Failed to update link:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLink = async (id: number) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      const response = await fetch(`/api/links/${id}`, { method: "DELETE" });
      if (response.ok) {
        setLinks(links.filter((l) => l.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);

    const reorderedLinks = arrayMove(links, oldIndex, newIndex).map((link, index) => ({
      ...link,
      position: index,
    }));

    setLinks(reorderedLinks);

    try {
      await fetch("/api/links/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          links: reorderedLinks.map((l) => ({ id: l.id, position: l.position })),
        }),
      });
    } catch (error) {
      console.error("Failed to reorder links:", error);
    }
  };

  const handleUpdateTheme = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await fetch(`/api/themes/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          background_color: theme.backgroundColor,
          button_color: theme.buttonColor,
          button_text_color: theme.buttonTextColor,
          button_style: theme.buttonStyle,
          font_family: theme.fontFamily,
          profile_image_layout: theme.profileImageLayout,
          title_style: theme.titleStyle,
          title_font: theme.titleFont,
          title_color: theme.titleColor,
          title_size: theme.titleSize,
          wallpaper: theme.wallpaper,
          wallpaper_style: theme.wallpaperStyle,
        }),
      });
    } catch (error) {
      console.error("Failed to update theme:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`/api/users/${username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileForm.name,
          bio: profileForm.bio,
          profile_image_url: profileForm.profileImageUrl,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const applyPreset = (preset: typeof CURATED_THEMES[0]) => {
    setTheme({
      ...theme,
      backgroundColor: preset.backgroundColor,
      wallpaper: preset.wallpaper,
      buttonColor: preset.buttonColor,
      buttonTextColor: preset.buttonTextColor,
      buttonStyle: preset.buttonStyle as "rounded" | "square" | "pill",
      titleColor: preset.titleColor,
      titleFont: preset.titleFont,
    });
  };

  const applyButtonFontPreset = (preset: typeof BUTTON_FONT_PRESETS[0]) => {
    setTheme({
      ...theme,
      buttonStyle: preset.buttonStyle as "rounded" | "square" | "pill",
      buttonColor: preset.buttonColor,
      buttonTextColor: preset.buttonTextColor,
      titleFont: preset.titleFont,
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="border-b bg-white/50 backdrop-blur-sm dark:bg-gray-900/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="w-6 h-6 text-purple-600" />
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push(`/dashboard/${username}/analytics`)}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button variant="outline" onClick={() => window.open(`/${username}`, "_blank")}>
              <Eye className="w-4 h-4 mr-2" />
              View Profile
            </Button>
            <Button variant="outline" onClick={() => router.push(`/${username}/settings`)}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            {activeTab !== "design" && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Display Name</Label>
                      <Input
                        id="name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        placeholder="Tell people about yourself"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="profileImage">Profile Image URL</Label>
                      <Input
                        id="profileImage"
                        value={profileForm.profileImageUrl}
                        onChange={(e) => setProfileForm({ ...profileForm, profileImageUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    <Button type="submit" disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Save Profile
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="links">Links</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
              </TabsList>

              <TabsContent value="links" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Link</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddLink} className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={newLink.title}
                          onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                          placeholder="My Website"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="url">URL</Label>
                        <Input
                          id="url"
                          type="url"
                          value={newLink.url}
                          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                          placeholder="https://example.com"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="icon">Icon (optional)</Label>
                        <Select
                          value={newLink.icon}
                          onValueChange={(value) => setNewLink({ ...newLink, icon: value })}
                        >
                          <SelectTrigger id="icon">
                            <SelectValue placeholder="Select an icon" />
                          </SelectTrigger>
                          <SelectContent>
                            {ICON_OPTIONS.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  {getIcon(option.value)}
                                  <span>{option.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Layouts Section */}
                      <div>
                        <Label className="text-base font-semibold mb-3 block">Layout</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {/* Default Layout */}
                          <button
                            type="button"
                            onClick={() => setNewLink({ ...newLink, layout: "default" })}
                            className={`p-4 border-2 rounded-xl text-center transition-all ${
                              newLink.layout === "default" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                            }`}
                          >
                            <div className="w-full h-16 bg-muted rounded-lg mb-2 flex items-center justify-center p-2">
                              <div className="w-full h-8 bg-gray-700 rounded flex items-center justify-center gap-1 px-2">
                                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                <div className="flex-1 h-2 bg-gray-500 rounded"></div>
                              </div>
                            </div>
                            <span className="text-xs font-medium">Default</span>
                          </button>

                          {/* Icon Only Layout */}
                          <button
                            type="button"
                            onClick={() => setNewLink({ ...newLink, layout: "icon-only" })}
                            className={`p-4 border-2 rounded-xl text-center transition-all ${
                              newLink.layout === "icon-only" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                            }`}
                          >
                            <div className="w-full h-16 bg-muted rounded-lg mb-2 flex items-center justify-center">
                              <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                            </div>
                            <span className="text-xs font-medium">Icon Only</span>
                          </button>

                          {/* Thumbnail Layout */}
                          <button
                            type="button"
                            onClick={() => setNewLink({ ...newLink, layout: "thumbnail" })}
                            className={`p-4 border-2 rounded-xl text-center transition-all ${
                              newLink.layout === "thumbnail" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                            }`}
                          >
                            <div className="w-full h-16 bg-muted rounded-lg mb-2 flex items-center gap-2 p-2">
                              <div className="w-12 h-12 bg-gray-700 rounded"></div>
                              <div className="flex-1 space-y-1">
                                <div className="h-2 bg-gray-600 rounded"></div>
                                <div className="h-1.5 bg-gray-500 rounded w-2/3"></div>
                              </div>
                            </div>
                            <span className="text-xs font-medium">Thumbnail</span>
                          </button>

                          {/* Card Layout */}
                          <button
                            type="button"
                            onClick={() => setNewLink({ ...newLink, layout: "card" })}
                            className={`p-4 border-2 rounded-xl text-center transition-all ${
                              newLink.layout === "card" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                            }`}
                          >
                            <div className="w-full h-16 bg-muted rounded-lg mb-2 overflow-hidden">
                              <div className="w-full h-8 bg-gray-600"></div>
                              <div className="p-1.5 space-y-1">
                                <div className="h-1.5 bg-gray-600 rounded"></div>
                                <div className="h-1 bg-gray-500 rounded w-3/4"></div>
                              </div>
                            </div>
                            <span className="text-xs font-medium">Card</span>
                          </button>

                          {/* Minimal Layout */}
                          <button
                            type="button"
                            onClick={() => setNewLink({ ...newLink, layout: "minimal" })}
                            className={`p-4 border-2 rounded-xl text-center transition-all ${
                              newLink.layout === "minimal" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                            }`}
                          >
                            <div className="w-full h-16 bg-muted rounded-lg mb-2 flex items-center justify-center">
                              <div className="w-full space-y-2 px-3">
                                <div className="h-1.5 bg-gray-600 rounded w-2/3 mx-auto"></div>
                                <div className="h-1 bg-gray-500 rounded w-1/2 mx-auto"></div>
                              </div>
                            </div>
                            <span className="text-xs font-medium">Minimal</span>
                          </button>

                          {/* Featured Layout */}
                          <button
                            type="button"
                            onClick={() => setNewLink({ ...newLink, layout: "featured" })}
                            className={`p-4 border-2 rounded-xl text-center transition-all ${
                              newLink.layout === "featured" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                            }`}
                          >
                            <div className="w-full h-16 bg-muted rounded-lg mb-2 flex flex-col p-2 gap-1">
                              <div className="w-full h-6 bg-gradient-to-r from-gray-700 to-gray-600 rounded"></div>
                              <div className="flex gap-1">
                                <div className="flex-1 h-2 bg-gray-600 rounded"></div>
                                <div className="w-6 h-2 bg-gray-500 rounded"></div>
                              </div>
                            </div>
                            <span className="text-xs font-medium">Featured</span>
                          </button>
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full" disabled={saving}>
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        <Plus className="w-4 h-4 mr-2" />
                        Add Link
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Your Links ({links.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                          {links.map((link) => (
                            <SortableLink key={link.id} link={link} onEdit={setEditingLink} onDelete={handleDeleteLink} />
                          ))}
                          {links.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">No links yet. Add your first link above!</p>
                          )}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="design" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Customize Design
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Design Section Navigation */}
                    <div className="flex flex-col gap-2 pb-4 border-b">
                      <button
                        onClick={() => setDesignSection("header")}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                          designSection === "header" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                        }`}
                      >
                        <User className="w-4 h-4" />
                        <span className="font-medium">Header</span>
                      </button>
                      <button
                        onClick={() => setDesignSection("theme")}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                          designSection === "theme" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                        }`}
                      >
                        <Palette className="w-4 h-4" />
                        <span className="font-medium">Theme</span>
                      </button>
                      <button
                        onClick={() => setDesignSection("wallpaper")}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                          designSection === "wallpaper" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                        }`}
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span className="font-medium">Wallpaper</span>
                      </button>
                      <button
                        onClick={() => setDesignSection("presets")}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                          designSection === "presets" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                        }`}
                      >
                        <Wand2 className="w-4 h-4" />
                        <span className="font-medium">Presets</span>
                      </button>
                      <button
                        onClick={() => setDesignSection("text")}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                          designSection === "text" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                        }`}
                      >
                        <Type className="w-4 h-4" />
                        <span className="font-medium">Text</span>
                      </button>
                      <button
                        onClick={() => setDesignSection("buttons")}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                          designSection === "buttons" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                        }`}
                      >
                        <Square className="w-4 h-4" />
                        <span className="font-medium">Buttons</span>
                      </button>
                      <button
                        onClick={() => setDesignSection("colors")}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                          designSection === "colors" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                        }`}
                      >
                        <CircleDot className="w-4 h-4" />
                        <span className="font-medium">Colors</span>
                      </button>
                    </div>

                    {/* Header Section */}
                    {designSection === "header" && (
                      <div className="space-y-6">
                        <div>
                          <Label className="text-base font-semibold mb-3 block">Profile image layout</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => setTheme({ ...theme, profileImageLayout: "classic" })}
                              className={`p-4 border-2 rounded-lg text-center transition-all ${
                                theme.profileImageLayout === "classic" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                              }`}
                            >
                              <User className="w-4 h-4 mx-auto mb-2" />
                              <span className="text-sm font-medium">Classic</span>
                            </button>
                            <button
                              onClick={() => setTheme({ ...theme, profileImageLayout: "hero" })}
                              className={`p-4 border-2 rounded-lg text-center transition-all ${
                                theme.profileImageLayout === "hero" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                              }`}
                            >
                              <Wand2 className="w-4 h-4 mx-auto mb-2" />
                              <span className="text-sm font-medium">Hero</span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <Label className="text-base font-semibold mb-3 block">Title</Label>
                          
                          <div className="space-y-4">
                            <div>
                              <Label className="mb-2">Title style</Label>
                              <div className="grid grid-cols-2 gap-3">
                                <button
                                  onClick={() => setTheme({ ...theme, titleStyle: "text" })}
                                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                                    theme.titleStyle === "text" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                                  }`}
                                >
                                  <Type className="w-4 h-4 mx-auto mb-2" />
                                  <span className="text-sm font-medium">Text</span>
                                </button>
                                <button
                                  onClick={() => setTheme({ ...theme, titleStyle: "logo" })}
                                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                                    theme.titleStyle === "logo" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                                  }`}
                                >
                                  <ImageIcon className="w-4 h-4 mx-auto mb-2" />
                                  <span className="text-sm font-medium">Logo</span>
                                </button>
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="titleText">Title text</Label>
                              <Input
                                id="titleText"
                                value={profileForm.name || username}
                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                placeholder="@username"
                              />
                            </div>

                            <div>
                              <Label htmlFor="titleFont">Title font</Label>
                              <Select value={theme.titleFont} onValueChange={(value) => setTheme({ ...theme, titleFont: value })}>
                                <SelectTrigger id="titleFont">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Link Sans">Link Sans</SelectItem>
                                  <SelectItem value="Arial">Arial</SelectItem>
                                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                  <SelectItem value="Courier New">Courier New</SelectItem>
                                  <SelectItem value="Georgia">Georgia</SelectItem>
                                  <SelectItem value="Verdana">Verdana</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="titleColor">Title color</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="titleColor"
                                  type="color"
                                  value={theme.titleColor}
                                  onChange={(e) => setTheme({ ...theme, titleColor: e.target.value })}
                                  className="w-20 h-10"
                                />
                                <Input
                                  value={theme.titleColor}
                                  onChange={(e) => setTheme({ ...theme, titleColor: e.target.value })}
                                  placeholder="#000000"
                                />
                              </div>
                            </div>

                            <div>
                              <Label className="mb-2">Title size</Label>
                              <div className="grid grid-cols-2 gap-3">
                                <button
                                  onClick={() => setTheme({ ...theme, titleSize: "small" })}
                                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                                    theme.titleSize === "small" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                                  }`}
                                >
                                  <span className="text-sm font-medium">Small</span>
                                </button>
                                <button
                                  onClick={() => setTheme({ ...theme, titleSize: "large" })}
                                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                                    theme.titleSize === "large" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                                  }`}
                                >
                                  <span className="text-xl font-medium">Large</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Theme Section */}
                    {designSection === "theme" && (
                      <div className="space-y-4">
                        {/* Preset Tabs */}
                        <div className="flex gap-2 border-b pb-4">
                          <button
                            onClick={() => setPresetTab("customizable")}
                            className={`px-4 py-2 font-medium transition-colors ${
                              presetTab === "customizable"
                                ? "text-primary border-b-2 border-primary"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Customizable
                          </button>
                          <button
                            onClick={() => setPresetTab("curated")}
                            className={`px-4 py-2 font-medium transition-colors ${
                              presetTab === "curated"
                                ? "text-primary border-b-2 border-primary"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Curated
                          </button>
                        </div>

                        {/* Customizable Tab */}
                        {presetTab === "customizable" && (
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => applyPreset({
                                name: "Light",
                                backgroundColor: "#ffffff",
                                wallpaper: "#ffffff",
                                buttonColor: "#000000",
                                buttonTextColor: "#ffffff",
                                buttonStyle: "rounded",
                                titleColor: "#000000",
                                titleFont: "Arial",
                              })}
                              className="p-4 border-2 rounded-lg text-center hover:border-primary transition-all"
                            >
                              <div className="w-full h-16 bg-white border-2 rounded mb-2 flex items-center justify-center">
                                <div className="w-12 h-6 bg-black rounded"></div>
                              </div>
                              <span className="text-sm font-medium">Light</span>
                            </button>
                            <button
                              onClick={() => applyPreset({
                                name: "Dark",
                                backgroundColor: "#1a1a1a",
                                wallpaper: "#1a1a1a",
                                buttonColor: "#ffffff",
                                buttonTextColor: "#000000",
                                buttonStyle: "rounded",
                                titleColor: "#ffffff",
                                titleFont: "Arial",
                              })}
                              className="p-4 border-2 rounded-lg text-center hover:border-primary transition-all"
                            >
                              <div className="w-full h-16 bg-gray-900 border-2 rounded mb-2 flex items-center justify-center">
                                <div className="w-12 h-6 bg-white rounded"></div>
                              </div>
                              <span className="text-sm font-medium">Dark</span>
                            </button>
                          </div>
                        )}

                        {/* Curated Tab */}
                        {presetTab === "curated" && (
                          <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                            {CURATED_THEMES.map((preset) => (
                              <button
                                key={preset.name}
                                onClick={() => applyPreset(preset)}
                                className="group relative p-3 border-2 rounded-xl text-center hover:border-primary transition-all"
                              >
                                {/* Preview Card */}
                                <div 
                                  className="w-full h-32 rounded-lg mb-2 flex flex-col items-center justify-center p-3 relative overflow-hidden"
                                  style={{ 
                                    background: preset.wallpaper,
                                  }}
                                >
                                  {/* Lightning Icon */}
                                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                                    <Wand2 className="w-3 h-3 text-white" />
                                  </div>
                                  
                                  {/* Title Preview */}
                                  <span 
                                    className="text-2xl font-bold mb-2"
                                    style={{ 
                                      color: preset.titleColor,
                                      fontFamily: preset.titleFont 
                                    }}
                                  >
                                    Aa
                                  </span>
                                  
                                  {/* Button Preview */}
                                  <div
                                    className="px-6 py-2 text-xs font-medium"
                                    style={{
                                      backgroundColor: preset.buttonColor,
                                      color: preset.buttonTextColor,
                                      borderRadius:
                                        preset.buttonStyle === "rounded"
                                          ? "0.5rem"
                                          : preset.buttonStyle === "pill"
                                          ? "9999px"
                                          : "0.25rem",
                                    }}
                                  >
                                    Button
                                  </div>
                                </div>
                                
                                {/* Theme Name */}
                                <span className="text-sm font-medium">{preset.name}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="border-t pt-4 mt-4">
                          <div>
                            <Label htmlFor="fontFamily">Font Family</Label>
                            <Select value={theme.fontFamily} onValueChange={(value) => setTheme({ ...theme, fontFamily: value })}>
                              <SelectTrigger id="fontFamily">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sans">Sans Serif</SelectItem>
                                <SelectItem value="serif">Serif</SelectItem>
                                <SelectItem value="mono">Monospace</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Wallpaper Section */}
                    {designSection === "wallpaper" && (
                      <div className="space-y-6">
                        <div>
                          <Label className="text-base font-semibold mb-3 block">Wallpaper style</Label>
                          <div className="grid grid-cols-3 gap-3">
                            {/* Fill */}
                            <button
                              onClick={() => setTheme({ ...theme, wallpaperStyle: "fill" })}
                              className={`p-4 border-2 rounded-xl text-center transition-all ${
                                theme.wallpaperStyle === "fill" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                              }`}
                            >
                              <div className="w-full h-20 bg-black rounded-lg mb-2"></div>
                              <span className="text-xs font-medium">Fill</span>
                            </button>

                            {/* Gradient */}
                            <button
                              onClick={() => setTheme({ ...theme, wallpaperStyle: "gradient", wallpaperGradientStart: "#6b2ff5", wallpaperGradientEnd: "#ff3a9d" })}
                              className={`p-4 border-2 rounded-xl text-center transition-all ${
                                theme.wallpaperStyle === "gradient" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                              }`}
                            >
                              <div className="w-full h-20 rounded-lg mb-2" style={{ background: "linear-gradient(135deg, #374151 0%, #000000 100%)" }}></div>
                              <span className="text-xs font-medium">Gradient</span>
                            </button>

                            {/* Blur */}
                            <button
                              onClick={() => setTheme({ ...theme, wallpaperStyle: "blur" })}
                              className={`p-4 border-2 rounded-xl text-center transition-all ${
                                theme.wallpaperStyle === "blur" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                              }`}
                            >
                              <div className="w-full h-20 bg-black rounded-lg mb-2 relative overflow-hidden border-4 border-black/50">
                                <div className="absolute inset-0 backdrop-blur-sm bg-white/10"></div>
                              </div>
                              <span className="text-xs font-medium">Blur</span>
                            </button>

                            {/* Pattern */}
                            <button
                              onClick={() => setTheme({ ...theme, wallpaperStyle: "pattern", wallpaperPattern: "dots" })}
                              className={`p-4 border-2 rounded-xl text-center transition-all ${
                                theme.wallpaperStyle === "pattern" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                              }`}
                            >
                              <div className="w-full h-20 bg-black rounded-lg mb-2 grid grid-cols-3 gap-2 p-2">
                                {[...Array(9)].map((_, i) => (
                                  <div key={i} className="bg-black/50 rounded"></div>
                                ))}
                              </div>
                              <span className="text-xs font-medium">Pattern</span>
                            </button>

                            {/* Image */}
                            <button
                              onClick={() => setTheme({ ...theme, wallpaperStyle: "image" })}
                              className={`p-4 border-2 rounded-xl text-center transition-all ${
                                theme.wallpaperStyle === "image" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                              }`}
                            >
                              <div className="w-full h-20 bg-gray-100 rounded-lg mb-2 flex items-center justify-center border-2 border-gray-300">
                                <ImageIcon className="w-5 h-5 text-gray-400" />
                                <Wand2 className="w-3 h-3 text-gray-600 absolute top-2 right-2 bg-gray-200 rounded-full p-0.5" />
                              </div>
                              <span className="text-xs font-medium">Image</span>
                            </button>

                            {/* Video */}
                            <button
                              onClick={() => setTheme({ ...theme, wallpaperStyle: "video" })}
                              className={`p-4 border-2 rounded-xl text-center transition-all ${
                                theme.wallpaperStyle === "video" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                              }`}
                            >
                              <div className="w-full h-20 bg-gray-100 rounded-lg mb-2 flex items-center justify-center border-2 border-gray-300">
                                <Video className="w-5 h-5 text-gray-400" />
                                <Wand2 className="w-3 h-3 text-gray-600 absolute top-2 right-2 bg-gray-200 rounded-full p-0.5" />
                              </div>
                              <span className="text-xs font-medium">Video</span>
                            </button>
                          </div>
                        </div>

                        {/* Fill Options */}
                        {theme.wallpaperStyle === "fill" && (
                          <div>
                            <Label className="text-base font-semibold mb-3 block">Color</Label>
                            <div className="space-y-4">
                              {/* Color Picker */}
                              <div className="flex gap-2">
                                <div className="relative">
                                  <Input
                                    type="color"
                                    value={theme.wallpaper}
                                    onChange={(e) => setTheme({ ...theme, wallpaper: e.target.value, backgroundColor: e.target.value })}
                                    className="w-20 h-20 rounded-lg cursor-pointer"
                                  />
                                </div>
                                <div className="flex-1">
                                  <Input
                                    value={theme.wallpaper}
                                    onChange={(e) => setTheme({ ...theme, wallpaper: e.target.value, backgroundColor: e.target.value })}
                                    placeholder="#000000"
                                  />
                                  {profileForm.profileImageUrl && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                      Suggested colors are based on your profile image
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Suggested Colors */}
                              <div className="flex gap-2 items-center">
                                <button
                                  onClick={() => setTheme({ ...theme, wallpaper: "#ffffff", backgroundColor: "#ffffff" })}
                                  className="w-10 h-10 rounded-full border-2 border-gray-300 bg-white hover:scale-110 transition-transform"
                                />
                                <button
                                  onClick={() => setTheme({ ...theme, wallpaper: "#000000", backgroundColor: "#000000" })}
                                  className="w-10 h-10 rounded-full border-2 border-gray-300 bg-black hover:scale-110 transition-transform"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Gradient Options */}
                        {theme.wallpaperStyle === "gradient" && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="gradientStart">Gradient Start Color</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="gradientStart"
                                  type="color"
                                  value={theme.wallpaperGradientStart || "#6b2ff5"}
                                  onChange={(e) => {
                                    const start = e.target.value;
                                    const end = theme.wallpaperGradientEnd || "#ff3a9d";
                                    setTheme({ 
                                      ...theme, 
                                      wallpaperGradientStart: start,
                                      wallpaper: `linear-gradient(135deg, ${start} 0%, ${end} 100%)`,
                                      backgroundColor: start
                                    });
                                  }}
                                  className="w-20 h-10"
                                />
                                <Input
                                  value={theme.wallpaperGradientStart || "#6b2ff5"}
                                  onChange={(e) => {
                                    const start = e.target.value;
                                    const end = theme.wallpaperGradientEnd || "#ff3a9d";
                                    setTheme({ 
                                      ...theme, 
                                      wallpaperGradientStart: start,
                                      wallpaper: `linear-gradient(135deg, ${start} 0%, ${end} 100%)`,
                                      backgroundColor: start
                                    });
                                  }}
                                  placeholder="#6b2ff5"
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="gradientEnd">Gradient End Color</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="gradientEnd"
                                  type="color"
                                  value={theme.wallpaperGradientEnd || "#ff3a9d"}
                                  onChange={(e) => {
                                    const start = theme.wallpaperGradientStart || "#6b2ff5";
                                    const end = e.target.value;
                                    setTheme({ 
                                      ...theme, 
                                      wallpaperGradientEnd: end,
                                      wallpaper: `linear-gradient(135deg, ${start} 0%, ${end} 100%)`,
                                      backgroundColor: start
                                    });
                                  }}
                                  className="w-20 h-10"
                                />
                                <Input
                                  value={theme.wallpaperGradientEnd || "#ff3a9d"}
                                  onChange={(e) => {
                                    const start = theme.wallpaperGradientStart || "#6b2ff5";
                                    const end = e.target.value;
                                    setTheme({ 
                                      ...theme, 
                                      wallpaperGradientEnd: end,
                                      wallpaper: `linear-gradient(135deg, ${start} 0%, ${end} 100%)`,
                                      backgroundColor: start
                                    });
                                  }}
                                  placeholder="#ff3a9d"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Blur Options */}
                        {theme.wallpaperStyle === "blur" && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="blurColor">Base Color</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="blurColor"
                                  type="color"
                                  value={theme.wallpaper}
                                  onChange={(e) => setTheme({ ...theme, wallpaper: e.target.value, backgroundColor: e.target.value })}
                                  className="w-20 h-10"
                                />
                                <Input
                                  value={theme.wallpaper}
                                  onChange={(e) => setTheme({ ...theme, wallpaper: e.target.value, backgroundColor: e.target.value })}
                                  placeholder="#000000"
                                />
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                A frosted glass effect will be applied over this color
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Pattern Options */}
                        {theme.wallpaperStyle === "pattern" && (
                          <div className="space-y-4">
                            <div>
                              <Label>Pattern Type</Label>
                              <div className="grid grid-cols-2 gap-3 mt-2">
                                <button
                                  onClick={() => setTheme({ ...theme, wallpaperPattern: "dots" })}
                                  className={`p-3 border-2 rounded-lg ${
                                    theme.wallpaperPattern === "dots" ? "border-primary bg-primary/5" : "border-border"
                                  }`}
                                >
                                  <div className="w-full h-12 rounded" style={{ 
                                    backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.2) 1px, transparent 1px)",
                                    backgroundSize: "8px 8px"
                                  }}></div>
                                  <span className="text-xs font-medium mt-2 block">Dots</span>
                                </button>
                                <button
                                  onClick={() => setTheme({ ...theme, wallpaperPattern: "grid" })}
                                  className={`p-3 border-2 rounded-lg ${
                                    theme.wallpaperPattern === "grid" ? "border-primary bg-primary/5" : "border-border"
                                  }`}
                                >
                                  <div className="w-full h-12 rounded grid grid-cols-4 gap-1">
                                    {[...Array(16)].map((_, i) => (
                                      <div key={i} className="bg-black/10 rounded-sm"></div>
                                    ))}
                                  </div>
                                  <span className="text-xs font-medium mt-2 block">Grid</span>
                                </button>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="patternColor">Background Color</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="patternColor"
                                  type="color"
                                  value={theme.wallpaper}
                                  onChange={(e) => setTheme({ ...theme, wallpaper: e.target.value, backgroundColor: e.target.value })}
                                  className="w-20 h-10"
                                />
                                <Input
                                  value={theme.wallpaper}
                                  onChange={(e) => setTheme({ ...theme, wallpaper: e.target.value, backgroundColor: e.target.value })}
                                  placeholder="#ffffff"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Image Options */}
                        {theme.wallpaperStyle === "image" && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="imageUrl">Image URL</Label>
                              <Input
                                id="imageUrl"
                                value={theme.wallpaperImageUrl || ""}
                                onChange={(e) => setTheme({ ...theme, wallpaperImageUrl: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                              />
                              <p className="text-xs text-muted-foreground mt-2">
                                Enter a URL to an image or upload one
                              </p>
                            </div>
                            {theme.wallpaperImageUrl && (
                              <div className="relative w-full h-32 rounded-lg overflow-hidden border-2">
                                <img 
                                  src={theme.wallpaperImageUrl} 
                                  alt="Wallpaper preview" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Video Options */}
                        {theme.wallpaperStyle === "video" && (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="videoUrl">Video URL</Label>
                              <Input
                                id="videoUrl"
                                value={theme.wallpaperVideoUrl || ""}
                                onChange={(e) => setTheme({ ...theme, wallpaperVideoUrl: e.target.value })}
                                placeholder="https://example.com/video.mp4"
                              />
                              <p className="text-xs text-muted-foreground mt-2">
                                Enter a URL to a video file (MP4 recommended)
                              </p>
                            </div>
                            {theme.wallpaperVideoUrl && (
                              <div className="relative w-full h-32 rounded-lg overflow-hidden border-2">
                                <video 
                                  src={theme.wallpaperVideoUrl} 
                                  className="w-full h-full object-cover"
                                  muted
                                  loop
                                  playsInline
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Presets Section - Button and Font */}
                    {designSection === "presets" && (
                      <div className="space-y-4">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold mb-2">Button and font</h3>
                          <p className="text-sm text-muted-foreground">Choose a preset style for your buttons and typography</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                          {BUTTON_FONT_PRESETS.map((preset) => (
                            <button
                              key={preset.name}
                              onClick={() => applyButtonFontPreset(preset)}
                              className={`group relative p-4 border-2 rounded-xl text-center hover:border-primary transition-all ${
                                theme.buttonStyle === preset.buttonStyle && 
                                theme.buttonColor === preset.buttonColor &&
                                theme.titleFont === preset.titleFont
                                  ? "border-primary bg-primary/5"
                                  : "border-border"
                              }`}
                            >
                              {/* Preview Card */}
                              <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center p-4">
                                {/* Custom preset shows icon */}
                                {preset.name === "Custom" ? (
                                  <div className="flex items-center justify-center">
                                    <Palette className="w-12 h-12 text-gray-400" />
                                  </div>
                                ) : (
                                  /* Button Preview */
                                  <div
                                    className="px-8 py-3 text-sm font-medium transition-all"
                                    style={{
                                      backgroundColor: preset.buttonColor,
                                      color: preset.buttonTextColor,
                                      border: preset.buttonBorder,
                                      borderRadius:
                                        preset.buttonStyle === "rounded"
                                          ? "0.5rem"
                                          : preset.buttonStyle === "pill"
                                          ? "9999px"
                                          : "0.25rem",
                                      fontFamily: preset.titleFont,
                                      fontWeight: preset.name === "Retro" ? "bold" : "500"
                                    }}
                                  >
                                    Button
                                  </div>
                                )}
                              </div>
                              
                              {/* Preset Name */}
                              <span className="text-sm font-semibold block mb-1">{preset.name}</span>
                              
                              {/* Selection indicator for Retro and Modern */}
                              {(preset.name === "Retro" || preset.name === "Modern") && 
                                theme.buttonStyle === preset.buttonStyle && 
                                theme.buttonColor === preset.buttonColor &&
                                theme.titleFont === preset.titleFont && (
                                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gray-400 flex items-center justify-center">
                                  <Wand2 className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>

                        <div className="border-t pt-4 mt-4">
                          <p className="text-xs text-muted-foreground">
                            💡 Tip: After applying a preset, you can further customize colors and styles in the Buttons and Text sections.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Text Section */}
                    {designSection === "text" && (
                      <div className="space-y-6">
                        {/* Title Font */}
                        <div>
                          <Label htmlFor="titleFontText" className="text-base font-semibold mb-3 block">Title font</Label>
                          <Select value={theme.titleFont} onValueChange={(value) => setTheme({ ...theme, titleFont: value })}>
                            <SelectTrigger id="titleFontText" className="w-full h-14 text-base">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {FONT_OPTIONS.map((font) => (
                                <SelectItem key={font.value} value={font.value} className="text-base py-3">
                                  <span style={{ fontFamily: font.value }}>{font.label}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Title Color */}
                        <div>
                          <Label htmlFor="titleColorText" className="text-base font-semibold mb-3 block">Title color</Label>
                          <div className="flex items-center justify-between h-14 px-4 border-2 rounded-lg bg-muted/30">
                            <span className="text-base">Title color</span>
                            <button
                              className="relative w-10 h-10 rounded-full border-2 border-border overflow-hidden"
                              onClick={() => document.getElementById('titleColorPickerText')?.click()}
                            >
                              <div
                                className="w-full h-full"
                                style={{ backgroundColor: theme.titleColor }}
                              />
                            </button>
                            <input
                              id="titleColorPickerText"
                              type="color"
                              value={theme.titleColor}
                              onChange={(e) => setTheme({ ...theme, titleColor: e.target.value })}
                              className="sr-only"
                            />
                          </div>
                        </div>

                        {/* Title Size */}
                        <div>
                          <Label className="text-base font-semibold mb-3 block">Title size</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => setTheme({ ...theme, titleSize: "small" })}
                              className={`relative h-20 border-2 rounded-xl text-center transition-all flex items-center justify-center ${
                                theme.titleSize === "small" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                              }`}
                            >
                              <span className="text-base font-medium">Small</span>
                            </button>
                            <button
                              onClick={() => setTheme({ ...theme, titleSize: "large" })}
                              className={`relative h-20 border-2 rounded-xl text-center transition-all flex items-center justify-center ${
                                theme.titleSize === "large" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                              }`}
                            >
                              <span className="text-xl font-medium">Large</span>
                              {theme.titleSize === "large" && (
                                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
                                  <Wand2 className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Page and Buttons Section */}
                        <div className="border-t pt-6 mt-6">
                          <h3 className="text-base font-semibold mb-4">Page and buttons</h3>
                          
                          {/* Page Font */}
                          <div className="mb-6">
                            <Label htmlFor="pageFont" className="text-base font-semibold mb-3 block">Font</Label>
                            <Select value={theme.fontFamily} onValueChange={(value) => setTheme({ ...theme, fontFamily: value })}>
                              <SelectTrigger id="pageFont" className="w-full h-14 text-base">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px]">
                                {FONT_OPTIONS.map((font) => (
                                  <SelectItem key={font.value} value={font.value} className="text-base py-3">
                                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Page Text Color */}
                          <div className="mb-6">
                            <Label className="text-base font-semibold mb-3 block">Page text color</Label>
                            <div className="flex items-center justify-between h-14 px-4 border-2 rounded-lg bg-muted/30">
                              <span className="text-base">Page text color</span>
                              <button
                                className="relative w-10 h-10 rounded-full border-2 border-border overflow-hidden"
                                onClick={() => document.getElementById('pageTextColorPicker')?.click()}
                              >
                                <div
                                  className="w-full h-full"
                                  style={{ backgroundColor: theme.titleColor }}
                                />
                              </button>
                              <input
                                id="pageTextColorPicker"
                                type="color"
                                value={theme.titleColor}
                                onChange={(e) => setTheme({ ...theme, titleColor: e.target.value })}
                                className="sr-only"
                              />
                            </div>
                          </div>

                          {/* Button Text Color */}
                          <div>
                            <Label className="text-base font-semibold mb-3 block">Button text color</Label>
                            <div className="flex items-center justify-between h-14 px-4 border-2 rounded-lg bg-muted/30">
                              <span className="text-base">Button text color</span>
                              <button
                                className="relative w-10 h-10 rounded-full border-2 border-border overflow-hidden"
                                onClick={() => document.getElementById('buttonTextColorPicker')?.click()}
                              >
                                <div
                                  className="w-full h-full"
                                  style={{ backgroundColor: theme.buttonTextColor }}
                                />
                              </button>
                              <input
                                id="buttonTextColorPicker"
                                type="color"
                                value={theme.buttonTextColor}
                                onChange={(e) => setTheme({ ...theme, buttonTextColor: e.target.value })}
                                className="sr-only"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Buttons Section */}
                    {designSection === "buttons" && (
                      <div className="space-y-6">
                        {/* Button Style */}
                        <div>
                          <Label className="text-base font-semibold mb-3 block">Button style</Label>
                          <div className="grid grid-cols-3 gap-3">
                            {/* Solid */}
                            <button
                              onClick={() => setTheme({ ...theme, buttonStyleType: "solid" })}
                              className={`p-4 border-2 rounded-xl text-center transition-all ${
                                (theme.buttonStyleType === "solid" || !theme.buttonStyleType) ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                              }`}
                            >
                              <div className="w-full h-16 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                                <div className="px-6 py-2 bg-gray-800 text-white rounded-lg text-xs font-medium">
                                  Solid
                                </div>
                              </div>
                              <span className="text-sm font-medium">Solid</span>
                            </button>

                            {/* Glass */}
                            <button
                              onClick={() => setTheme({ ...theme, buttonStyleType: "glass" })}
                              className={`relative p-4 border-2 rounded-xl text-center transition-all ${
                                theme.buttonStyleType === "glass" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                              }`}
                            >
                              {theme.buttonStyleType === "glass" && (
                                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
                                  <Wand2 className="w-3 h-3 text-white" />
                                </div>
                              )}
                              <div className="w-full h-16 bg-gray-200 rounded-lg mb-2 flex items-center justify-center relative overflow-hidden">
                                <div className="px-6 py-2 bg-white/40 backdrop-blur-md border border-white/50 text-gray-800 rounded-lg text-xs font-medium">
                                  Glass
                                </div>
                              </div>
                              <span className="text-sm font-medium">Glass</span>
                            </button>

                            {/* Outline */}
                            <button
                              onClick={() => setTheme({ ...theme, buttonStyleType: "outline" })}
                              className={`p-4 border-2 rounded-xl text-center transition-all ${
                                theme.buttonStyleType === "outline" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                              }`}
                            >
                              <div className="w-full h-16 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                                <div className="px-6 py-2 bg-transparent border-2 border-gray-800 text-gray-800 rounded-lg text-xs font-medium">
                                  Outline
                                </div>
                              </div>
                              <span className="text-sm font-medium">Outline</span>
                            </button>
                          </div>
                        </div>

                        {/* Button Options */}
                        <div className="border-t pt-6">
                          <h3 className="text-base font-semibold mb-4">Button Options</h3>
                          
                          {/* Corners Slider */}
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                              <Label className="text-sm font-medium">Corners</Label>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Square</span>
                                <span className="text-xs text-muted-foreground">Round</span>
                              </div>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="9999"
                              step="1"
                              value={theme.buttonCornerRadius || 8}
                              onChange={(e) => setTheme({ ...theme, buttonCornerRadius: parseInt(e.target.value) })}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                          </div>

                          {/* Shadow Options */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Shadow</Label>
                            <div className="grid grid-cols-4 gap-2">
                              <button
                                onClick={() => setTheme({ ...theme, buttonShadow: "none" })}
                                className={`p-3 border-2 rounded-xl text-center transition-all ${
                                  (theme.buttonShadow === "none" || !theme.buttonShadow) ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                                }`}
                              >
                                <div className="w-full h-10 bg-gray-800 rounded-lg mb-1"></div>
                                <span className="text-xs font-medium">None</span>
                              </button>

                              <button
                                onClick={() => setTheme({ ...theme, buttonShadow: "subtle" })}
                                className={`p-3 border-2 rounded-xl text-center transition-all ${
                                  theme.buttonShadow === "subtle" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                                }`}
                              >
                                <div className="w-full h-10 bg-gray-800 rounded-lg mb-1 shadow-sm"></div>
                                <span className="text-xs font-medium">Subtle</span>
                              </button>

                              <button
                                onClick={() => setTheme({ ...theme, buttonShadow: "strong" })}
                                className={`p-3 border-2 rounded-xl text-center transition-all ${
                                  theme.buttonShadow === "strong" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                                }`}
                              >
                                <div className="w-full h-10 bg-gray-800 rounded-lg mb-1 shadow-lg"></div>
                                <span className="text-xs font-medium">Strong</span>
                              </button>

                              <button
                                onClick={() => setTheme({ ...theme, buttonShadow: "hard" })}
                                className={`p-3 border-2 rounded-xl text-center transition-all ${
                                  theme.buttonShadow === "hard" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                                }`}
                              >
                                <div className="w-full h-10 bg-gray-800 rounded-lg mb-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"></div>
                                <span className="text-xs font-medium">Hard</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Colors */}
                        <div className="border-t pt-6">
                          <h3 className="text-base font-semibold mb-4">Colors</h3>
                          
                          {/* Button Color */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between h-14 px-4 border-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                              onClick={() => document.getElementById('buttonColorPicker')?.click()}
                            >
                              <span className="text-base">Button color</span>
                              <button
                                className="relative w-10 h-10 rounded-full border-2 border-border overflow-hidden"
                              >
                                <div
                                  className="w-full h-full"
                                  style={{ backgroundColor: theme.buttonColor }}
                                />
                              </button>
                              <input
                                id="buttonColorPicker"
                                type="color"
                                value={theme.buttonColor}
                                onChange={(e) => setTheme({ ...theme, buttonColor: e.target.value })}
                                className="sr-only"
                              />
                            </div>
                          </div>

                          {/* Text Color */}
                          <div>
                            <div className="flex items-center justify-between h-14 px-4 border-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                              onClick={() => document.getElementById('buttonTextColorPickerNew')?.click()}
                            >
                              <span className="text-base">Text color</span>
                              <button
                                className="relative w-10 h-10 rounded-full border-2 border-border overflow-hidden"
                              >
                                <div
                                  className="w-full h-full"
                                  style={{ backgroundColor: theme.buttonTextColor }}
                                />
                              </button>
                              <input
                                id="buttonTextColorPickerNew"
                                type="color"
                                value={theme.buttonTextColor}
                                onChange={(e) => setTheme({ ...theme, buttonTextColor: e.target.value })}
                                className="sr-only"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Colors Section */}
                    {designSection === "colors" && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="bgColor">Background Color</Label>
                          <div className="flex gap-2">
                            <Input
                              id="bgColor"
                              type="color"
                              value={theme.backgroundColor}
                              onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value, wallpaper: e.target.value })}
                              className="w-20 h-10"
                            />
                            <Input
                              value={theme.backgroundColor}
                              onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value, wallpaper: e.target.value })}
                              placeholder="#ffffff"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="btnColor2">Button Color</Label>
                          <div className="flex gap-2">
                            <Input
                              id="btnColor2"
                              type="color"
                              value={theme.buttonColor}
                              onChange={(e) => setTheme({ ...theme, buttonColor: e.target.value })}
                              className="w-20 h-10"
                            />
                            <Input
                              value={theme.buttonColor}
                              onChange={(e) => setTheme({ ...theme, buttonColor: e.target.value })}
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="textColor2">Text Color</Label>
                          <div className="flex gap-2">
                            <Input
                              id="textColor2"
                              type="color"
                              value={theme.titleColor}
                              onChange={(e) => setTheme({ ...theme, titleColor: e.target.value })}
                              className="w-20 h-10"
                            />
                            <Input
                              value={theme.titleColor}
                              onChange={(e) => setTheme({ ...theme, titleColor: e.target.value })}
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <Button onClick={handleUpdateTheme} className="w-full" disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Save Design
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Live Preview */}
          <div className="lg:sticky lg:top-24 h-fit space-y-4">
            {/* Public URL Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Link2 className="w-4 h-4" />
                  Your Public URL
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* URL Display with Copy Button */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm font-mono truncate">
                    {publicUrl}
                  </div>
                  <Button
                    variant={copied ? "default" : "outline"}
                    size="sm"
                    onClick={handleCopyUrl}
                    className="flex-shrink-0"
                  >
                    {copied ? (
                      <>
                        <span className="mr-2">✓</span> Copied
                      </>
                    ) : (
                      "Copy"
                    )}
                  </Button>
                </div>

                {/* Share Buttons */}
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Share on social media
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShareTwitter}
                      className="flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      Twitter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShareFacebook}
                      className="flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShareLinkedIn}
                      className="flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShareWhatsApp}
                      className="flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Preview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center py-8">
                {/* Mobile Mockup Frame */}
                <div className="relative">
                  {/* Phone Frame */}
                  <div className="relative w-[280px] h-[580px] bg-black rounded-[3rem] p-3 shadow-2xl">
                    {/* Screen Bezel */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>
                    
                    {/* Screen Content */}
                    <div 
                      className="w-full h-full rounded-[2.5rem] overflow-y-auto scrollbar-hide relative"
                      style={{
                        backgroundColor: theme.backgroundColor,
                        fontFamily: theme.fontFamily === "sans" ? "sans-serif" : theme.fontFamily === "serif" ? "serif" : "monospace",
                      }}
                    >
                      {/* Wallpaper Background Layer */}
                      <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden">
                        {/* Fill/Gradient/Blur Background */}
                        {(theme.wallpaperStyle === "fill" || theme.wallpaperStyle === "gradient" || theme.wallpaperStyle === "blur" || !theme.wallpaperStyle) && (
                          <div 
                            className="absolute inset-0"
                            style={{ background: theme.wallpaper }}
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
                              backgroundColor: theme.wallpaper,
                              backgroundImage: theme.wallpaperPattern === "dots" 
                                ? "radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)"
                                : "none",
                              backgroundSize: theme.wallpaperPattern === "dots" ? "12px 12px" : "auto"
                            }}
                          >
                            {theme.wallpaperPattern === "grid" && (
                              <div className="grid grid-cols-8 gap-2 p-2 w-full h-full">
                                {[...Array(64)].map((_, i) => (
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

                      <div className="min-h-full flex flex-col items-center justify-center px-6 py-12 relative z-10">
                        {/* Profile Image - Classic or Hero Layout */}
                        {profileForm.profileImageUrl && (
                          <img 
                            src={profileForm.profileImageUrl} 
                            alt="Profile" 
                            className={`object-cover mb-3 ${
                              theme.profileImageLayout === "hero" 
                                ? "w-full h-32 rounded-lg" 
                                : "w-20 h-20 rounded-full"
                            }`}
                          />
                        )}
                        
                        {/* Title */}
                        <h2 
                          className={`font-bold mb-2 ${
                            theme.titleSize === "large" ? "text-2xl" : "text-xl"
                          }`}
                          style={{ 
                            color: theme.titleColor,
                            fontFamily: theme.titleFont
                          }}
                        >
                          {profileForm.name || `@${username}`}
                        </h2>
                        
                        {profileForm.bio && (
                          <p className="text-center mb-6 text-xs leading-relaxed" style={{ color: theme.titleColor, opacity: 0.7 }}>
                            {profileForm.bio}
                          </p>
                        )}
                        
                        <div className="w-full space-y-3 mb-8">
                          {links.map((link) => {
                            // Default Layout
                            if (!link.layout || link.layout === "default") {
                              return (
                                <div
                                  key={link.id}
                                  className="w-full px-4 py-2.5 text-center font-medium text-sm flex items-center justify-center gap-2 transition-all"
                                  style={{
                                    backgroundColor: theme.buttonStyleType === "outline" ? "transparent" : 
                                                   theme.buttonStyleType === "glass" ? `${theme.buttonColor}40` : 
                                                   theme.buttonColor,
                                    color: theme.buttonTextColor,
                                    borderRadius: theme.buttonCornerRadius ? `${theme.buttonCornerRadius}px` : 
                                                theme.buttonStyle === "rounded" ? "0.5rem" : 
                                                theme.buttonStyle === "pill" ? "9999px" : "0.25rem",
                                    border: theme.buttonStyleType === "outline" ? `2px solid ${theme.buttonColor}` : 
                                           theme.buttonStyleType === "glass" ? "1px solid rgba(255,255,255,0.3)" : "none",
                                    backdropFilter: theme.buttonStyleType === "glass" ? "blur(12px)" : "none",
                                    boxShadow: theme.buttonShadow === "subtle" ? "0 1px 3px rgba(0,0,0,0.12)" :
                                              theme.buttonShadow === "strong" ? "0 10px 25px rgba(0,0,0,0.25)" :
                                              theme.buttonShadow === "hard" ? "4px 4px 0px rgba(0,0,0,0.3)" : "none",
                                  }}
                                >
                                  {getIcon(link.icon)}
                                  <span>{link.title}</span>
                                </div>
                              );
                            }
                            
                            // Icon Only Layout
                            if (link.layout === "icon-only") {
                              return (
                                <div key={link.id} className="flex justify-center">
                                  <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                                    style={{
                                      backgroundColor: theme.buttonColor,
                                      color: theme.buttonTextColor,
                                    }}
                                  >
                                    {getIcon(link.icon) || <span className="text-xs">{link.title[0]}</span>}
                                  </div>
                                </div>
                              );
                            }
                            
                            // Thumbnail Layout
                            if (link.layout === "thumbnail") {
                              return (
                                <div
                                  key={link.id}
                                  className="w-full p-3 flex items-center gap-3 transition-all"
                                  style={{
                                    backgroundColor: theme.buttonColor,
                                    color: theme.buttonTextColor,
                                    borderRadius: "0.5rem",
                                  }}
                                >
                                  <div className="w-10 h-10 rounded bg-white/20 flex items-center justify-center flex-shrink-0">
                                    {getIcon(link.icon)}
                                  </div>
                                  <div className="flex-1 text-left min-w-0">
                                    <div className="font-medium text-xs truncate">{link.title}</div>
                                    <div className="text-[10px] opacity-70 truncate">{link.url}</div>
                                  </div>
                                </div>
                              );
                            }
                            
                            // Card Layout
                            if (link.layout === "card") {
                              return (
                                <div
                                  key={link.id}
                                  className="w-full rounded-lg overflow-hidden transition-all"
                                  style={{
                                    backgroundColor: theme.buttonColor,
                                    color: theme.buttonTextColor,
                                  }}
                                >
                                  <div className="w-full h-16 bg-gradient-to-r from-white/20 to-white/5"></div>
                                  <div className="p-3">
                                    <div className="font-medium text-xs mb-1">{link.title}</div>
                                    <div className="text-[10px] opacity-70">{link.url.replace(/^https?:\/\//, '')}</div>
                                  </div>
                                </div>
                              );
                            }
                            
                            // Minimal Layout
                            if (link.layout === "minimal") {
                              return (
                                <div key={link.id} className="w-full text-center py-2">
                                  <div className="text-sm font-medium" style={{ color: theme.titleColor }}>
                                    {link.title}
                                  </div>
                                  <div className="text-[10px] opacity-50" style={{ color: theme.titleColor }}>
                                    {link.url.replace(/^https?:\/\//, '')}
                                  </div>
                                </div>
                              );
                            }
                            
                            // Featured Layout
                            if (link.layout === "featured") {
                              return (
                                <div
                                  key={link.id}
                                  className="w-full rounded-lg overflow-hidden transition-all"
                                  style={{
                                    background: `linear-gradient(135deg, ${theme.buttonColor} 0%, ${theme.buttonColor}CC 100%)`,
                                    color: theme.buttonTextColor,
                                  }}
                                >
                                  <div className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                      {getIcon(link.icon)}
                                      <div className="font-bold text-sm">{link.title}</div>
                                    </div>
                                    <div className="text-[10px] opacity-70">{link.url.replace(/^https?:\/\//, '')}</div>
                                  </div>
                                </div>
                              );
                            }
                            
                            return null;
                          })}
                          {links.length === 0 && (
                            <p className="text-center text-xs opacity-50 py-8" style={{ color: theme.titleColor }}>
                              Your links will appear here
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Link Modal */}
      {editingLink && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Edit Link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="editTitle">Title</Label>
                <Input
                  id="editTitle"
                  value={editingLink.title}
                  onChange={(e) => setEditingLink({ ...editingLink, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="editUrl">URL</Label>
                <Input
                  id="editUrl"
                  value={editingLink.url}
                  onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="editIcon">Icon</Label>
                <Select
                  value={editingLink.icon || "none"}
                  onValueChange={(value) => setEditingLink({ ...editingLink, icon: value === "none" ? null : value })}
                >
                  <SelectTrigger id="editIcon">
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          {getIcon(option.value)}
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Layouts Section */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Layout</Label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Default Layout */}
                  <button
                    type="button"
                    onClick={() => setEditingLink({ ...editingLink, layout: "default" })}
                    className={`p-4 border-2 rounded-xl text-center transition-all ${
                      (editingLink.layout === "default" || !editingLink.layout) ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <div className="w-full h-16 bg-muted rounded-lg mb-2 flex items-center justify-center p-2">
                      <div className="w-full h-8 bg-gray-700 rounded flex items-center justify-center gap-1 px-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <div className="flex-1 h-2 bg-gray-500 rounded"></div>
                      </div>
                    </div>
                    <span className="text-xs font-medium">Default</span>
                  </button>

                  {/* Icon Only Layout */}
                  <button
                    type="button"
                    onClick={() => setEditingLink({ ...editingLink, layout: "icon-only" })}
                    className={`p-4 border-2 rounded-xl text-center transition-all ${
                      editingLink.layout === "icon-only" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <div className="w-full h-16 bg-muted rounded-lg mb-2 flex items-center justify-center">
                      <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                    </div>
                    <span className="text-xs font-medium">Icon Only</span>
                  </button>

                  {/* Thumbnail Layout */}
                  <button
                    type="button"
                    onClick={() => setEditingLink({ ...editingLink, layout: "thumbnail" })}
                    className={`p-4 border-2 rounded-xl text-center transition-all ${
                      editingLink.layout === "thumbnail" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <div className="w-full h-16 bg-muted rounded-lg mb-2 flex items-center gap-2 p-2">
                      <div className="w-12 h-12 bg-gray-700 rounded"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-2 bg-gray-600 rounded"></div>
                        <div className="h-1.5 bg-gray-500 rounded w-2/3"></div>
                      </div>
                    </div>
                    <span className="text-xs font-medium">Thumbnail</span>
                  </button>

                  {/* Card Layout */}
                  <button
                    type="button"
                    onClick={() => setEditingLink({ ...editingLink, layout: "card" })}
                    className={`p-4 border-2 rounded-xl text-center transition-all ${
                      editingLink.layout === "card" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <div className="w-full h-16 bg-muted rounded-lg mb-2 overflow-hidden">
                      <div className="w-full h-8 bg-gray-600"></div>
                      <div className="p-1.5 space-y-1">
                        <div className="h-1.5 bg-gray-600 rounded"></div>
                        <div className="h-1 bg-gray-500 rounded w-3/4"></div>
                      </div>
                    </div>
                    <span className="text-xs font-medium">Card</span>
                  </button>

                  {/* Minimal Layout */}
                  <button
                    type="button"
                    onClick={() => setEditingLink({ ...editingLink, layout: "minimal" })}
                    className={`p-4 border-2 rounded-xl text-center transition-all ${
                      editingLink.layout === "minimal" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <div className="w-full h-16 bg-muted rounded-lg mb-2 flex items-center justify-center">
                      <div className="w-full space-y-2 px-3">
                        <div className="h-1.5 bg-gray-600 rounded w-2/3 mx-auto"></div>
                        <div className="h-1 bg-gray-500 rounded w-1/2 mx-auto"></div>
                      </div>
                    </div>
                    <span className="text-xs font-medium">Minimal</span>
                  </button>

                  {/* Featured Layout */}
                  <button
                    type="button"
                    onClick={() => setEditingLink({ ...editingLink, layout: "featured" })}
                    className={`p-4 border-2 rounded-xl text-center transition-all ${
                      editingLink.layout === "featured" ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <div className="w-full h-16 bg-muted rounded-lg mb-2 flex flex-col p-2 gap-1">
                      <div className="w-full h-6 bg-gradient-to-r from-gray-700 to-gray-600 rounded"></div>
                      <div className="flex gap-1">
                        <div className="flex-1 h-2 bg-gray-600 rounded"></div>
                        <div className="w-6 h-2 bg-gray-500 rounded"></div>
                      </div>
                    </div>
                    <span className="text-xs font-medium">Featured</span>
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleUpdateLink} disabled={saving} className="flex-1">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save
                </Button>
                <Button variant="outline" onClick={() => setEditingLink(null)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}