export async function GET(req) {
    try {
        // Safely construct URL (handles frameworks where req.url may be relative)
        const url = new URL(req.url, `http://${req.headers.get('host')}`);
        const searchParams = url.searchParams;

        // Extract query parameters
        const username = searchParams.get("username") || "octocat";
        const repo1Name = searchParams.get("repo1");
        const repo2Name = searchParams.get("repo2");

        // Validate input
        if (!repo1Name || !repo2Name) {
            return new Response(
                `<svg><text x="20" y="20" fill="red">Error: Please provide repo1 and repo2</text></svg>`,
                { headers: { "Content-Type": "image/svg+xml" }, status: 400 }
            );
        }

        // Headers for GitHub API
        const headers = {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        };

        // Escape function for SVG text
        const escapeSVG = (str) =>
            String(str)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&apos;");

        // Function to map languages to colors
        const getLanguageColor = (language) => {
            const colors = {
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
            return colors[language] || colors.default;
        };

        // Fetch GitHub repo safely
        const fetchRepo = async (repoName) => {
            const res = await fetch(`https://api.github.com/repos/${username}/${repoName}`, { headers });
            if (!res.ok) {
                const text = await res.text();
                console.error(`GitHub API error for ${repoName}:`, text);
                return null;
            }
            try {
                return await res.json();
            } catch (err) {
                console.error(`Failed to parse JSON for ${repoName}:`, err);
                return null;
            }
        };

        const [repo1, repo2] = await Promise.all([fetchRepo(repo1Name), fetchRepo(repo2Name)]);

        if (!repo1 || !repo2) {
            return new Response(
                `<svg><text x="20" y="20" fill="red">Error: Could not fetch one or both repos</text></svg>`,
                { headers: { "Content-Type": "image/svg+xml" }, status: 404 }
            );
        }

        const repo1LangColor = getLanguageColor(repo1.language);
        const repo2LangColor = getLanguageColor(repo2.language);

        // Build SVG
        const svg = `
        <svg width="420" height="100" xmlns="http://www.w3.org/2000/svg">
        <style>
            .title { font: 600 16px sans-serif; fill: #c9d1d9; }
            .repo { font: 14px sans-serif; fill: #8b949e; }
            .desc { font: 12px sans-serif; fill: #6e7681; }
            .dot { r: 6; }
        </style>

        <rect width="100%" height="100%" rx="12" fill="#0d1117" stroke="#30363d"/>

        <!-- Card Title -->
        <text x="20" y="35" class="title">Featured Repos</text>

        <!-- Repo 1 -->
        <circle cx="20" cy="55" class="dot" fill="${repo1LangColor}" />
        <text x="35" y="60" class="repo">${escapeSVG(String(repo1.name || "Unknown"))}</text>
        <text x="35" y="75" class="desc">${escapeSVG(String(repo1.description || "No description"))}</text>

        <!-- Repo 2 -->
        <circle cx="220" cy="55" class="dot" fill="${repo2LangColor}" />
        <text x="235" y="60" class="repo">${escapeSVG(String(repo2.name || "Unknown"))}</text>
        <text x="235" y="75" class="desc">${escapeSVG(String(repo2.description || "No description"))}</text>
        </svg>
        `;

        return new Response(svg, {
            headers: {
                "Content-Type": "image/svg+xml",
                "Cache-Control": "s-maxage=3600",
            },
        });
    } catch (err) {
        console.error("Unexpected server error:", err);
        return new Response(
            `<svg><text x="20" y="20" fill="red">${err.message}</text></svg>`,
            { headers: { "Content-Type": "image/svg+xml" }, status: 500 }
        );
    }
}