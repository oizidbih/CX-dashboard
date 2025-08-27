import React from 'react';
import { ArrowRight, Users, Settings, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { Persona, Service, TouchPoint, SimulationState } from '../types';

interface JourneyVisualizerProps {
  personas: Persona[];
  services: Service[];
  touchPoints: TouchPoint[];
  simulationState: SimulationState;
  isSimulating: boolean;
}

const JourneyVisualizer: React.FC<JourneyVisualizerProps> = ({
  personas,
  services,
  touchPoints,
  simulationState,
  isSimulating
}) => {
  const enabledServices = services.filter(s => s.enabled);

  const getPersonaImpact = (personaId: string) => {
    return simulationState.personaImpacts.find(pi => pi.personaId === personaId);
  };

  const getTouchPointScore = (personaId: string, touchPointId: string) => {
    const personaImpact = getPersonaImpact(personaId);
    const touchPointImpact = personaImpact?.touchPointImpacts.find(tpi => tpi.touchPointId === touchPointId);
    return touchPointImpact?.score || 0;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getServicesForTouchPoint = (touchPointId: string) => {
    return enabledServices.filter(service => 
      service.fulfillment[touchPointId] && 
      Object.values(service.fulfillment[touchPointId]).some(value => value > 0)
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Customer Journey Visualization</h1>
          <p className="text-slate-600 mt-2">Visualize how services impact each persona's journey through touchpoints</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span>Excellent (80+)</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Good (60-79)</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>{'Needs Work (<60)'}</span>
          </div>
        </div>
      </div>

      {/* Journey Maps */}
      <div className="space-y-8">
        {personas.map((persona) => {
          const personaImpact = getPersonaImpact(persona.id);
          
          return (
            <div key={persona.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/60 shadow-sm">
              {/* Persona Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{persona.name}</h2>
                    <p className="text-slate-600">{persona.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500">
                      <span>{persona.group} • Score: {persona.score}</span>
                      <span>•</span>
                      <span>{persona.relevance}% strategic relevance</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500 mb-1">Overall Score</div>
                  <div className={`text-3xl font-bold ${getScoreTextColor(personaImpact?.overallScore || 0)}`}>
                    {personaImpact?.overallScore || 0}
                  </div>
                </div>
              </div>

              {/* Journey Flow */}
              <div className="relative">
                <div className="flex items-center justify-between">
                  {persona.journey.map((touchPointId, index) => {
                    const touchPoint = touchPoints.find(tp => tp.id === touchPointId);
                    const score = getTouchPointScore(persona.id, touchPointId);
                    const touchPointServices = getServicesForTouchPoint(touchPointId);
                    const needs = persona.needs[touchPointId];
                    
                    if (!touchPoint) return null;

                    return (
                      <React.Fragment key={touchPointId}>
                        <div className="flex-1 max-w-xs">
                          {/* Touchpoint Card */}
                          <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200 relative">
                            {/* Score Indicator */}
                            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
                              <div className={`w-4 h-4 rounded-full ${getScoreColor(score)}`}></div>
                            </div>

                            {/* Touchpoint Info */}
                            <div className="mb-4">
                              <h3 className="font-semibold text-slate-800 mb-1">{touchPoint.name}</h3>
                              <p className="text-xs text-slate-600 mb-3">{touchPoint.description}</p>
                              <div className={`text-2xl font-bold ${getScoreTextColor(score)}`}>
                                {score}
                              </div>
                            </div>

                            {/* Needs Breakdown */}
                            {needs && (
                              <div className="space-y-2 mb-4">
                                <div className="text-xs text-slate-500 font-medium">Customer Needs</div>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-slate-600">CES</span>
                                    <span className="text-slate-800">{needs.ces}</span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span className="text-slate-600">Painpoints</span>
                                    <span className="text-slate-800">{needs.mitigatedPainpoints}</span>
                                  </div>
                                  <div className="flex justify-between text-xs">
                                    <span className="text-slate-600">WOW</span>
                                    <span className="text-slate-800">{needs.wowMoments}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Active Services */}
                            <div className="space-y-2">
                              <div className="text-xs text-slate-500 font-medium">Active Services</div>
                              {touchPointServices.length > 0 ? (
                                <div className="space-y-1">
                                  {touchPointServices.slice(0, 2).map((service) => (
                                    <div key={service.id} className="flex items-center space-x-2">
                                      <Settings className="w-3 h-3 text-emerald-600" />
                                      <span className="text-xs text-slate-700 truncate">{service.name}</span>
                                    </div>
                                  ))}
                                  {touchPointServices.length > 2 && (
                                    <div className="text-xs text-slate-500">
                                      +{touchPointServices.length - 2} more
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <AlertTriangle className="w-3 h-3 text-yellow-500" />
                                  <span className="text-xs text-slate-500">No services active</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Arrow */}
                        {index < persona.journey.length - 1 && (
                          <div className="flex items-center justify-center px-4">
                            <ArrowRight className="w-6 h-6 text-slate-400" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Journey Flow Line */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 -z-10 transform -translate-y-1/2"></div>
              </div>

              {/* Persona Insights */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/60">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Journey Efficiency</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {Math.round((personaImpact?.overallScore || 0) * 0.85)}%
                  </div>
                  <div className="text-xs text-blue-700 mt-1">
                    Based on touchpoint performance
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200/60">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800">Service Coverage</span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-900">
                    {Math.round((enabledServices.length / Math.max(services.length, 1)) * 100)}%
                  </div>
                  <div className="text-xs text-emerald-700 mt-1">
                    {enabledServices.length} of {services.length} services active
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200/60">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-800">Impact Weight</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-900">
                    {personaImpact?.weightedScore || 0}
                  </div>
                  <div className="text-xs text-purple-700 mt-1">
                    Volume × Relevance weighted
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {personas.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">No customer journeys to visualize</h3>
          <p className="text-slate-600 mb-6">Add personas in the Personas tab to see their customer journey visualization.</p>
        </div>
      )}
    </div>
  );
};

export default JourneyVisualizer;
