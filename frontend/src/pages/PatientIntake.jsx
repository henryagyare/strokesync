import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, AlertCircle, CheckCircle } from 'lucide-react';

const PatientIntake = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullname: '',
    age: '',
    onset_time: '',
    systolic: '',
    diastolic: '',
    nihss_score: 0,
    // ... add other fields from your Patient model here
  });

// Inside PatientIntake.jsx - A simplified version of the scoring logic
const handleScoreChange = (category, value) => {
  const newScores = { ...formData.scores, [category]: parseInt(value) };
  
  // Sum up all categories to get the total
  const total = Object.values(newScores).reduce((a, b) => a + b, 0);
  
  setFormData({
    ...formData,
    scores: newScores,
    nihss_score: total
  });
};  

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // This is the "Rapid ID" logic we discussed
  const triggerCodeStroke = () => {
    alert(`CRITICAL: Code Stroke Alert sent for ${formData.fullname}!`);
    // Later, this will trigger a Socket.io event to the Neurologist
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Step Indicator */}
      <div className="bg-slate-50 p-4 border-b flex justify-between">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`flex items-center ${step >= i ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= i ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
              {step > i ? <CheckCircle size={18} /> : i}
            </div>
            <span className="ml-2 font-medium">
              {i === 1 && 'Vitals'}
              {i === 2 && 'History'}
              {i === 3 && 'NIHSS'}
              {i === 4 && 'Imaging'}
            </span>
          </div>
        ))}
      </div>

      <div className="p-8">
        {/* Step 1: Rapid Vitals */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Initial Assessment</h2>
              <button 
                onClick={triggerCodeStroke}
                className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 animate-pulse"
              >
                <AlertCircle size={20} /> DECLARE CODE STROKE
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full border rounded-md p-2"
                  value={formData.fullname}
                  onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time Last Seen Normal</label>
                <input type="time" className="mt-1 block w-full border rounded-md p-2" />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: NIHSS (The Interactive Logic) */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">NIHSS Assessment</h2>
            <p className="text-gray-500 mb-6">Current Score: <span className="text-blue-600 font-bold text-xl">{formData.nihss_score}</span></p>
            {/* You'll port your radio buttons from nhiss_score.html here */}
            <div className="p-4 border rounded-lg bg-blue-50">
              <p className="font-medium">1a. Level of Consciousness</p>
              <div className="flex gap-4 mt-2">
                {[0, 1, 2, 3].map(score => (
                  <button 
                    key={score}
                    onClick={() => setFormData({...formData, nihss_score: formData.nihss_score + score})}
                    className="px-4 py-2 border rounded bg-white hover:bg-blue-100"
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-10 flex justify-between">
          <button 
            onClick={prevStep} 
            disabled={step === 1}
            className="flex items-center gap-2 text-gray-600 disabled:opacity-30"
          >
            <ChevronLeft size={20} /> Previous
          </button>
          <button 
            onClick={nextStep}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            {step === 4 ? 'Finish & Submit' : 'Next'} <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientIntake;