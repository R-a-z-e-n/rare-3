import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';

const PRODUCT_RECOMMENDATIONS: Record<string, { 
  type: 'cosmetic' | 'medical';
  routine: string; 
  ingredients: string;
  suggestions: string[]; 
}> = {
  acne: {
    type: 'cosmetic',
    routine: 'Focus on clearing deep pores and regulating excess sebum production.',
    ingredients: 'Salicylic Acid (BHA), Benzoyl Peroxide, Niacinamide.',
    suggestions: ['COSRX Salicylic Acid Daily Gentle Cleanser', 'Bioderma Sebium Kerato+ Gel-Cream', 'La Roche-Posay Effaclar Duo']
  },
  seborrheic_keratosis: {
    type: 'cosmetic',
    routine: 'Soften the hardened, thick keratin buildup to smooth out surface texture.',
    ingredients: 'Urea, Glycolic Acid (AHA), Salicylic Acid.',
    suggestions: ['CeraVe SA Smoothing Cream (10% Urea)', 'Paula\'s Choice Skin Perfecting 2% BHA Liquid Exfoliant', 'The Ordinary Glycolic Acid 7% Toning Solution']
  },
  pigmented_benign_keratosis: {
    type: 'cosmetic',
    routine: 'Gently promote surface cellular turnover while strictly preventing further sun-induced pigmentation.',
    ingredients: 'Retinol, Alpha Arbutin, Broad-Spectrum SPF 50+.',
    suggestions: ['La Roche-Posay Anthelios UVMune 400 SPF50+', 'The Ordinary Alpha Arbutin 2% + HA', 'CeraVe Resurfacing Retinol Serum']
  },
  actinic_keratosis: {
    type: 'medical',
    routine: 'This is a pre-cancerous sun-induced lesion. Avoid raw chemical scrubs completely and protect the barrier.',
    ingredients: 'High-protection physical sunscreens, soothing Ceramides.',
    suggestions: ['Requires Dermatologist Evaluation', 'Apply Broad-Spectrum SPF 50+ Daily', 'Avoid direct UV exposure']
  },
  nevus: {
    type: 'cosmetic',
    routine: 'Benign common mole structure. No cosmetic intervention needed. Protect with high sun defense.',
    ingredients: 'Zinc Oxide, Titanium Dioxide (Mineral SPF).',
    suggestions: ['Isdin Eryfotona Actinica Mineral SPF 50+', 'La Roche-Posay Mineral Sunscreen Fluid']
  },
  dermatofibroma: {
    type: 'cosmetic',
    routine: 'Benign deep skin nodule. Cosmetic topical treatments cannot remove firm nodules. Focus on keeping the surrounding surface skin healthy and hydrated.',
    ingredients: 'Hyaluronic Acid, Glycerin, Gentle Ceramides.',
    suggestions: ['CeraVe Moisturizing Cream', 'The Ordinary Natural Moisturizing Factors + HA']
  },
  vascular_lesion: {
    type: 'cosmetic',
    routine: 'Vascular lesions (like cherry angiomas or spider veins) are deep blood vessel structural formations. Topicals cannot eliminate them completely but can calm flushing or surface redness.',
    ingredients: 'Centella Asiatica (Cica), Niacinamide, Azelaic Acid.',
    suggestions: ['Dr.Jart+ Cicapair Tiger Grass Color Correcting Treatment', 'The Ordinary Azelaic Acid Suspension 10%']
  },
  melanoma: {
    type: 'medical',
    routine: 'High Alert: Structural properties align closely with clinical malignant melanoma criteria.',
    ingredients: 'Immediate medical inspection required.',
    suggestions: ['Urgent: Schedule a professional evaluation with a certified Dermatologist immediately.', 'Do not attempt to treat or exfoliate this lesion using over-the-counter skincare products.']
  },
  basal_cell_carcinoma: {
    type: 'medical',
    routine: 'High Alert: Structural properties align closely with basal cell carcinoma indications.',
    ingredients: 'Clinical surgical or medical removal required.',
    suggestions: ['Urgent: Schedule a professional evaluation with a certified Dermatologist immediately.', 'Avoid pickling, peeling, or irritating the lesion structure.']
  },
  squamous_cell_carcinoma: {
    type: 'medical',
    routine: 'High Alert: Structural properties align closely with squamous cell carcinoma indications.',
    ingredients: 'Clinical diagnostic verification required.',
    suggestions: ['Urgent: Schedule a professional evaluation with a certified Dermatologist immediately.', 'Protect the region from abrasions or unverified cosmetic ointments.']
  }
};

export function Mishti() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ conditions_detected: string[], confidence_scores: Record<string, number> } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBoxClick = () => {
    // Only allow clicking to browse if we aren't currently loading or showing results
    if (!loading && !results) {
      fileInputRef.current?.click();
    }
  };

  // 🛠️ THE NEW RESETER: Clears out all states perfectly
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents triggering the parent box click accidentally
    setResults(null);
    setPreview(null);
    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Wipes the underlying file memory
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, JPEG).');
      return;
    }

    setPreview(URL.createObjectURL(file));
    setLoading(true);
    setResults(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://rare-skin-backend.onrender.com/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Backend server error');

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('API Error:', error);
      alert('Could not connect to the AI engine. Make sure your Python backend terminal is running!');
      setPreview(null);
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (loading || results) return;
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="min-h-screen bg-cream text-dark">
      <div className="max-w-4xl mx-auto pt-32 px-6 pb-20">
        <p className="text-center text-xs tracking-widest uppercase opacity-60 mb-8">
          For best results, use natural lighting and ensure your face is clearly visible.
        </p>

        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
        />

        {/* Interactive Drop Box Zone */}
        <div 
          onClick={handleBoxClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`bg-linen p-12 mb-8 transition-all duration-300 ${
            results ? 'cursor-default' : 'cursor-pointer hover:border-rose/60'
          } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <div className="border-2 border-dashed border-rose/30 p-16 text-center flex flex-col items-center justify-center">
            {preview ? (
              <img 
                src={preview} 
                alt="Preview" 
                className="w-40 h-40 object-cover rounded-full border-2 border-rose/40 mb-4 animate-in fade-in"
              />
            ) : (
              <Upload size={48} className="text-rose mx-auto mb-6 stroke-[1.5]" />
            )}

            <p className="text-dark text-sm mb-2 font-light">
              {loading && 'Analyzing skin profile...'}
              {!loading && results && 'Image scanning sequence complete'}
              {!loading && !results && 'Drag and drop your photo here, or click to browse'}
            </p>
            {!results && !loading && (
              <p className="text-muted text-xs opacity-50">
                Supported formats: JPG, PNG (max 5MB)
              </p>
            )}
          </div>
        </div>

        {/* AI Results & Products Display */}
        {results && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* General Disclaimer */}
            <div className="bg-amber-500/10 border border-amber-500/20 p-4 flex gap-3 text-left rounded-sm">
              <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
              <p className="text-xs font-light text-dark/80 leading-relaxed">
                <strong>Important Notice:</strong> This analysis is processed via an automated machine learning image classification pipeline. This output is for screening purposes only and absolutely does not substitute for real medical, clinical, or diagnostic advice from an expert physician.
              </p>
            </div>

            <div className="bg-linen/50 border border-rose/10 p-8 rounded-sm">
              <h3 className="font-playfair text-2xl italic text-dark mb-6 text-left">AI Evaluation Profile</h3>
              
              {results.conditions_detected.length === 0 ? (
                <p className="text-sm font-light opacity-75 text-left">No significant skin conditions detected.</p>
              ) : (
                <div className="space-y-8">
                  {results.conditions_detected.map((condition) => {
                    const formattedName = condition.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    const confidencePercent = (results.confidence_scores[condition] * 100).toFixed(1);
                    const recs = PRODUCT_RECOMMENDATIONS[condition];

                    return (
                      <div key={condition} className="border-b border-rose/10 pb-6 last:border-0 last:pb-0 text-left">
                        
                        {/* Condition Header Metric */}
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium tracking-wide text-dark">{formattedName}</span>
                          <span className="text-xs font-light opacity-70">{confidencePercent}% match</span>
                        </div>
                        <div className="w-full bg-dark/10 h-1.5 rounded-full overflow-hidden mb-4">
                          <div className="bg-rose h-full transition-all duration-1000" style={{ width: `${confidencePercent}%` }}></div>
                        </div>

                        {/* Embedded Dynamic Product Matrix */}
                        {recs && (
                          <div className={`mt-3 p-4 rounded-sm border ${
                            recs.type === 'medical' 
                              ? 'bg-red-500/5 border-red-500/20' 
                              : 'bg-white/40 border-rose/20'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              {recs.type === 'medical' ? (
                                <AlertCircle className="text-red-600" size={14} />
                              ) : (
                                <Sparkles className="text-rose" size={14} />
                              )}
                              <span className={`text-[10px] uppercase font-semibold tracking-wider ${
                                recs.type === 'medical' ? 'text-red-700' : 'text-rose'
                              }`}>
                                {recs.type === 'medical' ? 'Clinical Action Blueprint' : 'Targeted Care Recommendations'}
                              </span>
                            </div>

                            <p className="text-xs font-light text-dark/80 mb-2 leading-relaxed">
                              <strong className="font-medium">Target Routine:</strong> {recs.routine}
                            </p>
                            <p className="text-xs font-light text-dark/80 mb-3">
                              <strong className="font-medium">Recommended Ingredients:</strong> {recs.ingredients}
                            </p>
                            
                            <div className="space-y-1.5">
                              <p className="text-[10px] uppercase font-semibold tracking-wider text-dark/40 mb-1">
                                {recs.type === 'medical' ? 'Required Action Items:' : 'Suggested Formulations:'}
                              </p>
                              {recs.suggestions.map((product, pIdx) => (
                                <div key={pIdx} className="flex items-center gap-2 text-xs font-light text-dark/90">
                                  <span className={recs.type === 'medical' ? 'text-red-500' : 'text-rose'}>•</span>
                                  <span>{product}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 🔘 THE CLEAR RESULTS ACTION BUTTON */}
              <button 
                onClick={handleClear}
                className="mt-8 bg-dark text-white hover:bg-rose px-8 py-3.5 text-[10px] uppercase tracking-[2px] transition-colors duration-500 flex items-center gap-2 mx-auto rounded-sm shadow-sm"
              >
                <RefreshCw size={12} />
                Clear Results & Scan Again
              </button>

            </div>
          </div>
        )}

        {/* Informational Guidelines Section */}
        <div className="mt-12 space-y-3 text-left max-w-xl mx-auto border-t border-rose/10 pt-8">
          <p className="text-xs uppercase tracking-[2px] text-rose font-semibold mb-4">Tips for Best Results</p>
          <div className="flex items-start gap-3 text-xs font-light opacity-80">
            <span className="text-rose">✓</span>
            <p>Use natural daylight (avoid harsh direct sunlight or deep shadow reflections).</p>
          </div>
          <div className="flex items-start gap-3 text-xs font-light opacity-80">
            <span className="text-rose">✓</span>
            <p>Remove makeup or skin coverings for an accurate mathematical pixel analysis.</p>
          </div>
          <div className="flex items-start gap-3 text-xs font-light opacity-80">
            <span className="text-rose">✓</span>
            <p>Face the camera structure directly with a neutral, steady facial expression.</p>
          </div>
        </div>
      </div>
    </div>
  );
}