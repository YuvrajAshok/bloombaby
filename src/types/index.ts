
export type User = {
  email: string;
  password: string;
  name: string;
  dueDate?: Date;
  currentTrimester?: number;
};

export type Symptom = {
  id: string;
  date: Date;
  symptomType: string;
  severity: "mild" | "moderate" | "severe";
  notes?: string;
};

export type Mood = {
  id: string;
  date: Date;
  mood: "happy" | "sad" | "anxious" | "calm" | "irritated";
  notes?: string;
};

export type NutritionLog = {
  id: string;
  date: Date;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  foodItems: string[];
  notes?: string;
};

export type Hospital = {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance?: number;
};

export type EmergencyContact = {
  id: string;
  name: string;
  relationship: string;
  phone: string;
};

export type Exercise = {
  id: string;
  date: Date;
  type: string;
  duration: number;
  intensity: "light" | "moderate" | "intense";
  notes?: string;
};

export type BirthPlanItem = {
  id: string;
  category: "environment" | "procedures" | "support" | "pain management" | "postpartum";
  preference: string;
  notes?: string;
};

export type BabySize = {
  week: number;
  size: string;
  fruit: string;
  length: string;
  weight: string;
  description: string;
  imageUrl?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export type Appointment = {
  id: string;
  title: string;
  date: Date;
  time: string;
  location?: string;
  notes?: string;
  reminder: boolean;
  reminderTime?: "1hour" | "1day" | "2days" | "1week";
};

export type KickCount = {
  id: string;
  date: Date;
  startTime: Date;
  endTime?: Date;
  count: number;
  duration?: number; // in minutes
  notes?: string;
};

export type Contraction = {
  id: string;
  date: Date;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  intensity: "mild" | "moderate" | "strong";
  notes?: string;
};

export type ContractionSession = {
  id: string;
  date: Date;
  contractions: Contraction[];
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
};
