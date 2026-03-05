'use client';
import { useState } from 'react';
import { Button, Group, Text, Alert } from '@mantine/core';
import { IconDeviceDesktopAnalytics, IconAlertCircle, IconCheck } from '@tabler/icons-react';

interface Props {
    onScrapeComplete: (newsSummary?: string) => void;
}

export function NewsScraperButton({ onScrapeComplete }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const handleScrape = async () => {
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            const res = await fetch('/api/analyze', { method: 'POST' });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || '분석 중 오류가 발생했습니다.');
            }

            setSuccessMsg('뉴스 분석 및 포트폴리오 갱신이 완료되었습니다!');
            onScrapeComplete(data.newsSummary);

            setTimeout(() => setSuccessMsg(null), 5000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Group justify="space-between" align="center" mb="md">
                <div>
                    <Text size="lg" fw={700}>오늘의 뉴스 기반 포트폴리오 업데이트</Text>
                    <Text c="dimmed" size="sm">버튼을 눌러 오늘 날짜 헤드라인 뉴스를 스크랩하고 AI로 분석합니다.</Text>
                </div>
                <Button
                    onClick={handleScrape}
                    loading={loading}
                    leftSection={<IconDeviceDesktopAnalytics size={18} />}
                    color="teal"
                    size="md"
                >
                    뉴스 스크랩 및 분석
                </Button>
            </Group>

            {error && (
                <Alert icon={<IconAlertCircle size={16} />} title="오류 발생" color="red" mb="md">
                    {error}
                </Alert>
            )}

            {successMsg && (
                <Alert icon={<IconCheck size={16} />} title="완료" color="green" mb="md">
                    {successMsg}
                </Alert>
            )}
        </>
    );
}
