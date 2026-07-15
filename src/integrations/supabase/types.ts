export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      barber_breaks: {
        Row: {
          barber_id: string
          day_of_week: number
          end_time: string
          id: string
          label: string | null
          start_time: string
        }
        Insert: {
          barber_id: string
          day_of_week: number
          end_time: string
          id?: string
          label?: string | null
          start_time: string
        }
        Update: {
          barber_id?: string
          day_of_week?: number
          end_time?: string
          id?: string
          label?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "barber_breaks_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
        ]
      }
      barber_schedules: {
        Row: {
          active: boolean
          barber_id: string
          day_of_week: number
          end_time: string
          id: string
          start_time: string
        }
        Insert: {
          active?: boolean
          barber_id: string
          day_of_week: number
          end_time: string
          id?: string
          start_time: string
        }
        Update: {
          active?: boolean
          barber_id?: string
          day_of_week?: number
          end_time?: string
          id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "barber_schedules_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
        ]
      }
      barbers: {
        Row: {
          active: boolean
          bio: string | null
          created_at: string
          id: string
          image_url: string | null
          name: string
          role: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          bio?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          role?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          bio?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          role?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      booking_settings: {
        Row: {
          buffer_minutes: number
          horizon_days: number
          id: boolean
          min_notice_minutes: number
          slot_step_minutes: number
          timezone: string
          updated_at: string
        }
        Insert: {
          buffer_minutes?: number
          horizon_days?: number
          id?: boolean
          min_notice_minutes?: number
          slot_step_minutes?: number
          timezone?: string
          updated_at?: string
        }
        Update: {
          buffer_minutes?: number
          horizon_days?: number
          id?: boolean
          min_notice_minutes?: number
          slot_step_minutes?: number
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          barber_id: string
          confirmation_code: string
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          duration_minutes_at_booking: number
          end_at: string
          id: string
          notes: string | null
          price_cents_at_booking: number
          service_id: string
          start_at: string
          status: string
          updated_at: string
        }
        Insert: {
          barber_id: string
          confirmation_code?: string
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          duration_minutes_at_booking: number
          end_at: string
          id?: string
          notes?: string | null
          price_cents_at_booking: number
          service_id: string
          start_at: string
          status?: string
          updated_at?: string
        }
        Update: {
          barber_id?: string
          confirmation_code?: string
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          duration_minutes_at_booking?: number
          end_at?: string
          id?: string
          notes?: string | null
          price_cents_at_booking?: number
          service_id?: string
          start_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      business_hours: {
        Row: {
          close_time: string | null
          closed: boolean
          day_of_week: number
          open_time: string | null
        }
        Insert: {
          close_time?: string | null
          closed?: boolean
          day_of_week: number
          open_time?: string | null
        }
        Update: {
          close_time?: string | null
          closed?: boolean
          day_of_week?: number
          open_time?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean
          category: string
          created_at: string
          duration_minutes: number
          id: string
          name: string
          price_cents: number
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          category: string
          created_at?: string
          duration_minutes: number
          id?: string
          name: string
          price_cents: number
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          duration_minutes?: number
          id?: string
          name?: string
          price_cents?: number
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      time_off: {
        Row: {
          barber_id: string | null
          created_at: string
          ends_at: string
          id: string
          kind: string
          reason: string | null
          starts_at: string
        }
        Insert: {
          barber_id?: string | null
          created_at?: string
          ends_at: string
          id?: string
          kind?: string
          reason?: string | null
          starts_at: string
        }
        Update: {
          barber_id?: string | null
          created_at?: string
          ends_at?: string
          id?: string
          kind?: string
          reason?: string | null
          starts_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_off_barber_id_fkey"
            columns: ["barber_id"]
            isOneToOne: false
            referencedRelation: "barbers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_busy_slots: {
        Args: { p_barber_ids: string[]; p_from: string; p_to: string }
        Returns: {
          barber_id: string
          end_at: string
          start_at: string
          status: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "staff" | "customer"
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
    Enums: {
      app_role: ["admin", "staff", "customer"],
    },
  },
} as const
