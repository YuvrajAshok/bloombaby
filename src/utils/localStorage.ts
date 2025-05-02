import { User, Symptom, Mood, NutritionLog, EmergencyContact, Exercise, BirthPlanItem, Appointment, KickCount, Contraction, ContractionSession } from "@/types";

const USERS_KEY = "mindful_mama_users";
const CURRENT_USER_KEY = "mindful_mama_current_user";
const SYMPTOMS_KEY = "mindful_mama_symptoms";
const MOODS_KEY = "mindful_mama_moods";
const NUTRITION_KEY = "mindful_mama_nutrition";
const EMERGENCY_CONTACTS_KEY = "mindful_mama_emergency_contacts";
const EXERCISES_KEY = "mindful_mama_exercises";
const BIRTH_PLAN_KEY = "mindful_mama_birth_plan";
const APPOINTMENTS_KEY = "mindful_mama_appointments";
const KICK_COUNTS_KEY = "mindful_mama_kick_counts";
const CONTRACTIONS_KEY = "mindful_mama_contractions";
const CONTRACTION_SESSIONS_KEY = "mindful_mama_contraction_sessions";

// User functions
export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const updateCurrentUser = (updatedUser: Partial<User>): void => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    const updated = { ...currentUser, ...updatedUser };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
    
    // Also update in users array
    const users = getUsers();
    const updatedUsers = users.map(u => 
      u.email === currentUser.email ? { ...u, ...updatedUser } : u
    );
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  }
};

export const logoutUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Symptoms functions
export const getSymptoms = (): Symptom[] => {
  const user = getCurrentUser();
  if (!user) return [];
  
  const key = `${SYMPTOMS_KEY}_${user.email}`;
  const symptoms = localStorage.getItem(key);
  return symptoms ? JSON.parse(symptoms) : [];
};

export const saveSymptom = (symptom: Symptom): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const key = `${SYMPTOMS_KEY}_${user.email}`;
  const symptoms = getSymptoms();
  symptoms.push(symptom);
  localStorage.setItem(key, JSON.stringify(symptoms));
};

export const deleteSymptom = (id: string): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const key = `${SYMPTOMS_KEY}_${user.email}`;
  let symptoms = getSymptoms();
  symptoms = symptoms.filter(s => s.id !== id);
  localStorage.setItem(key, JSON.stringify(symptoms));
};

// Moods functions
export const getMoods = (): Mood[] => {
  const user = getCurrentUser();
  if (!user) return [];
  
  const key = `${MOODS_KEY}_${user.email}`;
  const moods = localStorage.getItem(key);
  return moods ? JSON.parse(moods) : [];
};

export const saveMood = (mood: Mood): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const key = `${MOODS_KEY}_${user.email}`;
  const moods = getMoods();
  moods.push(mood);
  localStorage.setItem(key, JSON.stringify(moods));
};

export const deleteMood = (id: string): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const key = `${MOODS_KEY}_${user.email}`;
  let moods = getMoods();
  moods = moods.filter(m => m.id !== id);
  localStorage.setItem(key, JSON.stringify(moods));
};

// Nutrition functions
export const getNutrition = (): NutritionLog[] => {
  const user = getCurrentUser();
  if (!user) return [];
  
  const key = `${NUTRITION_KEY}_${user.email}`;
  const nutrition = localStorage.getItem(key);
  return nutrition ? JSON.parse(nutrition) : [];
};

export const saveNutrition = (nutrition: NutritionLog): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const key = `${NUTRITION_KEY}_${user.email}`;
  const nutritionLogs = getNutrition();
  nutritionLogs.push(nutrition);
  localStorage.setItem(key, JSON.stringify(nutritionLogs));
};

export const deleteNutrition = (id: string): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const key = `${NUTRITION_KEY}_${user.email}`;
  let nutritionLogs = getNutrition();
  nutritionLogs = nutritionLogs.filter(n => n.id !== id);
  localStorage.setItem(key, JSON.stringify(nutritionLogs));
};

// Emergency Contacts functions
export const getEmergencyContacts = (): EmergencyContact[] => {
  const user = getCurrentUser();
  if (!user) return [];
  
  const key = `${EMERGENCY_CONTACTS_KEY}_${user.email}`;
  const contacts = localStorage.getItem(key);
  return contacts ? JSON.parse(contacts) : [];
};

export const saveEmergencyContact = (contact: EmergencyContact): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const key = `${EMERGENCY_CONTACTS_KEY}_${user.email}`;
  const contacts = getEmergencyContacts();
  contacts.push(contact);
  localStorage.setItem(key, JSON.stringify(contacts));
};

export const deleteEmergencyContact = (id: string): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const key = `${EMERGENCY_CONTACTS_KEY}_${user.email}`;
  let contacts = getEmergencyContacts();
  contacts = contacts.filter(c => c.id !== id);
  localStorage.setItem(key, JSON.stringify(contacts));
};

// Exercise functions
export const getExercises = (): Exercise[] => {
  const user = getCurrentUser();
  if (!user) return [];
  
  const key = `${EXERCISES_KEY}_${user.email}`;
  const exercises = localStorage.getItem(key);
  return exercises ? JSON.parse(exercises) : [];
};

export const saveExercise = (exercise: Exercise): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const key = `${EXERCISES_KEY}_${user.email}`;
  const exercises = getExercises();
  exercises.push(exercise);
  localStorage.setItem(key, JSON.stringify(exercises));
};

export const deleteExercise = (id: string): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const key = `${EXERCISES_KEY}_${user.email}`;
  let exercises = getExercises();
  exercises = exercises.filter(e => e.id !== id);
  localStorage.setItem(key, JSON.stringify(exercises));
};

// Birth Plan functions
export const getBirthPlan = (): BirthPlanItem[] => {
  const user = getCurrentUser();
  if (!user) return [];
  
  const key = `${BIRTH_PLAN_KEY}_${user.email}`;
  const birthPlan = localStorage.getItem(key);
  return birthPlan ? JSON.parse(birthPlan) : [];
};

export const saveBirthPlanItem = (item: BirthPlanItem): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const key = `${BIRTH_PLAN_KEY}_${user.email}`;
  const birthPlan = getBirthPlan();
  birthPlan.push(item);
  localStorage.setItem(key, JSON.stringify(birthPlan));
};

export const updateBirthPlanItem = (updatedItem: BirthPlanItem): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const key = `${BIRTH_PLAN_KEY}_${user.email}`;
  let birthPlan = getBirthPlan();
  birthPlan = birthPlan.map(item => 
    item.id === updatedItem.id ? updatedItem : item
  );
  localStorage.setItem(key, JSON.stringify(birthPlan));
};

export const deleteBirthPlanItem = (id: string): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const key = `${BIRTH_PLAN_KEY}_${user.email}`;
  let birthPlan = getBirthPlan();
  birthPlan = birthPlan.filter(item => item.id !== id);
  localStorage.setItem(key, JSON.stringify(birthPlan));
};

// Appointments functions
export const getAppointments = (): Appointment[] => {
  const user = getCurrentUser();
  if (!user) return [];
  
  const key = `${APPOINTMENTS_KEY}_${user.email}`;
  const appointments = localStorage.getItem(key);
  return appointments ? JSON.parse(appointments) : [];
};

export const saveAppointment = (appointment: Appointment): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const key = `${APPOINTMENTS_KEY}_${user.email}`;
  const appointments = getAppointments();
  appointments.push(appointment);
  localStorage.setItem(key, JSON.stringify(appointments));
};

export const updateAppointment = (updatedAppointment: Appointment): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const key = `${APPOINTMENTS_KEY}_${user.email}`;
  let appointments = getAppointments();
  appointments = appointments.map(appointment => 
    appointment.id === updatedAppointment.id ? updatedAppointment : appointment
  );
  localStorage.setItem(key, JSON.stringify(appointments));
};

export const deleteAppointment = (id: string): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const key = `${APPOINTMENTS_KEY}_${user.email}`;
  let appointments = getAppointments();
  appointments = appointments.filter(a => a.id !== id);
  localStorage.setItem(key, JSON.stringify(appointments));
};

// Kick Counter functions
export const getKickCounts = (): KickCount[] => {
  const user = getCurrentUser();
  if (!user) return [];
  
  const key = `${KICK_COUNTS_KEY}_${user.email}`;
  const kickCounts = localStorage.getItem(key);
  return kickCounts ? JSON.parse(kickCounts) : [];
};

export const saveKickCount = (kickCount: KickCount): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const key = `${KICK_COUNTS_KEY}_${user.email}`;
  const kickCounts = getKickCounts();
  kickCounts.push(kickCount);
  localStorage.setItem(key, JSON.stringify(kickCounts));
};

export const deleteKickCount = (id: string): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const key = `${KICK_COUNTS_KEY}_${user.email}`;
  let kickCounts = getKickCounts();
  kickCounts = kickCounts.filter(k => k.id !== id);
  localStorage.setItem(key, JSON.stringify(kickCounts));
};

// Contraction functions
export const getContractionSessions = (): ContractionSession[] => {
  const user = getCurrentUser();
  if (!user) return [];
  
  const key = `${CONTRACTION_SESSIONS_KEY}_${user.email}`;
  const sessions = localStorage.getItem(key);
  return sessions ? JSON.parse(sessions) : [];
};

export const saveContractionSession = (session: ContractionSession): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const key = `${CONTRACTION_SESSIONS_KEY}_${user.email}`;
  let sessions = getContractionSessions();
  
  // If updating an existing session
  if (sessions.some(s => s.id === session.id)) {
    sessions = sessions.map(s => s.id === session.id ? session : s);
  } else {
    // Adding a new session
    sessions.push(session);
  }
  
  localStorage.setItem(key, JSON.stringify(sessions));
};

export const saveContraction = (contraction: Contraction, sessionId: string): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const key = `${CONTRACTION_SESSIONS_KEY}_${user.email}`;
  let sessions = getContractionSessions();
  
  // Find the session and add the contraction to it
  const sessionIndex = sessions.findIndex(s => s.id === sessionId);
  if (sessionIndex !== -1) {
    sessions[sessionIndex].contractions.push(contraction);
    localStorage.setItem(key, JSON.stringify(sessions));
  }
};

export const deleteContractionSession = (id: string): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const key = `${CONTRACTION_SESSIONS_KEY}_${user.email}`;
  let sessions = getContractionSessions();
  sessions = sessions.filter(s => s.id !== id);
  localStorage.setItem(key, JSON.stringify(sessions));
};
