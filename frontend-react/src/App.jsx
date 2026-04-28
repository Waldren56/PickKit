import { useState, useEffect } from 'react';
import { api } from './services/api';
import './index.css';

function App() {
  const [lists, setLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null);
  const [activeListDetails, setActiveListDetails] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentQty, setCurrentQty] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('Connecting...');

  // Load Initial Data
  useEffect(() => {
    loadInitialData();
  }, []);

  // When activeListId changes, load details
  useEffect(() => {
    if (activeListId) {
      loadListDetails(activeListId);
    }
  }, [activeListId]);

  const loadInitialData = async () => {
    try {
      const allProducts = await api.getProducts();
      setProducts(allProducts || []);
      const allLists = await api.getLists();
      setLists(allLists || []);
      if (allLists?.length > 0) {
        setActiveListId(allLists[0].id);
      }
      setStatus('Connected ✓');
    } catch (err) {
      handleError(err);
      setStatus('Offline');
    }
  };

  const loadListDetails = async (id) => {
    try {
      const details = await api.getListDetails(id);
      setActiveListDetails(details);
    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (err) => {
    setError(err.message);
    setTimeout(() => setError(null), 5000);
  };

  // List Management
  const handleNewList = async () => {
    const name = window.prompt("Enter new list name:");
    if (!name?.trim()) return;
    try {
      const newList = await api.createList(name.trim());
      setLists([...lists, newList]);
      setActiveListId(newList.id);
    } catch (err) {
      handleError(err);
    }
  };

  const handleDeleteList = async () => {
    if (!activeListId) return;
    if (!window.confirm("Are you sure you want to delete this list?")) return;
    try {
      await api.deleteList(activeListId);
      const newLists = lists.filter(l => l.id !== activeListId);
      setLists(newLists);
      setActiveListId(newLists.length > 0 ? newLists[0].id : null);
      setActiveListDetails(null);
    } catch (err) {
      handleError(err);
    }
  };

  // Search Logic
  const getSuggestions = () => {
    if (!searchQuery.trim()) return [];
    const lowerQ = searchQuery.toLowerCase();
    const exactMatch = products.some(p => p.name.toLowerCase() === lowerQ);
    const matches = products.filter(p => p.name.toLowerCase().includes(lowerQ)).slice(0, 5);

    // Add "custom creation" option if exact match doesn't exist
    if (!exactMatch) {
      matches.push({
        id: 'new',
        name: searchQuery.trim(),
        category: { defaultUnit: 'Pezzi', availableUnits: ['Pezzi', 'Kg', 'g', 'Litri', 'Confezioni'], name: 'Altro' }
      });
    }
    return matches;
  };

  const handleSelectProduct = (p) => {
    setSelectedProduct(p);
    setCurrentQty(1);
    setSelectedUnit(p.category?.defaultUnit || (p.category?.availableUnits?.[0] || 'Pezzi'));
    setSearchQuery('');
  };

  // Item Logic
  const handleAddItem = async () => {
    if (!selectedProduct || !activeListId) return;
    try {
      await api.addItemToList(activeListId, {
        productName: selectedProduct.name,
        quantity: currentQty,
        unit: selectedUnit,
        categoryName: selectedProduct.category?.name || 'Altro'
      });
      setSelectedProduct(null);
      loadListDetails(activeListId); // refresh
    } catch (err) {
      handleError(err);
    }
  };

  const handleToggleItem = async (itemId) => {
    try {
      await api.toggleItemStatus(activeListId, itemId);
      loadListDetails(activeListId); // refresh
    } catch (err) {
      handleError(err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await api.deleteItem(activeListId, itemId);
      loadListDetails(activeListId); // refresh
    } catch (err) {
      handleError(err);
    }
  };

  const items = activeListDetails?.items || [];
  const sortedItems = [...items].sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));
  const doneCount = items.filter(i => i.done).length;
  const progressPercent = items.length === 0 ? 0 : Math.round((doneCount / items.length) * 100);

  return (
    <div className="app-container">
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginRight: '1rem' }}>🛒</div>
        <div style={{ flex: 1 }}>
          <h1 className="text-gradient" style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>Pickit</h1>
          <div style={{ color: 'var(--text-hint)', fontSize: '0.875rem' }}>Smart Shopping List</div>
        </div>
        <div style={{
          fontSize: '0.75rem',
          padding: '4px 10px',
          borderRadius: '20px',
          backgroundColor: status.includes('✓') ? 'rgba(20, 184, 166, 0.15)' : 'rgba(244, 63, 94, 0.15)',
          color: status.includes('✓') ? 'var(--accent-teal)' : 'var(--error-color)',
          border: `1px solid ${status.includes('✓') ? 'rgba(20, 184, 166, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
        }}>
          {status}
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="animate-slide-down" style={{
          background: 'var(--error-bg)', border: '1px solid var(--error-border)',
          padding: '12px 16px', borderRadius: 'var(--radius-md)',
          color: 'var(--error-color)', marginBottom: '1.25rem', fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      {/* lists selection */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
        {lists.map(l => (
          <button
            key={l.id}
            onClick={() => setActiveListId(l.id)}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-xl)',
              fontSize: '0.875rem',
              fontWeight: activeListId === l.id ? 600 : 400,
              cursor: 'pointer',
              border: activeListId === l.id ? '1px solid var(--primary-color)' : '1px solid var(--surface-border)',
              background: activeListId === l.id ? 'var(--primary-glow)' : 'transparent',
              color: activeListId === l.id ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s'
            }}
          >
            {l.name}
          </button>
        ))}
        <button
          onClick={handleNewList}
          style={{
            padding: '6px 16px', borderRadius: 'var(--radius-xl)', fontSize: '0.875rem', cursor: 'pointer',
            border: '1px dashed var(--text-hint)', background: 'transparent', color: 'var(--text-hint)'
          }}
        >
          + New List
        </button>
      </div>

      {/* Search and Add Card */}
      <div className="card">
        <input
          type="text"
          placeholder="Search or add product..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--surface-border)', background: 'var(--bg-color)',
            color: 'var(--text-primary)', outline: 'none', fontSize: '1rem',
            transition: 'border-color 0.2s, box-shadow 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--surface-border)'}
        />

        {/* Suggestions */}
        {searchQuery && !selectedProduct && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }} className="animate-slide-down">
            {getSuggestions().map((p, i) => (
              <button
                key={i}
                onClick={() => handleSelectProduct(p)}
                style={{
                  padding: '6px 14px', borderRadius: 'var(--radius-xl)', background: 'var(--surface-border)',
                  border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem'
                }}
                onMouseOver={(e) => { e.target.style.background = 'var(--primary-color)'; e.target.style.color = '#fff' }}
                onMouseOut={(e) => { e.target.style.background = 'var(--surface-border)'; e.target.style.color = 'var(--text-secondary)' }}
              >
                {p.id === 'new' ? `+ Add "${p.name}"` : p.name}
              </button>
            ))}
          </div>
        )}

        {/* Selected Product Config */}
        {selectedProduct && (
          <div className="animate-slide-down" style={{
            display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
            marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--surface-border)'
          }}>
            <div style={{ flex: 1, fontWeight: 500, minWidth: '100px' }}>
              {selectedProduct.name}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-color)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
              <button
                onClick={() => setCurrentQty(Math.max(1, currentQty - 1))}
                style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.2rem' }}
              >−</button>
              <span style={{ width: '32px', textAlign: 'center', fontWeight: 600 }}>{currentQty}</span>
              <button
                onClick={() => setCurrentQty(currentQty + 1)}
                style={{ width: '32px', height: '32px', border: 'none', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.2rem' }}
              >+</button>
            </div>

            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              style={{
                padding: '8px 12px', background: 'var(--bg-color)', color: 'var(--text-primary)',
                border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer'
              }}
            >
              {(selectedProduct.category?.availableUnits || ['Pezzi']).map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>

            <button
              onClick={handleAddItem}
              style={{
                backgroundColor: 'var(--primary-color)', color: 'white', border: 'none',
                padding: '8px 20px', borderRadius: 'var(--radius-sm)', fontWeight: 600,
                cursor: 'pointer', transition: 'background-color 0.2s', marginLeft: 'auto'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = 'var(--primary-hover)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'var(--primary-color)'}
            >
              Add
            </button>

            <button
              onClick={() => { setSelectedProduct(null); setSearchQuery(''); }}
              style={{
                background: 'transparent', color: 'var(--text-hint)', border: 'none', cursor: 'pointer', padding: '8px'
              }}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Shopping List view */}
      {activeListId && (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>
                {activeListDetails?.name || 'Loading list...'}
              </h2>
              {activeListDetails && (
                <button onClick={handleDeleteList} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-hint)', fontSize: '0.8rem' }}>
                  [ Delete ]
                </button>
              )}
            </div>
            <span style={{
              background: 'var(--surface-border)', padding: '4px 10px',
              borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600
            }}>
              {items.length} items
            </span>
          </div>

          <div style={{ height: '4px', background: 'var(--bg-color)' }}>
            <div style={{
              height: '100%', width: `${progressPercent}%`,
              background: 'var(--accent-teal)', transition: 'width 0.4s ease-out',
              boxShadow: '0 0 10px var(--accent-teal-glow)'
            }} />
          </div>

          <div style={{ padding: '0.5rem 0' }}>
            {items.length === 0 ? (
              <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-hint)' }}>
                No items yet.<br />Search above to add something!
              </div>
            ) : (
              sortedItems.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex', alignItems: 'center', padding: '12px 1.5rem',
                    borderBottom: '1px solid var(--surface-border)', gap: '16px',
                    transition: 'background-color 0.2s',
                    opacity: item.done ? 0.6 : 1
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {/* Custom Checkbox */}
                  <div
                    onClick={() => handleToggleItem(item.id)}
                    style={{
                      width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer',
                      border: `2px solid ${item.done ? 'var(--accent-teal)' : 'var(--text-hint)'}`,
                      backgroundColor: item.done ? 'var(--accent-teal)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.2s'
                    }}
                  >
                    {item.done && (
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '1rem', fontWeight: item.done ? 400 : 500,
                      textDecoration: item.done ? 'line-through' : 'none',
                      color: item.done ? 'var(--text-hint)' : 'var(--text-primary)'
                    }}>
                      {item.productName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-hint)', marginTop: '2px' }}>
                      {item.quantity} {item.unit} {item.categoryName ? ` • ${item.categoryName}` : ''}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-hint)', cursor: 'pointer', fontSize: '1.2rem', padding: '4px' }}
                    onMouseOver={(e) => e.target.style.color = 'var(--error-color)'}
                    onMouseOut={(e) => e.target.style.color = 'var(--text-hint)'}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
