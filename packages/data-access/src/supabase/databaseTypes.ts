export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4";
  };
  public: {
    Tables: {
      field_types: {
        Row: {
          id: number;
          name: string | null;
        };
        Insert: {
          id?: number;
          name?: string | null;
        };
        Update: {
          id?: number;
          name?: string | null;
        };
        Relationships: [];
      };
      fish: {
        Row: {
          field_type_id: number | null;
          id: number;
          name: string | null;
        };
        Insert: {
          field_type_id?: number | null;
          id?: number;
          name?: string | null;
        };
        Update: {
          field_type_id?: number | null;
          id?: number;
          name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fish_field_type_id_fkey";
            columns: ["field_type_id"];
            isOneToOne: false;
            referencedRelation: "field_types";
            referencedColumns: ["id"];
          },
        ];
      };
      fishing_log_catches: {
        Row: {
          catch_count: number;
          created_at: string;
          custom_fish_name: string | null;
          fish_id: number | null;
          id: number;
          log_id: number;
          max_size_cm: number | null;
        };
        Insert: {
          catch_count: number;
          created_at?: string;
          custom_fish_name?: string | null;
          fish_id?: number | null;
          id?: number;
          log_id: number;
          max_size_cm?: number | null;
        };
        Update: {
          catch_count?: number;
          created_at?: string;
          custom_fish_name?: string | null;
          fish_id?: number | null;
          id?: number;
          log_id?: number;
          max_size_cm?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "fishing_log_catches_fish_id_fkey";
            columns: ["fish_id"];
            isOneToOne: false;
            referencedRelation: "fish";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fishing_log_catches_log_id_fkey";
            columns: ["log_id"];
            isOneToOne: false;
            referencedRelation: "fishing_logs";
            referencedColumns: ["id"];
          },
        ];
      };
      fishing_logs: {
        Row: {
          created_at: string;
          custom_target_fish_name: string | null;
          field_type_id: number;
          id: number;
          latitude: number | null;
          location_name: string | null;
          longitude: number | null;
          memo: string | null;
          method: string | null;
          occurred_at: string;
          target_fish_id: number | null;
          tide: string | null;
          updated_at: string;
          user_id: string;
          water_temperature_c: number | null;
          weather: string | null;
        };
        Insert: {
          created_at?: string;
          custom_target_fish_name?: string | null;
          field_type_id: number;
          id?: number;
          latitude?: number | null;
          location_name?: string | null;
          longitude?: number | null;
          memo?: string | null;
          method?: string | null;
          occurred_at: string;
          target_fish_id?: number | null;
          tide?: string | null;
          updated_at?: string;
          user_id: string;
          water_temperature_c?: number | null;
          weather?: string | null;
        };
        Update: {
          created_at?: string;
          custom_target_fish_name?: string | null;
          field_type_id?: number;
          id?: number;
          latitude?: number | null;
          location_name?: string | null;
          longitude?: number | null;
          memo?: string | null;
          method?: string | null;
          occurred_at?: string;
          target_fish_id?: number | null;
          tide?: string | null;
          updated_at?: string;
          user_id?: string;
          water_temperature_c?: number | null;
          weather?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fishing_logs_field_type_id_fkey";
            columns: ["field_type_id"];
            isOneToOne: false;
            referencedRelation: "field_types";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fishing_logs_target_fish_field_type_fkey";
            columns: ["target_fish_id", "field_type_id"];
            isOneToOne: false;
            referencedRelation: "fish";
            referencedColumns: ["id", "field_type_id"];
          },
        ];
      };
      profiles: {
        Row: {
          birth_year: number | null;
          created_at: string;
          id: string;
          main_genre: string | null;
          nickname: string | null;
        };
        Insert: {
          birth_year?: number | null;
          created_at?: string;
          id: string;
          main_genre?: string | null;
          nickname?: string | null;
        };
        Update: {
          birth_year?: number | null;
          created_at?: string;
          id?: string;
          main_genre?: string | null;
          nickname?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_fishing_log: {
        Args: {
          p_catch_count?: number | null;
          p_custom_target_fish_name?: string | null;
          p_field_type_id: number;
          p_latitude?: number | null;
          p_location_name?: string | null;
          p_longitude?: number | null;
          p_max_size_cm?: number | null;
          p_memo?: string | null;
          p_method?: string | null;
          p_occurred_at: string;
          p_target_fish_id?: number | null;
          p_tide?: string | null;
          p_water_temperature_c?: number | null;
          p_weather?: string | null;
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
