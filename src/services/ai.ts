import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export interface PortfolioItem {
    stock_name: string;
    current_price: string;
    target_price: string;
    stop_loss: string;
    disparity_ratio: string;
    risk_factors: string;
    trigger_material: string;
    status: string;
}

export interface AIAnalysisResult {
    portfolio: PortfolioItem[];
    newsSummary: string;
}

export async function analyzeNewsWithGemini(newsText: string, previousPortfolio: PortfolioItem[] = []): Promise<AIAnalysisResult> {
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        // @ts-ignore
        tools: [{ googleSearch: {} }]
    });

    const prompt = `
당신은 한국 주식 시장(KOSPI, KOSDAQ) 전문 수석 AI 애널리스트입니다. 
다음 뉴스 기사들을 분석하여 유망 종목을 발굴하고, 포트폴리오 데이터를 생성하십시오.

# 작업 프로세스
1. **뉴스 분석**: 제공되는 기사의 핵심 내용(호재/악재, 모멘텀, 산업 동향 등)을 파악합니다.
2. **시장 데이터 크로스체크 (필수)**: 분석된 종목의 '현재가'와 '관련 공시' 등을 제공된 "구글 검색(Google Search) 도구"를 통해 실시간으로 검색해 확인하십시오. (반드시 검색 도구를 사용할 것)
3. **포트폴리오 업데이트**:
   - 신규 유망 종목 발굴 시 표에 추가.
   - 기존 종목의 재료 소멸이나 악재 발생 시 표에서 제외(매도 처리) 혹은 상태 변경.
   - 목표가 및 손절가는 기사의 임팩트와 현재 추세를 반영하여 논리적으로 산정.

# 운용 원칙 (Strict Rules)
1. 모든 분석은 한국 시장(국장)을 기준으로 하며, **절대로 가상의 종목(예: "~관련주", "~가정")을 만들지 마십시오.** 오직 실제 상장된 정확한 종목명만 사용해야 합니다.
2. '목표가'와 '손절가'는 단순 추측이 아닌, 기사 내용의 강도(수주 규모, 이익 개선폭 등)와 기술적 위치를 고려하여 산정하십시오.
3. 아래 제공되는 [이전 포트폴리오] 내역(보유 종목들)을 숙지/기억하고, 새로운 뉴스가 기존 종목에 영향을 미치는지 항상 확인하여 갱신하십시오. 영향을 받지 않는 기존 유망 종목은 그대로 다시 포함하여 반환하십시오.
4. 재무 비율, 밸류에이션(PER, PBR) 등 전문적인 지표를 근거로 삼으십시오.
5. **괴리율 계산식**: (목표가 - 현재가) / 현재가 * 100 (예: 21.4%)
6. **상태 허용값**: 신규편입 / 보유 / 관망 / 매도권고 / 제외 (반드시 이 중 하나로 지정)

# 출력 형식
반드시 아래 JSON 객체 형식으로만 반환해야 합니다. 마크다운(\`\`\`json) 등 다른 텍스트는 **절대 포함하지 마세요.**

{
  "newsSummary": "여기에 오늘 제공된 뉴스 기사들의 전반적인 핵심 내용을 3~4문장으로 요약하여 작성하십시오.",
  "portfolio": [
    {
      "stock_name": "종목명",
      "current_price": "70,000원",
      "target_price": "85,000원",
      "stop_loss": "65,000원",
      "disparity_ratio": "21.4%",
      "risk_factors": "리스크 요인 요약",
      "trigger_material": "기사 핵심 모멘텀",
      "status": "신규편입 (또는 보유 / 관망 / 매도권고 / 제외)"
    }
  ]
}

[이전 포트폴리오 데이터]
${JSON.stringify(previousPortfolio, null, 2)}

[오늘의 뉴스 기사]
${newsText.substring(0, 20000)}
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    responseText = responseText.replace(/```json\n/g, '').replace(/```\n?/g, '').trim();

    try {
        const data = JSON.parse(responseText);
        return {
            portfolio: Array.isArray(data.portfolio) ? data.portfolio : [],
            newsSummary: data.newsSummary || "요약 정보가 없습니다."
        };
    } catch (error) {
        console.error("AI 응답 파싱 실패", responseText);
        throw new Error('AI 분석 결과를 확인하던 중 오류가 발생했습니다.');
    }
}

export interface TechnicalAnalysisResult {
    analysisText: string;
}

export async function technicalAnalysisWithGemini(stockName: string): Promise<TechnicalAnalysisResult> {
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        // @ts-ignore
        tools: [{ googleSearch: {} }]
    });

    const prompt = `
당신은 한국 주식 시장(KOSPI, KOSDAQ) 전문 수석 AI 애널리스트입니다. 
사용자가 요청한 단일 종목에 대해 "구글 검색(Google Search) 도구"를 적극적으로 활용하여 최신 실시간 정보를 기반으로 기술적 분석을 수행하십시오.

# 대상 종목: ${stockName}

# 분석 사항
아래의 항목을 분석하여 상세히 설명해주십시오. 가격 및 타점은 뭉뚱그려 말하지 말고 반드시 "구체적인 수치(예: 75,000원)"로 명확하게 제시해야 합니다.
1. **현재 주가 동향**: 최신 실시간 가격, 최근 수급 동향, 모멘텀 요약
2. **기술적 매수 타점**: 지지선, 이평선, 보조지표(RSI 등) 기반 매수 전략
   - **1차 매수가**: (구체적인 가격)
   - **2차 매수가**: (구체적인 가격)
3. **기술적 매도 타점**: 저항선, 단기/중장기 관점 청산 전략
   - **1차 목표가(매도가)**: (구체적인 가격)
   - **2차 목표가(매도가)**: (구체적인 가격)
4. **손절 기준 (Stop Loss)**:
   - **손절가**: (어떤 지지선 혹은 이평선 이탈 기준인지 명시와 함께 구체적인 가격 제시)

# 주의사항
- 가독성이 좋은 마크다운 형식으로 작성해주세요. 요란한 수식어나 길고 장황한 서론은 제외하고 핵심만 짚어서 리포트 형식으로 작성하세요.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return {
        analysisText: responseText
    };
}
