"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/prisma";

interface Playlist {
  id: number;
  name: string;
  color: string;
  pochetteUrl: string | null;
}

export async function getPlaylists(): Promise<
  { playlists: Playlist[] } | { error: unknown; message: string }
> {
  try {
    const playlists = await prisma.playlist.findMany();
    return { playlists };
  } catch (error: unknown) {
    return { error, message: "Failed to fetch playlists" };
  }
}

export async function createPlaylist(
  formData: FormData
): Promise<{ playlist: Playlist } | { error: unknown; message: string }> {
  try {
    const name = formData.get("name") as string;
    const color = formData.get("color") as string;
    const pochetteUrl = formData.get("pochetteUrl") as string | null;

    const playlist = await prisma.playlist.create({
      data: { name, color, pochetteUrl },
    });

    revalidatePath("/");
    return { playlist };
  } catch (error: unknown) {
    return { error, message: "Failed to create playlist" };
  }
}

export async function updatePlaylist(
  formData: FormData
): Promise<{ playlist: Playlist } | { error: unknown; message: string }> {
  try {
    const id = parseInt(formData.get("id") as string);
    const name = formData.get("name") as string;
    const color = formData.get("color") as string;
    const pochetteUrl = formData.get("pochetteUrl") as string | null;

    const playlist = await prisma.playlist.update({
      where: { id },
      data: { name, color, pochetteUrl },
    });

    revalidatePath("/");
    return { playlist };
  } catch (error: unknown) {
    return { error, message: "Failed to update playlist" };
  }
}

export async function deletePlaylist(
  formData: FormData
): Promise<{ success: boolean } | { error: unknown; message: string }> {
  try {
    const id = parseInt(formData.get("id") as string);

    await prisma.playlist.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: unknown) {
    return { error, message: "Failed to delete playlist" };
  }
}
