"use client";

import React from "react";
import { Playlist } from "./playlist";

interface PlaylistListProps {
  playlists: Playlist[];
  onEditPlaylist: (playlist: Playlist) => void;
  onDeletePlaylist: (id: number) => void;
}

const PlaylistList: React.FC<PlaylistListProps> = ({
  playlists,
  onEditPlaylist,
  onDeletePlaylist,
}) => {
  return (
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}>
          <span>{playlist.name}</span>
          <button onClick={() => onEditPlaylist(playlist)}>Modifier</button>
          <button onClick={() => onDeletePlaylist(playlist.id)}>
            Supprimer
          </button>
        </li>
      ))}
    </ul>
  );
};

export default PlaylistList;
