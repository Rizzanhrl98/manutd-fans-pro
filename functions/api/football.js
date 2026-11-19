
export async function onRequest({ request, env }) {
  const url = new URL(request.url);

  if (!env.FOOTBALL_API_KEY) {
    return Response.json(
      { error: "API Key belum terpasang" },
      { status: 500 }
    );
  }

  const endpoint = url.searchParams.get("endpoint") || "fixtures";

  const allowed = [
    "fixtures",
    "standings",
    "teams",
    "players",
    "leagues"
  ];

  if (!allowed.includes(endpoint)) {
    return Response.json(
      { error: "Endpoint tidak diizinkan" },
      { status: 400 }
    );
  }

  const params = new URLSearchParams();

  for (const [key, value] of url.searchParams) {
    if (key !== "endpoint") {
      params.set(key, value);
    }
  }

  const apiUrl =
    `https://v3.football.api-sports.io/${endpoint}?${params}`;

  try {
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
