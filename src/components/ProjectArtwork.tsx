import type { Project } from '../data/projects'

export function ProjectArtwork({ project }: { project: Project }) {
  return <div className={`artwork artwork-${project.kind}`} aria-label={`${project.shortTitle} project artwork`} role="img">
    <div className="artwork-grid" />
    {project.kind === 'medical' && <div className="med-scene"><div className="med-orbit orbit-a"/><div className="med-orbit orbit-b"/><div className="med-core">+</div><span className="scan-label">SIGNAL / 01</span><i className="scan-line"/></div>}
    {project.kind === 'shopping' && <div className="shop-scene"><div className="shop-window"><div className="shop-bar"><b/><b/><b/><span>PRODUCT INTELLIGENCE</span></div><div className="shop-content"><div className="product-shape"/><div className="shop-lines"><i/><i/><i/><strong>ANALYSIS READY</strong></div></div><div className="shop-scan">↗  PRICE SIGNAL <span>VISIBLE</span></div></div></div>}
    {project.kind === 'travel' && <div className="travel-scene"><div className="map-contours"/><svg viewBox="0 0 500 360" aria-hidden="true"><path d="M38 265 C 120 242, 110 165, 192 186 S 277 264, 321 174 S 394 120, 459 85" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 7"/><circle cx="38" cy="265" r="5"/><circle cx="192" cy="186" r="5"/><circle cx="321" cy="174" r="5"/><circle cx="459" cy="85" r="5"/></svg><span className="map-label label-one">01 / ORIGIN</span><span className="map-label label-two">03 / ARRIVAL</span><div className="travel-coord">12°58′ N<br/>77°35′ E</div></div>}
    {project.kind === 'water' && <div className="water-scene"><div className="water-ring ring-one"/><div className="water-ring ring-two"/><div className="water-drop">↓</div><div className="water-data data-a">RAIN<br/><b>INPUT</b></div><div className="water-data data-b">ROOF<br/><b>AREA</b></div><div className="water-data data-c">STORE<br/><b>OUTPUT</b></div><div className="water-flow"/></div>}
    <div className="artwork-corner">{project.number} — FIELD NOTE</div>
  </div>
}
