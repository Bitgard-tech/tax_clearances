import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        const vehicles = await db.vehicle.findMany({
            include: { expenses: true },
            orderBy: { createdAt: 'desc' },
        });

        // Create CSV content
        const headers = [
            'ID',
            'Make',
            'Model',
            'Year',
            'Reg Number',
            'VIN',
            'Status',
            'Purchase Price',
            'Purchase Date',
            'Sold Price',
            'Sold Date',
            'Total Expenses',
            'Total Cost',
            'Profit/Loss',
        ];

        const rows = vehicles.map((v) => {
            const totalExpenses = v.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
            const purchasePrice = Number(v.purchasePrice);
            const soldPrice = v.soldPrice ? Number(v.soldPrice) : 0;
            const totalCost = purchasePrice + totalExpenses;
            const profitLoss = v.status === 'SOLD' ? soldPrice - totalCost : 0;

            return [
                v.id,
                v.make,
                v.model,
                v.year,
                v.regNumber,
                v.vin || '',
                v.status,
                purchasePrice,
                v.purchaseDate ? new Date(v.purchaseDate).toLocaleDateString() : '',
                v.soldPrice ? soldPrice : '',
                v.soldDate ? new Date(v.soldDate).toLocaleDateString() : '',
                totalExpenses,
                totalCost,
                v.status === 'SOLD' ? profitLoss : '',
            ];
        });

        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n');

        // Return CSV file
        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="inventory-export-${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json({ error: 'Export failed' }, { status: 500 });
    }
}
