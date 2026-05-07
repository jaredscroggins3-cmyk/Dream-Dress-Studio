import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const FAL_KEY = process.env.FAL_AI_KEY;
  
  if (!FAL_KEY) {
    return NextResponse.json({ 
      success: false, 
      error: "FAL_AI_KEY is missing. Add it in Vercel Settings → Environment Variables." 
    }, { status: 500 });
  }

  try {
    const { imageUrl, customizations, intensity = 65 } = await req.json();

    let waistDesc = "preserve the exact original waistline, bodice-to-skirt transition and torso proportions";
    
    if (customizations.waistStyle === "basque") {
      waistDesc = "dramatic Basque waist with deep V-shaped point extending well below the natural waist, fitted through the hips, elegant torso-lengthening effect";
    } else if (customizations.waistStyle === "drop") {
      waistDesc = "Drop waist silhouette, waistline sitting low at the hip bones, 1920s-inspired elongated torso, smooth transition from bodice to skirt";
    } else if (customizations.waistStyle === "empire") {
      waistDesc = "Empire waist high under the bust with flowing skirt";
    }

    const prompt = `Photorealistic professional bridal portrait of the exact same bride, identical face, skin tone, hair, makeup, pose, lighting, and body proportions from the reference photo. 
She is wearing a stunning custom Elizabeth Lee couture wedding gown featuring: ${waistDesc}. 
Silhouette: ${customizations.silhouette || 'original'}. 
Neckline: ${customizations.neckline || 'original'}. 
Sleeves: ${customizations.sleeves || 'original'}. 
Color: ${customizations.color || 'ivory'}. 
Highly detailed realistic lace, fabric texture, natural drape and movement, perfect fit on her body, couture bridal photography style, sharp focus, 8k`;

    const res = await fetch("https://fal.run/fal-ai/flux-2-pro/edit", {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url: imageUrl,
        prompt: prompt,
        strength: Math.max(0.68, intensity / 100),
        num_inference_steps: 30,
        guidance_scale: 3.5,
        negative_prompt: "deformed waist, distorted torso, bad anatomy, floating dress, wrong proportions, blurry, low quality, extra limbs, ugly hands",
      }),
    });

    const data = await res.json();

    return NextResponse.json({
      success: true,
      imageUrl: data.images?.[0]?.url || data.image?.url,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Generation failed" }, { status: 500 });
  }
}
