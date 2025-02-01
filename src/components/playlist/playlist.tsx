"use client";

import React, { useState, useEffect } from "react";
import {
  getPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  uploadImage,
} from "../../app/actions/playlist";
import { FormikHelpers } from "formik";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PlaylistList from "./PlaylistList";
import PlaylistForm from "./PlaylistForm";

export interface Playlist {
  id: number;
  name: string;
  color: string;
  pochetteUrl: string | null;
}

const PlaylistComponent = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [pochetteUrl, setPochetteUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await getPlaylists();
        if ("playlists" in response) {
          setPlaylists(response.playlists);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error(error);
        setError("Une erreur s'est produite lors du chargement des playlists.");
      }
    };
    fetchPlaylists();
  }, []);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleFileSelected = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleCreateOrUpdatePlaylist = async (
    values: any,
    formikHelpers: FormikHelpers<any>
  ) => {
    try {
      let imageUrl = pochetteUrl;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const response = await uploadImage(formData);
        if ("url" in response) {
          imageUrl = response.url;
        } else {
          console.error("Upload failed:", response.message);
          return;
        }
      }

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("color", selectedColor || "");
      formData.append("pochetteUrl", imageUrl || "");

      let response;
      if (isEditing) {
        formData.append("id", isEditing.toString());
        response = await updatePlaylist(formData);
      } else {
        response = await createPlaylist(formData);
      }

      if ("playlist" in response) {
        if (isEditing) {
          setPlaylists(
            playlists.map((p) => (p.id === isEditing ? response.playlist : p))
          );
          toast.success("Playlist mise à jour avec succès!");
        } else {
          setPlaylists([...playlists, response.playlist]);
          toast.success("Playlist créée avec succès!");
        }
        setIsEditing(null);
        setPochetteUrl(null);
        setSelectedFile(null);
        formikHelpers.resetForm();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(error);
      setError(
        `Une erreur s'est produite lors de ${
          isEditing ? "la mise à jour" : "la création"
        } de la playlist.`
      );
    }
  };

  const handleDeletePlaylist = async (id: number) => {
    try {
      const formData = new FormData();
      formData.append("id", id.toString());

      const response = await deletePlaylist(formData);
      if (
        (response as { success: boolean; error?: { message: string } }).success
      ) {
        setPlaylists(playlists.filter((p) => p.id !== id));
      } else {
        throw new Error(
          (response as { error?: { message: string } }).error?.message ||
            "Une erreur s'est produite lors de la suppression."
        );
      }
    } catch (error) {
      console.error(error);
      setError("Une erreur s'est produite lors de la suppression.");
    }
  };

  const handleEditPlaylist = (playlist: Playlist) => {
    setIsEditing(playlist.id);
    setSelectedColor(playlist.color);
    setPochetteUrl(playlist.pochetteUrl);
  };

  const initialValues = {
    name: "",
  };

  return (
    <div>
      <h1>Playlists</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ToastContainer />
      <PlaylistList
        playlists={playlists}
        onEditPlaylist={handleEditPlaylist}
        onDeletePlaylist={handleDeletePlaylist}
      />
      <PlaylistForm
        initialValues={initialValues}
        isEditing={isEditing}
        selectedColor={selectedColor}
        pochetteUrl={pochetteUrl}
        onColorSelect={handleColorSelect}
        onFileSelected={handleFileSelected}
        onSubmit={handleCreateOrUpdatePlaylist}
        playlists={playlists}
      />
    </div>
  );
};

export default PlaylistComponent;
