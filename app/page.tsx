'use client';

import { useState } from 'react';

export default function ElizabethLeeDressStudio() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [waistStyle, setWaistStyle] = useState("keep");
  const [silhouette, setSilhouette] = useState("keep");
  const [neckline, setNeckline] = useState("keep");
  const [sleeves, setSleeves] = useState("keep");
  const [color, setColor] = useState("ivory");
  const [intensity, setIntensity] = useState(65);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setSelectedImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generateGown = async () => {
    if (!selectedImage) return alert("Please upload a bride photo first");

    setLoading(true);
    setGeneratedImage(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: selectedImage,
          customizations: { waistStyle, silhouette, neckline, sleeves, color },
          intensity,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedImage(data.imageUrl);
      } else {
        alert("Generation failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Connection error. Make sure your FAL_AI_KEY is set.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-6xl font-light text-center mb-2 tracking-tight">Elizabeth Lee</h1>
        <p className="text-rose-400 text-center text-2xl mb-12">Dream Dress Studio</p>

        {/* Upload */}
        <div className="bg-zinc-900 rounded-3xl p-10 mb-10">
          <h2 className="text-xl mb-6">1. Upload Photo of Bride in Current Dress</h2>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-8 file:rounded-2xl file:border-0 file:bg-rose-600 file:text-white hover:file:bg-rose-700"
          />
          {selectedImage && (
            <img src={selectedImage} alt="Selected" className="mt-8 max-h-[500px] mx-auto rounded-2xl shadow-2xl" />
          )}
        </div>

        {/* Customizations */}
        <div className="bg-zinc-900 rounded-3xl p-10 mb-10 space-y-8">
          <h2 className="text-xl mb-6">2. Customize the Dress</h2>

          {/* Waist Style - The one you really wanted */}
          <div>
            <label className="block text-sm mb-3 font-medium">Waist Style (Major Improvement)</label>
            <select value={waistStyle} onChange={(e) => setWaistStyle(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-lg">
              <option value="keep">Keep Original Waist</option>
              <option value="basque">Basque Waist (deep V below natural waist)</option>
              <option value="drop">Drop Waist (low on hips - 1920s style)</option>
              <option value="natural">Natural Waist</option>
              <option value="empire">Empire Waist</option>
              <option value="princess">Princess Seam</option>
            </select>
          </div>

          {/* Add more options later - starting simple */}
          <div>
            <label className="block text-sm mb-3 font-medium">Change Strength: {intensity}%</label>
            <input 
              type="range" 
              min="40" 
              max="95" 
              value={intensity} 
              onChange={(e) => setIntensity(Number(e.target.value))} 
              className="w-full accent-rose-600"
            />
          </div>
        </div>

        <button 
          onClick={generateGown}
          disabled={loading || !selectedImage}
          className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 py-7 rounded-3xl text-2xl font-medium disabled:opacity-50 transition-all"
        >
          {loading ? "✦ Creating your dream dress with AI..." : "✦ Generate My Custom Gown ✦"}
        </button>

        {generatedImage && (
          <div className="mt-16 bg-zinc-900 rounded-3xl p-10">
            <h2 className="text-3xl text-center mb-8">Your Dream Dress Result</h2>
            <img src={generatedImage} className="mx-auto rounded-2xl shadow-2xl" alt="Generated" />
          </div>
        )}
      </div>
    </div>
  );
}
