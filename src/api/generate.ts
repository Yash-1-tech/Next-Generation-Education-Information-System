import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateBlueprint(
  subject: string,
  topic: string
) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are an expert school teacher.

Subject: ${subject}
Topic: ${topic}

Generate a teaching blueprint in JSON with this exact structure:

{
  "concept": "string",
  "howToTeach": ["step1", "step2"],
  "commonMistakes": ["mistake1", "mistake2"]
}

Keep it concise and classroom-ready.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return JSON.parse(text);
}
