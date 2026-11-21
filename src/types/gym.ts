export type Language = "en" | "bn";

export interface ShiftInfo {
  id: string;
  nameEn: string;
  nameBn: string;
  category: "male" | "female" | "combined";
  timeEn: string;
  timeBn: string;
  badgeEn: string;
  badgeBn: string;
  descriptionEn: string;
  descriptionBn: string;
  trainerEn: string;
  trainerBn: string;
  daysEn: string;
  daysBn: string;
}

export interface Facility {
  id: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  icon: string;
  badgeEn?: string;
  badgeBn?: string;
}

export interface Trainer {
  id: string;
  nameEn: string;
  nameBn: string;
  roleEn: string;
  roleBn: string;
  experienceEn: string;
  experienceBn: string;
  specialityEn: string[];
  specialityBn: string[];
  shiftsEn: string;
  shiftsBn: string;
  image: string;
  gender: "male" | "female";
}

export interface PricingPlan {
  id: string;
  nameEn: string;
  nameBn: string;
  periodEn: string;
  periodBn: string;
  admissionFee: number;
  durationFee: number;
  subTotal: number;
  discount: number;
  price: number; // Grand Total
  renewalFeeEn?: string;
  renewalFeeBn?: string;
  originalPrice?: number;
  badgeEn?: string;
  badgeBn?: string;
  popular?: boolean;
  featuresEn: string[];
  featuresBn: string[];
}

export interface GalleryImage {
  id: string;
  titleEn: string;
  titleBn: string;
  category: "all" | "floor" | "equipment" | "training" | "cardio";
  categoryLabelEn: string;
  categoryLabelBn: string;
  src: string;
  alt: string;
}

export interface ReviewItem {
  id: string;
  authorEn: string;
  authorBn: string;
  rating: number;
  dateEn: string;
  dateBn: string;
  membershipEn: string;
  membershipBn: string;
  commentEn: string;
  commentBn: string;
  shiftEn: string;
  shiftBn: string;
  avatar?: string;
}

export interface FaqItem {
  id: string;
  questionEn: string;
  questionBn: string;
  answerEn: string;
  answerBn: string;
  categoryEn?: string;
  categoryBn?: string;
}