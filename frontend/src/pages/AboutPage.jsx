import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUsers, FiTrash2, FiMapPin } from 'react-icons/fi';
import aboutImage from '../assets/about_mission_placeholder.png';

const AboutPage = () => {
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
                        <span style={styles.logoText}>About Us</span>
                    </div>
                </div>
            </nav>

            {/* Hero Section: Born in Dumaguete */}
            <header style={styles.hero}>
                <h1 style={styles.headline}>
                    Born in <span style={styles.gradientText}>Dumaguete.</span>
                </h1>
                <p style={styles.subheadline}>
                    A family-run initiative to keep our City of Gentle People clean, green, and sustainable.
                </p>
            </header>

            {/* The Story Section */}
            <section style={styles.storySection}>
                <div style={styles.storyGrid}>
                    <div style={styles.storyContent}>
                        <h2 style={styles.sectionTitleLeft}>The Silent Crisis</h2>
                        <p style={styles.storyText}>
                            <strong>Dumaguete is growing, and so is our waste.</strong>
                        </p>
                        <p style={styles.storyText}>
                            Traditional government collection is overwhelmed. Trucks break down, schedules drift, and in frustration, some resort to burning trash or dumping in rivers.
                            We realized that E-Konek isn't just an app; it's a <strong>digital bridge</strong>.
                        </p>
                        <p style={styles.storyText}>
                            We don't replace the government; we give them "eyes" on the ground. We don't replace junk shops; we become their logistics arm.
                            Our goal is to divert <strong>50% of Dumaguete's waste</strong> away from the Candau-ay Dumpsite and into recycling centers.
                        </p>
                    </div>
                    <div style={styles.storyImageContainer}>
                        <img
                            src={aboutImage}
                            alt="Dumaguete City Street"
                            style={styles.storyImage}
                        />
                    </div>
                </div>
            </section>

            {/* Our Mission & Values Section */}
            <section style={styles.teamSection}>
                <h2 style={styles.sectionTitle}>Our Mission & Values</h2>
                <p style={styles.sectionSubtitle}>Guided by principles that drive meaningful change in our community.</p>

                <div style={styles.teamGrid}>
                    {/* Value 1 */}
                    <div style={styles.teamCard}>
                        <div style={styles.avatarPlaceholder}>🎯</div>
                        <h3 style={styles.teamName}>Innovation</h3>
                        <p style={styles.teamRole}>Smart Solutions</p>
                        <p style={styles.teamDesc}>
                            Leveraging technology to solve real-world waste management challenges, making it easier for everyone to participate in keeping Dumaguete clean.
                        </p>
                    </div>

                    {/* Value 2 */}
                    <div style={styles.teamCard}>
                        <div style={styles.avatarPlaceholder}>🤝</div>
                        <h3 style={styles.teamName}>Community</h3>
                        <p style={styles.teamRole}>People First</p>
                        <p style={styles.teamDesc}>
                            Building bridges between residents, collectors, and local government to create a collaborative ecosystem that benefits everyone.
                        </p>
                    </div>

                    {/* Value 3 */}
                    <div style={styles.teamCard}>
                        <div style={styles.avatarPlaceholder}>🌱</div>
                        <h3 style={styles.teamName}>Sustainability</h3>
                        <p style={styles.teamRole}>Long-term Impact</p>
                        <p style={styles.teamDesc}>
                            Creating lasting environmental change through proper waste segregation, recycling initiatives, and empowering local freelancers.
                        </p>
                    </div>
                </div>
            </section>

            {/* Team Members Section */}
            <section style={styles.membersSection}>
                <h2 style={styles.sectionTitle}>Our Team Members</h2>
                <p style={styles.sectionSubtitle}>Meet the passionate individuals driving our mission forward.</p>

                <div style={styles.membersGrid}>
                    <div style={styles.memberCard}>
                        <div style={styles.memberImageContainer}>
                            <img src="/ph/Imagine_1363203062195930~2.jpg" alt="Team Member 1" style={styles.memberImage} />
                        </div>
                        <h3 style={styles.memberName}>Ellix Vincent M. Yocor</h3>
                    </div>

                    <div style={styles.memberCard}>
                        <div style={styles.memberImageContainer}>
                            <img src="/ph/received_1484308172625981.jpeg" alt="Team Member 2" style={styles.memberImage} />
                        </div>
                        <h3 style={styles.memberName}>Jessa Mae Adella</h3>
                    </div>

                    <div style={styles.memberCard}>
                        <div style={styles.memberImageContainer}>
                            <img src="/ph/received_1880106520049703.jpeg" alt="Team Member 3" style={styles.memberImage} />
                        </div>
                        <h3 style={styles.memberName}>Nelson Lumacad Jr.</h3>
                    </div>

                    <div style={styles.memberCard}>
                        <div style={styles.memberImageContainer}>
                            <img src="/ph/received_736474272816721.jpeg" alt="Team Member 4" style={styles.memberImage} />
                        </div>
                        <h3 style={styles.memberName}>Earl Aian Liu</h3>
                    </div>

                    <div style={styles.memberCard}>
                        <div style={styles.memberImageContainer}>
                            <img src="/ph/received_745405391158268.jpeg" alt="Team Member 5" style={styles.memberImage} />
                        </div>
                        <h3 style={styles.memberName}>John Vincent Abella</h3>
                    </div>

                    {/* <div style={styles.memberCard}>
                        <div style={{ ...styles.memberImageContainer, ...styles.memberPlaceholder }}>
                            <span style={styles.placeholderInitial}>L</span>
                        </div>
                        <h3 style={styles.memberName}>Luis Fernandez</h3>
                    </div> */}
                </div>
            </section>

            {/* Impact Counter Section */}
            <section style={styles.impactSection}>
                <h2 style={{ ...styles.sectionTitle, color: '#fff' }}>Our Impact So Far</h2>
                <div style={styles.impactGrid}>
                    <div style={styles.impactItem}>
                        <div style={styles.impactIcon}><FiTrash2 /></div>
                        <div style={styles.impactNumber}>1,250+</div>
                        <div style={styles.impactLabel}>Kgs of Plastic Diverted</div>
                    </div>
                    <div style={styles.impactItem}>
                        <div style={styles.impactIcon}><FiUsers /></div>
                        <div style={styles.impactNumber}>45+</div>
                        <div style={styles.impactLabel}>Freelancers Empowered</div>
                    </div>
                    <div style={styles.impactItem}>
                        <div style={styles.impactIcon}><FiMapPin /></div>
                        <div style={styles.impactNumber}>8</div>
                        <div style={styles.impactLabel}>Barangays Partnered</div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={styles.ctaSection}>
                <h2 style={styles.ctaTitle}>Join our mission.</h2>
                <p style={styles.ctaText}>Whether you're a resident, a driver, or a barangay official, there's a place for you in our ecosystem.</p>
                <button style={styles.ctaButton} onClick={() => navigate('/signup')}>Join E-Konek</button>
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
    storySection: {
        padding: '0 clamp(16px, 5vw, 48px) 80px',
        maxWidth: '1280px',
        margin: '0 auto',
    },
    storyGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '60px',
        alignItems: 'center',
    },
    storyContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    sectionTitleLeft: {
        fontSize: '2rem',
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: '8px',
    },
    storyText: {
        fontSize: '1.1rem',
        color: '#4b5563',
        lineHeight: '1.7',
    },
    storyImageContainer: {
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
    },
    storyImage: {
        width: '100%',
        height: 'auto',
        display: 'block',
    },
    teamSection: {
        padding: '80px clamp(16px, 5vw, 48px)',
        backgroundColor: '#fff',
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: '2.5rem',
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: '16px',
    },
    sectionSubtitle: {
        fontSize: '1.25rem',
        color: '#64748b',
        maxWidth: '600px',
        margin: '0 auto 60px',
    },
    teamGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '40px',
        maxWidth: '1000px',
        margin: '0 auto',
    },
    teamCard: {
        backgroundColor: '#f8fafc',
        borderRadius: '24px',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid #e2e8f0',
    },
    avatarPlaceholder: {
        width: '96px',
        height: '96px',
        borderRadius: '50%',
        backgroundColor: '#e0f2fe',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem',
        marginBottom: '24px',
    },
    teamName: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '8px',
    },
    teamRole: {
        fontSize: '1rem',
        fontWeight: '600',
        color: '#3b82f6',
        marginBottom: '24px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    teamDesc: {
        color: '#64748b',
        lineHeight: '1.6',
        fontStyle: 'italic',
    },
    membersSection: {
        padding: '80px clamp(16px, 5vw, 48px)',
        backgroundColor: '#f8fafc',
        textAlign: 'center',
    },
    membersGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    memberCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
    },
    memberImageContainer: {
        width: '160px',
        height: '160px',
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        border: '4px solid #fff',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        ':hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
        }
    },
    memberImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
    },
    memberName: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#0f172a',
        margin: 0,
    },
    memberPlaceholder: {
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderInitial: {
        fontSize: '4rem',
        fontWeight: '800',
        color: '#fff',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    impactSection: {
        padding: '80px clamp(16px, 5vw, 48px)',
        backgroundColor: '#064e3b',
        color: '#fff',
        textAlign: 'center',
    },
    impactGrid: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '60px',
        marginTop: '60px',
    },
    impactItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
    },
    impactIcon: {
        fontSize: '2.5rem',
        color: '#34d399',
    },
    impactNumber: {
        fontSize: '3.5rem',
        fontWeight: '800',
        lineHeight: '1',
    },
    impactLabel: {
        fontSize: '1.1rem',
        color: '#a7f3d0',
        fontWeight: '500',
    },
    ctaSection: {
        textAlign: 'center',
        padding: '80px 24px',
        backgroundColor: '#fff',
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
        maxWidth: '600px',
        margin: '0 auto 40px',
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

export default AboutPage;
