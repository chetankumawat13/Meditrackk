const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
import { config } from '../config/config.js';

function extractJson(text) {
    const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('Gemini returned an invalid response');
    return JSON.parse(cleaned.slice(start, end + 1));
}

export const readPrescription = async (req, res) => {
    try {
        const { image, mimeType } = req.body;
        const apiKey = config.GEMINI_API_KEY?.trim();

        if (!apiKey) {
            return res.status(503).json({ success: false, message: 'Gemini API is not configured' });
        }
        if (!image || !mimeType || !/^image\/(jpeg|png|webp|heic|heif)$/.test(mimeType)) {
            return res.status(400).json({ success: false, message: 'A valid prescription image is required' });
        }

        const response = await fetch(
            `${GEMINI_URL}/${config.GEMINI_MODEL}:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            {
                                text: 'Read this handwritten medical note. Return only JSON with this exact shape: {"medicines":[{"name":"string","quantity":number|null,"instructions":"string"}],"rawText":"string","confidence":"high|medium|low"}. Do not diagnose, infer, or recommend medicines. Include only medicine names that are visibly written. Preserve uncertain spellings in the name and use low confidence when handwriting is unclear.',
                            },
                            { inline_data: { mime_type: mimeType, data: image } },
                        ],
                    }],
                    generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
                }),
            }
        );

        const result = await response.json();
        if (!response.ok) {
            return res.status(502).json({ success: false, message: result.error?.message || 'Gemini could not read the image' });
        }

        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        const extracted = extractJson(text || '');
        const medicines = Array.isArray(extracted.medicines) ? extracted.medicines.filter((medicine) => medicine?.name) : [];

        return res.status(200).json({
            success: true,
            medicines,
            rawText: extracted.rawText || '',
            confidence: extracted.confidence || 'low',
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || 'Unable to read prescription' });
    }
};