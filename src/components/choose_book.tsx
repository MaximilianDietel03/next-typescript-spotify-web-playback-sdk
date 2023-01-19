import { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce"
import { Box } from "@mui/material";
import { getBookInfos } from "../utils/google_books";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAuthContext } from "../auth/useAuthContext";
import Image from 'next/image'
import { AnimatePresence, motion } from "framer-motion"

export const ChooseBook = () => {
  const { setBookInfo } = useAuthContext()
  const [query, setQuery] = useState("")
  const [bookInfos, setBookInfos] = useState<any[]>([])
  const [boyVisible, setBoyVisible] = useState(true)

  const handleChange = (event: any) => {
    setQuery(event.target.value)
  }

  const handleChooseBook = (bookInfo: any) => {
    setBoyVisible(false)
    setTimeout(() => {
      setBookInfo(bookInfo)
    }, 1000)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceBookAutocomplete = useCallback(
    debounce(async (query: string) => {
      if (query.length < 3) return;
      const _bookInfos = await getBookInfos({ query })
      setBookInfos(_bookInfos)
    }
  , 200), [])

  useEffect(() => {
    debounceBookAutocomplete(query)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return (
    <div className="relative w-screen h-screen bg-black flex flex-col justify-center items-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center text-5xl text-white mb-10"
      >
        <div className="flex">
          <h1>
            Experience the
          </h1>
          <h1 className="text-green-500 mx-2">
            Perfect Synergy
          </h1>
        </div>

        <div className="flex">
          <h1 className="">
            of
          </h1>
          <h1 className="text-green-500 mx-2">
            Music
          </h1>
          <h1 className="">
            and
          </h1>
          <h1 className="text-green-500 ml-2">
            Storytelling
          </h1>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-white text-xl w-5/12 text-center mb-10"
      >
        {"Enter the name of your favourite book below and let our AI pick the perfect songs for the best reading experience. You're gonna love it!"}
      </motion.p>

      <motion.input
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        autoFocus
        value={query}
        onChange={handleChange}
        placeholder="My favourite book"
        className="z-10 flex w-96 bg-white/20 rounded-full py-2 px-6 text-white mb-10 border-2 border-white/30 focus:(outline-none border-white)"
      />

      <Box className="text-lg text-white w-5/12 h-60">
        {bookInfos.slice(0, 5).map((bookInfo, i) => (
          <button key={`${bookInfo.title}-${i}`} onClick={() => handleChooseBook(bookInfo)} className="flex justify-between p-1 w-full hover:opacity-75">
            <p className="truncate mr-8">{bookInfo.title}</p>
            <ArrowForwardIcon />
          </button>
        ))}
      </Box>

      <AnimatePresence>
        {boyVisible && (
          <motion.div
            initial={{ opacity: 0, left: 20 }}
            animate={{ opacity: 1, left: 30 }}
            exit={{ opacity: 0, left: 20 }}
            transition={{ duration: 1 }}
            className="absolute -bottom-12"
          >
            <Image priority src="/readingmood-boy-left.png" width={350} height={350} alt="boy-reading" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, right: 40 }}
        animate={{ opacity: 1, right: 50 }}
        transition={{ duration: 1 }}
        className="absolute -bottom-2"
      >
        <Image priority src="/readingmood-boy-right.png" width={320} height={320} alt="boy-reading" />
      </motion.div>
    </div>
  )
}