export interface PortfolioItem {
    id?: string;
    stock_name: string;
    current_price: string;
    target_price: string;
    stop_loss: string;
    disparity_ratio: string;
    risk_factors: string;
    trigger_material: string;
    status: string;
    updated_at?: string;
}
