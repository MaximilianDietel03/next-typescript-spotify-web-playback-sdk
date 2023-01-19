import { useAuthContext } from "../auth/useAuthContext";
import { ChooseBook } from "./choose_book";
import { ChooseGenre } from "./choose_genre";
import { SongSuggestions } from "./song_suggestions";

export const Content = () => {
  const { bookInfo, genre } = useAuthContext()

  if (!bookInfo) return (
    <ChooseBook />
  )

  if (!genre) return (
    <ChooseGenre />
  )

  return (
    <SongSuggestions />
  )
}
