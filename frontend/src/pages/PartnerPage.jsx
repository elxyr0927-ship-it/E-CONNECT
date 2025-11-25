import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiTruck, FiClock, FiDollarSign } from 'react-icons/fi';

const PartnerPage = () => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = React.useState(() => (typeof window !== 'undefined' ? window.innerWidth <= 640 : false));

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={styles.container}>
            {/* Navigation */}
            <nav style={{ ...styles.nav, ...(isMobile ? styles.navMobile : {}) }}>
                <div style={{ ...styles.navContent, ...(isMobile ? styles.navContentMobile : {}) }}>
                    <button
                        style={{ ...styles.backBtn, ...(isMobile ? styles.backBtnMobile : {}) }}
                        onClick={() => navigate('/')}
                    >
                        <FiArrowLeft /> Back to Home
                    </button>
                    <div style={{ ...styles.titleContainer, ...(isMobile ? styles.titleContainerMobile : {}) }}>
                        <span style={styles.logoText}>Become a Partner</span>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header style={styles.hero}>
                <h1 style={styles.headline}>
                    Turn your Multicab into an <br />
                    <span style={styles.gradientText}>Income Generator.</span>
                </h1>
                <p style={styles.subheadline}>
                    Join the E-Konek fleet. Work when you want, be your own boss, and help keep Dumaguete clean.
                </p>
                <button style={styles.ctaButton} onClick={() => navigate('/signup')}>Register as Driver</button>
            </header>

            {/* Benefits Section */}
            <section style={styles.benefitsSection}>
                <div style={styles.benefitsGrid}>
                    <div style={styles.benefitCard}>
                        <div style={styles.iconBox}><FiClock size={32} color="#10b981" /></div>
                        <h3 style={styles.benefitTitle}>Flexible Hours</h3>
                        <p style={styles.benefitText}>You decide when to work. Turn on the app when you're ready to accept pickups.</p>
                    </div>
                    <div style={styles.benefitCard}>
                        <div style={styles.iconBox}><FiDollarSign size={32} color="#f59e0b" /></div>
                        <h3 style={styles.benefitTitle}>Earn Extra Cash</h3>
                        <p style={styles.benefitText}>Get paid for every pickup. Keep 70% of the booking fee plus tips.</p>
                    </div>
                    <div style={styles.benefitCard}>
                        <div style={styles.iconBox}><FiTruck size={32} color="#3b82f6" /></div>
                        <h3 style={styles.benefitTitle}>Community Hero</h3>
                        <p style={styles.benefitText}>Help your neighbors dispose of bulk waste responsibly and keep our city green.</p>
                    </div>
                </div>
            </section>

            {/* Requirements Section */}
            <section style={styles.requirementsSection}>
                <div style={styles.requirementsContainer}>
                    <h2 style={styles.sectionTitle}>What You Need to Start</h2>
                    <div style={styles.checklist}>
                        <div style={styles.checklistItem}>
                            <FiCheckCircle size={24} color="#10b981" />
                            <span>Professional Driver's License</span>
                        </div>
                        <div style={styles.checklistItem}>
                            <FiCheckCircle size={24} color="#10b981" />
                            <span>Vehicle OR/CR (Multicab or Truck)</span>
                        </div>
                        <div style={styles.checklistItem}>
                            <FiCheckCircle size={24} color="#10b981" />
                            <span>Barangay Clearance</span>
                        </div>
                        <div style={styles.checklistItem}>
                            <FiCheckCircle size={24} color="#10b981" />
                            <span>Android Smartphone</span>
                        </div>
                        <div style={styles.checklistItem}>
                            <FiCheckCircle size={24} color="#10b981" />
                            <span>Gcash Account (for payouts)</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={styles.ctaSection}>
                <h2 style={styles.ctaTitle}>Ready to hit the road?</h2>
                <p style={styles.ctaText}>Sign up today and start earning within 24 hours.</p>
                <button style={styles.ctaButton} onClick={() => navigate('/signup')}>Apply Now</button>
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px clamp(16px, 5vw, 48px) 0',
        maxWidth: '1280px',
        margin: '0 auto',
        gap: '12px',
        flexWrap: 'wrap',
        position: 'relative',
    },
    navContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        width: '100%',
    },
    navMobile: {
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center',
        gap: '12px',
        padding: '16px 20px 0',
    },
    navContentMobile: {
        flexDirection: 'column',
        alignItems: 'stretch',
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
        fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
        position: 'absolute',
        left: '0',
        zIndex: 10,
        transition: 'color 0.2s',
        ':hover': {
            color: '#0f172a',
        }
    },
    backBtnMobile: {
        position: 'relative',
        left: 'auto',
        width: '100%',
        justifyContent: 'flex-start',
        padding: '10px 16px',
        backgroundColor: '#fff',
        borderRadius: '999px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    logoText: {
        fontSize: 'clamp(1rem, 4vw, 1.25rem)',
        fontWeight: '700',
        color: '#0f172a',
    },
    titleContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainerMobile: {
        justifyContent: 'center',
        width: '100%',
    },
    hero: {
        textAlign: 'center',
        padding: 'clamp(48px, 10vh, 80px) clamp(16px, 6vw, 24px)',
        maxWidth: '800px',
        margin: '0 auto',
    },
    headline: {
        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
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
    benefitsSection: {
        padding: '0 clamp(16px, 5vw, 48px) 80px',
        maxWidth: '1280px',
        margin: '0 auto',
    },
    benefitsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '32px',
    },
    benefitCard: {
        backgroundColor: '#fff',
        borderRadius: '24px',
        padding: '32px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    iconBox: {
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
    },
    benefitTitle: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '12px',
    },
    benefitText: {
        color: '#64748b',
        lineHeight: '1.6',
        fontSize: '1.05rem',
    },
    requirementsSection: {
        padding: '80px clamp(16px, 5vw, 48px)',
        backgroundColor: '#fff',
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
    },
    sectionTitle: {
        fontSize: '2.5rem',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '60px',
        color: '#0f172a',
    },
    requirementsContainer: {
        maxWidth: '800px',
        margin: '0 auto',
    },
    checklist: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    checklistItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        fontSize: '1.25rem',
        color: '#334155',
        padding: '24px',
        backgroundColor: '#f8fafc',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
    },
    ctaSection: {
        textAlign: 'center',
        padding: '80px 24px',
        backgroundColor: '#f8fafc',
    },
    ctaTitle: {
        fontSize: '2rem',
        fontWeight: '800',
        marginBottom: '16px',
        color: '#0f172a',
    },
    ctaText: {
        fontSize: '1.25rem',
        color: '#64748b',
        marginBottom: '40px',
    },
    ctaButton: {
        backgroundColor: '#10b981',
        color: '#fff',
        border: 'none',
        padding: '16px 40px',
        borderRadius: '99px',
        fontSize: '1.1rem',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
        transition: 'transform 0.2s',
        ':hover': {
            transform: 'translateY(-2px)',
        }
    },
};

export default PartnerPage;
