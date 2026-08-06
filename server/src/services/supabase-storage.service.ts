import { randomUUID } from "crypto";
import path from "path";

import { supabase } from "../config/supabase";


export async function uploadToSupabase(
  file: Express.Multer.File
) {
  const extension = path.extname(file.originalname);

  const fileName = `${randomUUID()}${extension}`;

  const { error } = await supabase.storage
    .from("documents")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    console.error(error);
    throw error;
  }

  const { data } = supabase.storage
    .from("documents")
    .getPublicUrl(fileName);

  return {
    fileUrl: data.publicUrl,
    publicId: fileName,
  };
}

export async function deleteFromSupabase(
  publicId: string
) {
  const { error } =
    await supabase.storage
      .from("documents")
      .remove([publicId]);

  if (error) {
    throw error;
  }
}