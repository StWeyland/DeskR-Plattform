export type ProgrammStatus = "aktiv" | "in_aufbau" | "kostenlos";

export type SessionMaterialTyp = "video" | "workbook" | "datei" | "link";

export type AssistenzStatusWert = "offen" | "in_bearbeitung" | "abgeschlossen";

export interface Database {
  public: {
    Tables: {
      programme: {
        Row: {
          id: string;
          slug: string;
          titel: string;
          untertitel: string | null;
          beschreibung: string | null;
          status: ProgrammStatus;
          reihenfolge: number;
          teaser_aktiv: boolean;
          preis_anzeigen: boolean;
          preis_cent: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          titel: string;
          untertitel?: string | null;
          beschreibung?: string | null;
          status?: ProgrammStatus;
          reihenfolge?: number;
          teaser_aktiv?: boolean;
          preis_anzeigen?: boolean;
          preis_cent?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          titel?: string;
          untertitel?: string | null;
          beschreibung?: string | null;
          status?: ProgrammStatus;
          reihenfolge?: number;
          teaser_aktiv?: boolean;
          preis_anzeigen?: boolean;
          preis_cent?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      sessions: {
        Row: {
          id: string;
          programm_id: string;
          titel: string;
          beschreibung: string | null;
          reihenfolge: number;
          veroeffentlicht: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          programm_id: string;
          titel: string;
          beschreibung?: string | null;
          reihenfolge?: number;
          veroeffentlicht?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          programm_id?: string;
          titel?: string;
          beschreibung?: string | null;
          reihenfolge?: number;
          veroeffentlicht?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "sessions_programm_id_fkey";
            columns: ["programm_id"];
            referencedRelation: "programme";
            referencedColumns: ["id"];
          },
        ];
      };
      session_material: {
        Row: {
          id: string;
          session_id: string;
          typ: SessionMaterialTyp;
          titel: string;
          url: string | null;
          reihenfolge: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          typ: SessionMaterialTyp;
          titel: string;
          url?: string | null;
          reihenfolge?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          typ?: SessionMaterialTyp;
          titel?: string;
          url?: string | null;
          reihenfolge?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "session_material_session_id_fkey";
            columns: ["session_id"];
            referencedRelation: "sessions";
            referencedColumns: ["id"];
          },
        ];
      };
      assistenzen: {
        Row: {
          id: string;
          user_id: string | null;
          email: string;
          name: string | null;
          eingeladen_am: string;
          erstellt_am: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          email: string;
          name?: string | null;
          eingeladen_am?: string;
          erstellt_am?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          email?: string;
          name?: string | null;
          eingeladen_am?: string;
          erstellt_am?: string;
        };
        Relationships: [];
      };
      assistenz_programme: {
        Row: {
          id: string;
          assistenz_id: string;
          programm_id: string;
          zugeordnet_am: string;
        };
        Insert: {
          id?: string;
          assistenz_id: string;
          programm_id: string;
          zugeordnet_am?: string;
        };
        Update: {
          id?: string;
          assistenz_id?: string;
          programm_id?: string;
          zugeordnet_am?: string;
        };
        Relationships: [
          {
            foreignKeyName: "assistenz_programme_assistenz_id_fkey";
            columns: ["assistenz_id"];
            referencedRelation: "assistenzen";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "assistenz_programme_programm_id_fkey";
            columns: ["programm_id"];
            referencedRelation: "programme";
            referencedColumns: ["id"];
          },
        ];
      };
      assistenz_status: {
        Row: {
          id: string;
          assistenz_id: string;
          session_id: string;
          status: AssistenzStatusWert;
          aktualisiert_am: string;
        };
        Insert: {
          id?: string;
          assistenz_id: string;
          session_id: string;
          status?: AssistenzStatusWert;
          aktualisiert_am?: string;
        };
        Update: {
          id?: string;
          assistenz_id?: string;
          session_id?: string;
          status?: AssistenzStatusWert;
          aktualisiert_am?: string;
        };
        Relationships: [
          {
            foreignKeyName: "assistenz_status_assistenz_id_fkey";
            columns: ["assistenz_id"];
            referencedRelation: "assistenzen";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "assistenz_status_session_id_fkey";
            columns: ["session_id"];
            referencedRelation: "sessions";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Programm = Database["public"]["Tables"]["programme"]["Row"];
export type Session = Database["public"]["Tables"]["sessions"]["Row"];
export type SessionMaterial = Database["public"]["Tables"]["session_material"]["Row"];
export type Assistenz = Database["public"]["Tables"]["assistenzen"]["Row"];
export type AssistenzProgramm = Database["public"]["Tables"]["assistenz_programme"]["Row"];
export type AssistenzStatus = Database["public"]["Tables"]["assistenz_status"]["Row"];
