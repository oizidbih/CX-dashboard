import React, { useState } from "react";
import { Users, Edit3, Plus, Trash2, BarChart3 } from "lucide-react";
import { Persona, TouchPoint } from "../types";

interface PersonaManagerProps {
  personas: Persona[];
  setPersonas: (personas: Persona[]) => void;
  touchPoints: TouchPoint[];
}

const PersonaManager: React.FC<PersonaManagerProps> = ({
  personas,
  setPersonas,
  touchPoints,
}) => {
  const [editingPersona, setEditingPersona] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const updatePersona = (id: string, updates: Partial<Persona>) => {
    setPersonas(personas.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePersona = (id: string) => {
    setPersonas(personas.filter((p) => p.id !== id));
  };

  const addPersona = () => {
    const newPersona: Persona = {
      id: Date.now().toString(),
      name: "New Persona",
      description: "Description of the new persona",
      volume: 10,
      relevance: 50,
      needs: touchPoints.reduce(
        (acc, tp) => ({
          ...acc,
          [tp.id]: { speed: 50, simplicity: 50, personalization: 50 },
        }),
        {}
      ),
      journey: touchPoints.map((tp) => tp.id),
    };
    setPersonas([...personas, newPersona]);
    setEditingPersona(newPersona.id);
    setShowAddForm(false);
  };

  const NeedsEditor: React.FC<{ persona: Persona }> = ({ persona }) => (
    <div className="space-y-4">
      {touchPoints.map((touchPoint) => {
        const needs = persona.needs[touchPoint.id] || {
          speed: 50,
          simplicity: 50,
          personalization: 50,
        };

        return (
          <div key={touchPoint.id} className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-medium text-slate-800 mb-3">
              {touchPoint.name}
            </h4>
            <div className="space-y-3">
              {(["speed", "simplicity", "personalization"] as const).map(
                (need) => (
                  <div key={need} className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-slate-600 capitalize">
                        {need}
                      </label>
                      <span className="text-sm text-slate-500">
                        {needs[need]}%
                      </span>
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
                            [need]: parseInt(e.target.value),
                          },
                        };
                        updatePersona(persona.id, { needs: newNeeds });
                      }}
                      className="w-full h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                )
              )}
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
          <h1 className="text-3xl font-bold orange-text-gradient">
            Customer Personas
          </h1>
          <p className="text-dark-secondary mt-2">
            Define your customer segments and their specific needs at each
            touchpoint
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 orange-accent hover-orange-glow text-white px-6 py-3 rounded-xl font-medium transition-all shadow-orange-glow"
        >
          <Plus className="w-5 h-5" />
          <span>Add Persona</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="dark-card rounded-2xl p-8 shadow-dark-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-dark-primary">
              Add New Persona
            </h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-dark-secondary hover:text-orange-400 text-2xl"
            >
              ×
            </button>
          </div>
          <div className="flex items-center justify-center py-12 border-2 border-dashed border-dark rounded-xl hover-orange-glow">
            <button
              onClick={addPersona}
              className="flex items-center space-x-3 text-dark-secondary hover:text-orange-400 transition-colors"
            >
              <div className="w-12 h-12 bg-dark-elevated rounded-xl flex items-center justify-center shadow-orange-glow">
                <Plus className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-medium text-dark-primary">
                  Create New Persona
                </div>
                <div className="text-sm text-dark-secondary">
                  Define a new customer segment
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Personas List */}
      <div className="space-y-6">
        {personas.map((persona) => (
          <div
            key={persona.id}
            className="dark-card rounded-2xl shadow-dark-card overflow-hidden hover-orange-glow animate-subtle-float"
          >
            {/* Persona Header */}
            <div className="p-6 border-b border-dark">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 orange-accent rounded-xl flex items-center justify-center shadow-orange-glow">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    {editingPersona === persona.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={persona.name}
                          onChange={(e) =>
                            updatePersona(persona.id, { name: e.target.value })
                          }
                          className="text-xl font-semibold bg-transparent border-b border-dark focus:border-orange-500 outline-none text-dark-primary"
                        />
                        <textarea
                          value={persona.description}
                          onChange={(e) =>
                            updatePersona(persona.id, {
                              description: e.target.value,
                            })
                          }
                          className="text-dark-secondary bg-transparent border border-dark rounded px-2 py-1 text-sm w-full resize-none focus:border-orange-500 outline-none"
                          rows={2}
                        />
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-semibold text-dark-primary">
                          {persona.name}
                        </h3>
                        <p className="text-dark-secondary">
                          {persona.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm text-dark-secondary">Volume</div>
                    <div className="text-lg font-semibold text-orange-400">
                      {persona.volume}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-dark-secondary">Relevance</div>
                    <div className="text-lg font-semibold text-orange-400">
                      {persona.relevance}%
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setEditingPersona(
                          editingPersona === persona.id ? null : persona.id
                        )
                      }
                      className="p-2 text-dark-secondary hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-colors hover-orange-glow"
                      title="Edit persona"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deletePersona(persona.id)}
                      className="p-2 text-dark-secondary hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete persona"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Volume and Relevance Sliders */}
              {editingPersona === persona.id && (
                <div className="mt-6 grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-dark-secondary">
                        Customer Volume
                      </label>
                      <span className="text-sm text-orange-400">
                        {persona.volume}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={persona.volume}
                      onChange={(e) =>
                        updatePersona(persona.id, {
                          volume: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-slate-600">
                        Strategic Relevance
                      </label>
                      <span className="text-sm text-slate-500">
                        {persona.relevance}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={persona.relevance}
                      onChange={(e) =>
                        updatePersona(persona.id, {
                          relevance: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Needs Configuration */}
            {editingPersona === persona.id && (
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-slate-600" />
                  <h4 className="text-lg font-semibold text-slate-800">
                    Touchpoint Needs
                  </h4>
                </div>
                <NeedsEditor persona={persona} />
              </div>
            )}

            {/* Needs Summary (when not editing) */}
            {editingPersona !== persona.id && (
              <div className="p-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {touchPoints.map((touchPoint) => {
                    const needs = persona.needs[touchPoint.id];
                    if (!needs) return null;

                    const avgNeed = Math.round(
                      (needs.speed + needs.simplicity + needs.personalization) /
                        3
                    );

                    return (
                      <div
                        key={touchPoint.id}
                        className="bg-slate-50 rounded-lg p-4"
                      >
                        <h5 className="font-medium text-slate-700 mb-2">
                          {touchPoint.name}
                        </h5>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Speed</span>
                            <span className="text-slate-700">
                              {needs.speed}%
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Simplicity</span>
                            <span className="text-slate-700">
                              {needs.simplicity}%
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Personal</span>
                            <span className="text-slate-700">
                              {needs.personalization}%
                            </span>
                          </div>
                          <div className="pt-1 border-t border-slate-200">
                            <div className="flex justify-between text-sm font-medium">
                              <span className="text-slate-600">Average</span>
                              <span className="text-slate-800">{avgNeed}%</span>
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
          <h3 className="text-lg font-medium text-slate-800 mb-2">
            No personas defined
          </h3>
          <p className="text-slate-600 mb-6">
            Create your first customer persona to get started with the
            simulation.
          </p>
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
