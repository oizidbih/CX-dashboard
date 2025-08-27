import React, { useState, useMemo } from 'react';
import { Users, Target, Settings, BarChart3, TrendingUp, Eye, ChevronRight, Play, Pause } from 'lucide-react';
import PersonaManager from './components/PersonaManager';
import ServiceManager from './components/ServiceManager';
import JourneyVisualizer from './components/JourneyVisualizer';
import ImpactDashboard from './components/ImpactDashboard';
import { Persona, Service, TouchPoint, SimulationState } from './types';

const initialPersonas: Persona[] = [
  {
    id: '1',
    name: 'Individual Consumer',
    description: 'Personal users seeking intuitive and personalized experiences',
    group: 'People',
    score: 85,
    relevance: 80,
    needs: {
      'onboarding': { ces: 20, mitigatedPainpoints: 85, wowMoments: 90 },
      'discover-plan': { ces: 25, mitigatedPainpoints: 80, wowMoments: 85 },
      'navigate': { ces: 15, mitigatedPainpoints: 90, wowMoments: 75 },
      'use': { ces: 20, mitigatedPainpoints: 85, wowMoments: 95 },
      'recovery': { ces: 30, mitigatedPainpoints: 90, wowMoments: 80 }
    },
    journey: ['onboarding', 'discover-plan', 'navigate', 'use', 'recovery']
  },
  {
    id: '2',
    name: 'Enterprise Client',
    description: 'Business users requiring reliable and scalable solutions',
    group: 'Business',
    score: 75,
    relevance: 90,
    needs: {
      'onboarding': { ces: 35, mitigatedPainpoints: 95, wowMoments: 70 },
      'discover-plan': { ces: 40, mitigatedPainpoints: 90, wowMoments: 75 },
      'navigate': { ces: 25, mitigatedPainpoints: 95, wowMoments: 60 },
      'use': { ces: 30, mitigatedPainpoints: 85, wowMoments: 70 },
      'recovery': { ces: 45, mitigatedPainpoints: 100, wowMoments: 65 }
    },
    journey: ['onboarding', 'discover-plan', 'navigate', 'use', 'recovery']
  },
  {
    id: '3',
    name: 'Focus Assets',
    description: 'Revenue-generating services that drive business value',
    group: 'Focus Assets',
    score: 95,
    relevance: 100,
    needs: {
      'acquire': { ces: 15, mitigatedPainpoints: 85, wowMoments: 90 },
      'generate-revenue': { ces: 10, mitigatedPainpoints: 95, wowMoments: 100 },
      'retire': { ces: 25, mitigatedPainpoints: 90, wowMoments: 80 }
    },
    journey: ['acquire', 'generate-revenue', 'retire']
  }
];

const initialServices: Service[] = [
  {
    id: '1',
    name: 'Service Robots',
    description: 'Automated service delivery systems providing efficient and consistent experiences',
    cost: 80000,
    fulfillment: {
      'onboarding': { ces: 85, mitigatedPainpoints: 90, wowMoments: 70 },
      'discover-plan': { ces: 80, mitigatedPainpoints: 85, wowMoments: 75 },
      'navigate': { ces: 90, mitigatedPainpoints: 95, wowMoments: 65 },
      'use': { ces: 85, mitigatedPainpoints: 90, wowMoments: 70 },
      'recovery': { ces: 75, mitigatedPainpoints: 85, wowMoments: 60 },
      'acquire': { ces: 80, mitigatedPainpoints: 85, wowMoments: 70 },
      'generate-revenue': { ces: 90, mitigatedPainpoints: 95, wowMoments: 75 },
      'retire': { ces: 85, mitigatedPainpoints: 90, wowMoments: 65 }
    },
    enabled: false
  },
  {
    id: '2',
    name: 'Personal AI Concierge',
    description: 'Intelligent personal assistant providing tailored, high-touch customer experiences',
    cost: 120000,
    fulfillment: {
      'onboarding': { ces: 95, mitigatedPainpoints: 85, wowMoments: 100 },
      'discover-plan': { ces: 90, mitigatedPainpoints: 80, wowMoments: 95 },
      'navigate': { ces: 85, mitigatedPainpoints: 75, wowMoments: 90 },
      'use': { ces: 90, mitigatedPainpoints: 80, wowMoments: 100 },
      'recovery': { ces: 95, mitigatedPainpoints: 90, wowMoments: 95 },
      'acquire': { ces: 90, mitigatedPainpoints: 80, wowMoments: 95 },
      'generate-revenue': { ces: 95, mitigatedPainpoints: 85, wowMoments: 100 },
      'retire': { ces: 85, mitigatedPainpoints: 90, wowMoments: 90 }
    },
    enabled: false
  }
];

const touchPoints: TouchPoint[] = [
  { id: 'onboarding', name: 'Onboarding', description: 'Initial setup and getting started' },
  { id: 'discover-plan', name: 'Discover & Plan', description: 'Exploring options and making decisions' },
  { id: 'navigate', name: 'Navigate', description: 'Moving through the system and finding what you need' },
  { id: 'use', name: 'Use', description: 'Actively using the service to accomplish goals' },
  { id: 'recovery', name: 'Recovery', description: 'Getting help when something goes wrong' },
  { id: 'acquire', name: 'Acquire', description: 'Acquiring and onboarding new revenue-generating assets' },
  { id: 'generate-revenue', name: 'Generate Revenue', description: 'Operating and maximizing revenue from assets' },
  { id: 'retire', name: 'Retire', description: 'Decommissioning and transitioning assets out of service' }
];

// Helper function to get touchpoints for a specific persona group
const getTouchPointsForGroup = (group: 'People' | 'Business' | 'Focus Assets'): TouchPoint[] => {
  if (group === 'Focus Assets') {
    return touchPoints.filter(tp => ['acquire', 'generate-revenue', 'retire'].includes(tp.id));
  }
  return touchPoints.filter(tp => ['onboarding', 'discover-plan', 'navigate', 'use', 'recovery'].includes(tp.id));
};

function App() {
  const [activeTab, setActiveTab] = useState<'personas' | 'services' | 'journey' | 'impact'>('impact');
  const [personas, setPersonas] = useState<Persona[]>(initialPersonas);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isSimulating, setIsSimulating] = useState(false);

  const simulationState: SimulationState = useMemo(() => {
    const enabledServices = services.filter(s => s.enabled);
    const totalCost = enabledServices.reduce((sum, service) => sum + service.cost, 0);
    
    // Calculate impact for each persona and touchpoint
    const personaImpacts = personas.map(persona => {
      const touchPointImpacts = touchPoints.map(touchPoint => {
        const personaNeeds = persona.needs[touchPoint.id];
        if (!personaNeeds) return { touchPointId: touchPoint.id, score: 0, improvement: 0 };

        // Calculate baseline score (average of needs, note CES is inverted - lower is better)
        const baselineScore = ((100 - personaNeeds.ces) + personaNeeds.mitigatedPainpoints + personaNeeds.wowMoments) / 3;
        
        // Calculate service fulfillment
        let serviceFulfillment = { ces: 0, mitigatedPainpoints: 0, wowMoments: 0 };
        if (enabledServices.length > 0) {
          enabledServices.forEach(service => {
            const fulfillment = service.fulfillment[touchPoint.id];
            if (fulfillment) {
              serviceFulfillment.ces = Math.max(serviceFulfillment.ces, fulfillment.ces);
              serviceFulfillment.mitigatedPainpoints = Math.max(serviceFulfillment.mitigatedPainpoints, fulfillment.mitigatedPainpoints);
              serviceFulfillment.wowMoments = Math.max(serviceFulfillment.wowMoments, fulfillment.wowMoments);
            }
          });
        }

        // Calculate weighted score based on how well services fulfill needs
        // CES is inverted logic - higher service CES helps with lower persona CES needs
        const cesScore = Math.min(100 - personaNeeds.ces, serviceFulfillment.ces);
        const fulfillmentScore = (
          cesScore * 0.3 +
          Math.min(personaNeeds.mitigatedPainpoints, serviceFulfillment.mitigatedPainpoints) * 0.4 +
          Math.min(personaNeeds.wowMoments, serviceFulfillment.wowMoments) * 0.3
        );

        const finalScore = Math.min(100, baselineScore * 0.3 + fulfillmentScore * 0.7);
        const improvement = finalScore - baselineScore;

        return {
          touchPointId: touchPoint.id,
          score: Math.round(finalScore),
          improvement: Math.round(improvement)
        };
      });

      const overallScore = touchPointImpacts.reduce((sum, impact) => sum + impact.score, 0) / touchPointImpacts.length;
      const weightedScore = overallScore * (persona.score / 100) * (persona.relevance / 100);

      return {
        personaId: persona.id,
        overallScore: Math.round(overallScore),
        weightedScore: Math.round(weightedScore),
        touchPointImpacts
      };
    });

    const overallImpact = personaImpacts.reduce((sum, impact) => sum + impact.weightedScore, 0) / personaImpacts.length;

    return {
      totalCost,
      overallImpact: Math.round(overallImpact),
      personaImpacts,
      enabledServices: enabledServices.length,
      roi: totalCost > 0 ? Math.round((overallImpact - 50) * 1000 / totalCost) : 0
    };
  }, [personas, services]);

  const tabs = [
    { id: 'impact' as const, name: 'Impact Dashboard', icon: BarChart3 },
    { id: 'personas' as const, name: 'Personas', icon: Users },
    { id: 'services' as const, name: 'Services', icon: Settings },
    { id: 'journey' as const, name: 'Journey Visualization', icon: Target }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  CX Impact Simulator
                </h1>
                <p className="text-sm text-slate-600">Service Investment Decision Tool</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg font-semibold">
                Impact Score: {simulationState.overallImpact}
              </div>
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isSimulating 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isSimulating ? 'Pause' : 'Simulate'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/60 backdrop-blur-sm border-b border-slate-200/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all relative ${
                    activeTab === tab.id
                      ? 'text-blue-600 bg-blue-50/80'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50/80'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'impact' && (
          <ImpactDashboard 
            simulationState={simulationState}
            personas={personas}
            services={services}
            touchPoints={touchPoints}
            isSimulating={isSimulating}
          />
        )}
        
        {activeTab === 'personas' && (
          <PersonaManager 
            personas={personas}
            setPersonas={setPersonas}
            touchPoints={touchPoints}
            getTouchPointsForGroup={getTouchPointsForGroup}
          />
        )}
        
        {activeTab === 'services' && (
          <ServiceManager 
            services={services}
            setServices={setServices}
            touchPoints={touchPoints}
            simulationState={simulationState}
            getTouchPointsForGroup={getTouchPointsForGroup}
          />
        )}
        
        {activeTab === 'journey' && (
          <JourneyVisualizer 
            personas={personas}
            services={services}
            touchPoints={touchPoints}
            simulationState={simulationState}
            isSimulating={isSimulating}
          />
        )}
      </main>
    </div>
  );
}

export default App;
