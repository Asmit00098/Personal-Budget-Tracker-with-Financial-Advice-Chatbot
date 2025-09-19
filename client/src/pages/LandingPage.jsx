import { Link, useNavigate } from 'react-router-dom'
import DummyDashboard from '../components/DummyDashboard'
import './css/LandingPage.css'
export default function LandingPage(){
  const navigate = useNavigate()
  
  return (
    <div className="landing-container">
      {/* Navigation */}
      <header className="navbar">
        <div className="nav-container">
          <div className="logo">FlowLedger</div>
          <nav className="nav-menu">
            <Link to="/features">Features</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/about">About</Link>
          </nav>
          <div className="nav-actions">
            <Link className="btn btn-link" to="/auth">Login</Link>
            <Link className="btn btn-primary" to="/auth" onClick={() => navigate('/auth')}>Sign Up</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Master Your Money with Smart Tracking</h1>
          <p className="hero-subtitle">Clarity, control, and calm for your finances. FlowLedger helps you track expenses, manage budgets, and gain financial insights.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary btn-large" to="/auth" onClick={() => navigate('/auth')}>Get Started Free</Link>
            <Link className="btn btn-secondary btn-large" to="/demo">Watch Demo</Link>
          </div>
        </div>
        <div className="hero-visual dummy-dashboard-container">
          <DummyDashboard />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2>Why Choose FlowLedger</h2>
          <p>Everything you need to take control of your finances</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Intuitive Expense Tracking</h3>
            <p>Log spending across categories in seconds with our streamlined interface.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Smart Budget Management</h3>
            <p>Set monthly limits and track progress with intelligent alerts and suggestions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Insights</h3>
            <p>Get personalized guidance to optimize your spending habits and save more.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Visual Analytics</h3>
            <p>Beautiful charts and graphs reveal where your money goes and how to improve.</p>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="logo">FlowLedger</div>
            <p>Your personal financial companion for clarity and control.</p>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <Link to="/features">Features</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/testimonials">Testimonials</Link>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <Link to="/about">About</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/careers">Careers</Link>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <Link to="/help">Help Center</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2023 FlowLedger. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}