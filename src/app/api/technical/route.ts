import { NextResponse } from 'next/server';
import { technicalAnalysisWithGemini } from '@/services/ai';

export async function POST(req: Request) {
    try {
        const { stockName } = await req.json();

        if (!stockName) {
            return NextResponse.json({ error: '종목명이 필요합니다.' }, { status: 400 });
        }

        const data = await technicalAnalysisWithGemini(stockName);

        if (!data || !data.analysisText) {
            return NextResponse.json({ error: '기술적 분석 결과를 가져오지 못했습니다.' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: data
        });

    } catch (error: any) {
        console.error('Technical API Error:', error);
        return NextResponse.json({ error: error.message || '서버 내부 오류가 발생했습니다.' }, { status: 500 });
    }
}
