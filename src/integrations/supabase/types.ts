export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      freelancer_profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          education: string | null
          hourly_rate: number | null
          id: string
          location: string | null
          profile_image_url: string | null
          title: string | null
          updated_at: string | null
          verified: boolean | null
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          education?: string | null
          hourly_rate?: number | null
          id: string
          location?: string | null
          profile_image_url?: string | null
          title?: string | null
          updated_at?: string | null
          verified?: boolean | null
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          education?: string | null
          hourly_rate?: number | null
          id?: string
          location?: string | null
          profile_image_url?: string | null
          title?: string | null
          updated_at?: string | null
          verified?: boolean | null
          years_experience?: number | null
        }
        Relationships: []
      }
      freelancer_skills: {
        Row: {
          created_at: string | null
          freelancer_id: string
          id: string
          skill_id: string
          years_experience: number | null
        }
        Insert: {
          created_at?: string | null
          freelancer_id: string
          id?: string
          skill_id: string
          years_experience?: number | null
        }
        Update: {
          created_at?: string | null
          freelancer_id?: string
          id?: string
          skill_id?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "freelancer_skills_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "freelancer_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freelancer_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_items: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          freelancer_id: string
          id: string
          image_url: string | null
          project_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          freelancer_id: string
          id?: string
          image_url?: string | null
          project_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          freelancer_id?: string
          id?: string
          image_url?: string | null
          project_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_items_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "freelancer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          id: string
          nextbillingdate: string | null
          paymentmethod: string | null
          plan: string
          startdate: string
          status: string
          userid: string
        }
        Insert: {
          created_at?: string
          id?: string
          nextbillingdate?: string | null
          paymentmethod?: string | null
          plan: string
          startdate?: string
          status: string
          userid: string
        }
        Update: {
          created_at?: string
          id?: string
          nextbillingdate?: string | null
          paymentmethod?: string | null
          plan?: string
          startdate?: string
          status?: string
          userid?: string
        }
        Relationships: []
      }
      user_documents: {
        Row: {
          document_type: string
          file_name: string
          file_path: string
          file_size: number
          id: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          document_type: string
          file_name: string
          file_path: string
          file_size: number
          id?: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          alias: string | null
          company_address: Json | null
          company_name: string | null
          company_registration_number: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          role: string | null
        }
        Insert: {
          alias?: string | null
          company_address?: Json | null
          company_name?: string | null
          company_registration_number?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          onboarding_completed?: boolean | null
          role?: string | null
        }
        Update: {
          alias?: string | null
          company_address?: Json | null
          company_name?: string | null
          company_registration_number?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_random_alias: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
