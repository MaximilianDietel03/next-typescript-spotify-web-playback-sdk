import { Box, CircularProgress } from "@mui/material"
import { useEffect, useReducer, useState } from "react"
import { playTrack, suggestSongsToBookAndFindSpotifyTracks, addToQueue } from "../utils/spotify"
import Image from 'next/image'
import { WebPlayback } from "./web_playback"
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useAuthContext } from "../auth/useAuthContext"
import { motion } from "framer-motion"
import toast, { Toaster } from 'react-hot-toast';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const notify = () => toast('Added to queue!', { icon: <CheckCircleIcon className="text-green-500" />, style: { background: '#333', color: '#fff' } });

export const SongSuggestions = () => {
  const { token, bookInfo, genre, setBookInfo, setGenre } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const [spotifyTracks, setSpotifyTracks] = useState<Spotify.Track[]>([])
  const [_, rerender] = useReducer((x) => x + 1, 0)

  
  useEffect(() => {
    (async () => {
      if (!bookInfo || !genre) return;
      setIsLoading(true)
      const spotifyTracks = await suggestSongsToBookAndFindSpotifyTracks(token, bookInfo?.title, bookInfo?.description, genre!)
      setSpotifyTracks(spotifyTracks)
      setIsLoading(false)
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookInfo, _])

  return (
    <div className="relative w-screen h-screen bg-black flex flex-col p-6 text-white pt-24 overflow-hidden">
      <Box className="flex justify-between pb-6">
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          onClick={() => setBookInfo(null)}
          className="flex max-w-2xl items-center text-2xl"
        >
          <ArrowBackIcon />
          <p className="ml-4">{bookInfo?.title}</p>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center"
        >
          <p className="text-lg mr-2">{genre} -</p>
          <button onClick={() => setGenre(null)} className="text-lg hover:underline">
            other genre
          </button>
          <button disabled={isLoading} onClick={() => rerender()} className="rounded-full p-4 mx-4 hover:bg-white/10 disabled:opacity-30">
            <RefreshIcon />
          </button>
          <button disabled={isLoading} onClick={() => {spotifyTracks.reduce((p, track) => p.then(() => addToQueue(token, track.uri)), Promise.resolve()); notify()}} className="flex items-center border-2 border-green-500 rounded-full py-3 px-6 hover:opacity-75 disabled:opacity-30">
            <QueueMusicIcon />
            <p className="ml-2">All to Queue</p>
          </button>
        </motion.div>
      </Box>
    
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gridTemplateRows: '1fr', gap: 3, flex: 1 }}>
        <WebPlayback />

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(5, 1fr)', gap: 3 }}>
          {(isLoading ? [...Array(10)] : spotifyTracks).map((spotifyTrack, i) => (
            <Track
              key={`${spotifyTrack?.id}-${i}`}
              i={i}
              token={token}
              spotifyTrack={spotifyTrack}
              isLoading={isLoading}
            />
          ))}
        </Box>
      </Box>
      <Toaster />
    </div>
  )
}

const Track = ({ i, token, spotifyTrack, isLoading }: { i: number, token: string, spotifyTrack: Spotify.Track | null, isLoading: boolean }) => {
  if (isLoading) return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: i * 0.1 }}
      className="flex justify-center items-center p-4 bg-white/10 rounded-2xl"
    >
      <CircularProgress color="inherit" size={30} />
    </motion.div>
  )

  if (!spotifyTrack) return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: i * 0.1 }}
      className="flex justify-center items-center p-4 bg-white/10 rounded-2xl"
    >
      <p>no track found</p>
    </motion.div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: i * 0.1 }}
      className="flex justify-between p-4 bg-white/10 rounded-2xl"
    >
      <Box className="flex grow">
        <Box className="flex h-full aspect-square relative mr-4">
          <Image src={spotifyTrack.album?.images[0].url} alt="album art" layout="fill" className="rounded-xl" />
        </Box>
        <Box className="flex w-60 flex-col w-30">
          <p className="font-bold text-lg truncate">{spotifyTrack.name}</p>
          <p className="text-white/70 text-sm">{spotifyTrack.artists[0].name}</p>
        </Box>
      </Box>
      <Box className="flex flex-col justify-between">
        <button className="hover:scale-110" onClick={() => {addToQueue(token, spotifyTrack.uri); notify()}}>
          <QueueMusicIcon className="text-green-500" />
        </button>
        <button className="hover:scale-110" onClick={() => playTrack(token, spotifyTrack.uri)}>
          <PlayCircleIcon />
        </button>
      </Box>
    </motion.div>
  )
}