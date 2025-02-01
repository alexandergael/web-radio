import React, { useState, useEffect } from "react";
import {
  getPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
} from "../../app/actions/playlist";

interface Playlist {
  id: number;
  name: string;
  color: string;
  pochetteUrl: string | null;
}

const PlaylistComponent = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [pochetteUrl, setPochetteUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

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

  const handleCreatePlaylist = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("color", color);
      formData.append("pochetteUrl", pochetteUrl || "");

      const response = await createPlaylist(formData);
      if ("playlist" in response) {
        setPlaylists([...playlists, response.playlist]);
        setName("");
        setColor("");
        setPochetteUrl("");
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(error);
      setError("Une erreur s'est produite lors de la création de la playlist.");
    }
  };

  const handleUpdatePlaylist = async (id: number) => {
    try {
      const formData = new FormData();
      formData.append("id", id.toString());
      formData.append("name", name);
      formData.append("color", color);
      formData.append("pochetteUrl", pochetteUrl || "");

      const response = await updatePlaylist(formData);
      if ("playlist" in response) {
        setPlaylists(
          playlists.map((p) => (p.id === id ? response.playlist : p))
        );
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(error);
      setError("Une erreur s'est produite lors de la mise à jour.");
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

  return (
    <div>
      <h1>Playlists</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <span>{playlist.name}</span>
            <button onClick={() => handleUpdatePlaylist(playlist.id)}>
              Modifier
            </button>
            <button onClick={() => handleDeletePlaylist(playlist.id)}>
              Supprimer
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleCreatePlaylist}>
        <label>
          Nom :
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label>
          Couleur :
          <input
            type="text"
            value={color}
            onChange={(event) => setColor(event.target.value)}
          />
        </label>
        <label>
          URL de la pochette :
          <input
            type="text"
            value={pochetteUrl}
            onChange={(event) => setPochetteUrl(event.target.value)}
          />
        </label>
        <button type="submit">Créer une playlist</button>
      </form>
    </div>
  );
};

export default PlaylistComponent;
