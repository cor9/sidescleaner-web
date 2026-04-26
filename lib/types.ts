export type Script = {
  id: string;
  project_title: string | null;
  project_type: string | null;
  production_format: string | null;
  genre: string[];
  tone: string | null;
  logline: string | null;
  synopsis: string | null;
  scene_summary: string | null;
  scene_count: number | null;
  extraction_notes: string | null;
  source_filename: string;
  storage_path: string;
  storage_url: string | null;
  raw_extraction: any;
  created_at: string;
};

export type Role = {
  id: string;
  script_id: string;
  name: string | null;
  age_range: string | null;
  gender: string | null;
  description: string | null;
  is_lead_in_scene: boolean;
  created_at: string;
};

export type ScriptWithRoles = Script & { roles: Role[] };

export type Filters = {
  q?: string;
  project_type?: string;
  production_format?: string;
  gender?: string;
  age_range?: string;
  genre?: string;
  lead_only?: boolean;
};

export const PROJECT_TYPES = [
  { value: "feature_film", label: "Feature Film" },
  { value: "tv_pilot", label: "TV Pilot" },
  { value: "tv_episodic", label: "TV Episodic" },
  { value: "short_film", label: "Short Film" },
  { value: "commercial", label: "Commercial" },
  { value: "other", label: "Other" },
];

export const PRODUCTION_FORMATS = [
  { value: "single_cam", label: "Single-Cam" },
  { value: "multi_cam", label: "Multi-Cam" },
  { value: "film", label: "Film" },
  { value: "unknown", label: "Unknown" },
];

export const AGE_BUCKETS = [
  { value: "0-5", label: "0–5", regex: "\\m([0-5])\\M|infant|toddler|preschool" },
  { value: "6-9", label: "6–9", regex: "\\m([6-9])\\M|elementary" },
  { value: "10-12", label: "10–12", regex: "\\m(1[0-2])\\M|tween|middle school|preteen" },
  { value: "13-15", label: "13–15", regex: "\\m(1[3-5])\\M|teen" },
  { value: "16-18", label: "16–18", regex: "\\m(1[6-8])\\M|teen|high school" },
  { value: "19-25", label: "19–25", regex: "\\m(19|2[0-5])\\M|young adult|college|early 20s" },
  { value: "26-35", label: "26–35", regex: "\\m(2[6-9]|3[0-5])\\M|late 20s|early 30s|adult" },
  { value: "36-50", label: "36–50", regex: "\\m(3[6-9]|4[0-9]|50)\\M|middle.?age|40s|late 30s" },
  { value: "50+", label: "50+", regex: "\\m(5[0-9]|6[0-9]|7[0-9]|8[0-9])\\M|senior|elderly" },
];
