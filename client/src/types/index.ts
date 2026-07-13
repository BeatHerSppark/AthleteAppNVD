export type UserRole = 'DOCTOR' | 'PATIENT' | 'ADMIN' | 'PENDING';
export type Gender = 'MALE' | 'FEMALE';
export type AthleteReportStatus = 'GOOD' | 'IMPROVED' | 'FOLLOWUP';
export type FlagLevel = 'GREEN' | 'YELLOW' | 'RED';
export type MoodEmotion = 'HAPPY' | 'EXCITED' | 'NEUTRAL' | 'TIRED' | 'STRESSED' | 'SAD';
export type MoodProgress = 'GOOD' | 'STALL' | 'BAD';
export type RecommendationType = 'TRAINING' | 'DIET' | 'SUPPLEMENT';
export type RestrictionLevel = 'NORMAL' | 'HARD' | 'EXTREME';
export type SportsmanCategory = 'RECREATION' | 'AMATEUR' | 'SEMI_PROFESSIONAL' | 'PROFESSIONAL';

export interface CurrentUser {
  personId: number | null;
  userId: number;
  embg: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  exp: number;
}

export interface JwtPayload {
  role: UserRole;
  firstName: string;
  lastName: string;
  personId: number | null;
  userId: number;
  sub: string;
  iat: number;
  exp: number;
}

export interface CreateAppUserDTO {
  firstName: string;
  lastName: string;
  embg: string;
  password: string;
  confirmPassword: string;
  email: string;
}

export interface CreateDoctorDTO {
  userId: number;
  specialization: string;
}

export interface CreatePatientDTO {
  id: number;
  sportsmanCategory: SportsmanCategory;
}

export interface AppUserDTO {
  userId: number;
  firstName: string;
  lastName: string;
  embg: string;
  role: UserRole;
  email: string | null;
  createdAt: string | null;
}

export interface PatientDTO {
  patientId: number;
  name: string;
  embg: string;
  dateOfBirth: string;
  dateOfLatestCheckup: string | null;
  gender: Gender;
  sportsmanCategory: SportsmanCategory;
  email: string | null;
  doctor: string | null;
}

export interface Patient {
  patientId: number;
  name: string;
  embg: string;
  dateOfBirth: string;
  dateOfLatestCheckup: string | null;
  gender: Gender;
  sportsmanCategory: SportsmanCategory;
  email: string | null;
  doctor: string | null;
}

export interface ReportForm {
  doctorId: number;
  embg: string;
  status: AthleteReportStatus;
  vo2Max: number;
  restingHeartRate: number;
  underPressureHeartRate: number;
  bodyFatPercentage: number;
  leanMuscleMass?: number;
  boneDensity: number;
  height: number;
  weight: number;
  oneRepMaxBench?: number;
  oneRepMaxSquat?: number;
  oneRepMaxDeadlift?: number;
  jumpHeight?: number;
  averageRunPerKilometer: number;
  shoulderFlexibility?: number;
  hipFlexibility?: number;
  balanceTime: number;
  reactionTime: number;
  coreStabilityScore: number;
  hemoglobin: number;
  glucose: number;
  creatinine: number;
  vitaminD: number;
  iron: number;
  testosterone: number;
  cortisol: number;
}

export interface ReportDetails {
  reportId: number;
  doctor: string;
  doctorId: number;
  patient: string;
  patientId: number;
  embg: string;
  createdAt: string;
  status: AthleteReportStatus;
  vo2Max: number;
  restingHeartRate: number;
  underPressureHeartRate: number;
  bodyFatPercentage: number;
  leanMuscleMass: number | null;
  boneDensity: number;
  height: number;
  weight: number;
  oneRepMaxBench: number | null;
  oneRepMaxSquat: number | null;
  oneRepMaxDeadlift: number | null;
  jumpHeight: number | null;
  averageRunPerKilometer: number;
  shoulderFlexibility: number | null;
  hipFlexibility: number | null;
  balanceTime: number;
  reactionTime: number;
  coreStabilityScore: number;
  hemoglobin: number;
  glucose: number;
  creatinine: number;
  vitaminD: number;
  iron: number;
  testosterone: number;
  cortisol: number;
}

export interface ReportShort {
  id: number;
  createdAt: string;
  doctorName: string;
  patientName: string;
  status: AthleteReportStatus;
  vo2Max: number;
}

export interface Recommendation {
  recommendationId: number;
  reportId: number;
  type: RecommendationType;
  restrictionLevel: RestrictionLevel;
  label: string;
  description: string;
  costPerMonth: number;
  durationWeeks: number;
  frequencyPerDay: number;
  targetGoal: string;
  effectivenessRating: number | null;
  doctorPersonalizedNotes: string;
}

export interface RecommendationFormDTO {
  reportId: number;
  type: RecommendationType;
  restrictionLevel: RestrictionLevel;
  label: string;
  description: string;
  costPerMonth: number;
  durationWeeks: number;
  frequencyPerDay: number;
  targetGoal: string;
  effectivenessRating: number | null;
  doctorPersonalizedNotes: string;
}

export interface Summary {
  summaryId: number;
  reportId: number;
  summarizedContent: string;
}

export interface SummaryForm {
  reportId: number;
  summarizedContent: string;
}

export interface Mood {
  moodId: number;
  moodProgress: MoodProgress;
  moodEmotion: MoodEmotion;
  hoursSleptAverage: number;
  moodDescription: string;
  moodDescriptionScore: number;
  createdAt: string;
  patientId: number;
  patientName: string;
}

export interface MoodStatistics {
  averageSleepOverall: number;
  mostFrequentEmotion: string;
  mostFrequentProgressState: string;
  totalMoodEntries: number;
  moodEmotionCounts: Record<string, number>;
  moodProgressCounts: Record<string, number>;
  progressOverTime: ProgressEntry[];
}

export interface ProgressEntry {
  date: string;
  progress: MoodProgress;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  first: boolean;
  last: boolean;
  size: number;
}

export interface MetricFlagDTO<T> {
  value: T;
  level: FlagLevel;
}

export interface ReportFlags {
  vo2Max: MetricFlagDTO<number> | null;
  restingHeartRate: MetricFlagDTO<number> | null;
  underPressureHeartRate: MetricFlagDTO<number> | null;
  bodyFatPercentage: MetricFlagDTO<number> | null;
  leanMuscleMass: MetricFlagDTO<number> | null;
  boneDensity: MetricFlagDTO<number> | null;
  bmi: MetricFlagDTO<number> | null;
  hemoglobin: MetricFlagDTO<number> | null;
  glucose: MetricFlagDTO<number> | null;
  vitaminD: MetricFlagDTO<number> | null;
  iron: MetricFlagDTO<number> | null;
  testosterone: MetricFlagDTO<number> | null;
  cortisol: MetricFlagDTO<number> | null;
}
