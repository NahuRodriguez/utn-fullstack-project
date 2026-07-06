import { formatPrice, formatDate } from "../../utils/utils";
import {
    ChevronRight,
    Package,
    Clock,
    Tag,
    Hash
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export const OrderCard = ({order}) => {
    const { date, time } = formatDate(order.createdAt);
    return (
        <Link
            key={order.id}
            to="/mis-compras/$orderId"
            params={{ orderId: order.id }}
            className="order-card"
        >
            <div className="order-card-bar" />

            <div className="order-card-id">
                <Package size={16} className="order-card-id-icon" />
                <span className="order-card-id-text">
                    #{order.id.slice(-8).toUpperCase()}
                </span>
            </div>

            <div className="order-card-meta">
                <span className="order-card-meta-item">
                    <Clock size={13} />
                    {time}
                </span>
                <span className="order-card-meta-item">
                    <Tag size={13} />
                    {date}
                </span>
                <span className="order-card-meta-item">
                    <Hash size={13} />
                    {order.items?.length || 0} producto{(order.items?.length || 0) !== 1 ? "s" : ""}
                </span>
            </div>

            <div className="order-card-footer">
                <span className="order-card-footer-label">Total</span>
                <div className="order-card-footer-right">
                    <span className="total-price" style={{ fontSize: "1.35rem" }}>
                        {formatPrice(order.total)}
                    </span>
                    <ChevronRight size={18} className="order-card-arrow" />
                </div>
            </div>
        </Link>
    );
}