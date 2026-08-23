import { ChatMistralAI } from "@langchain/mistralai";
import { PromptTemplate } from "@langchain/core/prompts";

// Initialize Mistral AI model
const mistralModel = process.env.MISTRAL_API_KEY ? new ChatMistralAI({
    apiKey: process.env.MISTRAL_API_KEY,
    model: process.env.MISTRAL_MODEL || "mistral-large-latest",
    temperature: 0.3,
    maxTokens: 1000
}) : null;

// Prompt template for medication analysis
const medicationAnalysisPrompt = PromptTemplate.fromTemplate(`
You are a medical AI assistant. Analyze the following patient's medication pattern and provide insights on potential side effects or concerns.

PATIENT INFORMATION:
- Age: {age}
- Gender: {gender}
- Known Allergies: {allergies}

MEDICATION HISTORY (Last 90 days):
{medicationHistory}

CURRENT ANALYSIS:
- Medicine: {medicineName}
- Generic Name: {genericName}
- Category: {category}
- Composition: {composition}
- Dosage & Frequency: {dosageFrequency}
- Duration of Continuous Use: {durationDays} days
- Expected Reaction Time (as per medical data): {expectedReactionTime} days
- Number of Purchases: {purchaseCount}
- Patient Reported Effects: {reportedEffects}

Please analyze and provide:
1. Whether the patient should have seen effects by now (based on expected reaction time)
2. Potential side effects to watch for
3. Possible drug interactions with other medicines in history
4. Recommendations (continue, consult doctor, stop, etc.)
5. Severity level (low/medium/high) of any concerns

Provide a concise, JSON-formatted response.
`);

// Main analysis function
export const analyzeMedicationPattern = async (patientData) => {
    try {
        if (!mistralModel) {
            throw new Error("MISTRAL_API_KEY is not configured");
        }

        const prompt = await medicationAnalysisPrompt.format({
            age: patientData.age || "Unknown",
            gender: patientData.gender || "Unknown",
            allergies: patientData.allergies?.join(", ") || "None recorded",
            medicationHistory: formatMedicationHistory(patientData.purchaseHistory),
            medicineName: patientData.currentMedicine.name,
            genericName: patientData.currentMedicine.genericName || "N/A",
            category: patientData.currentMedicine.category || "N/A",
            composition: patientData.currentMedicine.composition || "N/A",
            dosageFrequency: patientData.dosageFrequency || "As prescribed",
            durationDays: patientData.continuousUseDays,
            expectedReactionTime: patientData.expectedReactionTime,
            purchaseCount: patientData.purchaseCount,
            reportedEffects: patientData.reportedEffects || "None reported"
        });
        const response = await mistralModel.invoke(prompt);

        // Parse AI response
        const responseText = typeof response.content === 'string'
            ? response.content
            : response.content.map((part) => part.text || '').join('');
        const analysisResult = parseAIResponse(responseText);
        return analysisResult;

    } catch (error) {
        console.error("Error analyzing medication pattern:", error.message);
        throw new Error("Failed to analyze medication pattern");
    }
};

// Format medication history for prompt
function formatMedicationHistory(purchases) {
    if (!purchases || purchases.length === 0) return "No previous history";

    return purchases
        .map(purchase => {
            const date = new Date(purchase.createdAt).toLocaleDateString();
            const medicines = purchase.medicines
                .map(m => `${m.medicineName} (${m.quantity} units)`)
                .join(", ");
            return `${date}: ${medicines}`;
        })
        .join("\n");
}

// Parse AI response and extract structured data
function parseAIResponse(responseText) {
    try {
        // Try to extract JSON from response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return normalizeAIResult(JSON.parse(jsonMatch[0]), responseText);
        }

        // Fallback: create structured response from text
        return {
            effectsShouldBeVisible: responseText.toLowerCase().includes("should"),
            potentialSideEffects: extractSection(responseText, "side effects"),
            drugInteractions: extractSection(responseText, "interaction"),
            recommendation: extractSection(responseText, "recommendation"),
            severity: determineSeverity(responseText),
            rawAnalysis: responseText
        };
    } catch (error) {
        console.error("Error parsing AI response:", error.message);
        return {
            severity: "medium",
            recommendation: "Consult with doctor for personalized advice",
            rawAnalysis: responseText
        };
    }
}

function normalizeAIResult(result, rawAnalysis) {
    const analysis = result.analysis || result;
    const primaryRecommendation = analysis.recommendations?.primary;
    const severity = analysis.severity || analysis.severity_level?.overall_concern;
    const recommendation = typeof primaryRecommendation === "string"
        ? primaryRecommendation
        : primaryRecommendation?.action && primaryRecommendation?.reason
            ? `${primaryRecommendation.action}: ${primaryRecommendation.reason}`
            : analysis.recommendation;

    return {
        ...result,
        effectsShouldBeVisible: analysis.effectsShouldBeVisible
            ?? analysis.effects_by_now?.expected
            ?? analysis.effects_by_now?.should_have_seen_effects,
        potentialSideEffects: serializeAIField(analysis.potentialSideEffects || analysis.potential_side_effects),
        drugInteractions: serializeAIField(analysis.drugInteractions || analysis.drug_interactions),
        recommendation,
        severity: severity ? String(severity).toLowerCase() : determineSeverity(rawAnalysis),
        rawAnalysis
    };
}

function serializeAIField(value) {
    if (!value) return value;
    return typeof value === "string" ? value : JSON.stringify(value);
}

// Extract specific sections from text
function extractSection(text, keyword) {
    const regex = new RegExp(`${keyword}[^.!?]*[.!?]`, "gi");
    const matches = text.match(regex);
    return matches ? matches.join(" ").trim() : "Not specified";
}

// Determine severity from AI response
function determineSeverity(responseText) {
    const text = responseText.toLowerCase();
    if (text.includes("high") || text.includes("critical") || text.includes("severe")) return "high";
    if (text.includes("medium") || text.includes("moderate") || text.includes("concern")) return "medium";
    return "low";
}

// Simplified version for quick checks (uses basic logic before calling AI)
export const getExpectedReactionTime = (medicineName, category) => {
    // This is a simplified reference - in production, use a proper medical database
    const reactionTimes = {
        "paracetamol": 1,
        "ibuprofen": 1,
        "aspirin": 1,
        "antacid": 1,
        "antibiotic": 3,
        "antihistamine": 2,
        "antidepressant": 7,
        "blood_pressure": 14,
        "cholesterol": 14,
        "diabetes": 7,
        "thyroid": 7
    };

    const key = Object.keys(reactionTimes).find(
        k => medicineName?.toLowerCase().includes(k) || 
             category?.toLowerCase().includes(k)
    );

    return reactionTimes[key] || 7; // Default: 7 days
};

export default {
    analyzeMedicationPattern,
    getExpectedReactionTime,
    parseAIResponse
};
