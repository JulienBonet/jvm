// server\src\services\discogsMapper.js
export function mapDiscogsRelease(discogs) {
  const uniqueLabels = [...new Map((discogs.labels || []).map((l) => [l.id, l])).values()];

  return {
    id: discogs.id,
    title: discogs.title,
    year: discogs.year,
    country: discogs.country,
    notes: discogs.notes ?? '',

    identifiers: discogs.identifiers ?? [],
    formats: discogs.formats ?? [],
    images: discogs.images ?? [],
    videos: discogs.videos ?? [],
    uri: discogs.uri ?? '',

    artists: (discogs.artists || []).map((a) => ({
      id: a.id,
      name: a.name.replace(/\s\(\d+\)$/, ''),
      thumbnail_url: a.thumbnail_url ?? null,
    })),

    labels: uniqueLabels.map((l) => ({
      id: l.id,
      name: l.name,
      catno: l.catno,
      thumbnail_url: l.thumbnail_url ?? null,
    })),

    genres: discogs.genres ?? [],
    styles: discogs.styles ?? [],

    tracklist: discogs.tracklist ?? [],
  };
}
