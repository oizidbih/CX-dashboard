import React from "react";
import {
  DollarSign,
  Users,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { SimulationState, Persona, Service, TouchPoint } from "../types";

interface ImpactDashboardProps {
  simulationState: SimulationState;
  personas: Persona[];
  services: Service[];
  touchPoints: TouchPoint[];
  isSimulating: boolean;
}

const ImpactDashboard: React.FC<ImpactDashboardProps> = ({
  simulationState,
  personas,
  services,
  touchPoints,
}) => {
  const enabledServices = services.filter((s) => s.enabled);
  const totalVolume = personas.reduce((sum, p) => sum + p.volume, 0);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 bg-emerald-500/20";
    if (score >= 60) return "text-orange-400 bg-orange-500/20";
    return "text-red-400 bg-red-500/20";
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement > 0) return "text-emerald-400";
    if (improvement < 0) return "text-red-400";
    return "text-dark-secondary";
  };

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="dark-card rounded-2xl p-6 shadow-dark-card hover-orange-glow animate-subtle-float">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-dark-secondary">
                Overall Impact
              </p>
              <p
                className={`text-3xl font-bold ${
                  getScoreColor(simulationState.overallImpact).split(" ")[0]
                }`}
              >
                {simulationState.overallImpact}
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${getScoreColor(
                simulationState.overallImpact
              )} shadow-orange-glow`}
            >
              <Target className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            {simulationState.overallImpact >= 70 ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-orange-400" />
            )}
            <span className="text-sm text-dark-secondary">
              {simulationState.overallImpact >= 70
                ? "Excellent"
                : simulationState.overallImpact >= 50
                ? "Good"
                : "Needs Improvement"}
            </span>
          </div>
        </div>

        <div
          className="dark-card rounded-2xl p-6 shadow-dark-card hover-orange-glow animate-subtle-float"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-dark-secondary">
                Total Investment
              </p>
              <p className="text-3xl font-bold text-dark-primary">
                ${(simulationState.totalCost / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center shadow-orange-glow">
              <DollarSign className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <span className="text-sm text-dark-secondary">
              {enabledServices.length} service
              {enabledServices.length !== 1 ? "s" : ""} enabled
            </span>
          </div>
        </div>

        <div
          className="dark-card rounded-2xl p-6 shadow-dark-card hover-orange-glow animate-subtle-float"
          style={{ animationDelay: "1s" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-dark-secondary">
                ROI Score
              </p>
              <p
                className={`text-3xl font-bold ${
                  simulationState.roi > 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {simulationState.roi > 0 ? "+" : ""}
                {simulationState.roi}
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-orange-glow ${
                simulationState.roi > 0 ? "bg-emerald-500/20" : "bg-red-500/20"
              }`}
            >
              <TrendingUp
                className={`w-6 h-6 ${
                  simulationState.roi > 0 ? "text-emerald-400" : "text-red-400"
                }`}
              />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <span className="text-sm text-dark-secondary">
              Impact per $1K invested
            </span>
          </div>
        </div>

        <div
          className="dark-card rounded-2xl p-6 shadow-dark-card hover-orange-glow animate-subtle-float"
          style={{ animationDelay: "1.5s" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-dark-secondary">
                Customer Coverage
              </p>
              <p className="text-3xl font-bold text-dark-primary">
                {totalVolume}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center shadow-orange-glow">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <span className="text-sm text-dark-secondary">
              {personas.length} persona{personas.length !== 1 ? "s" : ""}{" "}
              analyzed
            </span>
          </div>
        </div>
      </div>

      {/* Persona Impact Breakdown */}
      <div className="dark-card rounded-2xl p-8 shadow-dark-card">
        <h2 className="text-2xl font-bold orange-text-gradient mb-6">
          Persona Impact Analysis
        </h2>
        <div className="space-y-6">
          {simulationState.personaImpacts.map((impact) => {
            const persona = personas.find((p) => p.id === impact.personaId);
            if (!persona) return null;

            return (
              <div
                key={impact.personaId}
                className="border border-dark rounded-xl p-6 bg-dark-elevated/50 hover-orange-glow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${getScoreColor(
                        impact.overallScore
                      )} shadow-orange-glow`}
                    >
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-dark-primary">
                        {persona.name}
                      </h3>
                      <p className="text-sm text-dark-secondary">
                        {persona.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-2xl font-bold ${
                        getScoreColor(impact.overallScore).split(" ")[0]
                      }`}
                    >
                      {impact.overallScore}
                    </div>
                    <div className="text-sm text-dark-secondary">
                      {persona.volume}% volume • {persona.relevance}% relevance
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {impact.touchPointImpacts.map((tpImpact) => {
                    const touchPoint = touchPoints.find(
                      (tp) => tp.id === tpImpact.touchPointId
                    );
                    if (!touchPoint) return null;

                    return (
                      <div
                        key={tpImpact.touchPointId}
                        className="bg-dark-surface/80 rounded-lg p-4 border border-dark hover-orange-glow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-dark-primary">
                            {touchPoint.name}
                          </h4>
                          <div
                            className={`text-lg font-bold ${
                              getScoreColor(tpImpact.score).split(" ")[0]
                            }`}
                          >
                            {tpImpact.score}
                          </div>
                        </div>
                        <div
                          className={`flex items-center space-x-1 text-sm ${getImprovementColor(
                            tpImpact.improvement
                          )}`}
                        >
                          {tpImpact.improvement > 0 ? (
                            <ArrowUp className="w-3 h-3" />
                          ) : tpImpact.improvement < 0 ? (
                            <ArrowDown className="w-3 h-3" />
                          ) : null}
                          <span>
                            {tpImpact.improvement > 0 ? "+" : ""}
                            {tpImpact.improvement}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Recommendations */}
      {enabledServices.length === 0 && (
        <div className="dark-card rounded-2xl p-8 shadow-dark-card border border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-orange-600/5">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0 shadow-orange-glow">
              <AlertCircle className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-orange-300 mb-2">
                No Services Enabled
              </h3>
              <p className="text-dark-secondary mb-4">
                Enable services in the Services tab to see their impact on
                customer experience across different personas and touchpoints.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-orange-400 font-medium">
                  Recommended starting points:
                </p>
                <ul className="text-sm text-dark-secondary space-y-1 ml-4">
                  <li>
                    • Self-Service Portal for immediate impact across all
                    touchpoints
                  </li>
                  <li>
                    • AI-Powered Chatbot for personalized support experiences
                  </li>
                  <li>
                    • Video Tutorial Library for cost-effective onboarding
                    improvement
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Services Summary */}
      {enabledServices.length > 0 && (
        <div className="dark-card rounded-2xl p-8 shadow-dark-card">
          <h2 className="text-2xl font-bold orange-text-gradient mb-6">
            Active Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enabledServices.map((service) => (
              <div
                key={service.id}
                className="border border-dark rounded-xl p-6 bg-dark-elevated/50 hover-orange-glow animate-subtle-float"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-dark-primary">
                    {service.name}
                  </h3>
                  <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-orange-glow animate-orange-breathing"></div>
                </div>
                <p className="text-sm text-dark-secondary mb-4">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-dark-primary">
                    ${(service.cost / 1000).toFixed(0)}K/year
                  </span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImpactDashboard;
