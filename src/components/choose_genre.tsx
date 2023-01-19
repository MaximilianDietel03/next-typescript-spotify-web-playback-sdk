import { useState } from "react";
import { Box } from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Genre } from "../auth/AuthContext";
import { useAuthContext } from "../auth/useAuthContext";
import Image from 'next/image'
import { AnimatePresence, motion } from "framer-motion"

export const ChooseGenre = () => {
  const { bookInfo, setGenre } = useAuthContext()
  const [selectedGenre, setSelectedGenre] = useState<Genre>(Genre.NoPreference)
  const [boyVisible, setBoyVisible] = useState(true)

  const handleChooseGenre = (genre: Genre) => {
    setBoyVisible(false)
    setTimeout(() => {
      setGenre(genre)
    }, 1000)
  }

  return (
    <div className="relative w-screen h-screen bg-black flex justify-between items-center p-16 text-white overflow-hidden">
      <Box className="flex flex-col">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-medium text-2xl mb-10"
        >
          Choose your style:
        </motion.p>
        <Box sx={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
          {Object.values(Genre).map((genre, i) => (
            <motion.button
              key={genre}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              onClick={() => setSelectedGenre(genre)}
              className="border-2 rounded-full py-3 w-40"
              style={{ borderColor: genre === selectedGenre ? '#5FC269' : '#fff', backgroundColor: genre === selectedGenre ? '#5FC269' : undefined  }}
            >
              {genre}
            </motion.button>
          ))}
        </Box>
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
          onClick={() => handleChooseGenre(selectedGenre)}
          className="text-2xl mt-10 flex items-center hover:opacity-75"
        >
          <p className="mr-2">Get suggestions</p>
          <ArrowForwardIcon />
        </motion.button>
      </Box>
      <div className="flex flex-col w-5/12 h-96">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="uppercase font-light text-end mb-6 text-white/80"
        >
          {bookInfo?.title}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full text-white h-44"
        >
          <p className="text-end">{`"${bookInfo?.description}"`}</p>
        </motion.div>
      </div>

      <AnimatePresence>
        {boyVisible && (
          <motion.div
          className="absolute -bottom-2"
          exit={{ opacity: 0, right: 40 }}
          transition={{ duration: 1 }}
          style={{ right: 50 }}
        >
            <Image priority src="/readingmood-boy-right.png" width={320} height={320} alt="boy-reading" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}