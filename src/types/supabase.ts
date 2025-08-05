// types/supabase.ts or lib/database.types.ts

export type JsonPrimitive = string | number | boolean | null;
export type Json = JsonPrimitive | Json[] | { [key: string]: Json };

export interface Database {
  public: {
    Tables: {
      reflections: {
        Row: {
          id: string;
          content: string;
          mood: string | null;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          mood?: string | null;
          user_id: string;
          created_at?: string;
        };
        Update: {
          content?: string;
          mood?: string | null;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reflections_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      reflection_comments: {
        Row: {
          id: string;
          reflection_id: string;
          user_id: string;
          comment: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          reflection_id: string;
          user_id: string;
          comment: string;
          created_at?: string;
        };
        Update: {
          comment?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reflection_comments_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reflection_comments_reflection_id_fkey";
            columns: ["reflection_id"];
            referencedRelation: "reflections";
            referencedColumns: ["id"];
          }
        ];
      };

      likes: {
        Row: {
          id: string;
          user_id: string;
          reflection_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          reflection_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          reflection_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "likes_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "likes_reflection_id_fkey";
            columns: ["reflection_id"];
            referencedRelation: "reflections";
            referencedColumns: ["id"];
          }
        ];
      };
    };

    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
    Enums: Record<string, unknown>;
    CompositeTypes: Record<string, unknown>;
  };
}
