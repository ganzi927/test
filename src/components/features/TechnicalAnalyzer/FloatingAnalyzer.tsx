'use client';
import { useState } from 'react';
import { Affix, Popover, ActionIcon, TextInput, Button, Text, Stack, ScrollArea, Loader, Center } from '@mantine/core';
import { IconChartLine, IconX } from '@tabler/icons-react';

export function FloatingAnalyzer() {
    const [opened, setOpened] = useState(false);
    const [stockName, setStockName] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!stockName.trim()) return;
        setLoading(true);
        setResult(null);

        try {
            const res = await fetch('/api/technical', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stockName })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || '분석 실패');
            setResult(data.data.analysisText);
        } catch (error: any) {
            setResult(`**오류 발생:** ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Affix position={{ bottom: 40, right: 40 }}>
            <Popover opened={opened} onChange={setOpened} width={400} position="top-end" withArrow shadow="md">
                <Popover.Target>
                    <ActionIcon
                        size={60}
                        color="indigo"
                        radius="xl"
                        variant="filled"
                        onClick={() => setOpened((o) => !o)}
                        style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}
                    >
                        {opened ? <IconX size={28} /> : <IconChartLine size={28} />}
                    </ActionIcon>
                </Popover.Target>

                <Popover.Dropdown p="md">
                    <Stack gap="sm">
                        <Text fw={700} size="lg">📈 기술적 분석 AI</Text>
                        <Text size="sm" c="dimmed">
                            궁금한 종목명을 입력하시면 AI가 현재가 및 매수/매도 타점을 분석해 드립니다.
                        </Text>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <TextInput
                                placeholder="예) 삼성전자"
                                style={{ flex: 1 }}
                                value={stockName}
                                onChange={(e) => setStockName(e.currentTarget.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                            />
                            <Button onClick={handleAnalyze} loading={loading} color="indigo">
                                분석
                            </Button>
                        </div>

                        {loading && (
                            <Center py="xl">
                                <Loader color="indigo" type="dots" />
                            </Center>
                        )}

                        {result && !loading && (
                            <ScrollArea h={300} type="always" offsetScrollbars bg="var(--mantine-color-gray-0)" p="sm" style={{ borderRadius: 8 }}>
                                <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                                    {result}
                                </Text>
                            </ScrollArea>
                        )}
                    </Stack>
                </Popover.Dropdown>
            </Popover>
        </Affix>
    );
}
