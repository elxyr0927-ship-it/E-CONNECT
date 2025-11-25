import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiTruck, FiClock, FiShield } from 'react-icons/fi';

const PricingPage = () => {
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
                        <span style={styles.logoText}>E-Konekricing</span>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header style={styles.hero}>
                <h1 style={styles.headline}>
                    Transparency is <span style={styles.gradientText}>Key.</span>
                </h1>
                <p style={styles.subheadline}>
                    Clear pricing for everyone. Basic services are always free for residents.
                </p>
            </header>

            {/* Pricing Tiers */}
            <section style={styles.pricingSection}>
                <div style={styles.pricingGrid}>
                    {/* Tier 1: Citizen */}
                    <div style={styles.pricingCard}>
                        <div style={styles.cardHeader}>
                            <h3 style={styles.tierName}>Citizen</h3>
                            <div style={styles.priceContainer}>
                                <span style={styles.currency}>₱</span>
                                <span style={styles.price}>0</span>
                                <span style={styles.period}>/forever</span>
                            </div>
                            <p style={styles.tierDesc}>For General Residents</p>
                        </div>
                        <div style={styles.cardBody}>
                            <ul style={styles.featureList}>
                                <li style={styles.featureItem}><FiCheck color="#10b981" /> Live Truck Tracking</li>
                                <li style={styles.featureItem}><FiCheck color="#10b981" /> Schedule Notifications</li>
                                <li style={styles.featureItem}><FiCheck color="#10b981" /> Access to Barangay Leaderboard</li>
                                <li style={styles.featureItem}><FiCheck color="#10b981" /> Earn Eco-Points</li>
                            </ul>
                            <button style={styles.ctaButtonOutline} onClick={() => navigate('/signup')}>Sign Up Now</button>
                        </div>
                    </div>

                    {/* Tier 2: On-Demand */}
                    <div style={{ ...styles.pricingCard, ...styles.featuredCard }}>
                        <div style={styles.popularBadge}>Most Popular</div>
                        <div style={styles.cardHeader}>
                            <h3 style={{ ...styles.tierName, color: '#2563eb' }}>On-Demand</h3>
                            <div style={styles.priceContainer}>
                                <span style={styles.startsAt}>Starts at</span>
                                <span style={styles.currency}>₱</span>
                                <span style={{ ...styles.price, color: '#2563eb' }}>150</span>
                            </div>
                            <p style={styles.tierDesc}>Pay-Per-Pickup</p>
                        </div>
                        <div style={styles.cardBody}>
                            <ul style={styles.featureList}>
                                <li style={styles.featureItem}><FiCheck color="#2563eb" /> Instant Booking</li>
                                <li style={styles.featureItem}><FiCheck color="#2563eb" /> Tiered pricing for load size</li>
                                <li style={styles.featureItem}><FiCheck color="#2563eb" /> Construction Debris & Appliances</li>
                                <li style={styles.featureItem}><FiCheck color="#2563eb" /> 70% goes to local driver</li>
                            </ul>
                            <button style={styles.ctaButtonPrimary} onClick={() => navigate('/signup')}>Book Pickup</button>
                        </div>
                    </div>

                    {/* Tier 3: Junk Shop Partner (NEW) */}
                    <div style={styles.pricingCard}>
                        <div style={styles.cardHeader}>
                            <h3 style={styles.tierName}>Junk Shop Partner</h3>
                            <div style={styles.priceContainer}>
                                <span style={styles.currency}>₱</span>
                                <span style={styles.price}>1,500</span>
                                <span style={styles.period}>/month</span>
                            </div>
                            <p style={styles.tierDesc}>For Recycling Businesses</p>
                        </div>
                        <div style={styles.cardBody}>
                            <ul style={styles.featureList}>
                                <li style={styles.featureItem}><FiCheck color="#f59e0b" /> Priority Listing on Driver Map</li>
                                <li style={styles.featureItem}><FiCheck color="#f59e0b" /> Incoming Load Alerts</li>
                                <li style={styles.featureItem}><FiCheck color="#f59e0b" /> Digital Transaction History</li>
                                <li style={styles.featureItem}><FiCheck color="#f59e0b" /> Verified "Eco-Partner" Badge</li>
                            </ul>
                            <button style={styles.ctaButtonOutline} onClick={() => navigate('/partner')}>Become a Partner</button>
                        </div>
                    </div>

                    {/* Tier 4: LGU */}
                    <div style={styles.pricingCard}>
                        <div style={styles.cardHeader}>
                            <h3 style={styles.tierName}>LGU / Barangay</h3>
                            <div style={styles.priceContainer}>
                                <span style={{ ...styles.price, fontSize: '2rem' }}>Contact Sales</span>
                            </div>
                            <p style={styles.tierDesc}>B2G Subscription</p>
                        </div>
                        <div style={styles.cardBody}>
                            <ul style={styles.featureList}>
                                <li style={styles.featureItem}><FiCheck color="#64748b" /> Admin Dashboard</li>
                                <li style={styles.featureItem}><FiCheck color="#64748b" /> Heatmaps of uncollected trash</li>
                                <li style={styles.featureItem}><FiCheck color="#64748b" /> Driver Performance Analytics</li>
                                <li style={styles.featureItem}><FiCheck color="#64748b" /> Compliance Reports for DILG</li>
                            </ul>
                            <button style={styles.ctaButtonOutline} onClick={() => navigate('/contact')}>Contact Us</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badge */}
            <section style={styles.trustSection}>
                <div style={styles.trustBadge}>
                    <FiShield size={24} color="#10b981" />
                    <span>Official Partner of Dumaguete City Environment Office</span>
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
    pricingSection: {
        padding: '0 clamp(16px, 5vw, 48px) 80px',
        maxWidth: '1280px',
        margin: '0 auto',
    },
    pricingGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '32px',
        alignItems: 'start',
    },
    pricingCard: {
        backgroundColor: '#fff',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s',
        ':hover': {
            transform: 'translateY(-4px)',
        }
    },
    featuredCard: {
        border: '2px solid #3b82f6',
        boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.15)',
        transform: 'scale(1.02)',
        zIndex: 1,
    },
    popularBadge: {
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#3b82f6',
        color: '#fff',
        padding: '4px 16px',
        borderBottomLeftRadius: '12px',
        borderBottomRightRadius: '12px',
        fontSize: '0.875rem',
        fontWeight: '600',
    },
    cardHeader: {
        padding: '40px 32px 24px',
        textAlign: 'center',
        borderBottom: '1px solid #f1f5f9',
    },
    tierName: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '16px',
    },
    priceContainer: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'center',
        marginBottom: '8px',
        gap: '4px',
    },
    currency: {
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#64748b',
    },
    price: {
        fontSize: '3.5rem',
        fontWeight: '800',
        color: '#0f172a',
        lineHeight: '1',
    },
    startsAt: {
        fontSize: '0.875rem',
        color: '#64748b',
        fontWeight: '500',
    },
    period: {
        fontSize: '1rem',
        color: '#64748b',
        fontWeight: '500',
    },
    tierDesc: {
        color: '#64748b',
        fontSize: '1rem',
    },
    cardBody: {
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
    },
    featureList: {
        listStyle: 'none',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    featureItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '1rem',
        color: '#334155',
    },
    ctaButtonOutline: {
        backgroundColor: 'transparent',
        color: '#0f172a',
        border: '2px solid #e2e8f0',
        padding: '14px',
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
        width: '100%',
    },
    ctaButtonPrimary: {
        backgroundColor: '#3b82f6',
        color: '#fff',
        border: 'none',
        padding: '16px',
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
        transition: 'all 0.2s',
        width: '100%',
    },
    trustSection: {
        textAlign: 'center',
        paddingBottom: '80px',
    },
    trustBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#ecfdf5',
        padding: '12px 24px',
        borderRadius: '99px',
        color: '#064e3b',
        fontWeight: '600',
        fontSize: '0.95rem',
    },
};

export default PricingPage;
