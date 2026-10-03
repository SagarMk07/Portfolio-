import type { Project } from '../data/projects'

function MockupFrame({ brand, children }: { brand: string; children: React.ReactNode }) {
  return <div className="mockup-frame" aria-hidden="true">
    <div className="mockup-chrome"><div className="mockup-dots"><i/><i/><i/></div><span>{brand}</span><span className="mockup-status">CONCEPT VIEW</span></div>
    {children}
  </div>
}

function MedicalMockup() {
  return <MockupFrame brand="MEDASSIST / ASSISTANT"><div className="mockup-medical">
    <aside className="mockup-rail"><b>+</b><i/><i/><i/><i/></aside>
    <div className="mockup-main"><div className="mockup-overline">HEALTH ASSISTANT / CONCEPT</div><strong>What would you like help with?</strong><p>Share a question or add a document for text recognition.</p><div className="mockup-input">Describe your concern <span>↗</span></div><div className="mockup-upload"><span>↥</span><div><b>ADD A DOCUMENT</b><small>OCR INPUT / PRESENTATION ONLY</small></div></div></div>
    <div className="mockup-aside"><span className="mockup-overline">YOUR SESSION</span><div className="mockup-placeholder-line"/><div className="mockup-placeholder-line short"/><div className="mockup-disclaimer">For informational support<br/>Not a diagnosis</div></div>
  </div></MockupFrame>
}

function ShoppingMockup() {
  return <MockupFrame brand="SMARTSHOPPER / PAGE ANALYSIS"><div className="mockup-shopping">
    <div className="mockup-product"><div className="mockup-product-shape"/><span className="mockup-overline">CURRENT LISTING</span><strong>Product details</strong><div className="mockup-placeholder-line"/><div className="mockup-placeholder-line short"/><div className="mockup-price-line"><span>PRICE CONTEXT</span><b>ANALYSIS PENDING</b></div></div>
    <div className="mockup-analysis"><div className="mockup-overline">SHOPPING INTELLIGENCE</div><strong>Signals to review</strong><div className="mockup-signal"><i/> REVIEW PATTERNS <span>↗</span></div><div className="mockup-signal"><i/> LISTING DETAILS <span>↗</span></div><div className="mockup-signal"><i/> PRICE COMPARISON <span>↗</span></div><div className="mockup-disclaimer">Illustrative interface<br/>No score or savings shown</div></div>
  </div></MockupFrame>
}

function TravelMockup() {
  return <MockupFrame brand="TRIP PLANNER / ITINERARY"><div className="mockup-travel">
    <div className="mockup-itinerary"><div className="mockup-overline">YOUR TRIP / DRAFT</div><strong>Built around your preferences</strong><div className="mockup-trip-stop"><span>01</span><div><b>Suggested stop</b><small>Matched to your trip brief</small></div></div><div className="mockup-trip-stop"><span>02</span><div><b>Nearby place</b><small>Location context via Maps</small></div></div><div className="mockup-trip-stop"><span>03</span><div><b>Flexible time</b><small>Adjust this itinerary</small></div></div></div>
    <div className="mockup-map"><div className="mockup-map-lines"/><svg viewBox="0 0 360 240"><path d="M34 188 C 86 163 72 83 143 110 S 220 174 258 92 S 306 63 331 39"/><circle cx="34" cy="188" r="5"/><circle cx="143" cy="110" r="5"/><circle cx="258" cy="92" r="5"/><circle cx="331" cy="39" r="5"/></svg><span>MAP / ROUTE CONCEPT</span></div>
  </div></MockupFrame>
}

function WaterMockup() {
  return <MockupFrame brand="RAINWATER / RECOMMENDATION"><div className="mockup-water">
    <div className="mockup-water-inputs"><div className="mockup-overline">SITE PROFILE / INPUTS</div><strong>Start with local context</strong>{['Roof area', 'Rainfall data', 'Site conditions'].map(label => <div className="mockup-field" key={label}><span>{label}</span><b>NOT ENTERED</b></div>)}<small>INPUTS SHOWN FOR PRESENTATION</small></div>
    <div className="mockup-water-result"><div className="mockup-water-symbol">↓</div><div className="mockup-overline">OUTPUT / PREVIEW</div><strong>Recommendation pending</strong><p>Enter site inputs to explore a harvesting option.</p><div className="mockup-result-line"/></div>
  </div></MockupFrame>
}

const mockups = { medical: MedicalMockup, shopping: ShoppingMockup, travel: TravelMockup, water: WaterMockup }

export function ProjectArtwork({ project }: { project: Project }) {
  const Mockup = mockups[project.kind]
  return <div className={`artwork artwork-${project.kind}`} aria-label={`${project.title} conceptual interface mockup, for presentation only; not an application screenshot`} role="img">
    <div className="artwork-grid" aria-hidden="true"/><Mockup/>
    <div className="artwork-corner">{project.number} / CONCEPT MOCKUP · NOT A SCREENSHOT</div>
  </div>
}
