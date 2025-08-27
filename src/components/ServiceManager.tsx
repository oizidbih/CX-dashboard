import React, { useState } from 'react';
import { Settings, DollarSign, ToggleLeft, ToggleRight, Plus, Edit3, Trash2, TrendingUp } from 'lucide-react';
import { Service, TouchPoint, SimulationState } from '../types';

interface ServiceManagerProps {
  services: Service[];
  setServices: (services: Service[]) => void;
  touchPoints: TouchPoint[];
  simulationState: SimulationState;
  getTouchPointsForGroup: (group: 'People' | 'Business' | 'Focus Assets') => TouchPoint[];
}

const ServiceManager: React.FC<ServiceManagerProps> = ({
  services,
  setServices,
  touchPoints,
  simulationState,
  getTouchPointsForGroup
}) => {
  const [editingService, setEditingService] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleService = (id: string) => {
    setServices(services.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(services.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const addService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      name: 'New Service',
      description: 'Description of the new service',
      cost: 25000,
      fulfillment: touchPoints.reduce((acc, tp) => ({
        ...acc,
        [tp.id]: { ces: 50, mitigatedPainpoints: 50, wowMoments: 50 }
      }), {}),
      enabled: false
    };
    setServices([...services, newService]);
    setEditingService(newService.id);
    setShowAddForm(false);
  };

  const getServiceImpact = (service: Service) => {
    // Calculate potential impact if this service were enabled alone
    const testServices = services.map(s => ({ ...s, enabled: s.id === service.id }));
    // This is a simplified calculation - in a real app you'd recalculate the full simulation
    const avgFulfillment = touchPoints.reduce((sum, tp) => {
      const fulfillment = service.fulfillment[tp.id];
      return sum + (fulfillment ? (fulfillment.ces + fulfillment.mitigatedPainpoints + fulfillment.wowMoments) / 3 : 0);
    }, 0) / touchPoints.length;
    
    return Math.round(avgFulfillment * 0.7); // Simplified impact calculation
  };

  const FulfillmentEditor: React.FC<{ service: Service }> = ({ service }) => (
    <div className="space-y-4">
      {touchPoints.map((touchPoint) => {
        const fulfillment = service.fulfillment[touchPoint.id] || { ces: 50, mitigatedPainpoints: 50, wowMoments: 50 };
        
        return (
          <div key={touchPoint.id} className="bg-slate-50 rounded-lg p-4">
            <h4 className="font-medium text-slate-800 mb-3">{touchPoint.name}</h4>
            <div className="space-y-3">
              {(['ces', 'mitigatedPainpoints', 'wowMoments'] as const).map((aspect) => {
                const labelMap = {
                  ces: 'CES Fulfillment',
                  mitigatedPainpoints: 'Painpoint Mitigation',
                  wowMoments: 'WOW Moments'
                };
                
                return (
                  <div key={aspect} className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-slate-600">{labelMap[aspect]}</label>
                      <span className="text-sm text-slate-500">{fulfillment[aspect]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={fulfillment[aspect]}
                      onChange={(e) => {
                        const newFulfillment = {
                          ...service.fulfillment,
                          [touchPoint.id]: {
                            ...fulfillment,
                            [aspect]: parseInt(e.target.value)
                          }
                        };
                        updateService(service.id, { fulfillment: newFulfillment });
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

  const enabledServices = services.filter(s => s.enabled);
  const totalCost = enabledServices.reduce((sum, s) => sum + s.cost, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Service Portfolio</h1>
          <p className="text-slate-600 mt-2">Configure services and their impact on customer experience touchpoints</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-slate-500">Total Investment</div>
            <div className="text-2xl font-bold text-slate-800">${(totalCost / 1000).toFixed(0)}K</div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Service Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Services</p>
              <p className="text-3xl font-bold text-slate-800">{enabledServices.length}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Annual Investment</p>
              <p className="text-3xl font-bold text-slate-800">${(totalCost / 1000).toFixed(0)}K</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Impact Score</p>
              <p className="text-3xl font-bold text-slate-800">{simulationState.overallImpact}</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Add New Service</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          </div>
          <div className="flex items-center justify-center py-12 border-2 border-dashed border-slate-300 rounded-xl">
            <button
              onClick={addService}
              className="flex items-center space-x-3 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="font-medium">Create New Service</div>
                <div className="text-sm text-slate-500">Define a new customer experience service</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-6">
        {services.map((service) => {
          const impact = getServiceImpact(service);
          const roi = service.cost > 0 ? Math.round(impact * 1000 / service.cost) : 0;
          
          return (
            <div key={service.id} className={`bg-white/80 backdrop-blur-sm rounded-2xl border shadow-sm overflow-hidden transition-all ${
              service.enabled ? 'border-emerald-200/60 ring-2 ring-emerald-100' : 'border-slate-200/60'
            }`}>
              {/* Service Header */}
              <div className="p-6 border-b border-slate-200/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      service.enabled ? 'bg-emerald-100' : 'bg-slate-100'
                    }`}>
                      <Settings className={`w-6 h-6 ${service.enabled ? 'text-emerald-600' : 'text-slate-400'}`} />
                    </div>
                    <div className="flex-1">
                      {editingService === service.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={service.name}
                            onChange={(e) => updateService(service.id, { name: e.target.value })}
                            className="text-xl font-semibold bg-transparent border-b border-slate-300 focus:border-blue-500 outline-none"
                          />
                          <textarea
                            value={service.description}
                            onChange={(e) => updateService(service.id, { description: e.target.value })}
                            className="text-slate-600 bg-transparent border border-slate-300 rounded px-2 py-1 text-sm w-full resize-none"
                            rows={2}
                          />
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <label className="text-sm font-medium text-slate-600">Annual Cost:</label>
                              <input
                                type="number"
                                value={service.cost}
                                onChange={(e) => updateService(service.id, { cost: parseInt(e.target.value) || 0 })}
                                className="w-24 px-2 py-1 text-sm border border-slate-300 rounded"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-xl font-semibold text-slate-800">{service.name}</h3>
                          <p className="text-slate-600">{service.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-sm text-slate-500">Annual Cost</div>
                      <div className="text-lg font-semibold text-slate-800">${(service.cost / 1000).toFixed(0)}K</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500">Potential Impact</div>
                      <div className="text-lg font-semibold text-slate-800">{impact}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500">ROI Score</div>
                      <div className={`text-lg font-semibold ${roi > 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                        {roi > 0 ? '+' : ''}{roi}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleService(service.id)}
                        className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        {service.enabled ? (
                          <ToggleRight className="w-6 h-6 text-emerald-600" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-slate-400" />
                        )}
                      </button>
                      <button
                        onClick={() => setEditingService(editingService === service.id ? null : service.id)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteService(service.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fulfillment Configuration */}
              {editingService === service.id && (
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-slate-600" />
                    <h4 className="text-lg font-semibold text-slate-800">Touchpoint Fulfillment</h4>
                  </div>
                  <FulfillmentEditor service={service} />
                </div>
              )}

              {/* Fulfillment Summary (when not editing) */}
              {editingService !== service.id && (
                <div className="p-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {touchPoints.map((touchPoint) => {
                      const fulfillment = service.fulfillment[touchPoint.id];
                      if (!fulfillment) return null;
                      
                      const avgFulfillment = Math.round((fulfillment.ces + fulfillment.mitigatedPainpoints + fulfillment.wowMoments) / 3);
                      
                      return (
                        <div key={touchPoint.id} className="bg-slate-50 rounded-lg p-4">
                          <h5 className="font-medium text-slate-700 mb-2">{touchPoint.name}</h5>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">CES</span>
                              <span className="text-slate-700">{fulfillment.ces}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">Painpoints</span>
                              <span className="text-slate-700">{fulfillment.mitigatedPainpoints}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-500">WOW</span>
                              <span className="text-slate-700">{fulfillment.wowMoments}</span>
                            </div>
                            <div className="pt-1 border-t border-slate-200">
                              <div className="flex justify-between text-sm font-medium">
                                <span className="text-slate-600">Average</span>
                                <span className="text-slate-800">{avgFulfillment}</span>
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
          );
        })}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">No services configured</h3>
          <p className="text-slate-600 mb-6">Add your first service to start building your customer experience portfolio.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Add Your First Service
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceManager;
