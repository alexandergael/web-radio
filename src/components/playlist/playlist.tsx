"use client";

import React, { useState, useEffect } from "react";
import {
  getPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  uploadImage,
} from "../../app/actions/playlist";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Button,
  Card,
  Stack,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import DropdownColor from "../organisme/DropdownColor";
import FileUpload from "../organisme/FileUpload";

interface Playlist {
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

  const handleCreateOrUpdatePlaylist = async (values: any) => {
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
        } else {
          setPlaylists([...playlists, response.playlist]);
        }
        setIsEditing(null);
        setPochetteUrl(null);
        setSelectedFile(null);
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

  const validationSchema = Yup.object().shape({
    name: Yup.string().max(255).required("Obligatoire"),
  });

  return (
    <div>
      <h1>Playlists</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <span>{playlist.name}</span>
            <button onClick={() => handleEditPlaylist(playlist)}>
              Modifier
            </button>
            <button onClick={() => handleDeletePlaylist(playlist.id)}>
              Supprimer
            </button>
          </li>
        ))}
      </ul>

      <Card className="w-full p-4 pb-4 flex items-center gap-4 border-t-2">
        <div className="w-[60%]">
          <Formik
            enableReinitialize
            initialValues={
              isEditing
                ? playlists.find((p) => p.id === isEditing) || initialValues
                : initialValues
            }
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              await handleCreateOrUpdatePlaylist(values);
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              touched,
              values,
            }) => (
              <Form className="w-full" noValidate onSubmit={handleSubmit}>
                <Stack spacing={1}>
                  <InputLabel>Nom de la playliste</InputLabel>
                  <div className="flex gap-4">
                    <OutlinedInput
                      className={`font-poppins ${
                        errors.name ? "text-left border-none" : "text-left "
                      }`}
                      id="name"
                      type="text"
                      value={values.name}
                      name="name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Nom du produit*"
                      fullWidth
                      size="small"
                      error={Boolean(touched.name && errors.name)}
                      endAdornment={
                        <InputAdornment position="end">
                          {touched.name && errors.name && (
                            <FormHelperText
                              className="z-50 border-none"
                              error
                              id="helper-text-name"
                            >
                              {touched.name && errors.name?.toString()}
                            </FormHelperText>
                          )}
                        </InputAdornment>
                      }
                    />
                    <DropdownColor
                      onColorSelect={handleColorSelect}
                      selectedColor={selectedColor}
                    />
                  </div>
                </Stack>
                <Button type="submit" variant="contained">
                  {isEditing ? "Modifier" : "Créer"}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
        <div className="w-[30%]">
          <FileUpload onFileSelected={handleFileSelected} />
        </div>
      </Card>
    </div>
  );
};

export default PlaylistComponent;
