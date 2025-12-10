import fetch from 'node-fetch';

console.log('[Test] Fetching news from TheNewsAPI...');

async function testNewsAPI() {
  try {
    const response = await fetch('https://api.thenewsapi.com/v1/news/top?query=AI%20technology&limit=2&language=en');
    const data = await response.json();
    console.log('[Test] Response status:', response.status);
    console.log('[Test] Stories received:', data.data?.length || 0);
    if (data.data && data.data.length > 0) {
      console.log('[Test] First story:', {
        title: data.data[0].title,
        source: data.data[0].source,
        published: data.data[0].published_at
      });
    }
  } catch (error) {
    console.error('[Test] Error:', error.message);
  }
}

testNewsAPI();
