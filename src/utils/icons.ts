// Optimized icon imports to reduce bundle size
// Only import the icons we actually need

import {
  // Contact & Communication Icons
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  X,
  XCircle,
  
  // Navigation & UI Icons
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Menu,
  Search,
  Filter,
  Settings,
  Home,
  User,
  Users,
  Building,
  Globe,
  
  // Business & Analytics Icons
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Award,
  Star,
  Zap,
  Lightbulb,
  Brain,
  Cpu,
  Database,
  Server,
  Cloud,
  Shield,
  Lock,
  Key,
  Eye,
  EyeOff,
  
  // Media & Content Icons
  Image,
  Video,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Upload,
  Share,
  Link,
  Link2,
  ExternalLink,
  Copy,
  Clipboard,
  File,
  FileText,
  Folder,
  FolderOpen,
  
  // Service & Process Icons
  Workflow,
  GitBranch,
  Layers,
  Package,
  Wrench,
  Hammer,
  Cog,
  Puzzle,
  Blocks,
  Grid,
  Layout,
  Tablet,
  Smartphone,
  Monitor,
  Laptop,
  
  // Status & Feedback Icons
  Check,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  Plus,
  Minus,
  Edit,
  Trash,
  Trash2,
  RotateCcw,
  RefreshCw,
  Loader,
  
  // Social & External Icons
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Slack,
  Twitch,
  Dribbble,
  Figma,
  Chrome,
  
  // E-commerce & Business Icons
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  Wallet,
  Receipt,
  DollarSign,
  Euro,
  Calendar,
  CalendarDays,
  Tag,
  Tags,
  Percent,
  Calculator,
  Banknote,
  Coins
} from 'lucide-react';

// Re-export all icons for individual use
export {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  X,
  XCircle,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Menu,
  Search,
  Filter,
  Settings,
  Home,
  User,
  Users,
  Building,
  Globe,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Award,
  Star,
  Zap,
  Lightbulb,
  Brain,
  Cpu,
  Database,
  Server,
  Cloud,
  Shield,
  Lock,
  Key,
  Eye,
  EyeOff,
  Image,
  Video,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Upload,
  Share,
  Link,
  Link2,
  ExternalLink,
  Copy,
  Clipboard,
  File,
  FileText,
  Folder,
  FolderOpen,
  Workflow,
  GitBranch,
  Layers,
  Package,
  Wrench,
  Hammer,
  Cog,
  Puzzle,
  Blocks,
  Grid,
  Layout,
  Tablet,
  Smartphone,
  Monitor,
  Laptop,
  Check,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  Plus,
  Minus,
  Edit,
  Trash,
  Trash2,
  RotateCcw,
  RefreshCw,
  Loader,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Slack,
  Twitch,
  Dribbble,
  Figma,
  Chrome,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  Wallet,
  Receipt,
  DollarSign,
  Euro,
  Calendar,
  CalendarDays,
  Tag,
  Tags,
  Percent,
  Calculator,
  Banknote,
  Coins
};

// Icon sets for specific use cases
export const CONTACT_ICONS = {
  phone: Phone,
  whatsapp: MessageCircle,
  email: Mail,
  location: MapPin,
  clock: Clock,
  send: Send,
  success: CheckCircle,
  error: XCircle,
  close: X
};

export const NAVIGATION_ICONS = {
  arrowRight: ArrowRight,
  arrowLeft: ArrowLeft,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  chevronUp: ChevronUp,
  chevronDown: ChevronDown,
  menu: Menu,
  home: Home,
  user: User,
  users: Users,
  building: Building,
  globe: Globe
};

export const BUSINESS_ICONS = {
  trending: TrendingUp,
  chart: BarChart3,
  target: Target,
  award: Award,
  star: Star,
  zap: Zap,
  lightbulb: Lightbulb,
  brain: Brain,
  shield: Shield,
  lock: Lock,
  key: Key
};

export const MEDIA_ICONS = {
  image: Image,
  video: Video,
  play: Play,
  pause: Pause,
  download: Download,
  upload: Upload,
  share: Share,
  link: Link,
  externalLink: ExternalLink,
  copy: Copy,
  file: File,
  folder: Folder
};

export const SERVICE_ICONS = {
  workflow: Workflow,
  layers: Layers,
  package: Package,
  settings: Settings,
  wrench: Wrench,
  cog: Cog,
  puzzle: Puzzle,
  grid: Grid,
  layout: Layout,
  tablet: Tablet,
  smartphone: Smartphone,
  monitor: Monitor,
  laptop: Laptop
};

export const STATUS_ICONS = {
  check: Check,
  alert: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  help: HelpCircle,
  plus: Plus,
  minus: Minus,
  edit: Edit,
  trash: Trash,
  refresh: RefreshCw,
  loader: Loader
};

export const SOCIAL_ICONS = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github
};

// Icon component props interface
export interface IconProps {
  className?: string;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
  role?: string;
}

// Default icon props
export const DEFAULT_ICON_PROPS: IconProps = {
  size: 24,
  strokeWidth: 2,
  'aria-hidden': true,
  role: 'img'
};

// Icon size presets
export const ICON_SIZES = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  '2xl': 48,
  '3xl': 64
};

// Icon utility functions
export const getIconSize = (size: keyof typeof ICON_SIZES | number): number => {
  if (typeof size === 'number') return size;
  return ICON_SIZES[size] || ICON_SIZES.md;
};

export const getIconClassName = (
  baseClass: string = '',
  size?: keyof typeof ICON_SIZES | number,
  color?: string
): string => {
  let className = baseClass;
  
  if (size && typeof size === 'string') {
    const sizeClasses = {
      xs: 'w-4 h-4',
      sm: 'w-5 h-5',
      md: 'w-6 h-6',
      lg: 'w-7 h-7',
      xl: 'w-8 h-8',
      '2xl': 'w-12 h-12',
      '3xl': 'w-16 h-16'
    };
    className += ` ${sizeClasses[size]}`;
  }
  
  if (color) {
    className += ` text-${color}`;
  }
  
  return className.trim();
};

// Icon loading states
export const ICON_LOADING_STATES = {
  spin: 'animate-spin',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  ping: 'animate-ping'
};

// Accessibility helpers
export const getIconA11yProps = (
  label?: string,
  decorative: boolean = false
): Partial<IconProps> => {
  if (decorative) {
    return {
      'aria-hidden': true,
      role: 'presentation'
    };
  }
  
  return {
    'aria-label': label,
    'aria-hidden': false,
    role: 'img'
  };
};

// Export all organized by category for easy access
export const ICONS = {
  contact: CONTACT_ICONS,
  navigation: NAVIGATION_ICONS,
  business: BUSINESS_ICONS,
  media: MEDIA_ICONS,
  service: SERVICE_ICONS,
  status: STATUS_ICONS,
  social: SOCIAL_ICONS
};
