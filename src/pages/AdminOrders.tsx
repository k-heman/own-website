import React, { useState, useEffect } from 'react';
import { getOrders, updateOrder } from '../services/db';
import type { Order } from '../services/db';
import { ShoppingBag, User, Phone, MapPin, Package, Clock, CheckCircle, XCircle, Search, RefreshCw, Truck } from 'lucide-react';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      // Sort by date descending
      const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(sorted);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, field: 'status' | 'deliveryStatus' | 'deliveryDate', value: string) => {
    setUpdatingId(id);
    try {
      await updateOrder(id, { [field]: value });
      setOrders(prev => prev.map(order =>
        order.id === id ? { ...order, [field]: value } : order
      ));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.mobile.includes(searchTerm)
  );

  const getOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'not available': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'shipping': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'ready for delivery': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-orange-50 text-orange-600 border-orange-100'; // pending
    }
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'shipping': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'delivered': return 'bg-green-50 text-green-600 border-green-100';
      case 'not available': return 'bg-red-50 text-red-600 border-red-100';
      case 'ready for delivery': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100'; // pending
    }
  };


  if (loading && orders.length === 0) {
    return (
      <div className="container py-20 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary opacity-20 rounded-full mb-4"></div>
          <p className="text-muted">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 px-4 md:px-6">
      <div className="flex-between mb-8 flex-wrap gap-6">
        <div>
          <h1 className="heading-lg flex items-center gap-3 text-primary">
            <ShoppingBag size={32} /> Customer Orders
          </h1>
          <p className="text-muted mt-1">Manage and track your customer purchase requests.</p>
        </div>

        <div className="flex gap-4 items-center flex-wrap">
          <div className="relative search-wrapper">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, product or mobile..."
              className="pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none w-full md:min-w-[320px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={fetchOrders} className="btn btn-secondary flex items-center gap-2 rounded-xl">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="card text-center py-20 bg-gray-50 border-dashed border-2 rounded-2xl">
          <Package size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="heading-sm text-gray-500">No orders found</h3>
          <p className="text-muted">Once customers use the 'Shop Now' option, they will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {filteredOrders.map((order) => (
            <div key={order.id} className="order-card-admin card shadow-xl border-t-4 border-primary overflow-hidden">
              <div className="p-0 md:p-2">
                {/* Header Section */}
                <div className="p-6 flex-between flex-wrap gap-4 border-b border-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                      <User size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-800">{order.fullName}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm font-bold text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                          <Clock size={14} /> {new Date(order.createdAt).toLocaleDateString()} @ {new Date(order.createdAt).toLocaleTimeString()}
                        </span>
                        <span className="text-sm font-bold text-primary flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-md">
                          ID: {order.id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`status-pill border shadow-sm ${getOrderStatusColor(order.status)}`}>
                      {order.status || 'Pending'}
                    </div>
                  </div>
                </div>

                {/* Main Content Grid (Task: Medium Image + Step-by-Step Details) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-slate-100">
                  {/* Product Column */}
                  <div className="lg:col-span-5 p-8 border-r border-slate-50 bg-slate-50/20">
                    <p className="admin-label mb-4">Product Details</p>
                    <div className="flex items-center gap-6">
                      <div className="w-[140px] h-[140px] bg-white rounded-2xl shadow-sm border border-slate-100 p-2 flex-center flex-shrink-0">
                        <img
                          src={order.productImage || '/logo.png'}
                          alt={order.productName}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-black text-slate-800 text-xl leading-tight">{order.productName}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-black bg-primary/10 px-3 py-1 rounded-lg text-sm">Quantity: {order.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info Column */}
                  <div className="lg:col-span-7 p-8 flex flex-col md:flex-row gap-8">
                    {/* Step 1: Contact */}
                    <div className="flex-1">
                      <p className="admin-label mb-4">Step 1: Contact Detail</p>
                      <div className="flex items-center gap-4 group">
                        <div className="bg-green-50 p-3 rounded-2xl text-green-600 border border-green-100">
                          <Phone size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Number</p>
                          <a href={`tel:${order.mobile}`} className="text-lg font-black text-slate-700 hover:text-primary transition-colors">
                            {order.mobile}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Step 2: Shipping */}
                    <div className="flex-[1.5]">
                      <p className="admin-label mb-4">Step 2: Shipping Destination</p>
                      <div className="flex items-start gap-4">
                        <div className="bg-orange-50 p-3 rounded-2xl text-orange-600 border border-orange-100 mt-1">
                          <MapPin size={20} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-black text-slate-700 leading-tight">
                            {order.address.village}, {order.address.mandal}
                          </p>
                          <p className="font-bold text-slate-500 uppercase tracking-wider text-xs">
                            {order.address.district}, {order.address.state} — {order.address.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Controls Footer (Task Refined) */}
                <div className="p-8 bg-slate-50/50 flex items-center justify-between flex-wrap gap-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full lg:w-auto flex-grow">
                    {/* Order Status Select */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Order Status</label>
                      <select
                        className={`status-select font-black border-2 transition-all ${getOrderStatusColor(order.status || 'pending')}`}
                        value={order.status || 'pending'}
                        onChange={(e) => handleStatusUpdate(order.id, 'status', e.target.value)}
                        disabled={updatingId === order.id}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="available">✅Accepted</option>
                        <option value="not available">❌ Not Available</option>
                        <option value="delivered">🎉 Delivered</option>
                        <option value="cancelled">🚫 Cancelled</option>
                      </select>
                    </div>

                    {/* Delivery Status Select */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Delivery Status</label>
                      <select
                        className={`status-select font-black border-2 transition-all ${getDeliveryStatusColor(order.deliveryStatus || 'pending')}`}
                        value={order.deliveryStatus || 'pending'}
                        onChange={(e) => handleStatusUpdate(order.id, 'deliveryStatus', e.target.value)}
                        disabled={updatingId === order.id}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="available">✅ Available</option>
                        <option value="not available">❌ Not Available</option>
                        <option value="shipping">🚛 Shipping</option>
                        <option value="ready for delivery">📍 Ready for delivery</option>
                        <option value="delivered">🎉 Delivered</option>
                        <option value="cancelled">🚫 Cancelled</option>
                      </select>
                    </div>

                    {/* Delivery Date Field - Calendar Type */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Delivery Date (Calendar)</label>
                      <div className="relative">
                        <input
                          type="date"
                          className="status-select font-black border-2 border-slate-200 outline-none w-full !bg-white hover:border-primary focus:border-primary transition-colors"
                          value={order.deliveryDate || ''}
                          onChange={(e) => handleStatusUpdate(order.id, 'deliveryDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 ml-auto lg:ml-0">
                    <button
                      className="p-4 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white border-2 border-red-100 hover:border-red-500 transition-all shadow-sm bg-white active:scale-95"
                      title="Quick Cancel"
                      onClick={() => handleStatusUpdate(order.id, 'status', 'cancelled')}
                    >
                      <XCircle size={24} />
                    </button>
                    <button
                      className="p-4 rounded-2xl text-green-500 hover:bg-green-500 hover:text-white border-2 border-green-100 hover:border-green-500 transition-all shadow-sm bg-white active:scale-95"
                      title="Quick Complete"
                      onClick={() => handleStatusUpdate(order.id, 'status', 'delivered')}
                    >
                      <CheckCircle size={24} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .order-card-admin {
          border-radius: 1.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .order-card-admin:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15);
        }
        .admin-label {
          font-size: 0.7rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #94a3b8;
        }
        .status-pill {
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .status-select {
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-size: 0.85rem;
          border: 1px solid #e2e8f0;
          outline: none;
          cursor: pointer;
          background: white;
          min-width: 160px;
        }
        .status-select:focus {
          border-color: var(--color-primary);
        }
        .icon-btn {
          padding: 0.75rem;
          border-radius: 12px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .search-wrapper {
          flex-grow: 1;
        }
        @media (max-width: 768px) {
          .order-card-admin {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminOrders;
