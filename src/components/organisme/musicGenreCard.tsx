import {
  Card,
  Checkbox,
  Divider,
  IconButton,
  Slider,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

export default function MusicGenreCards() {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 w-max">
        {[...Array(18)].map((_, i) => (
          <Card key={i} className="min-w-64 p-4">
            <div className="flex flex-col gap-4">
              <AlbumArtPreview />
              <GenreInfo />
              <Divider />
              <GenreControls />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

const AlbumArtPreview = () => (
  <div className="relative w-40 h-40 mx-auto bg-gray-300 rounded-full">
    <IconButton className="absolute top-2 right-2 bg-white">
      <SearchIcon fontSize="small" />
    </IconButton>
    <IconButton className="center-transform">
      <PlayCircleIcon className="text-6xl" />
    </IconButton>
  </div>
);

const GenreInfo = () => (
  <div className="text-center">
    <Typography variant="h6">Pop & Dance</Typography>
    <Typography variant="body2">Pop, Dance, Electro</Typography>
  </div>
);

const GenreControls = () => (
  <div>
    <div className="flex items-center gap-2">
      <Checkbox />
      <span className="bg-gray-200 px-2 rounded">50%</span>
    </div>
    <Slider defaultValue={50} className="w-full" />
  </div>
);
