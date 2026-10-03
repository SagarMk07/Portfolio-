export type Project = {
  id: string
  number: string
  title: string
  shortTitle: string
  category: string
  description: string
  technologies: string[]
  kind: 'medical' | 'shopping' | 'travel' | 'water'
  github?: string
  liveDemo?: string
  featured: boolean
  overview: string
  problem: string
  approach: string
  system: string
  implementation: string
  result: string
  lessons: string
}

export const projects: Project[] = [
  {
    id: 'medassist-ai', number: '01', title: 'MedAssist AI', shortTitle: 'MedAssist', category: 'HEALTHCARE · AI SYSTEMS',
    description: 'A healthcare assistant exploring how computer vision and language models can make health information easier to navigate.',
    technologies: ['React', 'Computer Vision', 'OCR', 'AI / ML', 'Supabase'], kind: 'medical', featured: true,
    overview: 'MedAssist AI is an exploration of an AI-powered healthcare assistant. The project brings image understanding and conversational interaction into one focused experience.',
    problem: 'Health information can be difficult to interpret, especially when useful context is spread across documents and images.',
    approach: 'The product is designed around a simple exchange: provide relevant input, let AI help interpret it, then present the result in a clear interface.',
    system: 'A React interface connects computer-vision and OCR workflows to an AI layer, with Supabase supporting the application data layer.',
    implementation: 'The work centers on connecting client-side experiences to OCR and AI capabilities while keeping the interaction understandable.',
    result: 'A working project concept. Clinical validation, user outcomes, and measured results have not been published.',
    lessons: 'Healthcare interfaces need to make uncertainty visible and keep people in control of decisions.'
  },
  {
    id: 'smartshopper-guardian', number: '02', title: 'SmartShopper Guardian AI', shortTitle: 'SmartShopper', category: 'BROWSER TOOLS · PRODUCT INTELLIGENCE',
    description: 'A shopping safety and product intelligence concept that brings AI analysis and price context closer to the point of purchase.',
    technologies: ['Chrome Extension', 'JavaScript / TypeScript', 'AI', 'Product Analysis', 'Price Comparison'], kind: 'shopping', featured: true,
    overview: 'SmartShopper Guardian AI is a browser extension concept for more informed online shopping, combining product analysis with price comparison.',
    problem: 'Comparing products and judging a listing often means switching between pages and piecing together scattered details.',
    approach: 'Keep useful context close to the product page, with an assistant that can analyze product information and surface comparison signals.',
    system: 'A browser extension gathers page context and presents a compact product intelligence experience, with AI analysis and comparison as its core capabilities.',
    implementation: 'The project explores extension UI, page context, and the integration boundary between browser-side code and AI services.',
    result: 'Project details and measured shopping outcomes are not published.',
    lessons: 'A useful assistant has to show where its information comes from and make comparison feel effortless.'
  },
  {
    id: 'ai-trip-planner', number: '03', title: 'AI Personalized Trip Planner', shortTitle: 'Trip Planner', category: 'TRAVEL · GENERATIVE AI',
    description: 'A travel planning platform built to turn personal preferences into a practical, map-aware itinerary.',
    technologies: ['React', 'Node.js', 'Gemini / Vertex AI', 'Firebase', 'Google Maps'], kind: 'travel', featured: true,
    overview: 'The AI Personalized Trip Planner explores using generative AI to create travel plans informed by a person’s preferences and place context.',
    problem: 'Planning a trip can mean juggling preferences, destinations, logistics, and separate mapping tools.',
    approach: 'Bring trip preferences and AI-generated planning into one workflow, then connect the plan to a map so places have useful context.',
    system: 'A React client works with a Node.js service, Gemini or Vertex AI, Firebase, and Google Maps integrations.',
    implementation: 'The central engineering work is coordinating generated recommendations with saved trip data and map-based place information.',
    result: 'No usage metrics or trip-planning outcomes have been published.',
    lessons: 'Generated plans become more useful when they stay editable and connect to real places.'
  },
  {
    id: 'rainwater-recommendation', number: '04', title: 'AI-Based Rainwater Harvesting Recommendation System', shortTitle: 'Rainwater System', category: 'SUSTAINABILITY · MACHINE LEARNING',
    description: 'A recommendation system applying machine learning and data analysis to rainwater harvesting decisions.',
    technologies: ['Python', 'Machine Learning', 'Data Analysis', 'Recommendation Systems'], kind: 'water', featured: true,
    overview: 'This project investigates how data and machine learning can support rainwater harvesting recommendations.',
    problem: 'Choosing a harvesting approach depends on local conditions and the available information about a site.',
    approach: 'Use a recommendation-system framing to connect input data with a more useful next step for planning.',
    system: 'A Python-based analysis and machine-learning workflow forms the core of the recommendation system.',
    implementation: 'The project focuses on preparing data, applying a model, and translating its output into a recommendation.',
    result: 'No validated recommendations or measured environmental impact have been published.',
    lessons: 'Recommendations are only as useful as the assumptions and data behind them.'
  }
]

export const projectById = (id: string) => projects.find((project) => project.id === id)
