const LANGUAGE_COLORS = {
    'C#': "#000d5f",
    'C++': "#ff0000",
    C: "#e100ff",
    JavaScript: "#f1e05a",
    TypeScript: "#2b7489",
    Python: "#3572A5",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Ruby: "#701516",
    Java: "#b07219",
    Go: "#00ADD8",
    default: "#58a6ff",
};

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username") || "octocat";

    const headers = {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    };

    try {
        // 🔹 Fetch repos
        const repoRes = await fetch(
            `https://api.github.com/users/${username}/repos?per_page=100`,
            { headers, next: { revalidate: 3600 } }
        );

        if (!repoRes.ok) throw new Error("Failed to fetch repos");
        const repos = await repoRes.json();

        let totalStars = 0;
        let totalForks = 0;
        let topRepo = { name: "", stars: 0 };

        const langBytes = {};

        // 🔹 Loop repos
        for (const repo of repos) {
            totalStars += repo.stargazers_count;
            totalForks += repo.forks_count;

            if (repo.stargazers_count > topRepo.stars) {
                topRepo = {
                    name: repo.name,
                    stars: repo.stargazers_count,
                };
            }

            // 🔹 Fetch language bytes per repo
            const langRes = await fetch(repo.languages_url, { headers });
            if (!langRes.ok) continue;

            const data = await langRes.json();

            for (const lang in data) {
                langBytes[lang] = (langBytes[lang] || 0) + data[lang];
            }
        }

        // 🔹 Convert to percentages
        const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0);

        const topLangs = Object.entries(langBytes)
            .map(([lang, bytes]) => ({
                lang,
                percent: ((bytes / totalBytes) * 100).toFixed(1),
            }))
            .sort((a, b) => b.percent - a.percent)
            .slice(0, 5);

        // 🔹 SVG layout
        let y = 90;

        const bars = topLangs
            .map(({ lang, percent }) => {
                const width = percent * 2;
                const color = LANGUAGE_COLORS[lang] || LANGUAGE_COLORS.default;

                const el = `
          <text x="20" y="${y}" class="label">${lang}</text>
          <rect x="120" y="${y - 10}" width="160" height="10" rx="5" fill="#30363d"/>
          <rect x="120" y="${y - 10}" width="${width}" height="10" rx="5" fill="${color}"/>
          <text x="290" y="${y}" class="label">${percent}%</text>
        `;
                y += 22;
                return el;
            })
            .join("");

        const height = Math.max(200, y);

        const svg = `
    <svg width="420" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .title { font: 600 16px sans-serif; fill: #c9d1d9; }
        .stat { font: 12px sans-serif; fill: #8b949e; }
        .label { font: 11px sans-serif; fill: #8b949e; }
      </style>

      <rect width="100%" height="100%" rx="12" fill="#0d1117" stroke="#30363d"/>

      <text x="20" y="30" class="title">${username}'s Stats</text>

      <!-- Stats -->
      <text x="20" y="48" class="stat">⭐ Stars: ${totalStars}</text>
      <text x="140" y="48" class="stat">🍴 Forks: ${totalForks}</text>
      <text x="260" y="48" class="stat">🏆 Top Repo: ${topRepo.name}</text>

      <text x="20" y="70" class="title">Top Languages</text>

      ${bars}
    </svg>
    `;

        return new Response(svg, {
            headers: {
                "Content-Type": "image/svg+xml",
                "Cache-Control": "s-maxage=3600",
            },
        });
    } catch (err) {
        return new Response(
            `<svg><text x="20" y="20" fill="red">${err.message}</text></svg>`,
            { headers: { "Content-Type": "image/svg+xml" }, status: 500 }
        );
    }
}