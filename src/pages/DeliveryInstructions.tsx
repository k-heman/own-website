import React from 'react';
import { MapPin, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';

const DeliveryInstructions: React.FC = () => {
  return (
    <div className="section container animate-fade-in" style={{ padding: '4rem 1.5rem', minHeight: '90vh' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">

          <h1 className="heading-xl mb-4 text-primary" style={{ fontWeight: 800 }}>Delivery Information</h1>
          <br />
          <p className="text-muted text-lg max-w-2xl mx-auto" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
            We ensure your home products reach you safely. Review our delivery zones, terms, and local service area below.
          </p>
          <br />
        </div>

        {/* Delivery Rules Section */}
        <div className="grid grid-cols-1 md-grid-cols-3 gap-8 mb-12">
          <div className="card shadow-lg p-10 flex-col flex-center text-center transition-all hover:-translate-y-2 bg-white" style={{ borderTop: '5px solid #10B981', borderRadius: '1.5rem' }}>
            <br />
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.5rem', borderRadius: '50%', color: '#10B981', marginBottom: '1.5rem' }}>
              <ShieldCheck size={40} />
            </div>
            <h3 className="heading-sm mb-4" style={{ fontSize: '1.25rem' }}>Free Delivery</h3>
            <p className="text-muted" style={{ lineHeight: '1.6' }}>
              Enjoy <b><u>Zero delivery charges</u></b> for all locations within <b><u>5km</u></b> of our Gundaram store.
            </p>
            <br />
          </div>

          <div className="card shadow-lg p-10 flex-col flex-center text-center transition-all hover:-translate-y-2 bg-white" style={{ borderTop: '5px solid var(--color-primary)', borderRadius: '1.5rem' }}>
            <br />
            <div style={{ background: 'rgba(30, 58, 138, 0.1)', padding: '1.5rem', borderRadius: '50%', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
              <Clock size={40} />
            </div>
            <h3 className="heading-sm mb-4" style={{ fontSize: '1.25rem' }}>Standard Rates</h3>
            <p className="text-muted" style={{ lineHeight: '1.6' }}>
              For distances <b><u>above 5km</u></b>, nominal <b><u>delivery charges apply</u></b> based on transport distance.
            </p>
            <br />
          </div>

          <div className="card shadow-lg p-10 flex-col flex-center text-center transition-all hover:-translate-y-2 bg-white" style={{ borderTop: '5px solid #EF4444', borderRadius: '1.5rem' }}>
            <br />
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '50%', color: '#EF4444', marginBottom: '1.5rem' }}>
              <AlertTriangle size={40} />
            </div>
            <h3 className="heading-sm mb-4" style={{ fontSize: '1.25rem' }}>Service Limit</h3>
            <p className="text-muted" style={{ lineHeight: '1.6' }}>
              To maintain service quality, we currently <b><u>deliver up to 15km</u></b> from our central hub.
            </p>
            <br />
          </div>
        </div>

        {/* Footer Info */}
        <br />
        <div className="text-center pt-8 border-t border-gray-100">
          <div className="flex-center gap-2 text-primary font-bold text-lg">
            <MapPin size={24} /> Store: Peddapalli, Gundaram
          </div>
          <br />
          <p className="text-muted mt-2">Serving our local community with pride for over 20 years.</p>
        </div>
      </div>

      <style>{`
        .text-primary { color: var(--color-primary); }
        .flex-center { display: flex; align-items: center; justify-content: center; }
        .gap-3 { gap: 0.75rem; }
        .heading-xl { font-size: clamp(2.5rem, 5vw, 3.5rem); }
        @media (max-width: 768px) {
          .section { padding: 3rem 1rem; }
          .heading-xl { font-size: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default DeliveryInstructions;
