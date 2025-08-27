import React from 'react';
import { DollarSign, Users, Target, TrendingUp, AlertCircle, CheckCircle, ArrowUp, ArrowDown } from 'lucide-react';
import { SimulationState, Persona, Service, TouchPoint } from '../types';

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
  isSimulating
}) => {
  const enabledServices = services.filter(s => s.enabled);
  const totalScore = personas.reduce((sum, p) => sum + p.score, 0);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement > 0) return 'text-emerald-600';
    if (improvement < 0) return 'text-red-600';
    return 'text-slate-600';
  };

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Overall Impact</p>
              <p className={`text-3xl font-bold ${getScoreColor(simulationState.overallImpact).split(' ')[0]}`}>
                {simulationState.overallImpact}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getScoreColor(simulationState.overallImpact)}`}>
              <Target className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            {simulationState.overallImpact >= 70 ? (
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-500" />
            )}
            <span className="text-sm text-slate-600">
              {simulationState.overallImpact >= 70 ? 'Excellent' : simulationState.overallImpact >= 50 ? 'Good' : 'Needs Improvement'}
            </span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Investment</p>
              <p className="text-3xl font-bold text-slate-800">
                ${(simulationState.totalCost / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <span className="text-sm text-slate-600">
              {enabledServices.length} service{enabledServices.length !== 1 ? 's' : ''} enabled
            </span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">ROI Score</p>
              <p className={`text-3xl font-bold ${simulationState.roi > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {simulationState.roi > 0 ? '+' : ''}{simulationState.roi}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              simulationState.roi > 0 ? 'bg-emerald-50' : 'bg-red-50'
            }`}>
              <TrendingUp className={`w-6 h-6 ${simulationState.roi > 0 ? 'text-emerald-600' : 'text-red-600'}`} />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <span className="text-sm text-slate-600">
              Impact per $1K invested
            </span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Score</p>
              <p className="text-3xl font-bold text-slate-800">{totalScore}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <span className="text-sm text-slate-600">
              {personas.length} persona group{personas.length !== 1 ? 's' : ''} analyzed
            </span>
          </div>
        </div>
      </div>

      {/* Persona Impact Breakdown */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/60 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Persona Impact Analysis</h2>
        <div className="space-y-6">
          {simulationState.personaImpacts.map((impact) => {
            const persona = personas.find(p => p.id === impact.personaId);
            if (!persona) return null;

            return (
              <div key={impact.personaId} className="border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getScoreColor(impact.overallScore)}`}>
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">{persona.name}</h3>
                      <p className="text-sm text-slate-600">{persona.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(impact.overallScore).split(' ')[0]}`}>
                      {impact.overallScore}
                    </div>
                    <div className="text-sm text-slate-600">
                      {persona.group} • Score: {persona.score} • {persona.relevance}% relevance
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {impact.touchPointImpacts.map((tpImpact) => {
                    const touchPoint = touchPoints.find(tp => tp.id === tpImpact.touchPointId);
                    if (!touchPoint) return null;

                    return (
                      <div key={tpImpact.touchPointId} className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-slate-700">{touchPoint.name}</h4>
                          <div className={`text-lg font-bold ${getScoreColor(tpImpact.score).split(' ')[0]}`}>
                            {tpImpact.score}
                          </div>
                        </div>
                        <div className={`flex items-center space-x-1 text-sm ${getImprovementColor(tpImpact.improvement)}`}>
                          {tpImpact.improvement > 0 ? (
                            <ArrowUp className="w-3 h-3" />
                          ) : tpImpact.improvement < 0 ? (
                            <ArrowDown className="w-3 h-3" />
                          ) : null}
                          <span>{tpImpact.improvement > 0 ? '+' : ''}{tpImpact.improvement}</span>
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
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200/60">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">No Services Enabled</h3>
              <p className="text-blue-700 mb-4">
                Enable services in the Services tab to see their impact on customer experience across different personas and touchpoints.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-blue-600 font-medium">Recommended starting points:</p>
                <ul className="text-sm text-blue-600 space-y-1 ml-4">
                  <li>• Service Robots for efficient and consistent experiences</li>
                  <li>• Personal AI Concierge for high-touch, personalized interactions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Services Summary */}
      {enabledServices.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/60 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Active Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enabledServices.map((service) => (
              <div key={service.id} className="border border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-800">{service.name}</h3>
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                </div>
                <p className="text-sm text-slate-600 mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    ${(service.cost / 1000).toFixed(0)}K/year
                  </span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
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
