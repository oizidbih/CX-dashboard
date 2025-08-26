export interface Persona {
  id: string;
  name: string;
  description: string;
  volume: number; // Percentage of total customer base
  relevance: number; // Strategic importance (0-100)
  needs: Record<string, PersonaNeeds>; // Keyed by touchpoint ID
  journey: string[]; // Ordered list of touchpoint IDs
}

export interface PersonaNeeds {
  speed: number; // 0-100
  simplicity: number; // 0-100
  personalization: number; // 0-100
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
  speed: number; // How well it addresses speed needs (0-100)
  simplicity: number; // How well it addresses simplicity needs (0-100)
  personalization: number; // How well it addresses personalization needs (0-100)
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
