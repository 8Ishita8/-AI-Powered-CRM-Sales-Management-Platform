import { GoogleGenerativeAI } from '@google/generative-ai';
import { LeadContext } from './context-builder';
import { LEAD_ANALYSIS_PROMPT } from '../../prompts/lead-analysis.prompt';
import { EMAIL_GENERATION_PROMPT } from '../../prompts/email-generation.prompt';
import { 
  LeadAnalysisSchema, 
  LeadAnalysisResult, 
  EmailGenerationSchema, 
  EmailGenerationResult 
} from './ai.schema';

// Helper to initialize Gemini API client
const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not defined.');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });
};

/**
 * Service handling all AI interactions with Google Gemini AI.
 */
export class AIService {
  /**
   * Analyzes lead context using Gemini, validates the result with Zod,
   * performs repair if needed, and falls back to rule-based scoring on error.
   */
  public async analyzeLead(context: LeadContext): Promise<LeadAnalysisResult> {
    try {
      // 1. Format the prompts with context
      const activitiesStr = context.activities.length > 0
        ? context.activities.map(a => `- [${new Date(a.createdAt).toLocaleDateString()}] ${a.type}: ${a.notes || 'N/A'}`).join('\n')
        : 'No recent activities found.';

      const followUpsStr = context.followups.length > 0
        ? context.followups.map(f => `- [Date: ${new Date(f.followUpDate).toLocaleDateString()}] Status: ${f.status}`).join('\n')
        : 'No pending follow-ups.';

      const prompt = LEAD_ANALYSIS_PROMPT
        .replace('{{leadName}}', context.lead.name)
        .replace('{{leadStage}}', context.lead.stage)
        .replace('{{activities}}', activitiesStr)
        .replace('{{followUps}}', followUpsStr);

      console.log(`[AI Service] Sending Lead Analysis request to Gemini for Lead: ${context.lead.name} (${context.lead.id})`);

      // 2. Call Gemini
      const model = getGeminiModel();
      const result = await model.generateContent(prompt);
      let responseText = result.response.text().trim();
      
      // Clean potential markdown tags if returned
      responseText = responseText.replace(/```json\s?/g, '').replace(/```\s?/g, '').trim();

      // 3. Parse and Validate
      try {
        const parsed = JSON.parse(responseText);
        return LeadAnalysisSchema.parse(parsed);
      } catch (validationError) {
        console.warn('[AI Service] Initial response failed validation. Attempting repair prompt. Error:', validationError);
        
        // 4. One-time Repair Workflow
        const repairPrompt = `
You generated a response that failed validation.
Error detail: ${(validationError as Error).message}

Raw Response:
${responseText}

Please correct the response and return ONLY a valid JSON object matching the schema below.
Schema:
{
  "conversion_score": number,
  "probability_class": "High" | "Medium" | "Low",
  "next_best_action": string,
  "summary": string
}
`;
        const repairResult = await model.generateContent(repairPrompt);
        let repairText = repairResult.response.text().trim();
        repairText = repairText.replace(/```json\s?/g, '').replace(/```\s?/g, '').trim();
        
        const parsedRepair = JSON.parse(repairText);
        return LeadAnalysisSchema.parse(parsedRepair);
      }

    } catch (error) {
      console.error('[AI Service] Gemini Lead Analysis failed. Executing fallback rule-based strategy. Error:', (error as Error).message);
      return this.runRuleBasedScoringFallback(context);
    }
  }

  /**
   * Generates email drafts using Gemini, validates result, and falls back to standard template on error.
   */
  public async generateEmail(data: { leadName: string; company: string; purpose: string }): Promise<EmailGenerationResult> {
    try {
      const prompt = EMAIL_GENERATION_PROMPT
        .replace('{{leadName}}', data.leadName)
        .replace('{{company}}', data.company)
        .replace('{{purpose}}', data.purpose);

      console.log(`[AI Service] Generating follow-up email draft via Gemini for: ${data.leadName}`);

      const model = getGeminiModel();
      const result = await model.generateContent(prompt);
      let responseText = result.response.text().trim();

      responseText = responseText.replace(/```json\s?/g, '').replace(/```\s?/g, '').trim();

      const parsed = JSON.parse(responseText);
      return EmailGenerationSchema.parse(parsed);
    } catch (error) {
      console.error('[AI Service] Gemini Email Generation failed. Executing fallback template. Error:', (error as Error).message);
      return {
        subject: 'Follow-up Discussion',
        body_html: `<h3>Hello ${data.leadName}</h3><p>Thank you for your time.</p>`,
      };
    }
  }

  /**
   * Fallback rule-based scoring engine when Gemini AI is offline/unconfigured.
   */
  private runRuleBasedScoringFallback(context: LeadContext): LeadAnalysisResult {
    console.log('[AI Service] Computing Rule-Based Scoring for Lead:', context.lead.name);
    
    let score = 50; // Base score

    // Rule 1: Add 20 points if activities count > 3
    if (context.activities.length > 3) {
      score += 20;
    }

    // Rule 2: Add 10 points if followups count > 2
    if (context.followups.length > 2) {
      score += 10;
    }

    // Determine Classification
    let probabilityClass = 'Low';
    if (score >= 80) {
      probabilityClass = 'High';
    } else if (score >= 60) {
      probabilityClass = 'Medium';
    }

    return {
      conversion_score: score,
      probability_class: probabilityClass,
      next_best_action: 'Schedule Demo',
      summary: 'Lead is actively engaged.',
    };
  }
}
