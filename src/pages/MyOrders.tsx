import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrdersByUserId, updateOrder } from '../services/db';
import type { Order } from '../services/db';
import { Package, Clock, CheckCircle2, Truck, ShoppingBag, Calendar, XCircle } from 'lucide-react';

const MyOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      if (user) {
        const data = await getOrdersByUserId(user.id);
        const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(sorted);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    setCancellingId(id);
    try {
      await updateOrder(id, { status: 'cancelled' });
      setOrders(prev => prev.map(order =>
        order.id === id ? { ...order, status: 'cancelled' } : order
      ));
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'Available': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Not Available': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'Shipping': return 'text-purple-600 bg-purple-50 border-purple-100';
      case 'Ready for delivery': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      case 'delivered': return 'text-green-600 bg-green-50 border-green-100';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-orange-600 bg-orange-50 border-orange-100';
    }
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'shipping': return 'text-purple-600 bg-purple-50 border-purple-100';
      case 'delivered': return 'text-green-600 bg-green-50 border-green-100';
      case 'not available': return 'text-red-600 bg-red-50 border-red-100';
      case 'Ready for delivery': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      default: return 'text-slate-400 bg-slate-50 border-slate-100';
    }
  };

  if (loading) {
    return (
      <div className="section container flex-center" style={{ minHeight: '60vh' }}>
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary opacity-20 rounded-full mb-4"></div>
          <p className="text-muted">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section container animate-fade-in" style={{ padding: '3rem 1.5rem', minHeight: '85vh' }}>
      <div className="mb-10 text-center md:text-left">
        <h1 className="heading-lg flex items-center justify-center md:justify-start gap-4 text-primary">
          &nbsp; &nbsp; <ShoppingBag size={40} /> &nbsp; &nbsp; My Orders
        </h1>
        <br />
        <p className="text-muted mt-3 text-lg">Detailed history and tracking of your purchase requests.</p>
      </div>
      <br />

      {orders.length === 0 ? (
        <div className="card text-center py-20 bg-gray-50 border-dashed border-2 flex flex-col items-center rounded-3xl">
          <Package size={80} className="text-gray-300 mb-6" />
          <h2 className="heading-sm text-gray-500 mb-2">No orders yet</h2>
          <p className="text-muted mb-8 max-w-md">Your purchase history is empty. Start browsing our premium collection to place your first order.</p>
          <button onClick={() => window.location.href = '/products'} className="btn btn-primary px-10 py-4 rounded-2xl shadow-lg">Browse Products</button>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10">
          {orders.map((order) => (
            <div key={order.id} className="order-card-premium card">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Product Section */}
                <div className="flex items-center gap-6 flex-grow">
                  <div className="order-img-wrapper">
                    <img
                      src={order.productImage || '/logo.png'}
                      alt={order.productName}
                      className="order-img-fit"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-2xl font-black text-slate-800 leading-tight">{order.productName}</h3>
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                      <Clock size={16} />
                      Ordered on {new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="text-xs font-black text-primary bg-primary/5 px-2 py-1 rounded inline-block w-fit mt-1">
                      ID: {order.id.slice(-8).toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Status Section */}
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-8 md:min-w-[350px] justify-between lg:items-center px-2">
                  {order.status === 'cancelled' ? (
                    <div className="flex flex-col items-center justify-center bg-red-50/50 p-6 rounded-2xl border border-red-100 w-full animate-pulse">
                      <XCircle size={40} className="text-red-500 mb-2" />
                      <p className="text-red-600 font-black text-lg">Order Cancelled</p>
                      <p className="text-red-400 text-xs font-bold uppercase tracking-widest mt-1">No further action needed</p>
                    </div>
                  ) : (
                    <>
                      <div className="status-box flex-grow">
                        <p className="status-title">Current Progress</p>
                        <div className={`status-badge ${getStatusColor(order.status)}`}>
                          {order.status.toLowerCase() === 'available' && <Package size={18} />}
                          {order.status.toLowerCase() === 'shipping' && <Truck size={18} />}
                          {order.status.toLowerCase() === 'ready for delivery' && <Truck size={18} />}
                          {order.status.toLowerCase() === 'pending' && <Clock size={18} />}
                          {order.status.toLowerCase() === 'delivered' && <CheckCircle2 size={18} />}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </div>

                      <div className="status-box flex-grow">
                        <p className="status-title">Delivery Info</p>
                        <div className="flex flex-col gap-3">
                          <div className={`status-badge-premium ${getDeliveryStatusColor(order.deliveryStatus)}`}>
                            <span className="capitalize">{order.deliveryStatus || 'Processing'}</span>
                          </div>

                          {/* Task: Hide date if not available */}
                          {order.deliveryDate &&
                            order.deliveryStatus !== 'not available' && (
                              <div className="flex items-center gap-3 text-sm font-black text-slate-600 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <Calendar size={18} className="text-primary" />
                                <span>Exp. Delivery: {new Date(order.deliveryDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              </div>
                            )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Action Section */}
                {order.status === 'pending' && (
                  <div className="flex items-center justify-center md:border-l border-slate-100 md:pl-10">
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={cancellingId === order.id}
                      className="cancel-btn group"
                      title="Cancel Order"
                    >
                      <XCircle size={32} className="group-hover:scale-110 transition-transform" />
                      <span className="md:hidden font-black text-sm uppercase tracking-wider">Cancel My Order</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .order-card-premium {
          padding: 2.5rem;
          background: white;
          border-radius: 2.5rem;
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05);
          border: 1.5px solid #f8fafc;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .order-card-premium:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.1);
          border-color: #e2e8f0;
        }
        .order-img-wrapper {
          width: 120px;
          height: 120px;
          flex-shrink: 0;
          background: #f8fafc;
          border-radius: 2rem;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid #f1f5f9;
        }
        .order-img-fit {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .status-title {
          font-size: 0.7rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #94a3b8;
          margin-bottom: 0.75rem;
        }
        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          font-weight: 800;
          padding: 0.6rem 1.25rem;
          border-radius: 1.25rem;
          border-width: 1.5px;
          width: fit-content;
        }
        .cancel-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: #ef4444;
          background: #fef2f2;
          padding: 1rem;
          border-radius: 1.5rem;
          border: 1.5px solid #fee2e2;
          transition: all 0.2s;
          cursor: pointer;
        }
        .cancel-btn:hover {
          background: #ef4444;
          color: white;
          border-color: #ef4444;
        }
        
        .status-badge-premium {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          border-radius: 1rem;
          font-size: 0.9rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 2px solid transparent;
        }

        .order-card-premium {
          background: white;
          border-radius: 2.5rem;
          padding: 2.5rem;
          margin-bottom: 2.5rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #f1f5f9;
        }

        @media (max-width: 768px) {
          .order-card-premium {
            padding: 2rem;
            border-radius: 2rem;
            margin-bottom: 2rem;
          }
          .order-img-wrapper {
            width: 120px;
            height: 120px;
            border-radius: 1.5rem;
          }
          .status-badge-premium {
            font-size: 0.95rem;
            padding: 0.75rem 1.25rem;
            width: 100%;
            justify-content: center;
          }
          .cancel-btn {
            width: 100%;
            flex-direction: row;
            justify-content: center;
            padding: 1rem;
            border-radius: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MyOrders;
