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
      blood_banks: {
        Row: {
          bank_id: number
          contact_number: string | null
          location: string
          name: string
        }
        Insert: {
          bank_id?: number
          contact_number?: string | null
          location: string
          name: string
        }
        Update: {
          bank_id?: number
          contact_number?: string | null
          location?: string
          name?: string
        }
        Relationships: []
      }
      blood_groups: {
        Row: {
          blood_group_id: number
          group_name: string
        }
        Insert: {
          blood_group_id?: number
          group_name: string
        }
        Update: {
          blood_group_id?: number
          group_name?: string
        }
        Relationships: []
      }
      blood_stock: {
        Row: {
          bank_id: number | null
          blood_group_id: number | null
          blood_units: number
          expiry_date: string | null
          status: string
          stock_id: number
          storage_location: string | null
        }
        Insert: {
          bank_id?: number | null
          blood_group_id?: number | null
          blood_units?: number
          expiry_date?: string | null
          status?: string
          stock_id?: number
          storage_location?: string | null
        }
        Update: {
          bank_id?: number | null
          blood_group_id?: number | null
          blood_units?: number
          expiry_date?: string | null
          status?: string
          stock_id?: number
          storage_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blood_stock_bank_id_fkey"
            columns: ["bank_id"]
            isOneToOne: false
            referencedRelation: "blood_banks"
            referencedColumns: ["bank_id"]
          },
          {
            foreignKeyName: "blood_stock_blood_group_id_fkey"
            columns: ["blood_group_id"]
            isOneToOne: false
            referencedRelation: "blood_groups"
            referencedColumns: ["blood_group_id"]
          },
          {
            foreignKeyName: "fk_stock_bank"
            columns: ["bank_id"]
            isOneToOne: false
            referencedRelation: "blood_banks"
            referencedColumns: ["bank_id"]
          },
          {
            foreignKeyName: "fk_stock_group"
            columns: ["blood_group_id"]
            isOneToOne: false
            referencedRelation: "blood_groups"
            referencedColumns: ["blood_group_id"]
          },
        ]
      }
      camps: {
        Row: {
          camp_date: string
          camp_id: number
          location: string
          organizer: string
          total_donors: number
        }
        Insert: {
          camp_date: string
          camp_id?: number
          location: string
          organizer: string
          total_donors?: number
        }
        Update: {
          camp_date?: string
          camp_id?: number
          location?: string
          organizer?: string
          total_donors?: number
        }
        Relationships: []
      }
      donation_records: {
        Row: {
          bank_id: number | null
          donation_date: string
          donation_id: number
          donor_id: number | null
          units_donated: number
        }
        Insert: {
          bank_id?: number | null
          donation_date?: string
          donation_id?: number
          donor_id?: number | null
          units_donated?: number
        }
        Update: {
          bank_id?: number | null
          donation_date?: string
          donation_id?: number
          donor_id?: number | null
          units_donated?: number
        }
        Relationships: [
          {
            foreignKeyName: "donation_records_bank_id_fkey"
            columns: ["bank_id"]
            isOneToOne: false
            referencedRelation: "blood_banks"
            referencedColumns: ["bank_id"]
          },
          {
            foreignKeyName: "donation_records_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["donor_id"]
          },
          {
            foreignKeyName: "fk_don_bank"
            columns: ["bank_id"]
            isOneToOne: false
            referencedRelation: "blood_banks"
            referencedColumns: ["bank_id"]
          },
          {
            foreignKeyName: "fk_don_donor"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["donor_id"]
          },
        ]
      }
      donors: {
        Row: {
          age: number
          blood_group_id: number | null
          contact_number: string | null
          donor_id: number
          email: string | null
          gender: string
          last_donation_date: string | null
          name: string
          status: string
          weight: number
        }
        Insert: {
          age: number
          blood_group_id?: number | null
          contact_number?: string | null
          donor_id?: number
          email?: string | null
          gender: string
          last_donation_date?: string | null
          name: string
          status?: string
          weight: number
        }
        Update: {
          age?: number
          blood_group_id?: number | null
          contact_number?: string | null
          donor_id?: number
          email?: string | null
          gender?: string
          last_donation_date?: string | null
          name?: string
          status?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "donors_blood_group_id_fkey"
            columns: ["blood_group_id"]
            isOneToOne: false
            referencedRelation: "blood_groups"
            referencedColumns: ["blood_group_id"]
          },
          {
            foreignKeyName: "fk_donors_group"
            columns: ["blood_group_id"]
            isOneToOne: false
            referencedRelation: "blood_groups"
            referencedColumns: ["blood_group_id"]
          },
        ]
      }
      eligibility_logs: {
        Row: {
          donor_id: number | null
          eligibility_status: string
          log_date: string
          log_id: number
          screening_id: number | null
        }
        Insert: {
          donor_id?: number | null
          eligibility_status: string
          log_date?: string
          log_id?: number
          screening_id?: number | null
        }
        Update: {
          donor_id?: number | null
          eligibility_status?: string
          log_date?: string
          log_id?: number
          screening_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "eligibility_logs_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["donor_id"]
          },
          {
            foreignKeyName: "eligibility_logs_screening_id_fkey"
            columns: ["screening_id"]
            isOneToOne: false
            referencedRelation: "screenings"
            referencedColumns: ["screening_id"]
          },
          {
            foreignKeyName: "fk_elog_donor"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["donor_id"]
          },
          {
            foreignKeyName: "fk_elog_screen"
            columns: ["screening_id"]
            isOneToOne: false
            referencedRelation: "screenings"
            referencedColumns: ["screening_id"]
          },
        ]
      }
      emergency_requests: {
        Row: {
          blood_group_id: number | null
          hospital_id: number | null
          priority_level: string
          request_id: number
          request_time: string
          status: string
          units_required: number
        }
        Insert: {
          blood_group_id?: number | null
          hospital_id?: number | null
          priority_level?: string
          request_id?: number
          request_time?: string
          status?: string
          units_required: number
        }
        Update: {
          blood_group_id?: number | null
          hospital_id?: number | null
          priority_level?: string
          request_id?: number
          request_time?: string
          status?: string
          units_required?: number
        }
        Relationships: [
          {
            foreignKeyName: "emergency_requests_blood_group_id_fkey"
            columns: ["blood_group_id"]
            isOneToOne: false
            referencedRelation: "blood_groups"
            referencedColumns: ["blood_group_id"]
          },
          {
            foreignKeyName: "emergency_requests_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["hospital_id"]
          },
          {
            foreignKeyName: "fk_er_group"
            columns: ["blood_group_id"]
            isOneToOne: false
            referencedRelation: "blood_groups"
            referencedColumns: ["blood_group_id"]
          },
          {
            foreignKeyName: "fk_er_hosp"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["hospital_id"]
          },
        ]
      }
      hospitals: {
        Row: {
          contact_number: string | null
          hospital_id: number
          location: string
          name: string
        }
        Insert: {
          contact_number?: string | null
          hospital_id?: number
          location: string
          name: string
        }
        Update: {
          contact_number?: string | null
          hospital_id?: number
          location?: string
          name?: string
        }
        Relationships: []
      }
      screenings: {
        Row: {
          blood_pressure: string | null
          disease_history: string | null
          donor_id: number | null
          screening_date: string
          screening_id: number
          screening_result: string
          status: string
          temperature: number | null
        }
        Insert: {
          blood_pressure?: string | null
          disease_history?: string | null
          donor_id?: number | null
          screening_date?: string
          screening_id?: number
          screening_result?: string
          status?: string
          temperature?: number | null
        }
        Update: {
          blood_pressure?: string | null
          disease_history?: string | null
          donor_id?: number | null
          screening_date?: string
          screening_id?: number
          screening_result?: string
          status?: string
          temperature?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_screen_donor"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["donor_id"]
          },
          {
            foreignKeyName: "screenings_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["donor_id"]
          },
        ]
      }
      staff: {
        Row: {
          availability: string
          contact_number: string | null
          email: string | null
          name: string
          role: string
          staff_id: number
        }
        Insert: {
          availability?: string
          contact_number?: string | null
          email?: string | null
          name: string
          role: string
          staff_id?: number
        }
        Update: {
          availability?: string
          contact_number?: string | null
          email?: string | null
          name?: string
          role?: string
          staff_id?: number
        }
        Relationships: []
      }
      transfer_records: {
        Row: {
          blood_group_id: number | null
          from_bank_id: number | null
          to_bank_id: number | null
          transfer_date: string
          transfer_id: number
          units_transferred: number
        }
        Insert: {
          blood_group_id?: number | null
          from_bank_id?: number | null
          to_bank_id?: number | null
          transfer_date?: string
          transfer_id?: number
          units_transferred: number
        }
        Update: {
          blood_group_id?: number | null
          from_bank_id?: number | null
          to_bank_id?: number | null
          transfer_date?: string
          transfer_id?: number
          units_transferred?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_tr_from"
            columns: ["from_bank_id"]
            isOneToOne: false
            referencedRelation: "blood_banks"
            referencedColumns: ["bank_id"]
          },
          {
            foreignKeyName: "fk_tr_group"
            columns: ["blood_group_id"]
            isOneToOne: false
            referencedRelation: "blood_groups"
            referencedColumns: ["blood_group_id"]
          },
          {
            foreignKeyName: "fk_tr_to"
            columns: ["to_bank_id"]
            isOneToOne: false
            referencedRelation: "blood_banks"
            referencedColumns: ["bank_id"]
          },
          {
            foreignKeyName: "transfer_records_blood_group_id_fkey"
            columns: ["blood_group_id"]
            isOneToOne: false
            referencedRelation: "blood_groups"
            referencedColumns: ["blood_group_id"]
          },
          {
            foreignKeyName: "transfer_records_from_bank_id_fkey"
            columns: ["from_bank_id"]
            isOneToOne: false
            referencedRelation: "blood_banks"
            referencedColumns: ["bank_id"]
          },
          {
            foreignKeyName: "transfer_records_to_bank_id_fkey"
            columns: ["to_bank_id"]
            isOneToOne: false
            referencedRelation: "blood_banks"
            referencedColumns: ["bank_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_donor_eligibility: { Args: { _donor_id: number }; Returns: string }
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
