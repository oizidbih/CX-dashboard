import React, { useState, useMemo } from "react";
import {
  Users,
  Target,
  Settings,
  BarChart3,
  TrendingUp,
  Play,
  Pause,
} from "lucide-react";
import PersonaManager from "./components/PersonaManager";
import ServiceManager from "./components/ServiceManager";
import JourneyVisualizer from "./components/JourneyVisualizer";
import ImpactDashboard from "./components/ImpactDashboard";
import { Persona, Service, TouchPoint, SimulationState } from "./types";

const initialPersonas: Persona[] = [
  {
    id: "1",
    name: "Tech-Savvy Professional",
    description:
      "Young professionals who value efficiency and digital solutions",
    volume: 35,
    relevance: 85,
    needs: {
      onboarding: { speed: 90, simplicity: 70, personalization: 60 },
      support: { speed: 95, simplicity: 80, personalization: 40 },
      billing: { speed: 85, simplicity: 90, personalization: 30 },
      "feature-discovery": { speed: 80, simplicity: 60, personalization: 85 },
    },
    journey: ["onboarding", "feature-discovery", "support", "billing"],
  },
  {
    id: "2",
    name: "Traditional Enterprise User",
    description:
      "Established business users who prefer proven, reliable solutions",
    volume: 45,
    relevance: 75,
    needs: {
      onboarding: { speed: 60, simplicity: 85, personalization: 70 },
      support: { speed: 70, simplicity: 90, personalization: 80 },
      billing: { speed: 65, simplicity: 95, personalization: 60 },
      "feature-discovery": { speed: 50, simplicity: 85, personalization: 75 },
    },
    journey: ["onboarding", "support", "billing", "feature-discovery"],
  },
  {
    id: "3",
    name: "Small Business Owner",
    description: "Cost-conscious users who need maximum value and simplicity",
    volume: 20,
    relevance: 90,
    needs: {
      onboarding: { speed: 75, simplicity: 95, personalization: 50 },
      support: { speed: 80, simplicity: 95, personalization: 70 },
      billing: { speed: 90, simplicity: 100, personalization: 40 },
      "feature-discovery": { speed: 70, simplicity: 90, personalization: 60 },
    },
    journey: ["billing", "onboarding", "support", "feature-discovery"],
  },
];

const initialServices: Service[] = [
  {
    id: "1",
    name: "AI-Powered Chatbot",
    description: "Intelligent chatbot for instant customer support",
    cost: 50000,
    fulfillment: {
      onboarding: { speed: 85, simplicity: 70, personalization: 90 },
      support: { speed: 95, simplicity: 80, personalization: 85 },
      billing: { speed: 70, simplicity: 60, personalization: 40 },
      "feature-discovery": { speed: 80, simplicity: 75, personalization: 95 },
    },
    enabled: false,
  },
  {
    id: "2",
    name: "Self-Service Portal",
    description: "Comprehensive self-service platform for common tasks",
    cost: 75000,
    fulfillment: {
      onboarding: { speed: 90, simplicity: 85, personalization: 60 },
      support: { speed: 80, simplicity: 95, personalization: 50 },
      billing: { speed: 95, simplicity: 90, personalization: 30 },
      "feature-discovery": { speed: 85, simplicity: 80, personalization: 70 },
    },
    enabled: false,
  },
  {
    id: "3",
    name: "Personalized Onboarding",
    description: "Tailored onboarding experience based on user profile",
    cost: 40000,
    fulfillment: {
      onboarding: { speed: 75, simplicity: 80, personalization: 95 },
      support: { speed: 60, simplicity: 70, personalization: 80 },
      billing: { speed: 50, simplicity: 60, personalization: 70 },
      "feature-discovery": { speed: 70, simplicity: 65, personalization: 90 },
    },
    enabled: false,
  },
  {
    id: "4",
    name: "Video Tutorial Library",
    description: "Comprehensive video guides for all features and processes",
    cost: 25000,
    fulfillment: {
      onboarding: { speed: 60, simplicity: 90, personalization: 40 },
      support: { speed: 70, simplicity: 85, personalization: 30 },
      billing: { speed: 65, simplicity: 80, personalization: 20 },
      "feature-discovery": { speed: 85, simplicity: 90, personalization: 50 },
    },
    enabled: false,
  },
  {
    id: "5",
    name: "Dedicated Account Manager",
    description: "Personal account manager for high-value customers",
    cost: 120000,
    fulfillment: {
      onboarding: { speed: 80, simplicity: 85, personalization: 100 },
      support: { speed: 90, simplicity: 90, personalization: 100 },
      billing: { speed: 85, simplicity: 95, personalization: 90 },
      "feature-discovery": { speed: 75, simplicity: 80, personalization: 95 },
    },
    enabled: false,
  },
];

const touchPoints: TouchPoint[] = [
  {
    id: "onboarding",
    name: "Onboarding",
    description: "Initial setup and account creation",
  },
  {
    id: "support",
    name: "Customer Support",
    description: "Help and troubleshooting",
  },
  {
    id: "billing",
    name: "Billing & Payments",
    description: "Payment processing and invoicing",
  },
  {
    id: "feature-discovery",
    name: "Feature Discovery",
    description: "Learning about new features",
  },
];

function App() {
  const [activeTab, setActiveTab] = useState<
    "personas" | "services" | "journey" | "impact"
  >("impact");
  const [personas, setPersonas] = useState<Persona[]>(initialPersonas);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isSimulating, setIsSimulating] = useState(false);

  const simulationState: SimulationState = useMemo(() => {
    const enabledServices = services.filter((s) => s.enabled);
    const totalCost = enabledServices.reduce(
      (sum, service) => sum + service.cost,
      0
    );

    // Calculate impact for each persona and touchpoint
    const personaImpacts = personas.map((persona) => {
      const touchPointImpacts = touchPoints.map((touchPoint) => {
        const personaNeeds = persona.needs[touchPoint.id];
        if (!personaNeeds)
          return { touchPointId: touchPoint.id, score: 0, improvement: 0 };

        // Calculate baseline score (average of needs)
        const baselineScore =
          (personaNeeds.speed +
            personaNeeds.simplicity +
            personaNeeds.personalization) /
          3;

        // Calculate service fulfillment
        const serviceFulfillment = {
          speed: 0,
          simplicity: 0,
          personalization: 0,
        };
        if (enabledServices.length > 0) {
          enabledServices.forEach((service) => {
            const fulfillment = service.fulfillment[touchPoint.id];
            if (fulfillment) {
              serviceFulfillment.speed = Math.max(
                serviceFulfillment.speed,
                fulfillment.speed
              );
              serviceFulfillment.simplicity = Math.max(
                serviceFulfillment.simplicity,
                fulfillment.simplicity
              );
              serviceFulfillment.personalization = Math.max(
                serviceFulfillment.personalization,
                fulfillment.personalization
              );
            }
          });
        }

        // Calculate weighted score based on how well services fulfill needs
        const fulfillmentScore =
          Math.min(personaNeeds.speed, serviceFulfillment.speed) * 0.4 +
          Math.min(personaNeeds.simplicity, serviceFulfillment.simplicity) *
            0.4 +
          Math.min(
            personaNeeds.personalization,
            serviceFulfillment.personalization
          ) *
            0.2;

        const finalScore = Math.min(
          100,
          baselineScore * 0.3 + fulfillmentScore * 0.7
        );
        const improvement = finalScore - baselineScore;

        return {
          touchPointId: touchPoint.id,
          score: Math.round(finalScore),
          improvement: Math.round(improvement),
        };
      });

      const overallScore =
        touchPointImpacts.reduce((sum, impact) => sum + impact.score, 0) /
        touchPointImpacts.length;
      const weightedScore = overallScore * (persona.relevance / 100);

      return {
        personaId: persona.id,
        overallScore: Math.round(overallScore),
        weightedScore: Math.round(weightedScore),
        touchPointImpacts,
      };
    });

    const overallImpact =
      personaImpacts.reduce((sum, impact) => sum + impact.weightedScore, 0) /
      personaImpacts.length;

    return {
      totalCost,
      overallImpact: Math.round(overallImpact),
      personaImpacts,
      enabledServices: enabledServices.length,
      roi:
        totalCost > 0
          ? Math.round(((overallImpact - 50) * 1000) / totalCost)
          : 0,
    };
  }, [personas, services]);

  const tabs = [
    { id: "impact" as const, name: "Impact Dashboard", icon: BarChart3 },
    { id: "personas" as const, name: "Personas", icon: Users },
    { id: "services" as const, name: "Services", icon: Settings },
    { id: "journey" as const, name: "Journey Visualization", icon: Target },
  ];

  return (
    <div className="min-h-screen bg-dark-gradient relative overflow-hidden">
      {/* Background Orange Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-orange-breathing"></div>
        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-orange-600/8 rounded-full blur-3xl animate-orange-breathing"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl animate-subtle-float"></div>
      </div>

      {/* Header */}
      <header className="dark-card sticky top-0 z-50 border-b border-dark">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 orange-accent rounded-xl flex items-center justify-center shadow-orange-glow animate-orange-pulse-glow">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold orange-text-gradient">
                  CX Impact Simulator
                </h1>
                <p className="text-sm text-dark-secondary">
                  Service Investment Decision Tool
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="orange-accent text-white px-4 py-2 rounded-lg font-semibold shadow-orange-glow hover-orange-glow">
                Impact Score: {simulationState.overallImpact}
              </div>
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all hover-orange-glow ${
                  isSimulating
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-lg"
                    : "orange-accent text-white shadow-orange-glow"
                }`}
              >
                {isSimulating ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span>{isSimulating ? "Pause" : "Simulate"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-dark-surface/60 backdrop-blur-sm border-b border-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all relative hover-orange-glow ${
                    activeTab === tab.id
                      ? "text-orange-400 bg-orange-500/10"
                      : "text-dark-secondary hover:text-orange-300 hover:bg-dark-elevated/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 orange-accent shadow-orange-glow" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {activeTab === "impact" && (
          <ImpactDashboard
            simulationState={simulationState}
            personas={personas}
            services={services}
            touchPoints={touchPoints}
            isSimulating={isSimulating}
          />
        )}

        {activeTab === "personas" && (
          <PersonaManager
            personas={personas}
            setPersonas={setPersonas}
            touchPoints={touchPoints}
          />
        )}

        {activeTab === "services" && (
          <ServiceManager
            services={services}
            setServices={setServices}
            touchPoints={touchPoints}
            simulationState={simulationState}
          />
        )}

        {activeTab === "journey" && (
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
