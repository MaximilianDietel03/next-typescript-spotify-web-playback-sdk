import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import Image from 'next/image'
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import { transferPlayback } from "../utils/spotify";
import { useAuthContext } from "../auth/useAuthContext";
import { motion } from "framer-motion"

export const WebPlayback = () => {
  const { token } = useAuthContext();
  const [is_paused, setPaused] = useState<boolean>(false);
  const [is_active, setActive] = useState<boolean>(false);
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [current_track, setTrack] = useState<Spotify.Track | null>(null);
  const [device_id, setDeviceId] = useState<string | null>(null);

  const previous = () => {
    player?.previousTrack();
  };

  const toggle = () => {
    player?.togglePlay();
  };

  const next = () => {
    player?.nextTrack();
  };


  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
        setDeviceId(null);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        setTrack(state.track_window.current_track);
        setPaused(state.paused);

        player.getCurrentState().then((state) => {
          if (!state) {
            setActive(false);
          } else {
            setActive(true);
          }
        });
      });

      player.connect();
    };
  }, [token]);

  if (!player) {
    console.log("player is null");
    return null;
  }

  // if (!player) return (
  //   <motion.div className="bg-white/10 rounded-2xl p-4 flex flex-col">
  //     <p className="text-center text-2xl mt-8">now playing:</p>
  //     <Box className="flex justify-center items-center p-4">
  //       <p className="text-center">Spotify Player is null</p>
  //     </Box>
  //   </motion.div>
  // )

  if (!is_active) return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5 }}
      className="bg-white/10 rounded-2xl p-4 flex flex-col justify-center items-center text-lg"
    >
        <p className="text-center mb-16">Instance not active. Transfer your playback</p>
        <button
          onClick={() => transferPlayback(token, device_id)}
          className="border-2 border-white rounded-full py-3 px-6 flex items-center hover:opacity-75"
        >
          <Image src="/spotify-white.png" alt="spotify logo" width={22} height={22} />
          <p className="ml-2">Transfer Playback</p>
        </button>
    </motion.div>
  )

  return (
    <div className="bg-white/10 rounded-2xl text-2xl flex flex-col justify-center items-center">
      <Box className="relative w-8/12 aspect-square mb-8">
        {current_track && current_track.album.images[0].url ? (
          <Image src={current_track.album.images[0].url} alt="album art" layout="fill" className="rounded-xl" />
        ) : null}
      </Box>
      <Box className="flex flex-col items-center mb-6 px-6">
        <p className="text-sm text-center text-white/80 uppercase mb-1">{current_track?.artists[0].name}</p>
        <p className="text-center">{current_track?.name}</p>
      </Box>
      <Box className="flex">
        <button onClick={previous}>
          <SkipPreviousIcon className="text-white/75 hover:text-white" style={{ fontSize: 50 }} />
        </button>
        <button onClick={toggle} className="mx-2">
          {is_paused ? (
            <PlayCircleIcon style={{ fontSize: 50 }} />
          ) : (
            <PauseCircleIcon style={{ fontSize: 50 }} />
          )}
        </button>
        <button onClick={next}>
          <SkipNextIcon className="text-white/75 hover:text-white" style={{ fontSize: 50 }} />
        </button>
      </Box>
    </div>
  );
};
