import type { ApiSupabaseClient } from "../../supabase/client";
import type { Database } from "../../supabase/databaseTypes";

export type FieldTypeRow = Database["public"]["Tables"]["field_types"]["Row"];

export async function getFieldTypes(
  client: ApiSupabaseClient,
): Promise<FieldTypeRow[]> {
  const { data, error } = await client
    .from("field_types")
    .select("id, name")
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}
