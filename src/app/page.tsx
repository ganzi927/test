import { ExchangeRateWidget } from '@/components/features/ExchangeRate/ExchangeRateWidget';
import { PortfolioFeature } from '@/components/features/Portfolio';
import { Container, Title, Group } from '@mantine/core';

export default function Home() {
  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" align="center" mb="xl">
        <Title order={1}>AI 애널리스트 주식 포트폴리오 📈</Title>
        <ExchangeRateWidget />
      </Group>
      <PortfolioFeature />
    </Container>
  );
}
