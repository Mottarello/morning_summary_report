import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Globe, TrendingUp, MapPin, Bike } from "lucide-react";

interface Story {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  excerpt: string;
  source?: string;
  timestamp: string;
  url?: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "ai": <Zap className="w-4 h-4" />,
  "world": <Globe className="w-4 h-4" />,
  "economy": <TrendingUp className="w-4 h-4" />,
  "local": <MapPin className="w-4 h-4" />,
  "cycling": <Bike className="w-4 h-4" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  "ai": "bg-blue-100 text-blue-800",
  "world": "bg-purple-100 text-purple-800",
  "economy": "bg-green-100 text-green-800",
  "local": "bg-red-100 text-red-800",
  "cycling": "bg-pink-100 text-pink-800",
};

const categoryDisplayNames: Record<string, string> = {
  "ALL NEWS": "ALL NEWS",
  "ai": "AI & Startups",
  "world": "World News",
  "economy": "UK Economy",
  "local": "Maidenhead Local",
  "cycling": "Cycling"
};

export default function Home() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL NEWS");

  useEffect(() => {
    const loadStories = async () => {
      try {
        const response = await fetch("/api/trpc/news.getLatest");
        const result = await response.json();
        const newsData = result?.result?.data?.json;
        
        // Set stories directly from API response
        if (newsData?.stories) {
          setStories(newsData.stories);
        }
      } catch (error) {
        console.error("Error loading stories:", error);
      }
    };

    loadStories();
  }, []);

  const filteredStories =
    selectedCategory === "ALL NEWS"
      ? stories
      : stories.filter((story) => story.category === selectedCategory);

  const categories = [
    "ALL NEWS",
    "ai",
    "world",
    "economy",
    "local",
    "cycling",
  ];

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-12 border-b-4 border-orange-500">
        <div className="container">
          <div className="mb-2 text-sm font-medium text-orange-400 tracking-widest">
            DAILY REPORT
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-3 leading-tight">
            Morning Summary
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mb-4">
            Your daily digest of world news, tech announcements, economic updates, and local insights
          </p>
          <p className="text-sm text-slate-400">{dateStr}</p>
        </div>
      </header>

      {/* Category Filter */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white shadow-lg"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {categoryDisplayNames[cat] || cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-12">
        {filteredStories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading news stories...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Featured Story */}
            {filteredStories.length > 0 && (
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="md:col-span-2">
                  <Card className="h-full bg-white border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="p-8">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={`${CATEGORY_COLORS[filteredStories[0].category]} border-0`}>
                          {CATEGORY_ICONS[filteredStories[0].category]}
                          <span className="ml-1">{categoryDisplayNames[filteredStories[0].category] || filteredStories[0].category}</span>
                        </Badge>
                      </div>
                      <h2 className="text-3xl font-serif font-bold mb-2 text-slate-900">
                        {filteredStories[0].title}
                      </h2>
                      <p className="text-lg text-slate-600 mb-4 font-medium">
                        {filteredStories[0].subtitle}
                      </p>
                      <p className="text-slate-700 leading-relaxed mb-6">
                        {filteredStories[0].excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                          <span className="font-medium">{filteredStories[0].source}</span>
                          <span className="mx-2">•</span>
                          <span>{filteredStories[0].timestamp}</span>
                        </div>
                        <a
                          href={filteredStories[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                        >
                          Read Full Story <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 p-6">
                    <div className="text-3xl font-bold text-blue-900 mb-1">
                      {stories.length}
                    </div>
                    <div className="text-sm text-blue-700">Stories Today</div>
                  </Card>
                  <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 p-6">
                    <div className="text-3xl font-bold text-orange-900 mb-1">5</div>
                    <div className="text-sm text-orange-700">Categories</div>
                  </Card>
                  <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 p-6">
                    <div className="text-sm text-slate-700 font-medium">Updated Daily</div>
                    <div className="text-xs text-slate-600 mt-2">
                      Fresh curated news every morning
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Stories Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredStories.slice(1).map((story) => (
                <Card
                  key={story.id}
                  className="bg-white border-l-4 hover:shadow-lg transition-all duration-300"
                  style={{
                    borderLeftColor:
                      story.category === "ai"
                        ? "#3b82f6"
                        : story.category === "world"
                          ? "#a855f7"
                          : story.category === "economy"
                            ? "#10b981"
                            : story.category === "local"
                              ? "#ef4444"
                              : "#ec4899",
                  }}
                >
                  <div className="p-6">
                    <Badge className={`${CATEGORY_COLORS[story.category]} border-0 mb-3`}>
                      {CATEGORY_ICONS[story.category]}
                      <span className="ml-1">{categoryDisplayNames[story.category] || story.category}</span>
                    </Badge>
                    <h3 className="text-xl font-serif font-bold mb-2 text-slate-900">
                      {story.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-3 font-medium">
                      {story.subtitle}
                    </p>
                    <p className="text-slate-700 text-sm leading-relaxed mb-4 line-clamp-3">
                      {story.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        <span className="font-medium">{story.source}</span>
                        <span className="mx-1.5">•</span>
                        <span>{story.timestamp}</span>
                      </div>
                      <a
                        href={story.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1"
                      >
                        Read <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 mt-16 border-t border-slate-800">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <p className="font-serif text-lg font-bold text-white mb-1">
                Morning Summary
              </p>
              <p className="text-sm">Curated daily news digest</p>
            </div>
            <div className="text-sm text-slate-400 mt-4 md:mt-0">
              <p>Updated daily • World News • Tech • Economy • Local • Cycling</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

