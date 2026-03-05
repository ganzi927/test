import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
    try {
        // Using a free open exchange rate API that doesn't strictly require an API key for basic usage
        const res = await fetch('https://open.er-api.com/v6/latest/USD');

        if (!res.ok) {
            throw new Error('환율 정보를 가져오는 데 실패했습니다.');
        }

        const data = await res.json();
        let wti = null;

        try {
            const oilRes = await fetch('https://finance.naver.com/marketindex/worldDailyQuote.naver?marketindexCd=OIL_CL&fdtc=2', {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            const oilHtml = await oilRes.text();
            const $ = cheerio.load(oilHtml);
            wti = $('table.tbl_exchange tbody tr').first().find('td.num').first().text().trim();
        } catch (oilErr) {
            console.error('Failed to fetch WTI:', oilErr);
        }

        if (data && data.rates && data.rates.KRW) {
            return NextResponse.json({
                success: true,
                rate: data.rates.KRW,
                wti: wti,
                base: 'USD',
                target: 'KRW',
                // timestamp: data.time_last_update_unix
            });
        } else {
            throw new Error('응답에 KRW 환율 정보가 없습니다.');
        }

    } catch (error: any) {
        console.error('Exchange Rate API Error:', error);
        return NextResponse.json({ error: error.message || '서버 내부 오류가 발생했습니다.' }, { status: 500 });
    }
}
