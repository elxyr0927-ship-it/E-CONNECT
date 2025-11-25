import React from 'react';
import contactImage from '../assets/contact_placeholder.png';

const ContactPage = () => {
    return (
        <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '40px clamp(16px, 4vw, 48px)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            alignItems: 'center',
        }}>
            {/* Left Side: Content & Form */}
            <div>
                <h1 style={{
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    fontWeight: '800',
                    color: '#064e3b',
                    marginBottom: '16px',
                    lineHeight: '1.2',
                }}>
                    Get in Touch
                </h1>
                <p style={{
                    fontSize: '1.1rem',
                    color: '#4b5563',
                    marginBottom: '32px',
                    lineHeight: '1.6',
                }}>
                    Have questions about our recycling programs or need assistance? We're here to help you make a difference.
                </p>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label htmlFor="name" style={{ fontWeight: '600', color: '#374151' }}>Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Your Name"
                            style={{
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label htmlFor="email" style={{ fontWeight: '600', color: '#374151' }}>Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="your@email.com"
                            style={{
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '1rem',
                                outline: 'none',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label htmlFor="message" style={{ fontWeight: '600', color: '#374151' }}>Message</label>
                        <textarea
                            id="message"
                            rows="5"
                            placeholder="How can we help?"
                            style={{
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #d1d5db',
                                fontSize: '1rem',
                                outline: 'none',
                                resize: 'vertical',
                            }}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        style={{
                            backgroundColor: '#10b981',
                            color: 'white',
                            padding: '14px 28px',
                            borderRadius: '99px',
                            border: 'none',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            alignSelf: 'flex-start',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                            transition: 'transform 0.2s',
                        }}
                    >
                        Send Message
                    </button>
                </form>
            </div>

            {/* Right Side: Image */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <img
                    src={contactImage}
                    alt="Contact Us"
                    style={{
                        width: '100%',
                        maxWidth: '500px',
                        borderRadius: '24px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    }}
                />
            </div>
        </div>
    );
};

export default ContactPage;
