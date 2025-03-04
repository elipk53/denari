import Groq from "groq-sdk";
import { calculateResponseTimeScore } from "./utils";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

function generateScoringPrompt(emailText: string): string {
  return `
  You are an AI assistant trained to evaluate email communications based on four key business interaction metrics. Each metric must be scored from 1 (worst) to 5 (best), strictly following this rubric:

  **Rubric for Scoring Emails:**
  
  - **Fairness:**
    - 1: The client request was **not reasonable at all**.
    - 2: The client request was **somewhat not reasonable**.
    - 3: The client request was **somewhat reasonable**.
    - 4: The client request was **reasonable**.
    - 5: The client request was **very reasonable**.

  - **Respect:**
    - 1: The client request was **not respectful at all**.
    - 2: The client request was **somewhat not respectful**.
    - 3: The client request was **somewhat respectful**.
    - 4: The client request was **respectful**.
    - 5: The client request was **very respectful**.

  - **Professionalism:**
    - 1: The client request was **not professional at all**.
    - 2: The client request was **somewhat not professional**.
    - 3: The client request was **somewhat professional**.
    - 4: The client request was **professional**.
    - 5: The client request was **very professional**.

  **Email Text for Evaluation:**
  """
  ${emailText}
  """

  **Return ONLY a valid JSON object with this exact format:**
  {
    "fairness": {
      "score": 1-5,
      "explanation": "Detailed reasoning for the fairness score."
    },
    "respect": {
      "score": 1-5,
      "explanation": "Detailed reasoning for the respect score."
    },
    "professionalism": {
      "score": 1-5,
      "explanation": "Detailed reasoning for the professionalism score."
    }
  }

  No extra words, no explanations outside of the JSON. The response **must be** valid JSON and nothing else.
  `;
}

export async function analyzeEmail(emailText: string, responseTime: number) {
  const responseTimeScore = calculateResponseTimeScore(responseTime);

  try {
    const prompt = generateScoringPrompt(emailText);

    const response = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-specdec",
        messages: [{ role: "system", content: prompt }],
        temperature: 0,
        max_tokens: 1024,
        response_format: { type: "json_object" },
    });

    const rawText = response.choices[0]?.message?.content?.trim() || "{}";
    const jsonText = rawText.replace(/```json|```/g, "").trim();
    const parsedResponse = JSON.parse(jsonText);

    const fairnessScore = parsedResponse.fairness?.score || 1;
    const respectScore = parsedResponse.respect?.score || 1;
    const professionalismScore = parsedResponse.professionalism?.score || 1;

    const fairnessExplanation =
      parsedResponse.fairness?.explanation || "No explanation provided.";
    const respectExplanation =
      parsedResponse.respect?.explanation || "No explanation provided.";
    const professionalismExplanation =
      parsedResponse.professionalism?.explanation || "No explanation provided.";

    const totalScore = fairnessScore + respectScore + professionalismScore;

    return {
      responseTime: {
        score: responseTimeScore,
        explanation: `${responseTime} hours`,
      },
      fairness: { score: fairnessScore, explanation: fairnessExplanation },
      respect: { score: respectScore, explanation: respectExplanation },
      professionalism: {
        score: professionalismScore,
        explanation: professionalismExplanation,
      },
      totalScore: totalScore,
    };
  } catch (error) {
    console.error("Error analyzing email:", error);
    return {
      responseTime: {
        score: responseTimeScore,
        explanation: `${responseTime} hours`,
      },
      fairness: {
        score: null,
        explanation: "Error processing fairness score.",
      },
      respect: { score: null, explanation: "Error processing respect score." },
      professionalism: {
        score: null,
        explanation: "Error processing professionalism score.",
      },
      totalScore: null,
    };
  }
}
