export type ProjectKind = 'medical' | 'shopping' | 'travel' | 'water'

export type Project = {
  id: string
  number: string
  slug: string
  title: string
  shortTitle: string
  category: string
  shortDescription: string
  technologies: string[]
  kind: ProjectKind
  problem: string
  approach: string
  overview: string
  system: string
  systemSteps: string[]
  implementation: string
  result: string
  lessons: string
  github?: string
  liveDemo?: string
  image?: string
  featured: boolean
}

export const projects: Project[] = [
  {
    id: 'medassist-ai', number: '01', slug: 'medassist-ai', title: 'MedAssist AI', shortTitle: 'MedAssist',
    category: 'HEALTHCARE · AI SYSTEMS', kind: 'medical', featured: true,
    shortDescription: 'An AI-powered healthcare assistant combining symptom-related interaction, OCR, and supporting healthcare features.',
    overview: 'MedAssist AI is an AI-powered healthcare assistant designed to bring health-related assistance and document understanding into one interface.',
    problem: 'Healthcare-related information and assistance can be fragmented, making it difficult to find relevant context quickly.',
    approach: 'Bring AI assistance, symptom-related interaction, OCR, and supporting healthcare features together in a focused product experience.',
    system: 'Conceptual flow based on the project scope. The actual application architecture should be confirmed against the project source before describing implementation details as fact.',
    systemSteps: ['USER INPUT', 'REACT INTERFACE', 'OCR / VISION', 'AI / ML', 'SUPABASE'],
    implementation: 'The project combines a React interface with AI/ML, computer vision, OCR, and Supabase. The detailed service boundaries and data flow are not documented here.',
    result: 'No clinical validation, user outcomes, or performance figures are available. This portfolio makes no medical accuracy claims.',
    lessons: 'Healthcare experiences need clear limits, legible information, and people in control of decisions.',
    technologies: ['React', 'AI / ML', 'Computer Vision', 'OCR', 'Supabase'],
  },
  {
    id: 'smartshopper-guardian', number: '02', slug: 'smartshopper-guardian', title: 'SmartShopper Guardian AI', shortTitle: 'SmartShopper',
    category: 'BROWSER TOOLS · PRODUCT INTELLIGENCE', kind: 'shopping', featured: true,
    shortDescription: 'An AI-powered shopping safety and product intelligence browser extension.',
    overview: 'SmartShopper Guardian AI is a browser extension concept for assessing product details, reviews, and pricing across shopping platforms.',
    problem: 'Online shoppers have to piece together product trust, review signals, and price context across different pages and platforms.',
    approach: 'Extract product information from the current page and present AI-assisted product and review analysis alongside price comparison context.',
    system: 'Conceptual flow based on the stated extension behavior. Browser permissions, extraction details, and service architecture are not documented here.',
    systemSteps: ['SHOPPING PAGE', 'BROWSER EXTENSION', 'PRODUCT / REVIEW ANALYSIS', 'PRICE CONTEXT', 'SHOPPING SUMMARY'],
    implementation: 'The project uses a browser extension with JavaScript or TypeScript, AI, product analysis, review analysis, and price comparison. Specific extraction and comparison methods are not claimed.',
    result: 'No review accuracy, savings, or usage metrics are available.',
    lessons: 'Shopping guidance should make its signals understandable and keep the source listing in view.',
    technologies: ['Browser Extension', 'JavaScript / TypeScript', 'AI', 'Product Analysis', 'Review Analysis', 'Price Comparison'],
  },
  {
    id: 'ai-trip-planner', number: '03', slug: 'ai-trip-planner', title: 'AI Personalized Trip Planner', shortTitle: 'Trip Planner',
    category: 'TRAVEL · GENERATIVE AI', kind: 'travel', featured: true,
    shortDescription: 'An AI-powered travel planning platform that connects personal preferences, itinerary generation, and mapped places.',
    overview: 'The AI Personalized Trip Planner uses personal preferences as the starting point for an AI-assisted travel planning workflow.',
    problem: 'Travel planning spreads preferences, destination research, itinerary drafts, and location context across separate tools.',
    approach: 'Collect trip preferences, use Gemini or Vertex AI for itinerary generation, connect destinations with Google Maps, and support the planning workflow with Firebase.',
    system: 'Conceptual integration flow based on the project scope. The exact responsibilities of the Node.js service and Firebase data model are not documented here.',
    systemSteps: ['TRIP PREFERENCES', 'REACT / NODE.JS', 'GEMINI / VERTEX AI', 'GOOGLE MAPS', 'FIREBASE'],
    implementation: 'The named stack includes React, Node.js, Gemini or Vertex AI, Firebase, and Google Maps. This case study describes the intended workflow without claiming a specific production architecture.',
    result: 'No user statistics or measured planning outcomes are available.',
    lessons: 'Generated itineraries are most useful when they stay editable and connect recommendations to real locations.',
    technologies: ['React', 'Node.js', 'Gemini / Vertex AI', 'Firebase', 'Google Maps'],
  },
  {
    id: 'rainwater-recommendation', number: '04', slug: 'rainwater-recommendation', title: 'AI-Based Rainwater Harvesting Recommendation System', shortTitle: 'Rainwater System',
    category: 'SUSTAINABILITY · MACHINE LEARNING', kind: 'water', featured: true,
    shortDescription: 'An AI-based recommendation system for rainwater harvesting, using Python, machine learning, and data analysis.',
    overview: 'This project explores how machine learning and data analysis can inform rainwater harvesting recommendations.',
    problem: 'Selecting a rainwater harvesting approach depends on site inputs and a clear way to interpret them.',
    approach: 'Process the available inputs, apply recommendation logic, and present an output that can be understood in the context of the submitted data.',
    system: 'Conceptual data flow based on the stated recommendation-system scope. The input schema and model details are not documented here.',
    systemSteps: ['SITE INPUTS', 'DATA PROCESSING', 'MACHINE LEARNING', 'RECOMMENDATION LOGIC', 'OUTPUT'],
    implementation: 'The project is described as a Python, machine learning, and data analysis recommendation system. No specific model, dataset, or feature engineering is claimed.',
    result: 'No validated recommendations or environmental impact figures are available.',
    lessons: 'Recommendation quality depends on making the input assumptions and output reasoning clear.',
    technologies: ['Python', 'Machine Learning', 'Data Analysis', 'Recommendation System'],
  },
]

export const projectById = (id: string) => projects.find((project) => project.slug === id)
