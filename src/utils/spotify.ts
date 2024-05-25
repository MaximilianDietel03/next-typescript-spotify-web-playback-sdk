export async function suggestSongsToBook(title: string | undefined, description: string | undefined, genre: string) {
  const res = await fetch('/api/suggest-songs-to-book', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, description, genre })
  });
  const { song_suggestions, error } = await res.json();

  if (error) {
    console.error(error);
    return Array(10)
  }
  return song_suggestions;
}

export async function findSpotifyTrack(spotifyToken: string, track: string) {
  try {
    const res = await fetch(`https://api.spotify.com/v1/search?q=${track}&type=track&limit=1`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${spotifyToken}`
      },
    });
    const data = await res.json();
    return data.tracks.items[0] as {[key: string]: any}
  } catch (error) {
    console.error(error);
    return;
  }
}

export async function suggestSongsToBookAndFindSpotifyTracks(spotifyToken: string | null, title: string | undefined, description: string | undefined, genre: string) {
  if (!spotifyToken) throw new Error('spotifyToken is null')
  const suggestedSongs = await suggestSongsToBook(title, description, genre)

  const spotifyTrackUris = await Promise.all(suggestedSongs.map((song: string) => findSpotifyTrack(spotifyToken, song)))
  return spotifyTrackUris
}

export async function playTrack(spotifyToken: string, trackUri: string) {
  try {
    await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${spotifyToken}`
      },
      body: JSON.stringify({ "uris": [trackUri] })
    });
  } catch (error) {
    console.error(error);
  }
}

export async function transferPlayback(spotifyToken: string, deviceId: string | null) {
  try {
    if (!deviceId) throw new Error('deviceId is null')
    await fetch('https://api.spotify.com/v1/me/player', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${spotifyToken}`
      },
      body: JSON.stringify({ "device_ids": [deviceId] })
    });
  } catch (error) {
    console.error(error);
  }
}

export async function addToQueue(spotifyToken: string, trackUri: string) {
  try {
    await fetch(`https://api.spotify.com/v1/me/player/queue?uri=${trackUri}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${spotifyToken}`
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getCurrentUsersProfile(spotifyToken: string) {
  try {
    const res = await fetch(`https://api.spotify.com/v1/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${spotifyToken}`
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return;
  }
}
