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
  categories: string[];
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

const NEWS_API_URL = "https://api.thenewsapi.com/v1/news/all";
const NEWS_API_KEY = process.env.NEWS_API_KEY;

/**
 * Fetch news articles from TheNewsAPI.com using search
 */
async function fetchNewsFromAPI(searchQuery: string, limit: number = 10): Promise<NewsArticle[]> {
  try {
    if (!NEWS_API_KEY) {
      console.error("[News API] NEWS_API_KEY not configured");
      return [];
    }

    const url = `${NEWS_API_URL}?search=${encodeURIComponent(searchQuery)}&limit=${limit}&language=en&api_token=${NEWS_API_KEY}`;
    console.log(`[News API] Searching for: "${searchQuery}"`);
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`[News API] Error fetching news: ${response.status}`);
      return [];
    }

    const data = await response.json();
    console.log(`[News API] Found ${data.data?.length || 0} articles for "${searchQuery}"`);
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
 * Fetch all news for the morning summary with deduplication
 */
export async function fetchAllNews(): Promise<FetchedStory[]> {
  const stories: FetchedStory[] = [];
  const seenUrls = new Set<string>();
  let storyId = 1;

  // Specific search queries for your interests
  const searchCategories = [
    { 
      search: "OpenAI ChatGPT Claude Anthropic startup venture capital funding", 
      category: "ai", 
      limit: 15 
    },
    { 
      search: "world news international Ukraine Middle East China politics",
      category: "world", 
      limit: 15 
    },
    { 
      search: "UK pension state pension retirement triple lock annuity", 
      category: "economy", 
      limit: 15 
    },
    { 
      search: "Maidenhead Windsor Berkshire Reading local news council", 
      category: "local", 
      limit: 15 
    },
    { 
      search: "cycling Giro Italia Tour de France Pogacar Vingegaard bike race", 
      category: "cycling", 
      limit: 15 
    }
  ];

  for (const { search, category, limit } of searchCategories) {
    console.log(`[News] Fetching ${category} news...`);
    const articles = await fetchNewsFromAPI(search, limit);
    
    // Only add unique articles (deduplicate by URL)
    let addedCount = 0;
    for (const article of articles) {
      if (article.url && !seenUrls.has(article.url)) {
        seenUrls.add(article.url);
        stories.push(convertToStory(article, category, storyId++));
        addedCount++;
        
        // Limit to 2 unique stories per category
        if (addedCount >= 2) {
          break;
        }
      }
    }
    
    console.log(`[News] Added ${addedCount} stories for ${category}`);
  }

  console.log(`[News] Fetched ${stories.length} unique stories from ${seenUrls.size} total articles`);
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
      title: "UK Pension News",
      subtitle: "Pension and retirement updates",
      excerpt: "Latest updates on UK and Italian pensions, retirement planning, and financial news.",
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

