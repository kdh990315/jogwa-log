import type { ApiSupabaseClient } from "../../supabase/client";
import type { Database } from "../../supabase/databaseTypes";

export type CreateLogInput =
  Database["public"]["Functions"]["create_fishing_log"]["Args"];
export type FishingLogImageInsert =
  Database["public"]["Tables"]["fishing_log_images"]["Insert"];

export const FISHING_LOG_IMAGES_BUCKET = "fishing-log-images";

const IMAGE_EXTENSION_BY_CONTENT_TYPE = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

interface UploadLogImagesInput {
  images: readonly File[];
  logId: number;
}

export async function createLog(
  client: ApiSupabaseClient,
  input: CreateLogInput,
): Promise<number> {
  const { data, error } = await client.rpc("create_fishing_log", input);

  if (error) {
    throw error;
  }

  if (data === null) {
    throw new Error("CREATE_LOG_FAILED");
  }

  return data;
}

export async function deleteLog(
  client: ApiSupabaseClient,
  logId: number,
): Promise<void> {
  const { error } = await client.from("fishing_logs").delete().eq("id", logId);

  if (error) {
    throw error;
  }
}

export async function uploadLogImages(
  client: ApiSupabaseClient,
  { images, logId }: UploadLogImagesInput,
): Promise<void> {
  if (images.length === 0) {
    return;
  }

  const { data, error } = await client.auth.getUser();

  if (error) {
    throw error;
  }

  const userId = data.user?.id;

  if (!userId) {
    throw new Error("AUTH_REQUIRED");
  }

  const uploadedPaths: string[] = [];
  const imageRows: FishingLogImageInsert[] = [];

  try {
    for (const [index, image] of images.entries()) {
      const storagePath = createLogImageStoragePath({
        file: image,
        logId,
        userId,
      });
      const { error: uploadError } = await client.storage
        .from(FISHING_LOG_IMAGES_BUCKET)
        .upload(storagePath, image, {
          contentType: image.type,
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      uploadedPaths.push(storagePath);
      imageRows.push({
        content_type: image.type,
        log_id: logId,
        original_file_name: image.name,
        size_bytes: image.size,
        sort_order: index,
        storage_bucket: FISHING_LOG_IMAGES_BUCKET,
        storage_path: storagePath,
        user_id: userId,
      });
    }

    const { error: insertError } = await client
      .from("fishing_log_images")
      .insert(imageRows);

    if (insertError) {
      throw insertError;
    }
  } catch (error) {
    if (uploadedPaths.length > 0) {
      await client.storage.from(FISHING_LOG_IMAGES_BUCKET).remove(uploadedPaths);
    }

    throw error;
  }
}

function createLogImageStoragePath({
  file,
  logId,
  userId,
}: {
  file: File;
  logId: number;
  userId: string;
}) {
  const extension =
    IMAGE_EXTENSION_BY_CONTENT_TYPE[
      file.type as keyof typeof IMAGE_EXTENSION_BY_CONTENT_TYPE
    ];

  if (!extension) {
    throw new Error("UNSUPPORTED_IMAGE_TYPE");
  }

  return `${userId}/${logId}/${crypto.randomUUID()}.${extension}`;
}
