"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToSupabase = uploadToSupabase;
exports.deleteFromSupabase = deleteFromSupabase;
const crypto_1 = require("crypto");
const path_1 = __importDefault(require("path"));
const supabase_1 = require("../config/supabase");
async function uploadToSupabase(file) {
    const extension = path_1.default.extname(file.originalname);
    const fileName = `${(0, crypto_1.randomUUID)()}${extension}`;
    const { error } = await supabase_1.supabase.storage
        .from("documents")
        .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
    });
    if (error) {
        console.error(error);
        throw error;
    }
    const { data } = supabase_1.supabase.storage
        .from("documents")
        .getPublicUrl(fileName);
    return {
        fileUrl: data.publicUrl,
        publicId: fileName,
    };
}
async function deleteFromSupabase(publicId) {
    const { error } = await supabase_1.supabase.storage
        .from("documents")
        .remove([publicId]);
    if (error) {
        throw error;
    }
}
