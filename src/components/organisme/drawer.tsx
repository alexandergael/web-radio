import { useState } from "react";
import {
  Button,
  Card,
  Divider,
  Drawer,
  IconButton,
  OutlinedInput,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import { Formik } from "formik";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import DropdownColor from "./DropdownColor";
import CancelIcon from "@mui/icons-material/Cancel";
import { Upload } from "@mui/icons-material";
import Tabulation from "../tabs/tabs";

export const DynamicDrawer = ({
  open,
  onClose,
  playlistSongs,
  setPlaylistSongs,
  songs,
}: any) => {
  const [songsList, setSongsList] = useState(songs);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="w-full max-w-4xl p-4 relative">
        <IconButton onClick={onClose} className="absolute top-2 right-2">
          <CancelIcon />
        </IconButton>

        <Typography variant="h5" className="mb-6">
          Créer une playlist
        </Typography>

        <PlaylistForm />

        <div className="flex flex-col lg:flex-row gap-4 mt-4">
          <div className="flex-1">
            <Tabulation songsList={songsList} setSongsList={setSongsList} />
          </div>

          <PlaylistPreview
            playlistSongs={playlistSongs}
            setPlaylistSongs={setPlaylistSongs}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="contained" startIcon={<SaveIcon />}>
            Enregistrer la playlist
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

const PlaylistForm = () => (
  <Card className="p-4 mb-6">
    <Formik
      enableReinitialize
      initialValues={{ playlistName: "" }}
      validationSchema={Yup.object({
        playlistName: Yup.string().required("Obligatoire"),
      })}
      onSubmit={async (values: any) => {
        try {
          console.log("values", values);
        } catch (er) {
          console.error(er);
        }
      }}
    >
      {({ values, handleChange }) => (
        <Stack spacing={3}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Nom de la playlist</label>
              <OutlinedInput
                name="playlistName"
                value={values.playlistName}
                onChange={handleChange}
                fullWidth
              />
              <DropdownColor />
            </div>

            <div>
              <label>Pochette</label>
              <Button
                variant="outlined"
                startIcon={<Upload />}
                fullWidth
                className="h-14"
              >
                Upload
              </Button>
            </div>
          </div>
        </Stack>
      )}
    </Formik>
  </Card>
);

const PlaylistPreview = ({ playlistSongs, setPlaylistSongs }: any) => (
  <div className="w-full lg:w-96 p-4 border-2 border-dashed rounded-lg">
    <Typography variant="h6">Playlist en cours</Typography>
    <Typography variant="body2" color="textSecondary">
      Durée Totale: 0:00
    </Typography>

    <div className="mt-4 h-96 overflow-y-auto">
      {playlistSongs.map((song: any, index: any) => (
        <Paper key={index} className="p-2 mb-2">
          <div className="flex justify-between items-center">
            <div>
              <Typography variant="body1">{song.title}</Typography>
              <Typography variant="body2">{song.artist}</Typography>
            </div>
            <IconButton
              onClick={() =>
                setPlaylistSongs((prev: any) =>
                  prev.filter((_: any, i: any) => i !== index)
                )
              }
            >
              <DeleteIcon />
            </IconButton>
          </div>
        </Paper>
      ))}
    </div>
  </div>
);
