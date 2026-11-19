
export async function onRequest({ request, env }) {
  const url = new URL(request.url);

  if (!env.FOOTBALL_API_KEY) {
    return Response.json(
      { error: "API Key belum terpasang" },
      { status: 500 }
    );
  }

  const endpoint = url.searchParams.get("endpoint") || "fixtures";

  const allowedEndpoints = [
    "fixtures",
    "standings",
    "teams",
    "players",
    "leagues"
  ];

  if (!allowedEndpoints.includes(endpoint)) {
    return Response.json(
      { error: "Endpoint tidak diizinkan" },
      { status: 400 }
    );
  }

  // Hanya parameter resmi API-Football
  const allowedParams = [
    "id",
    "ids",
    "live",
    "date",
    "league",
    "season",
    "team",
    "last",
    "next",
    "from",
    "to",
    "round",
    "status",
    "venue",
    "timezone",
    "country",
    "search",
    "code",
    "page"
  ];

  const params = new URLSearchParams();

  for (const key of allowedParams) {
    const value = url.searchParams.get(key);

    if (value) {
      params.set(key, value);
    }
  }

  try {
    const apiUrl =
      `https://v3.football.api-sports.io/${endpoint}?${params}`;

    const response = await fetch(apiUrl, {
      headers: {
        "x-apisports-key": env.FOOTBALL_API_KEY
      }
    });

    const data = await response.json();

    return Response.json(data, {
      status: response.status,
      headers: {
        "Cache-Control": "public, max-age=30"
      }
    });

  } catch (error) {
    return Response.json(
      { error: "Gagal menghubungi Football API" },
      { status: 502 }
    );
  }
}
