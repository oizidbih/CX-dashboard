export interface Persona {
  id: string;
  name: string;
  description: string;
  group: 'People' | 'Business' | 'Focus Assets'; // New persona groups
  score: number; // Replaced percentage with score
  relevance: number; // Strategic importance (0-100)
  needs: Record<string, PersonaNeeds>; // Keyed by touchpoint ID
  journey: string[]; // Ordered list of touchpoint IDs
}

export interface PersonaNeeds {
  ces: number; // Customer Effort Score (0-100) - replaced speed
  mitigatedPainpoints: number; // Mitigated Painpoints (0-100) - replaced simplicity
  wowMoments: number; // WOW moments delivered (0-100) - replaced personalization
}

export interface Service {
  id: string;
  name: string;
  description: string;
  cost: number; // Annual cost in dollars
  fulfillment: Record<string, ServiceFulfillment>; // Keyed by touchpoint ID
  enabled: boolean;
}

export interface ServiceFulfillment {
  ces: number; // How well it addresses CES needs (0-100)
  mitigatedPainpoints: number; // How well it addresses mitigated painpoints needs (0-100)
  wowMoments: number; // How well it addresses WOW moments needs (0-100)
}

export interface TouchPoint {
  id: string;
  name: string;
  description: string;
}

export interface TouchPointImpact {
  touchPointId: string;
  score: number; // Overall CX score for this touchpoint (0-100)
  improvement: number; // Improvement from baseline (-100 to +100)
}

export interface PersonaImpact {
  personaId: string;
  overallScore: number; // Average score across all touchpoints
  weightedScore: number; // Score weighted by persona relevance
  touchPointImpacts: TouchPointImpact[];
}

export interface SimulationState {
  totalCost: number;
  overallImpact: number; // Weighted average across all personas
  personaImpacts: PersonaImpact[];
  enabledServices: number;
  roi: number; // Return on investment metric
}
