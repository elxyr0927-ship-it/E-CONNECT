import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiMapPin, FiAward } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

// Component to fetch and display barangay rankings
const BarangayLeaderboard = () => {
    const [rankings, setRankings] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetch('/api/rankings')
            .then(res => res.json())
            .then(data => {
                setRankings(data.slice(0, 5)); // Top 5
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch rankings:', err);
                setLoading(false);
            });
    }, []);

    const awards = ['🏆 Cleanest', '⚡ Fastest', '🌱 Greenest', '⭐ Most Improved', '♻️ Top Recycler'];

    if (loading) {
        return <div style={{ color: '#a7f3d0', textAlign: 'center' }}>Loading rankings...</div>;
    }

    return rankings.map((item, index) => (
        <div key={item.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '12px 20px',
            borderRadius: '99px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            whiteSpace: 'nowrap',
        }}>
            <span style={{ fontWeight: '800', color: '#34d399' }}>#{index + 1}</span>
            <span style={{ fontWeight: '600' }}>{item.name}</span>
            <span style={{
                fontSize: '0.9rem',
                color: '#a7f3d0',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                padding: '2px 8px',
                borderRadius: '12px',
            }}>{awards[index] || '✨ Top Performer'}</span>
        </div>
    ));
};


const LandingPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, role, loading } = useAuth();
    const [city, setCity] = React.useState(null);
    const [locationStatus, setLocationStatus] = React.useState('detecting');
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        if (!navigator.geolocation) {
            setLocationStatus('unavailable');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                (async () => {
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        );
                        if (!response.ok) {
                            throw new Error('Failed to fetch city name');
                        }
                        const data = await response.json();
                        const address = data.address || {};
                        const cityName =
                            address.city ||
                            address.town ||
                            address.village ||
                            address.municipality ||
                            address.county ||
                            address.state;

                        if (cityName) {
                            setCity(cityName);
                        }
                        setLocationStatus('ready');
                    } catch (error) {
                        console.error('Error resolving city from coordinates', error);
                        setLocationStatus('unavailable');
                    }
                })();
            },
            (error) => {
                console.error('Geolocation error', error);
                setLocationStatus('denied');
            }
        );
    }, []);

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={styles.container}>
            {/* Navigation */}

            {/* Hero Section */}
            <header style={styles.hero}>
                <div style={styles.heroContent}>
                    <div style={styles.badge}>
                        <span style={styles.badgeDot}></span>
                        {locationStatus === 'ready' && city
                            ? `Now live in ${city}`
                            : locationStatus === 'detecting'
                                ? 'Detecting your city...'
                                : 'Now live in your city'}
                    </div>
                    <h1 style={styles.headline}>
                        Smart Segregation <br />
                        <span style={styles.gradientText}>Real Rewards.</span>
                    </h1>
                    <p style={styles.subheadline}>
                        Track collection trucks in real-time, earn rewards for responsible disposal,
                        and help build a cleaner, greener city with E-Konek.
                    </p>
                    <div
                        style={{
                            ...styles.ctaGroup,
                            flexDirection: isMobile ? 'column' : 'row',
                            alignItems: isMobile ? 'stretch' : 'center',
                        }}
                    >
                        <button
                            style={{
                                ...styles.primaryCta,
                                width: isMobile ? '100%' : 'auto',
                                justifyContent: 'center',
                            }}
                            onClick={() => navigate('/login')}
                        >
                            Start Tracking Now <FiArrowRight />
                        </button>
                        <button
                            style={{
                                ...styles.secondaryCta,
                                width: isMobile ? '100%' : 'auto',
                                textAlign: 'center',
                            }}
                            onClick={() => navigate('/signup')}
                        >
                            Sign Up
                        </button>
                        <button
                            style={{
                                ...styles.secondaryCta,
                                width: isMobile ? '100%' : 'auto',
                                textAlign: 'center',
                            }}
                            onClick={() => navigate('/features')}
                        >
                            Learn More
                        </button>
                    </div>

                    <div style={styles.statsRow}>
                        <div style={styles.statItem}>
                            <h3 style={styles.statNumber}>15k+</h3>
                            <p style={styles.statLabel}>Active Users</p>
                        </div>
                        <div style={styles.statDivider}></div>
                        <div style={styles.statItem}>
                            <h3 style={styles.statNumber}>98%</h3>
                            <p style={styles.statLabel}>Collection Rate</p>
                        </div>
                        <div style={styles.statDivider}></div>
                        <div style={styles.statItem}>
                            <h3 style={styles.statNumber}>500+</h3>
                            <p style={styles.statLabel}>Daily Pickups</p>
                        </div>
                    </div>
                </div>

                <div style={styles.heroVisual}>
                    <div style={styles.visualCard}>
                        <div style={styles.cardHeader}>
                            <div style={styles.cardDotRed}></div>
                            <div style={styles.cardDotYellow}></div>
                            <div style={styles.cardDotGreen}></div>
                        </div>
                        <div style={styles.mapPlaceholder}>
                            {/* Abstract Map UI Representation */}
                            <div style={styles.mapRoute}></div>
                            <div style={styles.mapTruck}>
                                <div style={styles.truckPulse}></div>
                                🚚
                            </div>
                            <div style={styles.mapPin1}>📍</div>
                            <div style={styles.mapPin2}>📍</div>
                            <div style={styles.mapPin3}>🏠</div>

                            <div style={styles.floatingCard}>
                                <div style={styles.floatingIcon}><FiCheckCircle /></div>
                                <div>
                                    <p style={styles.floatingTitle}>Pickup Confirmed</p>
                                    <p style={styles.floatingSub}>Truck arriving in 5 mins</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Social Proof Section */}
            <section style={styles.socialProofSection}>
                <p style={styles.socialProofLabel}>Trusted by our community partners</p>
                <div style={styles.logoGrid}>
                    <div style={styles.logoItem}>🏛️ DENR</div>
                    <div style={styles.logoItem}>🏙️ Dumaguete City</div>
                    <div style={styles.logoItem}>♻️ Local Junk Shops</div>
                    <div style={styles.logoItem}>👥 50+ Barangays</div>
                </div>
            </section>

            {/* Video Showcase Section */}
            <section style={styles.videoSection}>
                <div style={styles.videoContainer}>
                    <h2 style={styles.videoTitle}>See E-Konek in Action</h2>
                    <p style={styles.videoSubtitle}>
                        Watch how our platform is transforming waste management in communities
                    </p>
                    <div style={styles.videoWrapper}>
                        <iframe
                            allow="fullscreen;autoplay"
                            allowFullScreen
                            height="100%"
                            src="https://streamable.com/e/97qeo4?autoplay=1&nocontrols=1"
                            width="100%"
                            style={{
                                border: 'none',
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                left: '0px',
                                top: '0px',
                                overflow: 'hidden'
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* Barangay Leaderboard Ticker */}
            <section style={styles.leaderboardSection}>
                <div style={styles.leaderboardContainer}>
                    <div style={styles.leaderboardHeader}>
                        <h2 style={styles.leaderboardTitle}>Top Performing Barangays</h2>
                        <p style={styles.leaderboardSubtitle}>Celebrating our cleanest and greenest communities</p>
                    </div>

                    <div style={styles.tickerWrapper}>
                        <div style={styles.tickerContent}>
                            {/* Dynamic Data from API */}
                            <BarangayLeaderboard />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Preview */}
            <section style={styles.features}>
                <div style={styles.featureCard}>
                    <div style={styles.featureIconBox}><FiMapPin size={24} color="#10b981" /></div>
                    <h3 style={styles.featureTitle}>Real-Time Tracking</h3>
                    <p style={styles.featureDesc}>Never miss a collection again. See exactly where the truck is on a live map.</p>
                </div>
                <div style={styles.featureCard}>
                    <div style={styles.featureIconBox}><FiAward size={24} color="#f59e0b" /></div>
                    <h3 style={styles.featureTitle}>Earn Rewards</h3>
                    <p style={styles.featureDesc}>Get points for every confirmed pickup and redeem them for real-world items.</p>
                </div>
                <div style={styles.featureCard}>
                    <div style={styles.featureIconBox}><FiCheckCircle size={24} color="#3b82f6" /></div>
                    <h3 style={styles.featureTitle}>Verified Service</h3>
                    <p style={styles.featureDesc}>Rate your collectors and ensure high-quality service for your community.</p>
                </div>
            </section>

            {/* FAQ Section */}
            <section style={styles.faqSection}>
                <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
                <div style={styles.faqGrid}>
                    <div style={styles.faqItem}>
                        <h3 style={styles.faqQuestion}>Why do I have to pay for bulk pickup?</h3>
                        <p style={styles.faqAnswer}>Taxes cover the scheduled truck for daily household waste. Bulk pickup is a premium express service for renovation debris and large items.</p>
                    </div>
                    <div style={styles.faqItem}>
                        <h3 style={styles.faqQuestion}>Do you accept hazardous waste?</h3>
                        <p style={styles.faqAnswer}>No, we do not accept hazardous materials like chemicals, batteries, or medical waste. Please contact the City Environment Office for proper disposal.</p>
                    </div>
                    <div style={styles.faqItem}>
                        <h3 style={styles.faqQuestion}>How do I convert Eco-Points?</h3>
                        <p style={styles.faqAnswer}>Points can be redeemed directly in the app for grocery vouchers, phone load, or cash via Gcash.</p>
                    </div>
                </div>
            </section>

            {/* Partner CTA */}
            <section style={styles.partnerCtaSection}>
                <div style={styles.partnerCtaContent}>
                    <h2 style={styles.partnerCtaTitle}>Own a Multicab?</h2>
                    <p style={styles.partnerCtaText}>Turn your vehicle into an income generator. Join our fleet of Eco-Warriors today.</p>
                    <button style={styles.partnerCtaButton} onClick={() => navigate('/partner')}>Become a Partner</button>
                </div>
            </section>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f0fdf4', // Emerald 50
        color: '#064e3b', // Emerald 900
        fontFamily: 'Inter, sans-serif',
        overflowX: 'hidden',
    },
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 48px',
        maxWidth: '1280px',
        margin: '0 auto',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    logoIcon: {
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Emerald Gradient
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: '1.25rem',
        fontWeight: '700',
        letterSpacing: '-0.02em',
        color: '#064e3b',
    },
    navLinks: {
        display: 'flex',
        gap: '32px',
        '@media (max-width: 768px)': {
            display: 'none',
        },
    },
    navLink: {
        background: 'none',
        border: 'none',
        color: '#374151', // Gray 700
        fontSize: '0.95rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'color 0.2s',
        ':hover': {
            color: '#10b981',
        },
    },
    authButtons: {
        display: 'flex',
        gap: '16px',
    },
    loginBtn: {
        background: 'none',
        border: 'none',
        color: '#064e3b',
        fontWeight: '600',
        cursor: 'pointer',
        padding: '10px 20px',
    },
    signupBtn: {
        backgroundColor: '#10b981', // Emerald 500
        color: '#fff',
        border: 'none',
        padding: '10px 24px',
        borderRadius: '99px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
    },
    hero: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'clamp(48px, 12vh, 80px) clamp(16px, 5vw, 48px)',
        maxWidth: '1280px',
        margin: '0 auto',
        gap: '40px',
        flexWrap: 'wrap',
    },
    heroContent: {
        flex: '1',
        minWidth: '300px',
    },
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        backgroundColor: '#d1fae5', // Emerald 100
        border: '1px solid #a7f3d0', // Emerald 200
        borderRadius: '99px',
        color: '#059669', // Emerald 600
        fontSize: '0.85rem',
        fontWeight: '600',
        marginBottom: '24px',
    },
    badgeDot: {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: '#059669',
    },
    headline: {
        fontSize: 'clamp(2.4rem, 6vw, 4rem)',
        fontWeight: '800',
        lineHeight: '1.1',
        marginBottom: '24px',
        letterSpacing: '-0.03em',
        color: '#064e3b',
    },
    gradientText: {
        background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', // Emerald to Blue
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subheadline: {
        fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
        color: '#4b5563', // Gray 600
        lineHeight: '1.6',
        marginBottom: '40px',
        maxWidth: '540px',
    },
    ctaGroup: {
        display: 'flex',
        gap: '16px',
        marginBottom: '60px',
    },
    primaryCta: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#10b981',
        color: '#fff',
        border: 'none',
        padding: '16px 32px',
        borderRadius: '12px',
        fontSize: '1.1rem',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
        transition: 'transform 0.2s',
    },
    secondaryCta: {
        backgroundColor: '#fff',
        color: '#064e3b',
        border: '1px solid #d1d5db',
        padding: '16px 32px',
        borderRadius: '12px',
        fontSize: '1.1rem',
        fontWeight: '600',
        cursor: 'pointer',
    },
    dashboardCta: {
        backgroundColor: '#3b82f6',
        color: '#fff',
        border: 'none',
        padding: '16px 32px',
        borderRadius: '12px',
        fontSize: '1.1rem',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
        transition: 'transform 0.2s',
    },
    statsRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
    },
    statItem: {
        display: 'flex',
        flexDirection: 'column',
    },
    statNumber: {
        fontSize: '1.5rem',
        fontWeight: '700',
        margin: '0 0 4px',
        color: '#064e3b',
    },
    statLabel: {
        color: '#64748b',
        fontSize: '0.9rem',
        margin: 0,
    },
    statDivider: {
        width: '1px',
        height: '40px',
        backgroundColor: '#cbd5e1',
    },
    heroVisual: {
        flex: '1',
        minWidth: '300px',
        display: 'flex',
        justifyContent: 'center',
    },
    visualCard: {
        width: '100%',
        maxWidth: '500px',
        height: '400px',
        backgroundColor: '#fff',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        position: 'relative',
    },
    cardHeader: {
        height: '40px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: '8px',
        backgroundColor: '#f8fafc',
    },
    cardDotRed: { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' },
    cardDotYellow: { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#eab308' },
    cardDotGreen: { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e' },
    mapPlaceholder: {
        height: '100%',
        position: 'relative',
        background: '#ecfdf5', // Very light emerald
    },
    mapRoute: {
        position: 'absolute',
        top: '50%',
        left: '20%',
        width: '60%',
        height: '4px',
        backgroundColor: '#10b981',
        transform: 'rotate(-15deg)',
        opacity: 0.6,
        borderRadius: '99px',
    },
    mapTruck: {
        position: 'absolute',
        top: '45%',
        left: '50%',
        fontSize: '2rem',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
    },
    truckPulse: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '60px',
        height: '60px',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        animation: 'pulse 2s infinite',
    },
    mapPin1: { position: 'absolute', top: '30%', left: '30%', fontSize: '1.5rem', opacity: 0.8 },
    mapPin2: { position: 'absolute', top: '60%', left: '70%', fontSize: '1.5rem', opacity: 0.8 },
    mapPin3: { position: 'absolute', top: '20%', left: '80%', fontSize: '1.5rem', opacity: 0.8 },
    floatingCard: {
        position: 'absolute',
        bottom: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '12px 20px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '80%',
        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
    },
    floatingIcon: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#d1fae5',
        color: '#059669',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    floatingTitle: {
        margin: '0',
        fontSize: '0.9rem',
        fontWeight: '600',
        color: '#0f172a',
    },
    floatingSub: {
        margin: '0',
        fontSize: '0.8rem',
        color: '#64748b',
    },
    videoSection: {
        padding: '80px clamp(16px, 5vw, 48px)',
        maxWidth: '1280px',
        margin: '0 auto',
        backgroundColor: '#fff',
    },
    videoContainer: {
        textAlign: 'center',
    },
    videoTitle: {
        fontSize: 'clamp(2rem, 5vw, 2.5rem)',
        fontWeight: '800',
        color: '#064e3b',
        marginBottom: '16px',
        lineHeight: '1.2',
    },
    videoSubtitle: {
        fontSize: '1.125rem',
        color: '#6b7280',
        marginBottom: '48px',
        maxWidth: '600px',
        margin: '0 auto 48px',
    },
    videoWrapper: {
        position: 'relative',
        width: '100%',
        maxWidth: '900px',
        margin: '0 auto',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.15)',
        border: '1px solid #e2e8f0',
        paddingBottom: '56.25%', // 16:9 aspect ratio
        height: '0',
    },
    video: {
        width: '100%',
        height: 'auto',
        display: 'block',
        backgroundColor: '#000',
    },
    leaderboardSection: {
        backgroundColor: '#064e3b',
        padding: '40px 0',
        color: '#fff',
        overflow: 'hidden',
    },
    leaderboardContainer: {
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 clamp(16px, 5vw, 48px)',
    },
    leaderboardHeader: {
        textAlign: 'center',
        marginBottom: '32px',
    },
    leaderboardTitle: {
        fontSize: '1.5rem',
        fontWeight: '700',
        margin: '0 0 8px',
        color: '#fff',
    },
    leaderboardSubtitle: {
        color: '#a7f3d0',
        fontSize: '0.95rem',
        margin: 0,
    },
    tickerWrapper: {
        display: 'flex',
        overflowX: 'auto',
        gap: '24px',
        paddingBottom: '16px',
        scrollbarWidth: 'none', // Hide scrollbar Firefox
        msOverflowStyle: 'none', // Hide scrollbar IE/Edge
        '::-webkit-scrollbar': { display: 'none' } // Hide scrollbar Chrome/Safari
    },
    tickerContent: {
        display: 'flex',
        gap: '24px',
        minWidth: '100%',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    tickerItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: '12px 20px',
        borderRadius: '99px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        whiteSpace: 'nowrap',
    },
    tickerRank: {
        fontWeight: '800',
        color: '#34d399',
    },
    tickerName: {
        fontWeight: '600',
    },
    tickerAward: {
        fontSize: '0.9rem',
        color: '#a7f3d0',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        padding: '2px 8px',
        borderRadius: '12px',
    },
    features: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '32px',
        padding: '40px clamp(16px, 5vw, 48px) 80px',
        maxWidth: '1280px',
        margin: '0 auto',
    },
    featureCard: {
        backgroundColor: '#fff',
        padding: '32px',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        transition: 'transform 0.2s',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        ':hover': {
            transform: 'translateY(-5px)',
        },
    },
    featureIconBox: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        backgroundColor: '#f0fdf4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
    },
    featureTitle: {
        fontSize: '1.25rem',
        fontWeight: '700',
        marginBottom: '12px',
        color: '#0f172a',
    },
    featureDesc: {
        color: '#64748b',
        lineHeight: '1.6',
        margin: 0,
    },
    socialProofSection: {
        textAlign: 'center',
        padding: '40px 24px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #f1f5f9',
    },
    socialProofLabel: {
        fontSize: '0.9rem',
        color: '#64748b',
        marginBottom: '24px',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    logoGrid: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '40px',
        alignItems: 'center',
    },
    logoItem: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#475569',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        opacity: 0.8,
    },
    faqSection: {
        padding: '80px clamp(16px, 5vw, 48px)',
        backgroundColor: '#f8fafc',
    },
    sectionTitle: {
        fontSize: '2rem',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: '48px',
        color: '#0f172a',
    },
    faqGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '32px',
        maxWidth: '1000px',
        margin: '0 auto',
    },
    faqItem: {
        backgroundColor: '#fff',
        padding: '32px',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
    },
    faqQuestion: {
        fontSize: '1.1rem',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '12px',
    },
    faqAnswer: {
        color: '#64748b',
        lineHeight: '1.6',
    },
    partnerCtaSection: {
        padding: '80px 24px',
        backgroundColor: '#064e3b',
        color: '#fff',
        textAlign: 'center',
    },
    partnerCtaContent: {
        maxWidth: '600px',
        margin: '0 auto',
    },
    partnerCtaTitle: {
        fontSize: '2.5rem',
        fontWeight: '800',
        marginBottom: '16px',
    },
    partnerCtaText: {
        fontSize: '1.25rem',
        color: '#a7f3d0',
        marginBottom: '40px',
    },
    partnerCtaButton: {
        backgroundColor: '#fff',
        color: '#064e3b',
        border: 'none',
        padding: '16px 40px',
        borderRadius: '99px',
        fontSize: '1.1rem',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.2s',
        ':hover': {
            transform: 'translateY(-2px)',
        }
    },
};

export default LandingPage;
