/**
 * News fetching service using TheNewsAPI.com
 * Fetches real-time news for different categories
 */

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  url: string;
  source: string;
  category: string;
  published_at: string;
}

interface FetchedStory {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  excerpt: string;
  timestamp: string;
  source?: string;
  url?: string;
}

const NEWS_API_URL = "https://api.thenewsapi.com/v1/news/top";
const NEWS_API_KEY = process.env.NEWS_API_KEY;

/**
 * Fetch news articles from TheNewsAPI.com
 */
async function fetchNewsFromAPI(query: string, limit: number = 3): Promise<NewsArticle[]> {
  try {
    if (!NEWS_API_KEY) {
      console.error("[News API] NEWS_API_KEY not configured");
      return [];
    }

    const url = `${NEWS_API_URL}?query=${encodeURIComponent(query)}&limit=${limit}&language=en&api_token=${NEWS_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`[News API] Error fetching news: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("[News API] Error fetching news:", error);
    return [];
  }
}

/**
 * Convert API articles to story format
 */
function convertToStory(article: NewsArticle, category: string, index: number): FetchedStory {
  return {
    id: index,
    category,
    title: article.title || "Untitled",
    subtitle: article.source || "Breaking News",
    excerpt: article.description || article.content?.substring(0, 200) || "No description available",
    timestamp: article.published_at ? formatTime(new Date(article.published_at)) : "Recently",
    source: article.source,
    url: article.url,
  };
}

/**
 * Format timestamp to relative time
 */
function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-GB");
}

/**
 * Fetch all news for the morning summary
 */
export async function fetchAllNews(): Promise<FetchedStory[]> {
  const stories: FetchedStory[] = [];
  let storyId = 1;

  // AI & Startups
  console.log("[News] Fetching AI & Startups news...");
  const aiNews = await fetchNewsFromAPI("AI artificial intelligence startups technology", 2);
  aiNews.forEach((article, index) => {
    stories.push(convertToStory(article, "ai", storyId++));
  });

  // World News
  console.log("[News] Fetching World News...");
  const worldNews = await fetchNewsFromAPI("world news international breaking", 2);
  worldNews.forEach((article, index) => {
    stories.push(convertToStory(article, "world", storyId++));
  });

  // Economy & Finance
  console.log("[News] Fetching Economy news...");
  const economyNews = await fetchNewsFromAPI("UK economy finance business markets", 2);
  economyNews.forEach((article, index) => {
    stories.push(convertToStory(article, "economy", storyId++));
  });

  // Local News (Maidenhead)
  console.log("[News] Fetching Local news...");
  const localNews = await fetchNewsFromAPI("Maidenhead UK local news", 2);
  localNews.forEach((article, index) => {
    stories.push(convertToStory(article, "local", storyId++));
  });

  // Cycling News
  console.log("[News] Fetching Cycling news...");
  const cyclingNews = await fetchNewsFromAPI("cycling Giro d'Italia bike racing", 2);
  cyclingNews.forEach((article, index) => {
    stories.push(convertToStory(article, "cycling", storyId++));
  });

  console.log(`[News] Fetched ${stories.length} total stories`);
  return stories;
}

/**
 * Get fallback stories if API fails
 */
export function getFallbackStories(): FetchedStory[] {
  return [
    {
      id: 1,
      category: "ai",
      title: "AI and Technology News",
      subtitle: "Latest developments in artificial intelligence",
      excerpt: "Stay updated with the latest AI and technology announcements from around the world.",
      timestamp: "Today",
    },
    {
      id: 2,
      category: "world",
      title: "World News Updates",
      subtitle: "International breaking news",
      excerpt: "Important news and developments from across the globe.",
      timestamp: "Today",
    },
    {
      id: 3,
      category: "economy",
      title: "UK Economy & Finance",
      subtitle: "Economic updates and financial news",
      excerpt: "Latest updates on the UK economy, markets, and financial developments.",
      timestamp: "Today",
    },
    {
      id: 4,
      category: "local",
      title: "Maidenhead Local News",
      subtitle: "Local community updates",
      excerpt: "News and updates from the Maidenhead area and surrounding regions.",
      timestamp: "Today",
    },
    {
      id: 5,
      category: "cycling",
      title: "Cycling & Sports News",
      subtitle: "Latest from the cycling world",
      excerpt: "Updates on cycling events, races, and sports news from Italy and beyond.",
      timestamp: "Today",
    },
  ];
}
