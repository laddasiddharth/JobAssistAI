import OpenAI from 'openai';

const getOpenAIClient = (): OpenAI => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not defined in the environment variables');
  }
  return new OpenAI({ apiKey });
};

/**
 * Generates targeted resume suggestions based on a job description.
 * 
 * @param jobDescription - The text of the job description description.
 * @returns A promise that resolves to an array of 3-5 strings (bullet points).
 */
export const generateResumeSuggestions = async (jobDescription: string): Promise<string[]> => {
  try {
    const openai = getOpenAIClient();

    const prompt = `
      You are an expert career coach and resume writer.
      Analyze the following job description and provide 3 to 5 targeted, role-specific resume bullet points 
      that a candidate should highlight or adapt in their resume to stand out for this position.
      
      Job Description:
      """
      ${jobDescription}
      """
      
      Return the response strictly as a JSON object with a single key "suggestions" which contains an array of strings.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;

    if (!content) {
      throw new Error('No content returned from OpenAI API');
    }

    const parsedData = JSON.parse(content);
    
    // Ensure we return an array of strings
    if (Array.isArray(parsedData.suggestions)) {
      return parsedData.suggestions;
    }

    throw new Error('Invalid response format from OpenAI');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate resume suggestions';
    throw new Error(`Resume Service Error: ${message}`);
  }
};
