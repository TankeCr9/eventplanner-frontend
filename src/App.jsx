import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// ══════════════════════════════════════════════════════════════════════════════
//  EVENT PLANNER — REACT FRONTEND (Professional Build)
//  Este archivo es el frontend completo lista para npm build
// ══════════════════════════════════════════════════════════════════════════════

// API Configuration (cambiar según ambiente)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ══════════════════════════════════════════════════════════════════════════════
//  CUSTOM HOOKS
// ══════════════════════════════════════════════════════════════════════════════

function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Unauthorized');
      const data = await res.json();
      setUser(data);
    } catch (err) {
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (userData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return { token, user, loading, login, register, logout };
}

// ══════════════════════════════════════════════════════════════════════════════
//  COLOR PALETTE
// ══════════════════════════════════════════════════════════════════════════════

const C = {
  bg: "#fdf8f0",
  surface: "#fffdf8",
  card: "#ffffff",
  border: "#e8dcc8",
  border2: "#d4c4a0",
  accent: "#c9a84c",
  accentBg: "#f5ead0",
  accentDark: "#a07830",
  gold: "#e8c96a",
  greenBg: "#eef6f0",
  text: "#3d2e1a",
  textMid: "#7a6248",
  muted: "#b0998a",
  shadow: "rgba(180,140,80,0.12)",
};

// ══════════════════════════════════════════════════════════════════════════════
//  COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

function LandingPage({ onLoginClick, onRegisterClick }) {
  return (
    <div style={{ minHeight: '100vh', background: C.bg }}>
      {/* Header */}
      <header style={{
        background: C.card,
        borderBottom: `1.5px solid ${C.border}`,
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: C.accent }}>
          ✦ EventPlanner
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onLoginClick} style={{
            background: 'transparent',
            border: `1.5px solid ${C.border}`,
            color: C.textMid,
            padding: '10px 20px',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 14,
          }}>
            Ingresar
          </button>
          <button onClick={onRegisterClick} style={{
            background: C.accent,
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 14,
          }}>
            Registrarse
          </button>
        </div>
      </header>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '80px 40px' }}>
        <h1 style={{ fontSize: 56, fontWeight: 700, marginBottom: 20, color: C.text }}>
          ✦ EventPlanner
        </h1>
        <p style={{
          fontSize: 18,
          color: C.textMid,
          maxWidth: 600,
          margin: '0 auto 40px',
          lineHeight: 1.6,
        }}>
          Gestiona tu evento de forma fácil. Invitados, mesas, tareas, proveedores.
          Todo en un lugar.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={onLoginClick} style={{
            background: C.accent,
            color: 'white',
            border: 'none',
            padding: '16px 40px',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
          }}>
            Ingresar
          </button>
          <button onClick={onRegisterClick} style={{
            background: 'transparent',
            border: `1.5px solid ${C.accent}`,
            color: C.accent,
            padding: '16px 40px',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
          }}>
            Crear cuenta
          </button>
        </div>
      </div>

      {/* Features */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '60px 40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 24,
      }}>
        {[
          { emoji: '👥', title: 'Gestiona invitados', desc: 'Agrega, edita y organiza tu lista de invitados' },
          { emoji: '🗺️', title: 'Plano de mesas', desc: 'Arrastra mesas y asigna invitados interactivamente' },
          { emoji: '✅', title: 'Lista de tareas', desc: 'No olvides nada importante para tu evento' },
          { emoji: '🌸', title: 'Proveedores', desc: 'Conecta con flores, catering, fotografía y más' },
          { emoji: '📊', title: 'Dashboard', desc: 'Controla todo desde un único lugar' },
          { emoji: '📱', title: 'Responsive', desc: 'Funciona perfectamente en móvil y desktop' },
        ].map((feature, i) => (
          <div key={i} style={{
            background: C.card,
            border: `1.5px solid ${C.border}`,
            borderRadius: 16,
            padding: 32,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{feature.emoji}</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: C.accentDark }}>
              {feature.title}
            </h3>
            <p style={{ color: C.muted, fontSize: 14 }}>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoginPage({ onSwitch, onSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('vale@mail.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      onSuccess(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${C.accentBg} 0%, ${C.bg} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: C.card,
        borderRadius: 16,
        padding: 40,
        border: `1.5px solid ${C.border}`,
        boxShadow: `0 20px 40px ${C.shadow}`,
        maxWidth: 400,
        width: '100%',
      }}>
        <h1 style={{ fontSize: 28, marginBottom: 8, color: C.accentDark, textAlign: 'center' }}>
          Bienvenido
        </h1>
        <p style={{ textAlign: 'center', color: C.muted, marginBottom: 32, fontSize: 14 }}>
          Ingresa con tu cuenta
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: C.muted, fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: `1.5px solid ${C.border}`,
                borderRadius: 10,
                fontSize: 16,
                outline: 'none',
                background: C.bg,
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: C.muted, fontWeight: 600, display: 'block', marginBottom: 6 }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: `1.5px solid ${C.border}`,
                borderRadius: 10,
                fontSize: 16,
                outline: 'none',
                background: C.bg,
              }}
            />
          </div>

          {error && (
            <p style={{ color: '#c4707a', fontSize: 13, marginBottom: 16 }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: C.accent,
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: 10,
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: 16,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: C.muted }}>
          ¿No tienes cuenta?{' '}
          <span
            onClick={onSwitch}
            style={{ color: C.accent, cursor: 'pointer', fontWeight: 600 }}
          >
            Registrate aquí
          </span>
        </p>
      </div>
    </div>
  );
}

function RegisterPage({ onSwitch, onSuccess }) {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await register({ name, email, password, role });
      onSuccess(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${C.accentBg} 0%, ${C.bg} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: C.card,
        borderRadius: 16,
        padding: 40,
        border: `1.5px solid ${C.border}`,
        boxShadow: `0 20px 40px ${C.shadow}`,
        maxWidth: 400,
        width: '100%',
      }}>
        <h1 style={{ fontSize: 28, marginBottom: 32, color: C.accentDark, textAlign: 'center' }}>
          {step === 1 ? 'Elige tu rol' : 'Crear cuenta'}
        </h1>

        {step === 1 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={() => { setRole('client'); setStep(2); }}
              style={{
                padding: 20,
                border: '1.5px solid ' + C.border,
                borderRadius: 12,
                background: C.bg,
                cursor: 'pointer',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              💍 Soy Cliente
            </button>
            <button
              onClick={() => { setRole('vendor'); setStep(2); }}
              style={{
                padding: 20,
                border: '1.5px solid ' + C.border,
                borderRadius: 12,
                background: C.bg,
                cursor: 'pointer',
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              🌸 Soy Proveedor
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: C.muted, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 10,
                  fontSize: 16,
                  outline: 'none',
                  background: C.bg,
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: C.muted, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 10,
                  fontSize: 16,
                  outline: 'none',
                  background: C.bg,
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: C.muted, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: `1.5px solid ${C.border}`,
                  borderRadius: 10,
                  fontSize: 16,
                  outline: 'none',
                  background: C.bg,
                }}
              />
            </div>

            {error && (
              <p style={{ color: '#c4707a', fontSize: 13, marginBottom: 16 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: C.accent,
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: 10,
                fontWeight: 700,
                cursor: 'pointer',
                marginBottom: 12,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Creando...' : 'Crear cuenta'}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              style={{
                width: '100%',
                background: 'transparent',
                border: `1.5px solid ${C.border}`,
                color: C.textMid,
                padding: '12px',
                borderRadius: 10,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Volver
            </button>
          </form>
        )}

        {step === 1 && (
          <p style={{ textAlign: 'center', fontSize: 13, color: C.muted, marginTop: 20 }}>
            ¿Ya tienes cuenta?{' '}
            <span
              onClick={onSwitch}
              style={{ color: C.accent, cursor: 'pointer', fontWeight: 600 }}
            >
              Ingresa aquí
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  return (
    <div style={{ minHeight: '100vh', background: C.bg }}>
      {/* Header */}
      <header style={{
        background: C.card,
        borderBottom: `1.5px solid ${C.border}`,
        padding: '16px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.accent }}>
          ✦ EventPlanner
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div>
            <div style={{ fontWeight: 600, color: C.text }}>{user?.name}</div>
            <div style={{ fontSize: 12, color: C.muted }}>{user?.role}</div>
          </div>
          <button
            onClick={onLogout}
            style={{
              background: 'transparent',
              border: `1.5px solid ${C.border}`,
              color: C.textMid,
              padding: '8px 16px',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Salir
          </button>
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 40 }}>
        <h2 style={{ fontSize: 32, marginBottom: 20, color: C.accentDark }}>
          Bienvenido, {user?.name}!
        </h2>

        <div style={{
          background: C.card,
          border: `1.5px solid ${C.border}`,
          borderRadius: 16,
          padding: 32,
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 18, color: C.text, marginBottom: 16 }}>
            ✅ ¡App funcionando correctamente!
          </p>
          <p style={{ fontSize: 14, color: C.muted }}>
            Este es el frontend base. Puedes agregar más features:
          </p>
          <ul style={{ fontSize: 14, color: C.muted, marginTop: 16, listStyle: 'none' }}>
            <li>✓ Dashboard con estadísticas</li>
            <li>✓ Gestión de invitados (CRUD)</li>
            <li>✓ Plano interactivo de mesas</li>
            <li>✓ Lista de tareas</li>
            <li>✓ Directorio de proveedores</li>
            <li>✓ Panel de administración</li>
          </ul>
          <p style={{ fontSize: 12, color: C.muted, marginTop: 20 }}>
            API URL: {API_URL}
          </p>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN APP
// ══════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [page, setPage] = useState('landing');
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: C.bg,
      }}>
        <p style={{ color: C.textMid }}>Cargando...</p>
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} onLogout={() => { logout(); setPage('landing'); }} />;
  }

  return (
    <>
      {page === 'landing' && (
        <LandingPage
          onLoginClick={() => setPage('login')}
          onRegisterClick={() => setPage('register')}
        />
      )}
      {page === 'login' && (
        <LoginPage
          onSwitch={() => setPage('register')}
          onSuccess={() => setPage('dashboard')}
        />
      )}
      {page === 'register' && (
        <RegisterPage
          onSwitch={() => setPage('login')}
          onSuccess={() => setPage('dashboard')}
        />
      )}
    </>
  );
}

// Render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
