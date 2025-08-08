-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  due_date DATE,
  current_trimester INTEGER CHECK (current_trimester IN (1, 2, 3)),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create symptoms table
CREATE TABLE public.symptoms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  symptom_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('mild', 'moderate', 'severe')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create moods table
CREATE TABLE public.moods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  mood TEXT NOT NULL CHECK (mood IN ('happy', 'sad', 'anxious', 'calm', 'irritated')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create nutrition_logs table
CREATE TABLE public.nutrition_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  food_items TEXT[] NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create emergency_contacts table
CREATE TABLE public.emergency_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create exercises table
CREATE TABLE public.exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  intensity TEXT NOT NULL CHECK (intensity IN ('light', 'moderate', 'intense')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create birth_plan_items table
CREATE TABLE public.birth_plan_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('environment', 'procedures', 'support', 'pain management', 'postpartum')),
  preference TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  time TEXT NOT NULL,
  location TEXT,
  notes TEXT,
  reminder BOOLEAN NOT NULL DEFAULT false,
  reminder_time TEXT CHECK (reminder_time IN ('1hour', '1day', '2days', '1week')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create kick_counts table
CREATE TABLE public.kick_counts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  count INTEGER NOT NULL DEFAULT 0,
  duration INTEGER, -- in minutes
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contraction_sessions table
CREATE TABLE public.contraction_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contractions table
CREATE TABLE public.contractions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.contraction_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in seconds
  intensity TEXT NOT NULL CHECK (intensity IN ('mild', 'moderate', 'strong')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birth_plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kick_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contraction_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own profile" ON public.profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for symptoms
CREATE POLICY "Users can view their own symptoms" ON public.symptoms
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own symptoms" ON public.symptoms
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own symptoms" ON public.symptoms
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own symptoms" ON public.symptoms
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for moods
CREATE POLICY "Users can view their own moods" ON public.moods
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own moods" ON public.moods
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own moods" ON public.moods
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own moods" ON public.moods
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for nutrition_logs
CREATE POLICY "Users can view their own nutrition logs" ON public.nutrition_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own nutrition logs" ON public.nutrition_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own nutrition logs" ON public.nutrition_logs
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own nutrition logs" ON public.nutrition_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for emergency_contacts
CREATE POLICY "Users can view their own emergency contacts" ON public.emergency_contacts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own emergency contacts" ON public.emergency_contacts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own emergency contacts" ON public.emergency_contacts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own emergency contacts" ON public.emergency_contacts
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for exercises
CREATE POLICY "Users can view their own exercises" ON public.exercises
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own exercises" ON public.exercises
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own exercises" ON public.exercises
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own exercises" ON public.exercises
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for birth_plan_items
CREATE POLICY "Users can view their own birth plan items" ON public.birth_plan_items
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own birth plan items" ON public.birth_plan_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own birth plan items" ON public.birth_plan_items
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own birth plan items" ON public.birth_plan_items
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for appointments
CREATE POLICY "Users can view their own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own appointments" ON public.appointments
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own appointments" ON public.appointments
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for kick_counts
CREATE POLICY "Users can view their own kick counts" ON public.kick_counts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own kick counts" ON public.kick_counts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own kick counts" ON public.kick_counts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own kick counts" ON public.kick_counts
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for contraction_sessions
CREATE POLICY "Users can view their own contraction sessions" ON public.contraction_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own contraction sessions" ON public.contraction_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own contraction sessions" ON public.contraction_sessions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own contraction sessions" ON public.contraction_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for contractions
CREATE POLICY "Users can view their own contractions" ON public.contractions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own contractions" ON public.contractions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own contractions" ON public.contractions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own contractions" ON public.contractions
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();