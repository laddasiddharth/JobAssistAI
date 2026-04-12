import { GoogleGenerativeAI } from '@google/generative-ai';

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

/**
 * Generates targeted resume suggestions based on a job description.
 * 
 * @param jobDescription - The text of the job description.
 * @returns A promise that resolves to an array of 3-5 strings (bullet points).
 */
export const generateResumeSuggestions = async (jobDescription: string): Promise<string[]> => {
  try {
    const apiKey = process.env.GEMINI_API_KEY || '';
    logGeminiConfigOnce(apiKey);
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: getGeminiModelName() });

    const prompt = `You are an expert career coach and resume writer.
Analyze the following job description and provide 3 to 5 targeted, role-specific resume bullet points that a candidate should highlight or adapt in their resume to stand out for this position.

Job Description:
"""
${jobDescription}
"""

Return ONLY a JSON object with a single key "suggestions" containing an array of strings. No markdown, no code blocks, no explanations.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let content = response.text();

    if (!content) {
      throw new Error('No content returned from Gemini API');
    }

    // Clean up JSON if it's wrapped in markdown code blocks
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const parsedData = JSON.parse(content);
    
    // Ensure we return an array of strings
    if (Array.isArray(parsedData.suggestions)) {
      return parsedData.suggestions;
    }

    throw new Error('Invalid response format from Gemini');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate resume suggestions';
    throw new Error(`Resume Service Error: ${message}`);
  }
};
