export function TechnologyList({ technologies, compact = false }: { technologies: string[]; compact?: boolean }) {
  return <ul className={`technology-list ${compact ? 'technology-list-compact' : ''}`} aria-label="Technologies used">
    {technologies.map((technology) => <li key={technology}>{technology}</li>)}
  </ul>
}
