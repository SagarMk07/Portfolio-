export function SystemFlow({ steps }: { steps: string[] }) {
  return <div className="system-flow-wrap">
    <div className="system-flow-label"><span>CONCEPTUAL SYSTEM FLOW</span><span>TO BE CONFIRMED AGAINST PROJECT SOURCE</span></div>
    <ol className="system-flow">{steps.map((step, index) => <li key={`${step}-${index}`}><span className="flow-index">0{index + 1}</span><strong>{step}</strong>{index < steps.length - 1 && <i aria-hidden="true">→</i>}</li>)}</ol>
  </div>
}
