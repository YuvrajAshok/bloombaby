export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          created_at: string
          date: string
          id: string
          location: string | null
          notes: string | null
          reminder: boolean
          reminder_time: string | null
          time: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          location?: string | null
          notes?: string | null
          reminder?: boolean
          reminder_time?: string | null
          time: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          location?: string | null
          notes?: string | null
          reminder?: boolean
          reminder_time?: string | null
          time?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      birth_plan_items: {
        Row: {
          category: string
          created_at: string
          id: string
          notes: string | null
          preference: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          notes?: string | null
          preference: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          notes?: string | null
          preference?: string
          user_id?: string
        }
        Relationships: []
      }
      contraction_sessions: {
        Row: {
          created_at: string
          date: string
          end_time: string | null
          id: string
          is_active: boolean
          start_time: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          end_time?: string | null
          id?: string
          is_active?: boolean
          start_time: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          end_time?: string | null
          id?: string
          is_active?: boolean
          start_time?: string
          user_id?: string
        }
        Relationships: []
      }
      contractions: {
        Row: {
          created_at: string
          date: string
          duration: number | null
          end_time: string | null
          id: string
          intensity: string
          notes: string | null
          session_id: string
          start_time: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          duration?: number | null
          end_time?: string | null
          id?: string
          intensity: string
          notes?: string | null
          session_id: string
          start_time: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          duration?: number | null
          end_time?: string | null
          id?: string
          intensity?: string
          notes?: string | null
          session_id?: string
          start_time?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "contraction_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_contacts: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string
          relationship: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone: string
          relationship: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string
          relationship?: string
          user_id?: string
        }
        Relationships: []
      }
      exercises: {
        Row: {
          created_at: string
          date: string
          duration: number
          id: string
          intensity: string
          notes: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          duration: number
          id?: string
          intensity: string
          notes?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          duration?: number
          id?: string
          intensity?: string
          notes?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      kick_counts: {
        Row: {
          count: number
          created_at: string
          date: string
          duration: number | null
          end_time: string | null
          id: string
          notes: string | null
          start_time: string
          user_id: string
        }
        Insert: {
          count?: number
          created_at?: string
          date?: string
          duration?: number | null
          end_time?: string | null
          id?: string
          notes?: string | null
          start_time: string
          user_id: string
        }
        Update: {
          count?: number
          created_at?: string
          date?: string
          duration?: number | null
          end_time?: string | null
          id?: string
          notes?: string | null
          start_time?: string
          user_id?: string
        }
        Relationships: []
      }
      moods: {
        Row: {
          created_at: string
          date: string
          id: string
          mood: string
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          mood: string
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          mood?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      nutrition_logs: {
        Row: {
          created_at: string
          date: string
          food_items: string[]
          id: string
          meal_type: string
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          food_items: string[]
          id?: string
          meal_type: string
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          food_items?: string[]
          id?: string
          meal_type?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          current_trimester: number | null
          due_date: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_trimester?: number | null
          due_date?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_trimester?: number | null
          due_date?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      symptoms: {
        Row: {
          created_at: string
          date: string
          id: string
          notes: string | null
          severity: string
          symptom_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          severity: string
          symptom_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          severity?: string
          symptom_type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
