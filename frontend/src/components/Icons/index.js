// Centralized Icons Component - Professional Icon System
// All icons from react-icons library organized by category

// Navigation & Actions Icons
export {
  FaSearch,
  FaHome,
  FaCar,
  FaUser,
  FaCog,
  FaSignInAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';

// CRUD Operations
export {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaUndo,
  FaRedo,
  FaDownload,
  FaUpload,
  FaFileExport,
  FaFileImport
} from 'react-icons/fa';

// Vehicle Related Icons
export {
  FaCarSide,
  FaCarAlt,
  FaTruck,
  FaMotorcycle,
  FaBus,
  FaGasPump,
  FaChargingStation,
  FaWrench,
  FaTools,
  FaTachometerAlt
} from 'react-icons/fa';

// UI & Interaction Icons
export {
  FaHeart,
  FaRegHeart,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEye,
  FaEyeSlash,
  FaExpand,
  FaCompress,
  FaChevronUp,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
  FaArrowLeft,
  FaExternalLinkAlt
} from 'react-icons/fa';

// Material Design Icons
export {
  MdCompareArrows,
  MdCompare,
  MdCalendarToday,
  MdDateRange,
  MdColorLens,
  MdPalette,
  MdSpeed,
  MdTimer,
  MdAttachMoney,
  MdMoneyOff,
  MdLocationOn,
  MdMyLocation,
  MdDirectionsCar,
  MdDashboard,
  MdGridView,
  MdViewList,
  MdViewModule,
  MdViewComfy
} from 'react-icons/md';

// Status & Feedback Icons
export {
  MdCheckCircle,
  MdError,
  MdWarning,
  MdInfo,
  MdNotificationsActive,
  MdNotificationsNone,
  MdStar,
  MdStarBorder,
  MdStarHalf,
  MdFavorite,
  MdFavoriteBorder,
  MdThumbUp,
  MdThumbDown
} from 'react-icons/md';

// Communication Icons
export {
  IoLogoWhatsapp,
  IoMdMail,
  IoMdCall,
  IoMdChatbubbles,
  IoMdShare,
  IoMdMicrophone,
  IoMdMicOff,
  IoMdClose,
  IoMdCheckmark,
  IoMdAdd,
  IoMdRemove
} from 'react-icons/io';

// Box Icons - Additional UI Elements
export {
  BiTimeFive,
  BiTime,
  BiHistory,
  BiSearch,
  BiSearchAlt,
  BiFilter,
  BiSort,
  BiSortAlt2,
  BiChevronDown,
  BiChevronUp,
  BiChevronLeft,
  BiChevronRight,
  BiX,
  BiCheck,
  BiPlus,
  BiMinus
} from 'react-icons/bi';

// Outline Icons for Alternative Styles
export {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineInfoCircle,
  AiOutlineWarning,
  AiOutlineExclamationCircle,
  AiOutlineQuestionCircle,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineStar,
  AiFillStar,
  AiOutlineCar,
  AiOutlineCalendar,
  AiOutlineDollar,
  AiOutlineFilter,
  AiOutlineSearch
} from 'react-icons/ai';

// Bootstrap Icons - Modern UI
export {
  BsGrid3X3Gap,
  BsList,
  BsListUl,
  BsFilter,
  BsFilterLeft,
  BsFilterRight,
  BsHeart,
  BsHeartFill,
  BsStar,
  BsStarFill,
  BsStarHalf,
  BsSearch,
  BsX,
  BsCheck,
  BsChevronUp,
  BsChevronDown,
  BsChevronLeft,
  BsChevronRight,
  BsArrowRight,
  BsArrowLeft,
  BsThreeDots,
  BsThreeDotsVertical
} from 'react-icons/bs';

// Heroicons - Premium Style Icons
export {
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineHeart,
  HiHeart,
  HiOutlineStar,
  HiStar,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineColorSwatch,
  HiOutlineSparkles,
  HiOutlineFire,
  HiOutlineTruck,
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineChat,
  HiOutlineShare,
  HiOutlineExternalLink
} from 'react-icons/hi';

// Feather Icons - Minimalist Design
export {
  FiSearch,
  FiFilter,
  FiHeart,
  FiStar,
  FiCalendar,
  FiDollarSign,
  FiMapPin,
  FiPhone,
  FiMail,
  FiMessageCircle,
  FiShare2,
  FiExternalLink,
  FiEdit,
  FiTrash2,
  FiSave,
  FiPlus,
  FiMinus,
  FiX,
  FiCheck,
  FiChevronUp,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
  FiArrowLeft,
  FiGrid,
  FiList,
  FiMenu,
  FiMoreVertical,
  FiMoreHorizontal
} from 'react-icons/fi';

// Remix Icons - Another Modern Set
export {
  RiSearchLine,
  RiSearchFill,
  RiFilterLine,
  RiFilterFill,
  RiHeartLine,
  RiHeartFill,
  RiStarLine,
  RiStarFill,
  RiCalendarLine,
  RiCalendarFill,
  RiMoneyDollarCircleLine,
  RiMoneyDollarCircleFill,
  RiCarLine,
  RiCarFill,
  RiSpeedLine,
  RiSpeedFill,
  RiPaletteLine,
  RiPaletteFill,
  RiWhatsappLine,
  RiWhatsappFill,
  RiPhoneLine,
  RiPhoneFill,
  RiMailLine,
  RiMailFill
} from 'react-icons/ri';

// Default Icon Component Wrapper
import React from 'react';

export const Icon = ({ 
  icon: IconComponent, 
  size = 20, 
  color, 
  className = '', 
  onClick,
  title,
  style = {},
  ...props 
}) => {
  if (!IconComponent) return null;
  
  return (
    <IconComponent 
      className={`icon ${className}`}
      size={size}
      color={color}
      onClick={onClick}
      title={title}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        ...style
      }}
      {...props}
    />
  );
};

// Icon Sets for Quick Access
export const NavigationIcons = {
  home: FaHome,
  catalog: FaCar,
  login: FaSignInAlt,
  logout: FaSignOutAlt,
  admin: FaCog,
  user: FaUser,
  menu: FaBars,
  close: FaTimes
};

export const ActionIcons = {
  add: FaPlus,
  edit: FaEdit,
  delete: FaTrash,
  save: FaSave,
  search: FaSearch,
  filter: FaFilter,
  sort: FaSort,
  view: FaEye,
  hide: FaEyeSlash,
  expand: FaExpand,
  compress: FaCompress
};

export const VehicleIcons = {
  car: FaCar,
  suv: FaTruck,
  motorcycle: FaMotorcycle,
  bus: FaBus,
  speed: MdSpeed,
  fuel: FaGasPump,
  electric: FaChargingStation,
  calendar: MdCalendarToday,
  color: MdColorLens,
  money: MdAttachMoney,
  location: MdLocationOn,
  dashboard: MdDashboard
};

export const StatusIcons = {
  success: MdCheckCircle,
  error: MdError,
  warning: MdWarning,
  info: MdInfo,
  favorite: FaHeart,
  favoriteOutline: FaRegHeart,
  star: MdStar,
  starOutline: MdStarBorder,
  compare: MdCompareArrows
};

export const CommunicationIcons = {
  whatsapp: IoLogoWhatsapp,
  email: IoMdMail,
  phone: IoMdCall,
  chat: IoMdChatbubbles,
  share: IoMdShare,
  microphone: IoMdMicrophone,
  microphoneOff: IoMdMicOff
};

export const ViewModeIcons = {
  grid: BsGrid3X3Gap,
  list: BsList,
  module: MdViewModule,
  comfy: MdViewComfy
};

// Utility function to get icon by name
export const getIconByName = (name) => {
  const allIcons = {
    ...NavigationIcons,
    ...ActionIcons,
    ...VehicleIcons,
    ...StatusIcons,
    ...CommunicationIcons,
    ...ViewModeIcons
  };
  
  return allIcons[name] || null;
};

// Export all icon sets
export default {
  Icon,
  NavigationIcons,
  ActionIcons,
  VehicleIcons,
  StatusIcons,
  CommunicationIcons,
  ViewModeIcons,
  getIconByName
};