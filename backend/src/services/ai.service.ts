import OpenAI from 'openai';

interface ParsedJobDescription {
  company: string;
  role: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority: string;
  location: string;
}

const getOpenAIClient = (): OpenAI => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not defined in the environment variables');
  }
  return new OpenAI({ apiKey });
};

export const parseJobDescription = async (text: string): Promise<ParsedJobDescription> => {
  try {
    const openai = getOpenAIClient();

    const prompt = `
      You are an expert technical recruiter and job description analyzer.
      Given the following job description text, extract the key information and return it strictly as a JSON object.
      
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
      
      Respond ONLY with valid JSON matching the format requested.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // or another appropriate model like 'gpt-4-turbo' or 'gpt-3.5-turbo'
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;

    if (!content) {
      throw new Error('No content returned from OpenAI API');
    }

    const parsedData: ParsedJobDescription = JSON.parse(content);
    return parsedData;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to parse job description using AI';
    throw new Error(`AI Service Error: ${message}`);
  }
};
