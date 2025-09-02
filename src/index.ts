export interface User {
  ID: string;
  LoginEmail: string;
  UserName: string;
  DeviceCompany: string;
  DeviceUserID: string;
}

export interface UserInfoCardProps {
  user: User;
}

export interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  iconColor: string;
  copyable?: boolean;
  monospace?: boolean;
}

export interface CalendarDateSelectorProps {
  sleepData: SleepData[];
  userScores: UserScore[];
  onDateSelect: (date: string) => void;
  loading: boolean;
  error: string | null;
}

export interface CalendarDayProps {
  day: DayInfo;
  onClick: (day: DayInfo) => void;
  getColor: (day: DayInfo) => string | null;
}

export interface MonthNavigationProps {
  currentMonth: Date;
  navigateMonth: (dir: "prev" | "next") => void;
}

export interface QuickNavProps {
  dateRange: { start: Date; end: Date } | null;
  handleQuickNavigation: (type: "first" | "last" | "current") => void;
}

export interface DayInfo {
  date: Date;
  dateString: string;
  day: number;
  isCurrentMonth: boolean;
  hasData: boolean;
  scoreData?: UserScore;
  isToday: boolean;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DataModalProps {
  open: boolean;
  onClose: () => void;
  date: string;
  loginEmail: string;
  deviceUserID: string;
  sleepData: SleepData[];
  userScores: UserScore[];
}

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface SleepData {
  LoginEmail: string;
  DeviceUserID: string;
  Date: string;
  SleepOnset: string;
  WakeUpTime: string;
  Awake: string;
  Deep: string;
  Light: string;
  TotalTimeAsleep: string;
}

export interface SleepDataTabProps {
  sleepData: SleepData | undefined;
}

export interface SleepStage {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  description: string;
  gradient: string;
}

export interface SleepMetric {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

export interface UserScore {
  LoginEmail: string;
  DeviceUserID: string;
  Date: string;
  VitalzScore: number;
  ScoreType: string;
}

export interface UserScoreTabProps {
  userScore: UserScore | undefined;
}

export interface UserStatistics {
  LoginEmail: string;
  DeviceUserID: string;
  Date: string;
  Time: string;
  HR: number;
  HRV: number;
  OxygenSaturation: number;
}

export interface MetricStats {
  average: number;
  min: number;
  max: number;
  range: number;
  standardDeviation: number;
  outliers: number[];
  trend: "up" | "down" | "stable";
  variabilityScore: "low" | "medium" | "high";
}

export interface ProcessedStatistics {
  raw: UserStatistics[];
  hr: MetricStats;
  hrv: MetricStats;
  oxygen: MetricStats;
  totalReadings: number;
  timeRange: { start: string; end: string };
}

export interface UserStatisticsTabProps {
  loginEmail: string;
  deviceUserID: string;
  date: string;
}

export interface MetricCardProps {
  label: string;
  stats: MetricStats;
  unit: string;
  icon: React.ReactNode;
  color: "error" | "warning" | "success";
  rawData: number[];
  description: string;
  processedStatistics: ProcessedStatistics | null;
}

export interface ApiResponse<T> {
  status: number;
  data: T[];
}
