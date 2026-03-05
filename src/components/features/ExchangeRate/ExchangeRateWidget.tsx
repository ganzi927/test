'use client';
import { useState, useEffect } from 'react';
import { Group, Text, ActionIcon, Loader, Card, Badge } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';

export function ExchangeRateWidget() {
    const [rate, setRate] = useState<number | null>(null);
    const [wti, setWti] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    const fetchRate = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/exchange-rate');
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || '환율 오류');

            setRate(data.rate);
            setWti(data.wti);

            const now = new Date();
            setLastUpdated(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 최초 1회 자동 로드
    useEffect(() => {
        fetchRate();
    }, []);

    return (
        <Card shadow="sm" padding="sm" radius="md" withBorder mb="xl" style={{ display: 'inline-block' }}>
            <Group justify="space-between" align="center" gap="lg">
                <Group gap="xs" mr="xl">
                    <Badge color="blue" variant="light" size="lg">USD/KRW</Badge>
                    {loading && !rate ? (
                        <Loader size="sm" color="blue" />
                    ) : error ? (
                        <Text c="red" size="sm" fw={500}>조회 실패</Text>
                    ) : (
                        <Text fw={700} size="xl">
                            {rate ? `₩${rate.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '---'}
                        </Text>
                    )}
                </Group>

                <Group gap="xs">
                    <Badge color="orange" variant="light" size="lg">WTI 유가</Badge>
                    {loading && !wti ? (
                        <Loader size="sm" color="orange" />
                    ) : error ? (
                        <Text c="red" size="sm" fw={500}>조회 실패</Text>
                    ) : (
                        <Text fw={700} size="xl">
                            {wti ? `$${wti}` : '---'}
                        </Text>
                    )}
                </Group>

                <Group gap="xs">
                    {lastUpdated && !error && (
                        <Text size="xs" c="dimmed">
                            {lastUpdated} 기준
                        </Text>
                    )}
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={fetchRate}
                        loading={loading}
                        title="환율 새로고침"
                    >
                        <IconRefresh size={18} />
                    </ActionIcon>
                </Group>
            </Group>
        </Card>
    );
}
