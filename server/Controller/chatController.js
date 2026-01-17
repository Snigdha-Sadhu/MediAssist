import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const healthSchema = {
  type: SchemaType.OBJECT,
  properties: {
    diseaseName: { type: SchemaType.STRING },
    stage: { 
      type: SchemaType.STRING, 
      enum: ["Initial/Mild", "Moderate", "Advanced/Chronic", "Emergency"] 
    },
    resourceNeeded: { 
      type: SchemaType.STRING, 
      enum: ["none", "blood", "ambulance", "hospital", "police", "pharmacy"],
      description: "The specific emergency resource required immediately."
    },
    emergencyRequirements: { type: SchemaType.STRING },
    preventionSteps: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    urgencyScore: { type: SchemaType.NUMBER, description: "1 to 10 scale of danger" }
  },
  required: ["diseaseName", "stage", "emergencyRequirements", "preventionSteps", "urgencyScore"]
};

export const analyzeHealth = async (req, res) => {
  try {
    const { abnormality } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite", // 2026 standard
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: healthSchema,
      },
    });

    const prompt = `
      Act as a medical triage assistant. 
      Analyze the following physical abnormality/symptoms: "${abnormality}".
      Provide a likely disease name, the potential stage, immediate prevention, and emergency needs.
      IMPORTANT: Include a disclaimer that this is not a final medical diagnosis.
    `;

    const result = await model.generateContent(prompt);
    const analysis = JSON.parse(result.response.text());
    
    res.json({ success: true, analysis,emergency: analysis.stage === "Emergency" || analysis.urgencyScore >= 7 });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};