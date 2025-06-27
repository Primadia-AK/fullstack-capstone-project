import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config';


function SearchPage() {
  // State untuk input pengguna
  const [query, setQuery] = useState('');
  const [ageRange, setAgeRange] = useState(5); // default umur 5 tahun
  const [categoryOptions] = useState(['Mainan', 'Buku', 'Elektronik', 'Pakaian']);
  const [conditionOptions] = useState(['Baru', 'Bekas']);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Fungsi pemicu pencarian
  const handleSearch = async () => {
    setIsLoading(true);
    try {
        const response = await fetch(`${config.backendUrl}/api/gifts/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          age: ageRange,
          category: selectedCategory,
          condition: selectedCondition,
        }),
      });

      const data = await response.json();
      setSearchResults(data.results || []);
      setNoResults(data.results?.length === 0);
    } catch (err) {
      console.error('Gagal mengambil data pencarian:', err);
      setSearchResults([]);
      setNoResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigasi ke halaman detail hadiah
  const handleGiftClick = (giftId) => {
    navigate(`/gift/${giftId}`);
  };

  return (
    <div className="search-page">
      <h2>Cari Hadiah</h2>

      {/* Input Teks */}
      <input
        type="text"
        placeholder="Cari berdasarkan nama atau deskripsi"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Dropdown Kategori */}
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">-- Pilih Kategori --</option>
        {categoryOptions.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>

      {/* Dropdown Kondisi */}
      <select value={selectedCondition} onChange={(e) => setSelectedCondition(e.target.value)}>
        <option value="">-- Pilih Kondisi --</option>
        {conditionOptions.map((condition) => (
          <option key={condition} value={condition}>{condition}</option>
        ))}
      </select>

      {/* Slider Rentang Usia */}
      <div>
        <label>Umur: {ageRange} tahun</label>
        <input
          type="range"
          min="1"
          max="18"
          value={ageRange}
          onChange={(e) => setAgeRange(e.target.value)}
        />
      </div>

      {/* Tombol Pencarian */}
      <button onClick={handleSearch}>Cari</button>

      {/* Hasil Pencarian */}
      <div className="search-results">
        {isLoading && <p>Memuat hasil...</p>}
        {!isLoading && noResults && <p>Tidak ditemukan hadiah sesuai pencarian.</p>}
        {!isLoading && searchResults.map((gift) => (
          <div
            key={gift._id}
            className="gift-item"
            onClick={() => handleGiftClick(gift._id)}
            style={{ cursor: 'pointer', margin: '10px 0', border: '1px solid #ccc', padding: '10px' }}
          >
            <h4>{gift.name}</h4>
            <p>Kategori: {gift.category} | Umur: {gift.age} tahun | Kondisi: {gift.condition}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;
