"use client";

import {
  Button,
  Card,
  Checkbox,
  Divider,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import SearchIcon from "@mui/icons-material/Search";
import { ChangeEvent, useState } from "react";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { ArrowForward, Cancel, Upload } from "@mui/icons-material";
import Drawer from "@mui/material/Drawer";
import * as React from "react";
import PieChartWithCenterLabel from "../components/chart/chart";
import * as Yup from "yup";
import { Formik } from "formik";
import DropdownColor from "../components/organisme/DropdownColor";
import Tabulation, { Song } from "../components/tabs/tabs";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";

const songs = [
  {
    title: "Shape of You",
    artist: "Ed Sheeran",
    duration: "3:54",
    tags: ["Pop", "Hit", "Été"],
  },
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    duration: "3:20",
    tags: ["Pop", "Danse"],
  },
  {
    title: "Bad Guy",
    artist: "Billie Eilish",
    duration: "3:14",
    tags: ["Alternatif", "Électro"],
  },
  {
    title: "Stay With Me",
    artist: "Sam Smith",
    duration: "4:33",
    tags: ["Pop", "Soul"],
  },
  {
    title: "Stay With Me",
    artist: "Sam Smith",
    duration: "4:33",
    tags: ["Pop", "Soul"],
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [checked, setChecked] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [songsList, setSongsList] = useState<Song[]>(songs); // Déplacé depuis Tabulation
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [isDraggingOverPlaylist, setIsDraggingOverPlaylist] = useState(false);

  // Gestion du drop dans la playlist
  const handleDropInPlaylist = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const index = parseInt(e.dataTransfer.getData("text/plain"));
    const draggedSong = songsList[index];
    setPlaylistSongs([...playlistSongs, draggedSong]);
    setIsDraggingOverPlaylist(false);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const initialValues = {
    productName: "",
    submit: null,
  };

  const DrawerList = (
    <div
      className="w-[1160px] p-8 flex flex-col gap-7 relative"
      role="presentation"
    >
      <IconButton
        onClick={toggleDrawer(false)}
        color="error"
        className="absolute top-2 right-2"
      >
        <Cancel />
      </IconButton>

      <Typography className="text-[20px] font-semibold">
        Créer une playliste
      </Typography>

      <Card className="w-full p-4 pb-4 flex items-center gap-4 border-t-2">
        <div className="w-[60%]">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={Yup.object().shape({
              productName: Yup.string().max(255).required("Obligatoire"),
            })}
            onSubmit={async (values: any) => {
              try {
                console.log("values", values);
              } catch (er) {
                console.error(er);
              }
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
              <form className="w-full" noValidate onSubmit={handleSubmit}>
                <Stack spacing={1}>
                  <InputLabel>Nom de la playliste</InputLabel>
                  <div className="flex gap-4">
                    <OutlinedInput
                      className={`font-poppins ${
                        errors.productName
                          ? "text-left border-none"
                          : "text-left "
                      }`}
                      id="productName"
                      type="productName"
                      value={values.productName}
                      name="productName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Nom du produit*"
                      fullWidth
                      size="small"
                      error={Boolean(touched.productName && errors.productName)}
                      endAdornment={
                        <InputAdornment position="end">
                          {touched.productName && errors.productName && (
                            <FormHelperText
                              className="z-50 border-none"
                              error
                              id="helper-text-productName"
                            >
                              {touched.productName &&
                                errors.productName?.toString()}
                            </FormHelperText>
                          )}
                        </InputAdornment>
                      }
                    />
                    <DropdownColor />
                  </div>
                </Stack>
              </form>
            )}
          </Formik>
        </div>
        <div className="w-[30%]">
          <Stack spacing={1}>
            <InputLabel>Pochette</InputLabel>
            <Button
              startIcon={<Upload />}
              variant="outlined"
              className="w-full"
            >
              Upload
            </Button>
          </Stack>
        </div>
      </Card>

      <div>
        <div className="flex gap-2">
          <div className="w-1/2">
            <Tabulation songsList={songsList} setSongsList={setSongsList} />
          </div>
          <div className="w-1/2 h-full p-2">
            <div className="pb-6">
              <Typography className="text-[18px] font-semibold">
                Playlist en cours d'édition
              </Typography>
              <Typography className="text-[14px] text-[#bebdc4]">
                Durée Totale: 0:00{" "}
              </Typography>
            </div>
            <div
              className="h-[520px] overflow-y-auto w-full  border-dashed border-2 pt-4 flex rounded-md justify-center"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOverPlaylist(true);
              }}
              onDragLeave={() => setIsDraggingOverPlaylist(false)}
              onDrop={handleDropInPlaylist}
              style={{
                borderColor: isDraggingOverPlaylist ? "#3f51b5" : "#bebdc4",
                backgroundColor: isDraggingOverPlaylist ? "#f0f4f8" : "white",
              }}
            >
              {playlistSongs.length === 0 ? (
                <div className="flex flex-col items-center">
                  <QueueMusicIcon className="text-[41px] text-[#bebdc4]" />
                  <Typography className="text-[18px] text-[#bebdc4] font-semibold">
                    Glissez des titres ici pour créer votre playlist
                  </Typography>
                </div>
              ) : (
                <div className="w-full p-4">
                  {playlistSongs.map((song, index) => (
                    <Paper key={index} className="px-2 py-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Typography className="font-semibold">
                            {song.title}
                          </Typography>
                          <Typography variant="body2">{song.artist}</Typography>
                        </div>
                        <IconButton
                          onClick={() => {
                            setPlaylistSongs(
                              playlistSongs.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </Paper>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button startIcon={<SaveIcon />} variant="contained">
            {" "}
            Enregistrer la playlist
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="max-container h-full min-h-screen w-full flex items-center">
        <div className="flex gap-2 w-full bg-zinc-200 rounded-md">
          <div className="w-[72%] p-2 pt-4 rounded-md min-h-full h-[calc(100vh-340px)] flex flex-col gap-8">
            <div className="flex justify-between w-full items-center">
              <div className="space-y-1">
                <Typography className="text-[18px] text-gray-600 font-semibold">
                  Choisissez vos styles musicaux
                </Typography>
                <Typography className="text-[14px]">
                  il en faut pour tous les gouts
                </Typography>
              </div>

              <div className="space-x-2 ">
                <Button
                  startIcon={<AddTwoToneIcon />}
                  variant="contained"
                  size="medium"
                  className="h-[38px] text-gray-100"
                  onClick={toggleDrawer(true)}
                >
                  Créer une playlist
                </Button>
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="Rechercher un genre music..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>
            <div className="w-full overflow-x-auto">
              <div className="w-full min-w-max h-full py-2 gap-4 flex flex-nowrap">
                {Array.from({ length: 18 }).map((_, index) => (
                  <Card
                    key={index}
                    elevation={0}
                    className="min-w-[190px] flex justify-center py-4 bg-zinc-100"
                  >
                    <div className="flex flex-col gap-8">
                      <div className="w-[164px] h-[164px] rounded-full bg-slate-500 flex justify-center items-center relative">
                        <IconButton className="rounded-full w-16 h-16">
                          <PlayCircleIcon
                            color="secondary"
                            className="w-16 h-16"
                          />
                        </IconButton>
                        <IconButton className=" absolute top-3 right-1 rounded-full w-7 h-7 bg-white flex items-center justify-center">
                          <SearchIcon color="primary" className="w-4 h-4" />
                        </IconButton>
                      </div>
                      <div className="flex gap-2 justify-center flex-col text-center">
                        <Typography className="text-[18px] font-semibold">
                          Pop & Dance
                        </Typography>
                        <Typography> Pop, Dance, Electro </Typography>
                      </div>
                      <Divider className="mx-auto w-[90%]" />
                      <div className="space-y-2">
                        <div className="flex justify-start items-center">
                          <Checkbox
                            checked={checked}
                            onChange={handleChange}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                          <div className="bg-slate-400 w-12 rounded-md text-center py-[1px]">
                            50%
                          </div>
                        </div>
                        <div className="px-3">
                          <Slider
                            size="medium"
                            defaultValue={50}
                            aria-label="Small"
                            valueLabelDisplay="auto"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          <div className="w-[28%] p-2 rounded-md pt-6 min-h-full h-[calc(100vh-280px)] flex flex-col gap-3">
            <Card elevation={0} className="w-full h-full pt-6 px-6">
              <Typography className="text-[18px] font-semibold">
                Répartition musicale
              </Typography>
              <PieChartWithCenterLabel />
              <div>
                <Typography className="text-[18px] font-semibold">
                  Total
                </Typography>
                <Slider
                  size="medium"
                  // defaultValue={70}
                  aria-label="Small"
                  valueLabelDisplay="off"
                />
              </div>
            </Card>
            <Button variant="contained" endIcon={<ArrowForward />}>
              ETAPE SUIVANTE
            </Button>
          </div>
        </div>
      </div>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </>
  );
}
