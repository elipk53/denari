import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function generateScoringPrompt(emailText: string, responseTime: number): string {
  return `
  You are an AI model that evaluates email communications based on four key business interaction metrics:
  1. **Response Time** (Did the sender respond quickly? Response time is ${responseTime} hours)
  2. **Fairness** (Was the request reasonable?)
  3. **Respect** (Was the email polite and respectful?)
  4. **Professionalism** (Did the email maintain a professional tone?)

  Each metric should be rated on a scale from 1 (worst) to 5 (best), following these rules:

  - **Response Time**:
    - 1: Response took **longer than 4 weeks**.
    - 2: Response took **within 4 weeks**.
    - 3: Response took **within 1 week**.
    - 4: Response took **within 16 hours**.
    - 5: Response took **within 4 hours**.

  - **Fairness, Respect, and Professionalism** use standard scoring.

  **Email Text for Evaluation:**
  """
  ${emailText}
  """

  **Return a JSON object**:
  {
    "response_time": <score from 1-5>,
    "fairness": <score from 1-5>,
    "respect": <score from 1-5>,
    "professionalism": <score from 1-5>,
    "total_score": <sum of all scores>
  }
  `;
}

export async function analyzeEmail(emailText: string, responseTime: number) {
  try {
    const prompt = generateScoringPrompt(emailText, responseTime);

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: prompt }],
      temperature: 0.3,
      max_tokens: 200,
    });

    const jsonText = response.choices[0]?.message?.content?.trim() || "{}";
    const scores = JSON.parse(jsonText);

    return {
      responseTime: scores.response_time,
      fairness: scores.fairness,
      respect: scores.respect,
      professionalism: scores.professionalism,
      totalScore: scores.total_score,
    };
  } catch (error) {
    console.error("Error analyzing email:", error);
    return {
        responseTime: null,
        fairness: null,
        respect: null,
        professionalism: null,
        totalScore: null,
      };
  }
}
