export async function getBookInfos({ query }: { query: string }) {
  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?printType=books&langRestrict=en&q=${query}`);
  const data = await res.json();
  const bookInfos = data?.items?.flatMap((item: any) => item.volumeInfo ? [item.volumeInfo] : []) || []
  return bookInfos
}