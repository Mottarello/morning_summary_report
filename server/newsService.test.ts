import { describe, it, expect } from "vitest";

describe("News Service", () => {
  it("should have valid NEWS_API_KEY", () => {
    const apiKey = process.env.NEWS_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).toBeTruthy();
    expect(apiKey?.length).toBeGreaterThan(0);
  });

  it("should be able to fetch news from TheNewsAPI", async () => {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      throw new Error("NEWS_API_KEY not set");
    }

    try {
      const response = await fetch(
        `https://api.thenewsapi.com/v1/news/top?query=technology&limit=1&language=en&api_token=${apiKey}`
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toBeDefined();
      expect(data.data).toBeDefined();
      expect(Array.isArray(data.data)).toBe(true);

      if (data.data.length > 0) {
        console.log("✓ TheNewsAPI connectivity verified");
        console.log(`✓ Sample story: ${data.data[0].title}`);
      }
    } catch (error) {
      throw new Error(`Failed to connect to TheNewsAPI: ${error}`);
    }
  });
});
