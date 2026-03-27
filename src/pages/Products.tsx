import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProducts, getCategories } from '../services/db';
import type { Product, Category } from '../services/db';

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const location = useLocation();

  useEffect(() => {
    // Check if category is in URL
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }

    // Fetch categories
    getCategories()
      .then(data => setCategories([{ id: '0', name: 'All' }, ...data]))
      .catch(err => console.error('Error fetching categories:', err));
  }, [location]);

  useEffect(() => {
    setLoading(true);
    getProducts(activeCategory)
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, [activeCategory]);

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  // Task: Show all categories in one horizontal scrolling line
  const displayedCategories = categories;

  return (
    <div className="section container" style={{ padding: '3rem 1.5rem', minHeight: '80vh' }}>
      <div className="text-center mb-10" style={{ marginBottom: '3rem' }}>
        <h1 className="heading-lg" style={{ marginBottom: '1rem' }}>Our Products</h1>
        <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Browse our extensive collection of high-quality home appliances and durable furniture.
        </p>
      </div>

      {/* Search Bar (Centered & Styled) */}
      <div className="search-wrapper-premium mb-16 px-4">
        <div className="search-input-container">
          <Search className="text-muted" size={24} />
          <input
            type="text"
            placeholder="Search premium products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="search-glow"></div>
      </div>

      {/* Category Filter (Horizontal Scroll) */}
      <div className="mb-12">
        <div className="text-center mb-6">
          <p className="text-muted font-black uppercase tracking-wider" style={{ fontSize: '0.7rem' }}>
            <Filter size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} /> Browse Categories
          </p>
        </div>
        
        <div className="category-scroll-container hide-scrollbar">
          {displayedCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`category-pill ${activeCategory === cat.name ? 'active' : ''}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-20 animate-pulse">
          <div className="heading-md text-slate-300">Searching for perfect items...</div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center p-12 flex flex-col items-center bg-white rounded-3xl border border-dashed border-slate-200" style={{ padding: '6rem 2rem' }}>
          <div className="bg-slate-50 p-6 rounded-full mb-6">
            <Search size={48} className="text-slate-200" />
          </div>
          <h3 className="heading-md text-slate-800 mb-2">No Products Found</h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            We couldn't find anything matching "{searchQuery}" in {activeCategory === 'All' ? 'our catalog' : `the ${activeCategory} category`}.
          </p>
          <button 
            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} 
            className="btn btn-primary"
          >
            Clear Search & Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default Products;
