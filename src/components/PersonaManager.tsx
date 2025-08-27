import React, { useState } from 'react';
import { Users, Edit3, Plus, Trash2, BarChart3 } from 'lucide-react';
import { Persona, TouchPoint } from '../types';

interface PersonaManagerProps {
  personas: Persona[];
  setPersonas: (personas: Persona[]) => void;
  touchPoints: TouchPoint[];
  getTouchPointsForGroup: (group: 'People' | 'Business' | 'Focus Assets') => TouchPoint[];
}

const PersonaManager: React.FC<PersonaManagerProps> = ({
  personas,
  setPersonas,
  touchPoints,
  getTouchPointsForGroup
}) => {
  const [editingPersona, setEditingPersona] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const updatePersona = (id: string, updates: Partial<Persona>) => {
    setPersonas(personas.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePersona = (id: string) => {
    setPersonas(personas.filter(p => p.id !== id));
  };

  const addPersona = () => {
    const group = 'People';
    const relevantTouchPoints = getTouchPointsForGroup(group);
    const newPersona: Persona = {
      id: Date.now().toString(),
      name: 'New Persona',
      description: 'Description of the new persona',
      group: group,
      score: 50,
      relevance: 50,
      needs: relevantTouchPoints.reduce((acc, tp) => ({
        ...acc,
        [tp.id]: { ces: 50, mitigatedPainpoints: 50, wowMoments: 50 }
      }), {}),
      journey: relevantTouchPoints.map(tp => tp.id)
    };
    setPersonas([...personas, newPersona]);
    setEditingPersona(newPersona.id);
    setShowAddForm(false);
  };

  const NeedsEditor: React.FC<{ persona: Persona }> = ({ persona }) => (
    <div className="space-y-4">
      {getTouchPointsForGroup(persona.group).map((touchPoint) => {
        const needs = persona.needs[touchPoint.id] || { ces: 50, mitigatedPainpoints: 50, wowMoments: 50 };
        
        return (
          <div key={touchPoint.id} className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-medium text-slate-800 mb-3">{touchPoint.name}</h4>
            <div className="space-y-3">
              {(['ces', 'mitigatedPainpoints', 'wowMoments'] as const).map((need) => {
                const labelMap = {
                  ces: 'CES (Customer Effort Score)',
                  mitigatedPainpoints: 'Mitigated Painpoints',
                  wowMoments: 'WOW Moments'
                };
                
                return (
                  <div key={need} className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-slate-600">{labelMap[need]}</label>
                      <span className="text-sm text-slate-500">{needs[need]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={needs[need]}
                      onChange={(e) => {
                        const newNeeds = {
                          ...persona.needs,
                          [touchPoint.id]: {
                            ...needs,
                            [need]: parseInt(e.target.value)
                          }
                        };
                        updatePersona(persona.id, { needs: newNeeds });
                      }}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Customer Personas</h1>
          <p className="text-slate-600 mt-2">Define your customer segments and their specific needs at each touchpoint</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Persona</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Add New Persona</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          </div>
          <div className="flex items-center justify-center py-12 border-2 border-dashed border-slate-300 rounded-xl">
            <button
              onClick={addPersona}
              className="flex items-center space-x-3 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-medium">Create New Persona</div>
                <div className="text-sm text-slate-500">Define a new customer segment</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Personas List */}
      <div className="space-y-6">
        {personas.map((persona) => (
          <div key={persona.id} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            {/* Persona Header */}
            <div className="p-6 border-b border-slate-200/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    {editingPersona === persona.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={persona.name}
                          onChange={(e) => updatePersona(persona.id, { name: e.target.value })}
                          className="text-xl font-semibold bg-transparent border-b border-slate-300 focus:border-blue-500 outline-none"
                        />
                        <textarea
                          value={persona.description}
                          onChange={(e) => updatePersona(persona.id, { description: e.target.value })}
                          className="text-slate-600 bg-transparent border border-slate-300 rounded px-2 py-1 text-sm w-full resize-none"
                          rows={2}
                        />
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-semibold text-slate-800">{persona.name}</h3>
                        <p className="text-slate-600">{persona.description}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm text-slate-500">Group</div>
                    <div className="text-lg font-semibold text-slate-800">{persona.group}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">Score</div>
                    <div className="text-lg font-semibold text-slate-800">{persona.score}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">Relevance</div>
                    <div className="text-lg font-semibold text-slate-800">{persona.relevance}%</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingPersona(editingPersona === persona.id ? null : persona.id)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deletePersona(persona.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Group, Score and Relevance Controls */}
              {editingPersona === persona.id && (
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">Persona Group</label>
                    <select
                      value={persona.group}
                      onChange={(e) => {
                        const newGroup = e.target.value as 'People' | 'Business' | 'Focus Assets';
                        const relevantTouchPoints = getTouchPointsForGroup(newGroup);
                        const newNeeds = relevantTouchPoints.reduce((acc, tp) => ({
                          ...acc,
                          [tp.id]: persona.needs[tp.id] || { ces: 50, mitigatedPainpoints: 50, wowMoments: 50 }
                        }), {});
                        const newJourney = relevantTouchPoints.map(tp => tp.id);
                        updatePersona(persona.id, { 
                          group: newGroup,
                          needs: newNeeds,
                          journey: newJourney
                        });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-blue-500 outline-none"
                    >
                      <option value="People">People</option>
                      <option value="Business">Business</option>
                      <option value="Focus Assets">Focus Assets</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium text-slate-600">Score</label>
                        <span className="text-sm text-slate-500">{persona.score}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={persona.score}
                        onChange={(e) => updatePersona(persona.id, { score: parseInt(e.target.value) })}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium text-slate-600">Strategic Relevance</label>
                        <span className="text-sm text-slate-500">{persona.relevance}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={persona.relevance}
                        onChange={(e) => updatePersona(persona.id, { relevance: parseInt(e.target.value) })}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Needs Configuration */}
            {editingPersona === persona.id && (
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-slate-600" />
                  <h4 className="text-lg font-semibold text-slate-800">Touchpoint Needs</h4>
                </div>
                <NeedsEditor persona={persona} />
              </div>
            )}

            {/* Needs Summary (when not editing) */}
            {editingPersona !== persona.id && (
              <div className="p-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {getTouchPointsForGroup(persona.group).map((touchPoint) => {
                    const needs = persona.needs[touchPoint.id];
                    if (!needs) return null;
                    
                    const avgNeed = Math.round(((100 - needs.ces) + needs.mitigatedPainpoints + needs.wowMoments) / 3);
                    
                    return (
                      <div key={touchPoint.id} className="bg-slate-50 rounded-lg p-4">
                        <h5 className="font-medium text-slate-700 mb-2">{touchPoint.name}</h5>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">CES</span>
                            <span className="text-slate-700">{needs.ces}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Painpoints</span>
                            <span className="text-slate-700">{needs.mitigatedPainpoints}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">WOW</span>
                            <span className="text-slate-700">{needs.wowMoments}</span>
                          </div>
                          <div className="pt-1 border-t border-slate-200">
                            <div className="flex justify-between text-sm font-medium">
                              <span className="text-slate-600">Impact</span>
                              <span className="text-slate-800">{avgNeed}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {personas.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">No personas defined</h3>
          <p className="text-slate-600 mb-6">Create your first customer persona to get started with the simulation.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Add Your First Persona
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonaManager;
