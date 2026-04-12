import { GoogleGenerativeAI } from '@google/generative-ai';

interface ParsedJobDescription {
  company: string;
  role: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority: string;
  location: string;
}

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in the environment variables');
  }
  return new GoogleGenerativeAI(apiKey);
};

const getGeminiModelName = () => (process.env.GEMINI_MODEL || 'gemini-2.0-flash').trim();

let didLogGeminiConfig = false;
const logGeminiConfigOnce = (apiKey: string) => {
  if (didLogGeminiConfig) return;
  didLogGeminiConfig = true;
  console.info(
    `[Gemini] model=${getGeminiModelName()} keyLength=${apiKey.length}`
  );
};

export const parseJobDescription = async (text: string): Promise<ParsedJobDescription> => {
  try {
    const apiKey = process.env.GEMINI_API_KEY || '';
    logGeminiConfigOnce(apiKey);
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: getGeminiModelName() });

    const prompt = `You are an expert technical recruiter and job description analyzer.
Given the following job description text, extract the key information and return it ONLY as a valid JSON object with no other text.

Extract these fields:
- company: The name of the company (or "Unknown" if not found)
- role: The job title
- requiredSkills: An array of strings representing mandatory skills/technologies
- niceToHaveSkills: An array of strings representing optional or bonus skills/technologies
- seniority: The seniority level (e.g., Junior, Mid, Senior, Lead, "Unknown")
- location: The job location or "Remote" (or "Unknown" if not found)

Job Description:
"""
${text}
"""

Return ONLY valid JSON, no markdown, no code blocks, no explanations.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let content = response.text();

    if (!content) {
      throw new Error('No content returned from Gemini API');
    }

    // Clean up JSON if it's wrapped in markdown code blocks
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const parsedData: ParsedJobDescription = JSON.parse(content);
    return parsedData;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to parse job description using AI';
    throw new Error(`AI Service Error: ${message}`);
  }
};
