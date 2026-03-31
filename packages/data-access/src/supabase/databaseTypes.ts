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
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
