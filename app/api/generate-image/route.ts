import { NextRequest, NextResponse } from "next/server";
import { constructMetaPrompt } from "@/lib/meta-prompt";

// Documentation: https://ai.google.dev/gemini-api/docs/image-generation?hl=fr
// Model: "gemini-3-pro-image-preview" (aka Nano Banana Pro)
// Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent

const MODEL_NAME = "gemini-3-pro-image-preview";

export async function POST(req: NextRequest) {
  try {
    const params = await req.json();
    
    // Validate required fields
    if (!params.citation) {
      return NextResponse.json(
        { error: "Citation is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: "GEMINI_API_KEY is not configured" },
            { status: 500 }
        );
    }

    // Construct the prompt
    const prompt = constructMetaPrompt(params);

    // Call the Google AI Studio API (Gemini 3 generateContent Endpoint)
    // Note: This model requires specific generationConfig for images.
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ],
                generationConfig: {
                    responseModalities: ["IMAGE"], // Requesting IMAGE output
                        imageConfig: {
                        aspectRatio: params.aspectRatio || "16:9",
                        imageSize: "2K" // Supported by Nano Banana Pro as per docs
                    }
                }
            })
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API Error:", errorText);
        return NextResponse.json({ error: `API Error (${response.status}): ${errorText}` }, { status: response.status });
    }

    const result = await response.json();
    
    // Parse result for Gemini 3 Image Structure
    // Structure: candidates[0].content.parts[].inlineData.data
    let imageBase64;
    
    if (result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts) {
        for (const part of result.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.mimeType.startsWith("image") && part.inlineData.data) {
                imageBase64 = part.inlineData.data;
                break;
            }
        }
    }

    if (!imageBase64) {
         console.error("Unexpected API structure:", JSON.stringify(result, null, 2));
         return NextResponse.json({ error: "No image found in response", raw: result }, { status: 500 });
    }

    return NextResponse.json({ 
        imageUrl: `data:image/png;base64,${imageBase64}`,
        prompt: prompt 
    });
    
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate image" },
      { status: 500 }
    );
  }
}
