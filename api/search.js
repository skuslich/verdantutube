export default async function handler(req, res) {
  const { q = "" } = req.query;
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = "UCJ4Wk9YPRn3JiWqBG2VjaOg";

  if (!apiKey) {
    return res.status(500).json({ error: "Missing YouTube API key." });
  }

  const encodedQuery = encodeURIComponent(q);
  const maxResults = 5;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=${maxResults}&key=${apiKey}${q ? `&q=${encodedQuery}` : ""}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.items) {
      return res.status(500).json({ error: "Unexpected YouTube API response", raw: data });
    }

    const results = data.items.map((item) => ({
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails.medium.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));

    res.status(200).json({ episodes: results });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch from YouTube", details: err.message });
  }
}

