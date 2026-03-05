import * as cheerio from 'cheerio';

export async function scrapeTodaysHeadlineURL(): Promise<string | null> {
    try {
        const url = 'https://briskeen.com/m/category/' + encodeURIComponent('헤드라인뉴스');
        const response = await fetch(url);
        if (!response.ok) return null;
        const html = await response.text();
        const $ = cheerio.load(html);

        // Extract JSON-LD
        const scriptTags = $('script[type="application/ld+json"]');
        for (let i = 0; i < scriptTags.length; i++) {
            const text = $(scriptTags[i]).html();
            if (!text) continue;
            try {
                const data = JSON.parse(text);
                if (data['@type'] === 'BreadcrumbList' && data.itemListElement) {
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = today.getMonth() + 1;
                    const day = today.getDate();
                    const todayTokens = [`${year}년`, `${month}월`, `${day}일`];

                    for (const item of data.itemListElement) {
                        const name = item.item.name;
                        if (name && todayTokens.every(token => name.includes(token))) {
                            return item.item['@id'];
                        }
                    }
                }
            } catch (e) {
                console.warn('Failed to parse JSON-LD', e);
            }
        }
    } catch (error) {
        console.error('Error in scrapeTodaysHeadlineURL:', error);
    }
    return null;
}

export async function scrapeArticleText(articleUrl: string): Promise<string> {
    const response = await fetch(articleUrl);
    if (!response.ok) throw new Error('Failed to fetch article');
    const html = await response.text();
    const $ = cheerio.load(html);

    let contentHtml = $('.tt_article_useless_p_margin').html() || $('.article_view').html() || $('.tt_article').html() || '';
    if (!contentHtml) {
        contentHtml = $('body').html() || '';
    }

    const $content = cheerio.load(contentHtml);
    $content('script, style').remove();

    return $content.text().replace(/\s+/g, ' ').trim();
}
