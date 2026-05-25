import React, { useState, useRef } from 'react';

export const Mirror = () => {
  // These "states" remember what the user is doing (loading, seeing results, etc.)
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ conditions_detected: string[], confidence_scores: Record<string, number> } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  // This acts like an invisible bridge to a file upload popup
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show the user the image they just picked
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    setResults(null);

    // Prepare the file for the Python backend
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 🚀 THIS IS THE MAGIC: Sending the image to your FastAPI server!
      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("Server error");

      // Save the JSON result we got back from Python
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error analyzing image:", error);
      alert("Error connecting to AI. Is your Python terminal still running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream text-dark">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h4 className="text-rose text-[10px] uppercase tracking-[6px] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Introducing
          </h4>
          <h1 className="font-playfair text-5xl md:text-7xl mb-8 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
            The Mirror
          </h1>
          <p className="max-w-2xl mx-auto text-dark/70 font-light leading-relaxed mb-12 text-sm md:text-base">
            Reflecting your inner essence through a curated journey of wellness and transformation. 
            A space designed to reveal the most authentic version of yourself.
          </p>
          <div className="flex justify-center gap-6">
            
            {/* Hidden file input */}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            
            {/* The button now triggers the hidden file input */}
            <button 
              onClick={handleUploadClick}
              disabled={loading}
              className="bg-dark text-white px-10 py-4 text-[10px] uppercase tracking-[2px] hover:bg-rose transition-colors duration-500 disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Begin Analysis"}
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Results Section */}
      <section className="bg-dark text-white py-24 px-6 text-center min-h-[400px]">
        <div className="max-w-5xl mx-auto border border-rose/20 p-10 md:p-20 flex flex-col items-center justify-center min-h-[300px]">
          
          {loading && (
            <div className="animate-pulse">
              <h2 className="font-playfair text-3xl mb-4 italic text-rose">Processing...</h2>
              <p className="text-white/50 font-light tracking-widest text-[10px] uppercase">
                Our AI is analyzing your skin structure
              </p>
            </div>
          )}

          {!loading && !results && !preview && (
            <div>
              <h2 className="font-playfair text-3xl mb-4 italic">Awaiting Reflection</h2>
              <p className="text-white/50 font-light tracking-widest text-[10px] uppercase">
                Upload an image to begin your analysis
              </p>
            </div>
          )}

          {results && (
            <div className="w-full max-w-2xl animate-in fade-in duration-700">
              <h2 className="font-playfair text-4xl mb-8 text-rose italic">Analysis Complete</h2>
              
              <div className="flex flex-col md:flex-row gap-10 items-center justify-center text-left">
                {preview && (
                  <img src={preview} alt="User upload" className="w-48 h-48 object-cover rounded-full border-4 border-rose/30" />
                )}
                
                <div className="flex flex-col gap-4 w-full">
                  {results.conditions_detected.map((condition) => {
                    // Turn "pigmented_benign_keratosis" into "Pigmented Benign Keratosis"
                    const formattedName = condition.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    // Turn 0.897 into 89.7%
                    const confidencePercent = (results.confidence_scores[condition] * 100).toFixed(1);

                    return (
                      <div key={condition} className="bg-white/5 p-4 border border-white/10 rounded">
                        <p className="text-white/70 font-light tracking-widest text-[10px] uppercase mb-1">Detected Condition</p>
                        <h3 className="font-playfair text-2xl text-rose mb-2">{formattedName}</h3>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-dark border border-white/20 h-2 mt-2">
                          <div className="bg-rose h-full" style={{ width: `${confidencePercent}%` }}></div>
                        </div>
                        <p className="text-right text-xs mt-2 font-light">{confidencePercent}% Match</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          
        </div>
      </section>
    </div>
  );
};