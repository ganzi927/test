import { GoogleGenerativeAI } from '@google/generative-ai';

async function test() {
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBfBNSEUP5SitAOHVonRRhUT0uog-5d5Bs'; // User provided it
    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            tools: [{ googleSearch: {} }]
        });

        const result = await model.generateContent("대한민국 주식 삼성전자의 현재 가격은 얼마인가요?");
        console.log(result.response.text());
    } catch (e) {
        console.error("Error", e);
    }
}
test();
