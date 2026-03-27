import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { User, Phone, MapPin, Package, Send, AlertCircle, ArrowLeft, Info, CheckCircle } from 'lucide-react';
import { addOrder, getProductById } from '../services/db';
import type { Product } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../components/ProductCard';

const Checkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    village: '',
    mandal: '',
    district: 'Peddapalli',
    state: 'Telangana',
    pincode: '',
    quantity: 1
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProductById(id)
      .then(data => {
        if (!data) throw new Error('Product not found');
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.username || ''
      }));
    }
  }, [user]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "Enter a valid 10-digit mobile number";
    if (!formData.village.trim()) newErrors.village = "Village is required";
    if (!formData.mandal.trim()) newErrors.mandal = "Mandal is required";
    if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Enter a valid 6-digit pincode";
    if (formData.quantity < 1) newErrors.quantity = "Quantity must be at least 1";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !validate()) return;

    setIsSubmitting(true);
    try {
      const orderData = {
        productId: product.id,
        productName: product.name,
        productImage: product.image || (product.images && product.images[0]) || '',
        fullName: formData.fullName,
        mobile: formData.mobile,
        address: {
          village: formData.village,
          mandal: formData.mandal,
          district: formData.district,
          state: formData.state,
          pincode: formData.pincode,
        },
        quantity: formData.quantity,
        userId: user?.id,
      };

      await addOrder(orderData as any);

      // Automated WhatsApp message (Task 11)
      const whatsappNumber = "919959916507";
      const priceText = (!product.pricingType || product.pricingType === 'standard') ? formatCurrency(product.price) : "Contact for Price";
      const message = `Hii, \n I am ${formData.fullName}, i want to buy ${product.name} which was ${priceText}. \n Confirm my order and share more details about delivery.`;

      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');

      navigate('/my-orders');
    } catch (error) {
      console.error("Order submission failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center section heading-md text-muted">Loading Checkout...</div>;
  if (!product) return <div className="text-center section heading-md text-muted">Product Not Found</div>;

  return (
    <div className="section container animate-fade-in" style={{ padding: '3rem 1.5rem', minHeight: '90vh' }}>
      <div className="max-w-4xl mx-auto">
        <Link to={`/products/${id}`} className="flex items-center gap-2 text-primary hover:underline mb-8 font-semibold">
          <ArrowLeft size={18} /> Back to Product
        </Link>
        <br />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card shadow-xl p-6 sticky top-24 bg-white" style={{ borderRadius: '1.5rem', border: '1px solid #f1f5f9' }}>
              <br />
              <h2 className="heading-sm mb-6 flex items-center gap-2">
                &nbsp; &nbsp; <Package size={20} className="text-primary" />&nbsp; &nbsp;Order Summary
              </h2>
              <br />
              <div className="checkout-summary-content">
                <div className="checkout-summary-image-wrapper">
                  <img
                    src={product.image || (product.images && product.images[0]) || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="checkout-summary-img"
                  />
                </div>
                <div className="checkout-summary-details">
                  <h3 className="checkout-summary-name">{product.name}</h3>
                  <p className="checkout-summary-price">
                    {(!product.pricingType || product.pricingType === 'standard') ? formatCurrency(product.price) : 'Contact for Price'}
                  </p>
                  {product.promises?.delivery && (
                    <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-3 py-2 rounded-lg text-xs mt-2 w-fit">
                      <CheckCircle size={14} /> Delivery Available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="card shadow-2xl p-8 md:p-14 bg-white" style={{ borderRadius: '2.5rem', border: '1px solid #f1f5f9' }}>
              <h1 className="heading-md mb-10 px-2" style={{ borderLeft: '4px solid var(--color-primary)', paddingLeft: '1.5rem' }}>Enter Order Details</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label className="form-label flex items-center gap-2"><User size={16} /> Full Name</label>
                    <input
                      type="text"
                      className={`form-input-premium ${errors.fullName ? 'border-red-500' : ''}`}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.fullName}</p>}
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="form-label flex items-center gap-2"><Phone size={16} /> Mobile Number</label>
                    <input
                      type="tel"
                      maxLength={10}
                      className={`form-input-premium ${errors.mobile ? 'border-red-500' : ''}`}
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                      placeholder="10-digit number"
                    />
                    {errors.mobile && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.mobile}</p>}
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="form-label flex items-center gap-2"><Package size={16} /> Quantity</label>
                    <input
                      type="number"
                      min="1"
                      className={`form-input-premium ${errors.quantity ? 'border-red-500' : ''}`}
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    />
                    {errors.quantity && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.quantity}</p>}
                  </div>

                  <div className="md:col-span-2 flex items-center gap-4 py-2">
                    <div className="h-[1px] bg-slate-100 flex-grow"></div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <MapPin size={14} /> Delivery Address
                    </span>
                    <div className="h-[1px] bg-slate-100 flex-grow"></div>
                  </div>

                  <div>
                    <label className="form-label">Village</label>
                    <input
                      type="text"
                      className={`form-input-premium ${errors.village ? 'border-red-500' : ''}`}
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      placeholder="Village name"
                    />
                  </div>

                  <div>
                    <label className="form-label">Mandal</label>
                    <input
                      type="text"
                      className={`form-input-premium ${errors.mandal ? 'border-red-500' : ''}`}
                      value={formData.mandal}
                      onChange={(e) => setFormData({ ...formData, mandal: e.target.value })}
                      placeholder="Mandal name"
                    />
                  </div>

                  <div>
                    <label className="form-label">District</label>
                    <input
                      type="text"
                      className="form-input-premium bg-slate-50"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="form-label">PIN Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      className={`form-input-premium ${errors.pincode ? 'border-red-500' : ''}`}
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                      placeholder="6-digit pincode"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-8">
                  {/* Delivery Instructions Small Button (Task 3) */}
                  <Link
                    to="/delivery"
                    className="flex items-center justify-center gap-2 text-primary hover:underline font-bold text-sm bg-blue-50 py-2 rounded-xl self-center px-6"
                  >
                    <Info size={16} /> View Delivery Instructions
                  </Link>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full py-5 text-xl flex items-center justify-center gap-3 shadow-blue-200"
                    style={{ borderRadius: '1.25rem' }}
                  >
                    {isSubmitting ? "Processing..." : <>Confirm your Order<Send size={20} /></>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .checkout-summary-content { display: flex; flex-direction: column; gap: 1.5rem; }
        .checkout-summary-image-wrapper { width: 100%; aspect-ratio: 1; border-radius: 1.25rem; background: #f8fafc; padding: 1rem; border: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .checkout-summary-img { width: 100%; height: 100%; object-fit: contain; }
        .checkout-summary-details { flex: 1; }
        .checkout-summary-name { font-weight: 800; font-size: 1.1rem; line-height: 1.3; margin-bottom: 0.5rem; color: #1e293b; }
        .checkout-summary-price { font-weight: 900; font-size: 1.5rem; color: var(--color-primary); }

        @media (min-width: 1024px) {
          .checkout-summary-content { flex-direction: row; align-items: center; gap: 1.25rem; }
          .checkout-summary-image-wrapper { width: 100px; height: 100px; flex-shrink: 0; }
          .checkout-summary-name { font-size: 1rem; }
          .checkout-summary-price { font-size: 1.25rem; }
        }

        .form-label { font-size: 0.85rem; font-weight: 700; color: #64748b; margin-bottom: 0.5rem; display: block; }
        .form-input-premium { 
          width: 100%; 
          padding: 1.15rem 1.5rem; 
          border: 1.5px solid #E2E8F0; 
          border-radius: 1.25rem; 
          outline: none; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 1rem;
          color: #1e293b;
          background-color: #fcfdfe;
        }
        .form-input-premium:focus { 
          border-color: var(--color-primary); 
          box-shadow: 0 0 0 5px rgba(30, 58, 138, 0.08); 
          background: white;
          transform: translateY(-1px);
        }
        .shadow-blue-200 { box-shadow: 0 20px 25px -5px rgba(30, 58, 138, 0.2), 0 10px 10px -5px rgba(30, 58, 138, 0.1); }
      `}</style>
    </div>
  );
};

export default Checkout;
