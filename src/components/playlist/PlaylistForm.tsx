"use client";

import React, { useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  Button,
  Card,
  Stack,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
  Box,
} from "@mui/material";
import DropdownColor from "../organisme/DropdownColor";
import FileUpload from "../organisme/FileUpload";
import { Playlist } from "./playlist";

interface PlaylistFormProps {
  initialValues: { name: string };
  isEditing: number | null;
  selectedColor: string | null;
  pochetteUrl: string | null;
  onColorSelect: (color: string) => void;
  onFileSelected: (file: File | null) => void;
  onSubmit: (values: any, formikHelpers: FormikHelpers<any>) => Promise<void>;
  playlists: Playlist[];
}

const PlaylistForm: React.FC<PlaylistFormProps> = ({
  initialValues,
  isEditing,
  selectedColor,
  onColorSelect,
  onFileSelected,
  onSubmit,
  playlists,
}) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().max(255).required("Obligatoire"),
  });

  return (
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
          onSubmit={onSubmit}
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
                <Box display="flex" gap={2} alignItems="center">
                  <Box>
                    <InputLabel>Nom de la playliste</InputLabel>
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
                  </Box>
                  <Box width={"20%"}>
                    <InputLabel>Couleur</InputLabel>
                    <DropdownColor
                      onColorSelect={onColorSelect}
                      selectedColor={selectedColor}
                    />
                  </Box>
                  <Box width={"30%"}>
                    <FileUpload onFileSelected={onFileSelected} />
                  </Box>
                </Box>
              </Stack>
              <Button type="submit" variant="contained">
                {isEditing ? "Modifier" : "Créer"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Card>
  );
};

export default PlaylistForm;
