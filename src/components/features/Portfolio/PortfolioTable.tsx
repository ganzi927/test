'use client';
import { Table, Badge, Loader, Center } from '@mantine/core';
import type { PortfolioItem } from './types';

interface Props {
    data: PortfolioItem[];
    loading: boolean;
}

const getStatusColor = (status: string) => {
    if (status.includes('보유')) return 'blue';
    if (status.includes('신규')) return 'green';
    if (status.includes('매도')) return 'red';
    if (status.includes('제외')) return 'gray';
    return 'orange';
};

export function PortfolioTable({ data, loading }: Props) {
    if (loading) {
        return (
            <Center p="xl">
                <Loader size="lg" />
            </Center>
        );
    }

    const rows = data.map((item) => (
        <Table.Tr key={item.id || item.stock_name}>
            <Table.Td fw={700}>{item.stock_name}</Table.Td>
            <Table.Td>{item.current_price}</Table.Td>
            <Table.Td c="red" fw={500}>{item.target_price}</Table.Td>
            <Table.Td c="blue">{item.stop_loss}</Table.Td>
            <Table.Td fw={700}>{item.disparity_ratio}</Table.Td>
            <Table.Td>{item.risk_factors}</Table.Td>
            <Table.Td>{item.trigger_material}</Table.Td>
            <Table.Td>
                <Badge
                    color={getStatusColor(item.status)}
                    variant="light"
                    styles={{ root: { textTransform: 'none', height: 'auto', padding: '4px 8px' }, label: { whiteSpace: 'normal', overflow: 'visible' } }}
                >
                    {item.status}
                </Badge>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table.ScrollContainer minWidth={800}>
            <Table striped highlightOnHover withTableBorder withColumnBorders verticalSpacing="sm">
                <Table.Thead bg="var(--mantine-color-gray-1)">
                    <Table.Tr>
                        <Table.Th>종목명</Table.Th>
                        <Table.Th>현재가</Table.Th>
                        <Table.Th>목표가</Table.Th>
                        <Table.Th>손절가</Table.Th>
                        <Table.Th>괴리율(%)</Table.Th>
                        <Table.Th>리스크요인</Table.Th>
                        <Table.Th>트리거(재료)</Table.Th>
                        <Table.Th>상태</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}
