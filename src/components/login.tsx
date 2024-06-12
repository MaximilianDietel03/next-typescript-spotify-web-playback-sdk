import { VFC } from "react";
import Image from 'next/image'
import { useAuthContext } from "../auth/useAuthContext";
import { motion } from "framer-motion"

export const Login: VFC = () => {
  const { login } = useAuthContext();

  return (
    <motion.div className="w-screen h-screen bg-black flex flex-col justify-center items-center">
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
        {"Login with your Spotify Account and let our AI pick the perfect songs for your favourite Book. You're gonna love it!"}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        onClick={login}
        className="border-green-500 border-2 rounded-full py-3 px-6 text-xl text-white flex items-center mb-10"
      >
        <Image src="/spotify-white.png" alt="spotify logo" width={20} height={20} />
        <p className="ml-2">Login with Spotify</p>
      </motion.button>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="z-10 text-white text-sm"
      >
        Spotify API in development mode. Contact <a href="mailto:maxdietel03@gmail.com" className="text-green-500 hover:underline">me</a> to get access.
      </motion.p>
    </motion.div>
  );
};
