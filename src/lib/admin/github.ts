/**
 * Commits content.json back to the repository through the GitHub REST API, which
 * makes Vercel rebuild and publish the change.
 *
 * Why git rather than a database: the site stays fully static, so a GitHub outage
 * only stops *editing* — visitors are unaffected. Content also gets version
 * history and a revert path for free, and this needs no dependency beyond fetch.
 * The cost is that a save takes roughly a minute to appear, not a second.
 */

const CONTENT_PATH = "src/data/content.json";
const API = "https://api.github.com";

type Config = { token: string; owner: string; repo: string; branch: string };

function readConfig(): Config | { error: string } {
  const token = (process.env.GITHUB_TOKEN ?? "").trim();
  const slug = (process.env.GITHUB_REPO ?? "").trim();
  const branch = (process.env.GITHUB_BRANCH ?? "main").trim();
  if (!token) return { error: "GITHUB_TOKEN is not set on the server." };
  if (!slug.includes("/")) {
    return { error: 'GITHUB_REPO must look like "owner/repository".' };
  }
  const [owner, repo] = slug.split("/", 2);
  if (!owner || !repo) return { error: 'GITHUB_REPO must look like "owner/repository".' };
  return { token, owner, repo, branch };
}

export const githubConfigured = () => !("error" in readConfig());

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

/** Current blob sha, or null when the file does not exist yet. */
async function currentSha(cfg: Config): Promise<string | null> {
  const url = `${API}/repos/${cfg.owner}/${cfg.repo}/contents/${CONTENT_PATH}?ref=${encodeURIComponent(cfg.branch)}`;
  const res = await fetch(url, { headers: headers(cfg.token), cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(await describe(res, "reading the current file"));
  const body = (await res.json()) as { sha?: string };
  return body.sha ?? null;
}

async function describe(res: Response, what: string): Promise<string> {
  let detail = "";
  try {
    const body = (await res.json()) as { message?: string };
    detail = body.message ? ` — ${body.message}` : "";
  } catch {
    /* non-JSON error body */
  }
  if (res.status === 401) return `GitHub rejected the token (401)${detail}.`;
  if (res.status === 403) {
    return `GitHub refused the request (403)${detail}. The token likely lacks Contents: write on this repository.`;
  }
  if (res.status === 404) {
    return `GitHub returned 404${detail}. Check GITHUB_REPO and that the token can see it.`;
  }
  return `GitHub failed while ${what} (${res.status})${detail}.`;
}

export type CommitResult =
  | { ok: true; commit: string; url: string }
  | { ok: false; error: string };

export async function commitContent(json: string, message: string): Promise<CommitResult> {
  const cfg = readConfig();
  if ("error" in cfg) return { ok: false, error: cfg.error };

  const put = async (sha: string | null) =>
    fetch(`${API}/repos/${cfg.owner}/${cfg.repo}/contents/${CONTENT_PATH}`, {
      method: "PUT",
      headers: headers(cfg.token),
      cache: "no-store",
      body: JSON.stringify({
        message,
        content: Buffer.from(json, "utf8").toString("base64"),
        branch: cfg.branch,
        ...(sha ? { sha } : {}),
      }),
    });

  try {
    let res = await put(await currentSha(cfg));

    // 409/422 means someone else moved the file since we read its sha — re-read
    // once and reapply. This is last-write-wins by design: the studio is
    // single-user, and git history holds whatever got overwritten.
    if (res.status === 409 || res.status === 422) {
      res = await put(await currentSha(cfg));
    }

    if (!res.ok) return { ok: false, error: await describe(res, "writing the file") };

    const body = (await res.json()) as { commit?: { sha?: string; html_url?: string } };
    return {
      ok: true,
      commit: (body.commit?.sha ?? "").slice(0, 7),
      url: body.commit?.html_url ?? "",
    };
  } catch (cause) {
    const reason = cause instanceof Error ? cause.message : String(cause);
    return { ok: false, error: `Could not reach GitHub: ${reason}` };
  }
}
