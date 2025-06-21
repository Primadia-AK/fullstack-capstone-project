import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
  // State untuk input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Context dan Navigasi
  const navigate = useNavigate();
  const { bearerToken, setIsLoggedIn } = useAppContext();

  // Jika sudah login, langsung arahkan ke halaman utama
  useEffect(() => {
    if (bearerToken) {
      navigate('/app');
    }
  }, [bearerToken, navigate]);

  // Fungsi login
  const handleLogin = async () => {
    try {
      const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Login gagal. Periksa email atau password Anda.');
      }

      const data = await response.json();
      const token = data?.token;

      if (token) {
        localStorage.setItem('bearerToken', token);
        setIsLoggedIn(true);
        navigate('/app');
      } else {
        throw new Error('Token tidak ditemukan di respons server.');
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setErrorMessage(error.message || 'Terjadi kesalahan saat login.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="login-card p-4 border rounded">
            <h2 className="text-center mb-4 font-weight-bold">Masuk</h2>

            {/* Email Input */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="text"
                className="form-control"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Masukkan password Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="alert alert-danger text-center" role="alert">
                {errorMessage}
              </div>
            )}

            {/* Login Button */}
            <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>
              Masuk
            </button>

            {/* Link ke halaman register */}
            <p className="mt-4 text-center">
              Baru di sini? <a href="/app/register" className="text-primary">Daftar Di Sini</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
