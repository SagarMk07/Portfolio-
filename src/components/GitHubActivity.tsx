import { useEffect, useState } from 'react'
import { ArrowUpRight, Github } from 'lucide-react'

type Repo = { id: number; name: string; html_url: string; description: string | null; language: string | null; stargazers_count: number; fork: boolean; updated_at: string }
type Profile = { public_repos: number; followers: number }
const profileUrl = 'https://github.com/SagarMk07'

export function GitHubActivity() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'fallback'>('loading')
  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      fetch('https://api.github.com/users/SagarMk07', { signal: controller.signal }).then(r => { if (!r.ok) throw new Error('Profile unavailable'); return r.json() as Promise<Profile> }),
      fetch('https://api.github.com/users/SagarMk07/repos?sort=updated&per_page=100', { signal: controller.signal }).then(r => { if (!r.ok) throw new Error('Repositories unavailable'); return r.json() as Promise<Repo[]> }),
    ]).then(([person, repositories]) => {
      const selected = repositories.filter(repo => !repo.fork).sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at)).slice(0, 3)
      setProfile(person); setRepos(selected); setState('ready')
    }).catch(() => { if (!controller.signal.aborted) setState('fallback') })
    return () => controller.abort()
  }, [])
  return <section className="github-section" id="github"><div className="github-top"><div><div className="section-kicker"><span>06 /</span> OPEN SOURCE</div><h2>BUILDING IN<br/><em>PUBLIC.</em></h2></div><a className="github-profile" href={profileUrl} target="_blank" rel="noreferrer" data-cursor="OPEN"><Github size={18}/> <span>@SagarMk07</span><ArrowUpRight size={17}/></a></div>
    <div className="github-content"><div className="github-copy"><p>Code is where ideas meet their edge cases. Explore the repositories and experiments behind the work.</p>{state === 'ready' && <div className="github-stats"><span><b>{profile?.public_repos}</b> PUBLIC REPOSITORIES</span><span><b>{profile?.followers}</b> FOLLOWERS</span></div>}{state === 'fallback' && <p className="github-fallback">Live repository data is unavailable right now. The profile remains open to explore.</p>}{state === 'loading' && <p className="github-fallback">Loading public profile data…</p>}</div>
      <div className="repo-list" aria-live="polite">{state === 'ready' && repos.length > 0 ? repos.map((repo, i) => <a className="repo-row" href={repo.html_url} target="_blank" rel="noreferrer" key={repo.id}><span className="repo-num">0{i + 1}</span><div><strong>{repo.name}</strong><p>{repo.description || 'Repository description not provided.'}</p></div><span className="repo-language">{repo.language || '—'}</span><ArrowUpRight size={17}/></a>) : <a className="repo-row repo-fallback" href={profileUrl} target="_blank" rel="noreferrer"><span className="repo-num">↗</span><div><strong>Explore all repositories</strong><p>View projects, experiments, and code on GitHub.</p></div><span className="repo-language">GITHUB</span><ArrowUpRight size={17}/></a>}</div>
    </div>
    <div className="contrib-link"><span className="contrib-mark">▦</span><span>CONTRIBUTION ACTIVITY</span><span className="contrib-note">View the live contribution graph on GitHub</span><a href={`${profileUrl}?tab=overview&from=2026-01-01&to=2026-12-31`} target="_blank" rel="noreferrer" aria-label="View GitHub contribution activity"><ArrowUpRight size={17}/></a></div>
  </section>
}
