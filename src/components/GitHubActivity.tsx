import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Github } from 'lucide-react'
import { LineReveal } from './LineReveal'
import { fadeUpVariants, revealItemVariants, staggerVariants } from '../lib/motion'

type Repo = { id: number; name: string; html_url: string; description: string | null; language: string | null; fork: boolean; updated_at: string }
type Profile = { public_repos: number; followers: number }
type GitHubData = { profile: Profile; repos: Repo[] }
type GitHubState = 'loading' | 'ready' | 'fallback'
type CacheEntry = { value: GitHubData | null; expiresAt: number }

const profileUrl = 'https://github.com/SagarMk07'
const cacheKey = 'sagar-portfolio-github-v1'
const cacheDuration = 5 * 60 * 1000
const failureCacheDuration = 5 * 60 * 1000
let cachedData: CacheEntry | null = null
let pendingRequest: Promise<GitHubData> | null = null

function getGitHubData(): Promise<GitHubData> {
  if (!cachedData) {
    try {
      const stored = window.sessionStorage.getItem(cacheKey)
      if (stored) cachedData = JSON.parse(stored) as CacheEntry
    } catch { /* Storage can be unavailable in private browsing. */ }
  }
  if (cachedData && cachedData.expiresAt > Date.now()) return cachedData.value ? Promise.resolve(cachedData.value) : Promise.reject(new Error('GitHub data is in a short retry cooldown'))
  if (pendingRequest) return pendingRequest

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 8000)
  const request = Promise.all([
    fetch('https://api.github.com/users/SagarMk07', { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error('GitHub profile request failed')
      return response.json() as Promise<Profile>
    }),
    fetch('https://api.github.com/users/SagarMk07/repos?sort=updated&per_page=12', { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error('GitHub repositories request failed')
      return response.json() as Promise<Repo[]>
    }),
  ]).then(([profile, repositories]) => {
    const repos = repositories.filter(repo => !repo.fork).sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at)).slice(0, 3)
    const value = { profile, repos }
    cachedData = { value, expiresAt: Date.now() + cacheDuration }
    try { window.sessionStorage.setItem(cacheKey, JSON.stringify(cachedData)) } catch { /* Continue with in-memory cache only. */ }
    return value
  }).catch(error => {
    cachedData = { value: null, expiresAt: Date.now() + failureCacheDuration }
    try { window.sessionStorage.setItem(cacheKey, JSON.stringify(cachedData)) } catch { /* Continue with in-memory cache only. */ }
    throw error
  }).finally(() => {
    window.clearTimeout(timeout)
    pendingRequest = null
  })
  pendingRequest = request
  return request
}

function RepositorySkeleton() {
  return <div className="repo-skeleton-list" role="status" aria-label="Fetching public repositories">
    {[0, 1, 2].map(index => <div className="repo-skeleton-row" key={index}><span className="repo-num">0{index + 1}</span><div><i/><i/></div><i className="repo-skeleton-language"/></div>)}
  </div>
}

export function GitHubActivity() {
  const reduceMotion = useReducedMotion()
  const [repos, setRepos] = useState<Repo[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [state, setState] = useState<GitHubState>('loading')

  useEffect(() => {
    let active = true
    getGitHubData().then(data => {
      if (!active) return
      setProfile(data.profile)
      setRepos(data.repos)
      setState('ready')
    }).catch(() => {
      if (active) setState('fallback')
    })
    return () => { active = false }
  }, [])

  return <section className="github-section" id="github" data-cursor-theme="dark">
    <div className="github-top"><div><motion.div className="section-kicker" variants={fadeUpVariants} initial={reduceMotion ? false : 'hidden'} whileInView={reduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.3 }}><span>04 /</span> OPEN SOURCE</motion.div><LineReveal as="h2" lines={['BUILDING IN', <em>PUBLIC.</em>]}/></div><motion.a className="github-profile" href={profileUrl} target="_blank" rel="noreferrer" variants={fadeUpVariants} initial={reduceMotion ? false : 'hidden'} whileInView={reduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.3 }}><Github size={18}/> <span>@SagarMk07</span><ArrowUpRight size={17}/></motion.a></div>
    <div className="github-content">
      <div className="github-copy"><motion.p variants={fadeUpVariants} initial={reduceMotion ? false : 'hidden'} whileInView={reduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.3 }}>Code is where ideas meet their edge cases. Explore the repositories and experiments behind the work.</motion.p>
        <motion.div className="github-stats-slot" aria-live="polite" variants={fadeUpVariants} initial={reduceMotion ? false : 'hidden'} whileInView={reduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.3 }}>{state === 'ready' && profile ? <div className="github-stats"><span><b>{profile.public_repos}</b> PUBLIC REPOSITORIES</span><span><b>{profile.followers}</b> FOLLOWERS</span></div> : state === 'loading' ? <div className="github-stats-skeleton" aria-label="Fetching profile totals"><i/><i/></div> : <div className="github-stats-empty"/>}</motion.div>
        <motion.div className="github-state-slot" aria-live="polite" variants={fadeUpVariants} initial={reduceMotion ? false : 'hidden'} whileInView={reduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.3 }}>{state === 'loading' ? <p className="github-fallback">FETCHING PUBLIC REPOSITORY DATA</p> : state === 'fallback' ? <p className="github-fallback">Live repository data is unavailable right now. The profile remains open to explore.</p> : null}</motion.div>
      </div>
      <motion.div className="repo-list" aria-busy={state === 'loading'} variants={staggerVariants} initial={reduceMotion ? false : 'hidden'} whileInView={reduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.18 }}>{state === 'ready' && repos.length > 0 ? repos.map((repo, index) => <motion.a variants={revealItemVariants} className="repo-row" href={repo.html_url} target="_blank" rel="noreferrer" key={repo.id}><span className="repo-num">0{index + 1}</span><div><strong>{repo.name}</strong><p>{repo.description || 'Repository description not provided.'}</p></div><span className="repo-language">{repo.language || '—'}</span><ArrowUpRight size={17}/></motion.a>) : state === 'loading' ? <RepositorySkeleton/> : <motion.a variants={revealItemVariants} className="repo-row repo-fallback" href={profileUrl} target="_blank" rel="noreferrer"><span className="repo-num">↗</span><div><strong>Explore all repositories</strong><p>View projects, experiments, and code on GitHub.</p></div><span className="repo-language">GITHUB</span><ArrowUpRight size={17}/></motion.a>}</motion.div>
    </div>
    <motion.div className="contrib-link" variants={fadeUpVariants} initial={reduceMotion ? false : 'hidden'} whileInView={reduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.3 }}><span className="contrib-mark">▦</span><span>CONTRIBUTION ACTIVITY</span><span className="contrib-note">View the live contribution graph on GitHub</span><a href={`${profileUrl}?tab=overview`} target="_blank" rel="noreferrer" aria-label="View GitHub contribution activity"><ArrowUpRight size={17}/></a></motion.div>
  </section>
}
