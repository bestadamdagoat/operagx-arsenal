addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('id');

  if (!userId) {
    return new Response('Missing user ID\nv1.1b4', { status: 400 });
  }

  const targetUrl = `https://www.opera.com/api/proxy/rolve/${userId}`; // Replace with your API URL pattern

  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows 11.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36 OPRGX/104.0.4480.100",
  };

  if (request.method === 'OPTIONS') {
    // Handle preflight requests
    const preflightHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    return new Response(null, { headers: preflightHeaders });
  }

  const modifiedRequest = new Request(targetUrl, {
    method: 'POST',
    headers: Object.assign({}, request.headers, headers),
    body: request.body,
    redirect: 'manual'
  });

  const response = await fetch(modifiedRequest);

  // Create a new response without CORS headers
  const modifiedResponse = new Response(response.body, response);

  // Add CORS headers to the response
  modifiedResponse.headers.append('Access-Control-Allow-Origin', '*');
  modifiedResponse.headers.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  modifiedResponse.headers.append('Access-Control-Allow-Headers', 'Content-Type');

  return modifiedResponse;
}
