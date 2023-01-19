import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { getCurrentUsersProfile } from "../utils/spotify";

export enum Genre {
  NoPreference = "No Preference",
  Pop = "Pop",
  Rock = "Rock",
  Classical = "Classical",
  Jazz = "Jazz",
  Blues = "Blues",
  Country = "Country",
}

export type AuthContextType = {
  token: string;
  profile: {[key: string]: any} | null;
  bookInfo: {[key: string]: any} | null;
  genre: Genre | null;
  login: () => void;
  setProfile: (profile: {[key: string]: any} | null) => void;
  setBookInfo: (bookInfo: {[key: string]: any} | null) => void;
  setGenre: (genre: Genre | null) => void;
};
export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ token, children }: PropsWithChildren<{token: string}>) {
  const [profile, setProfile] = useState<{[key: string]: any} | null>(null)
  const [bookInfo, setBookInfo] = useState<{[key: string]: any} | null>(null)
  const [genre, setGenre] = useState<Genre | null>(null)
  const { replace } = useRouter()

  useEffect(() => {
    (async () => {
      if (token) {
        const _profile = await getCurrentUsersProfile(token)
        setProfile(_profile)
      } else {
        setProfile(null)
      }
    })()
  }, [token])

  // LOGIN
  const login = async () => {
    replace('api/auth/login')
  };

  return (
    <AuthContext.Provider value={{
      token,
      profile,
      bookInfo,
      genre,
      login,
      setProfile,
      setBookInfo,
      setGenre
    }}>
      {children}
    </AuthContext.Provider>
  )
}