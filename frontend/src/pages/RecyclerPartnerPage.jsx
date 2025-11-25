import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiBell, FiList, FiCheckCircle } from 'react-icons/fi';

const RecyclerPartnerPage = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            {/* Navigation */}
            <nav style={styles.nav}>
                <div style={styles.navContent}>
                    <button style={styles.backBtn} onClick={() => navigate('/')}>
                        <FiArrowLeft /> Back to Home
                    </button>
                    <span style={styles.logoText}>E-Konek Partner</span>
                </div>
            </nav>

            {/* Hero Section */}
            <header style={styles.hero}>
                <h1 style={styles.headline}>
                    Get Recyclables Delivered to <span style={styles.gradientText}>Your Gate.</span>
                </h1>
                <p style={styles.subheadline}>
                    Stop waiting for scraps. E-Konek connects you with our fleet of collectors who need a place to sell their load.
                </p>
                <div style={styles.heroButtons}>
                    <button style={styles.primaryBtn} onClick={() => navigate('/contact')}>Become a Partner</button>
                    <button style={styles.secondaryBtn} onClick={() => navigate('/pricing')}>View Pricing</button>
                </div>
            </header>

            {/* Features Grid */}
            <section style={styles.featuresSection}>
                <div style={styles.featureGrid}>
                    <div style={styles.featureCard}>
                        <div style={styles.iconBox}>
                            <FiMapPin size={24} color="#10b981" />
                        </div>
                        <h3 style={styles.featureTitle}>Map Listing</h3>
                        <p style={styles.featureDesc}>
                            Put your junk shop on our Driver Map. Drivers will see your location and buying prices when they have recyclables.
                        </p>
                    </div>

                    <div style={styles.featureCard}>
                        <div style={styles.iconBox}>
                            <FiBell size={24} color="#3b82f6" />
                        </div>
                        <h3 style={styles.featureTitle}>Inventory Alerts</h3>
                        <p style={styles.featureDesc}>
                            See incoming loads in real-time. Get notified when a driver is bringing copper, plastic, or cardboard to your area.
                        </p>
                    </div>

                    <div style={styles.featureCard}>
                        <div style={styles.iconBox}>
                            <FiList size={24} color="#f59e0b" />
                        </div>
                        <h3 style={styles.featureTitle}>Digital Ledger</h3>
                        <p style={styles.featureDesc}>
                            Track your daily buys digitally. No more pen and paper. Export reports for your business records.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section style={styles.stepsSection}>
                <h2 style={styles.sectionTitle}>How It Works</h2>
                <div style={styles.stepsContainer}>
                    <div style={styles.step}>
                        <div style={styles.stepNumber}>1</div>
                        <h4 style={styles.stepTitle}>Sign Up</h4>
                        <p style={styles.stepDesc}>Register your business and set your buying prices.</p>
                    </div>
                    <div style={styles.stepLine}></div>
                    <div style={styles.step}>
                        <div style={styles.stepNumber}>2</div>
                        <h4 style={styles.stepTitle}>Get Verified</h4>
                        <p style={styles.stepDesc}>We verify your location and add you to the "Eco-Partner" network.</p>
                    </div>
                    <div style={styles.stepLine}></div>
                    <div style={styles.step}>
                        <div style={styles.stepNumber}>3</div>
                        <h4 style={styles.stepTitle}>Receive Supply</h4>
                        <p style={styles.stepDesc}>Drivers are routed to your shop when they have materials you buy.</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={styles.ctaSection}>
                <div style={styles.ctaCard}>
                    <h2 style={styles.ctaTitle}>Ready to grow your volume?</h2>
                    <p style={styles.ctaText}>Join the Circular Economy network today.</p>
                    <button style={styles.ctaButton} onClick={() => navigate('/contact')}>
                        Contact Sales Team
                    </button>
                </div>
            </section>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        color: '#0f172a',
        fontFamily: 'Inter, sans-serif',
    },
    nav: {
        padding: '20px 40px',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#fff',
    },
    navContent: {
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'none',
        border: 'none',
        color: '#64748b',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    logoText: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#0f172a',
    },
    hero: {
        textAlign: 'center',
        padding: '80px 24px',
        maxWidth: '900px',
        margin: '0 auto',
    },
    headline: {
        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
        fontWeight: '800',
        lineHeight: '1.1',
        marginBottom: '24px',
        color: '#0f172a',
        letterSpacing: '-0.02em',
    },
    gradientText: {
        background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subheadline: {
        fontSize: '1.25rem',
        color: '#64748b',
        lineHeight: '1.6',
        maxWidth: '600px',
        margin: '0 auto 40px',
    },
    heroButtons: {
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
    },
    primaryBtn: {
        backgroundColor: '#10b981',
        color: '#fff',
        border: 'none',
        padding: '16px 32px',
        borderRadius: '12px',
        fontSize: '1.1rem',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
        transition: 'transform 0.2s',
    },
    secondaryBtn: {
        backgroundColor: '#fff',
        color: '#0f172a',
        border: '1px solid #e2e8f0',
        padding: '16px 32px',
        borderRadius: '12px',
        fontSize: '1.1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    featuresSection: {
        padding: '0 24px 80px',
        maxWidth: '1280px',
        margin: '0 auto',
    },
    featureGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '32px',
    },
    featureCard: {
        backgroundColor: '#fff',
        padding: '32px',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        transition: 'transform 0.2s',
    },
    iconBox: {
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        backgroundColor: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
    },
    featureTitle: {
        fontSize: '1.5rem',
        fontWeight: '700',
        marginBottom: '12px',
        color: '#0f172a',
    },
    featureDesc: {
        color: '#64748b',
        lineHeight: '1.6',
        fontSize: '1.1rem',
    },
    stepsSection: {
        padding: '80px 24px',
        backgroundColor: '#fff',
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: '2.5rem',
        fontWeight: '800',
        marginBottom: '60px',
        color: '#0f172a',
    },
    stepsContainer: {
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        position: 'relative',
        flexWrap: 'wrap',
        gap: '40px',
    },
    step: {
        flex: 1,
        minWidth: '250px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 1,
    },
    stepNumber: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: '#10b981',
        color: '#fff',
        fontSize: '1.25rem',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
        boxShadow: '0 0 0 8px #d1fae5',
    },
    stepTitle: {
        fontSize: '1.25rem',
        fontWeight: '700',
        marginBottom: '12px',
        color: '#0f172a',
    },
    stepDesc: {
        color: '#64748b',
        lineHeight: '1.5',
    },
    stepLine: {
        flex: 1,
        height: '2px',
        backgroundColor: '#e2e8f0',
        marginTop: '24px',
        display: 'none', // Hidden on mobile, could show on desktop with media query
    },
    ctaSection: {
        padding: '80px 24px',
        maxWidth: '1000px',
        margin: '0 auto',
    },
    ctaCard: {
        backgroundColor: '#0f172a',
        borderRadius: '32px',
        padding: '60px 24px',
        textAlign: 'center',
        color: '#fff',
        backgroundImage: 'linear-gradient(to right, #0f172a, #1e293b)',
    },
    ctaTitle: {
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: '800',
        marginBottom: '16px',
    },
    ctaText: {
        fontSize: '1.25rem',
        color: '#94a3b8',
        marginBottom: '40px',
    },
    ctaButton: {
        backgroundColor: '#10b981',
        color: '#fff',
        border: 'none',
        padding: '16px 40px',
        borderRadius: '12px',
        fontSize: '1.1rem',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
        transition: 'transform 0.2s',
    },
};

export default RecyclerPartnerPage;
