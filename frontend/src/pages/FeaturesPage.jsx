import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiAward, FiCheckCircle, FiShield, FiSmartphone, FiUsers } from 'react-icons/fi';

const FeaturesPage = () => {
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
                        <span style={styles.logoText}>E-Konek Features</span>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header style={styles.hero}>
                <h1 style={styles.headline}>
                    The <span style={styles.gradientText}>Hybrid Solution</span>
                </h1>
                <p style={styles.subheadline}>
                    Bridging the gap between public service and private convenience.
                    One app for all your waste management needs.
                </p>
            </header>

            {/* Hybrid Split Section */}
            <section style={styles.splitSection}>
                <div style={styles.splitGrid}>
                    {/* Left Side: Residents (Convenience) */}
                    <div style={styles.splitCard}>
                        <div style={styles.cardHeaderGreen}>
                            <div style={styles.iconCircleGreen}>
                                <FiMapPin size={32} color="#059669" />
                            </div>
                            <h2 style={styles.cardTitle}>For Residents</h2>
                            <span style={styles.badgeGreen}>Convenience & Compliance</span>
                        </div>
                        <div style={styles.cardContent}>
                            <div style={styles.featureItem}>
                                <h3 style={styles.featureName}>Visual Schedule</h3>
                                <p style={styles.featureText}>Smart Calendar highlights Recyclable vs. Residual days so you never bring out the wrong bag.</p>
                            </div>
                            <div style={styles.featureItem}>
                                <h3 style={styles.featureName}>Verified Eco-History</h3>
                                <p style={styles.featureText}>Build a proof of good citizenship. Use your history for barangay clearances or tax incentives.</p>
                            </div>
                            <div style={styles.featureItem}>
                                <h3 style={styles.featureName}>Hassle-Free Renovation</h3>
                                <p style={styles.featureText}>Renovating? Don't let debris pile up. One tap gets a truck there in 2 hours.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Freelancers (Livelihood) */}
                    <div style={styles.splitCard}>
                        <div style={styles.cardHeaderBlue}>
                            <div style={styles.iconCircleBlue}>
                                <FiSmartphone size={32} color="#2563eb" />
                            </div>
                            <h2 style={styles.cardTitle}>For Freelancers</h2>
                            <span style={styles.badgeBlue}>Double Income Opportunity</span>
                        </div>
                        <div style={styles.cardContent}>
                            <div style={styles.featureItem}>
                                <h3 style={styles.featureName}>Heatmap Demand</h3>
                                <p style={styles.featureText}>See exactly which barangays have the most pickup requests right now. Don't drive empty.</p>
                            </div>
                            <div style={styles.featureItem}>
                                <h3 style={styles.featureName}>Price Watch</h3>
                                <p style={styles.featureText}>Live updates on junk shop buying prices. Know exactly where to sell for highest profit.</p>
                            </div>
                            <div style={styles.featureItem}>
                                <h3 style={styles.featureName}>Digital ID Badge</h3>
                                <p style={styles.featureText}>Gain trust instantly. Your profile acts as a verified ID for safe entry into subdivisions.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Timeline */}
            <section style={styles.timelineSection}>
                <h2 style={styles.sectionTitle}>How It Works</h2>
                <div style={styles.timelineContainer}>
                    {[

                        { icon: <FiCheckCircle />, title: 'Select', desc: 'Standard Route or Special Pickup' },
                        { icon: <FiMapPin />, title: 'Track', desc: 'Watch collector arrive' },
                        { icon: <FiAward />, title: 'Earn', desc: 'Get Eco-Points or Cash' }
                    ].map((step, index) => (
                        <div key={index} style={styles.timelineStep}>
                            <div style={styles.stepCircle}>
                                {step.icon}
                            </div>
                            <h3 style={styles.stepTitle}>{step.title}</h3>
                            <p style={styles.stepDesc}>{step.desc}</p>
                            {index < 3 && <div style={styles.stepConnector}></div>}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section style={styles.ctaSection}>
                <h2 style={styles.ctaTitle}>Ready to simplify your waste disposal?</h2>
                <button style={styles.ctaButton} onClick={() => navigate('/login')}>Get Started Today</button>
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
        margin: '0 auto',
    },
    splitSection: {
        padding: '0 clamp(16px, 5vw, 48px) 80px',
        maxWidth: '1280px',
        margin: '0 auto',
    },
    splitGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '32px',
    },
    splitCard: {
        backgroundColor: '#fff',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
    },
    cardHeaderGreen: {
        backgroundColor: '#ecfdf5',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        borderBottom: '1px solid #d1fae5',
    },
    cardHeaderBlue: {
        backgroundColor: '#eff6ff',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        borderBottom: '1px solid #dbeafe',
    },
    iconCircleGreen: {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.1)',
    },
    iconCircleBlue: {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.1)',
    },
    cardTitle: {
        fontSize: '1.75rem',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '8px',
    },
    badgeGreen: {
        backgroundColor: '#10b981',
        color: '#fff',
        padding: '4px 12px',
        borderRadius: '99px',
        fontSize: '0.875rem',
        fontWeight: '600',
    },
    badgeBlue: {
        backgroundColor: '#3b82f6',
        color: '#fff',
        padding: '4px 12px',
        borderRadius: '99px',
        fontSize: '0.875rem',
        fontWeight: '600',
    },
    cardContent: {
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        flex: 1,
    },
    featureItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    featureName: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#0f172a',
    },
    featureText: {
        color: '#64748b',
        lineHeight: '1.5',
    },
    timelineSection: {
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
    timelineContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: '1000px',
        margin: '0 auto',
        position: 'relative',
        flexWrap: 'wrap',
        gap: '40px',
    },
    timelineStep: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        flex: 1,
        minWidth: '150px',
        position: 'relative',
    },
    stepCircle: {
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        color: '#334155',
        marginBottom: '16px',
        zIndex: 2,
        border: '4px solid #fff',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    stepTitle: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '8px',
    },
    stepDesc: {
        color: '#64748b',
        fontSize: '0.95rem',
    },
    stepConnector: {
        position: 'absolute',
        top: '32px',
        left: '50%',
        width: '100%',
        height: '2px',
        backgroundColor: '#e2e8f0',
        zIndex: 1,
        display: 'none', // Hidden on mobile by default, could enable with media query logic if needed but simple flex wrap is safer
    },
    ctaSection: {
        textAlign: 'center',
        padding: '80px 24px',
        backgroundColor: '#f8fafc',
    },
    ctaTitle: {
        fontSize: '2rem',
        fontWeight: '800',
        marginBottom: '32px',
        color: '#0f172a',
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

export default FeaturesPage;
