import { NextResponse } from 'next/server';
import { scrapeTodaysHeadlineURL, scrapeArticleText } from '@/services/scraper';
import { analyzeNewsWithGemini, PortfolioItem } from '@/services/ai';
import { supabase } from '@/services/supabase';

export async function POST(req: Request) {
    try {
        const articleUrl = await scrapeTodaysHeadlineURL();
        if (!articleUrl) {
            return NextResponse.json({ error: '오늘 날짜의 주요신문 헤드라인 기사를 찾을 수 없습니다.' }, { status: 404 });
        }

        const articleText = await scrapeArticleText(articleUrl);
        if (!articleText) {
            return NextResponse.json({ error: '기사 본문을 스크랩하는 데 실패했습니다.' }, { status: 500 });
        }

        // 이전 포트폴리오를 가져와서 AI 프롬프트에 제공
        const { data: previousPortfolio } = await supabase.from('portfolio').select('*');

        const aiAnalysisResult = await analyzeNewsWithGemini(articleText, previousPortfolio || []);
        const portfolioItems = aiAnalysisResult.portfolio;
        const newsSummary = aiAnalysisResult.newsSummary;

        if (!portfolioItems || portfolioItems.length === 0) {
            return NextResponse.json({ error: 'AI 분석 결과가 비어있습니다.' }, { status: 500 });
        }

        const { data: upsertData, error: dbError } = await supabase
            .from('portfolio')
            .upsert(
                portfolioItems,
                { onConflict: 'stock_name' }
            )
            .select();

        if (dbError) {
            console.error('Supabase Upsert Error:', dbError);
            return NextResponse.json({ error: '데이터베이스 저장 중 오류가 발생했습니다: ' + dbError.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: upsertData,
            sourceUrl: articleUrl,
            newsSummary: newsSummary
        });

    } catch (error: any) {
        console.error('Analyze API Error:', error);
        return NextResponse.json({ error: error.message || '서버 내부 오류가 발생했습니다.' }, { status: 500 });
    }
}
