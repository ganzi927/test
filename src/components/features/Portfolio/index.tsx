'use client';
import { useState, useEffect } from 'react';
import { Stack, Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { NewsScraperButton } from './NewsScraperButton';
import { PortfolioTable } from './PortfolioTable';
import { supabase } from '@/services/supabase';
import type { PortfolioItem } from './types';

export function PortfolioFeature() {
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [newsSummary, setNewsSummary] = useState<string | null>(null);

    const fetchPortfolio = async (summary?: string) => {
        setLoading(true);
        if (summary) setNewsSummary(summary);
        const { data, error } = await supabase
            .from('portfolio')
            .select('*')
            .order('updated_at', { ascending: false });

        if (!error && data) {
            setItems(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPortfolio();
    }, []);

    return (
        <Stack gap="xl">
            <NewsScraperButton onScrapeComplete={fetchPortfolio} />
            {items.length === 0 && !loading ? (
                <Alert icon={<IconInfoCircle size={16} />} title="데이터 없음" color="blue">
                    아직 포트폴리오 데이터가 없습니다. 위의 버튼을 눌러 오늘자 뉴스를 분석해보세요.
                </Alert>
            ) : (
                <>
                    <PortfolioTable data={items} loading={loading} />
                    {newsSummary && (
                        <Alert title="📰 오늘의 뉴스 요약" color="indigo" variant="light" mt="xl">
                            {newsSummary}
                        </Alert>
                    )}
                </>
            )}
        </Stack>
    );
}
