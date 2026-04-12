import { Request, Response } from 'express';
import { parseJobDescription as parseJobDescService } from '../services/ai.service';
import { generateResumeSuggestions as generateResumeService } from '../services/resume.service';

export const parseJobDescription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ message: 'Job description text is required and must be a string' });
      return;
    }

    const parsedData = await parseJobDescService(text);

    res.status(200).json({
      message: 'Job description parsed successfully',
      data: parsedData,
    });
  } catch (error: unknown) {
    console.error('[AI Controller Error - Parse]', error);
    const message = error instanceof Error ? error.message : 'Error parsing job description';
    res.status(500).json({ message });
  }
};

export const generateResumeSuggestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription || typeof jobDescription !== 'string') {
      res.status(400).json({ message: 'Job description is required and must be a string' });
      return;
    }

    const suggestions = await generateResumeService(jobDescription);

    res.status(200).json({
      message: 'Resume suggestions generated successfully',
      suggestions,
    });
  } catch (error: unknown) {
    console.error('[AI Controller Error - Resume]', error);
    const message = error instanceof Error ? error.message : 'Error generating resume suggestions';
    res.status(500).json({ message });
  }
};
