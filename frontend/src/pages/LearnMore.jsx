import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

// ─── Simple animated counter ─────────────────────────────────────────────────
const Counter = ({ target, suffix = "" }) => {
	const [count, setCount] = useState(0);
	const ref = useRef(null);
	const started = useRef(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !started.current) {
					started.current = true;
					let start = 0;
					const step = Math.ceil(target / 60);
					const timer = setInterval(() => {
						start += step;
						if (start >= target) {
							setCount(target);
							clearInterval(timer);
						} else {
							setCount(start);
						}
					}, 20);
				}
			},
			{ threshold: 0.4 }
		);
		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, [target]);

	return (
		<span ref={ref}>
			{count.toLocaleString()}
			{suffix}
		</span>
	);
};

// ─── Flow Step ────────────────────────────────────────────────────────────────
const FlowStep = ({ step, icon, title, desc, accent }) => (
	<div className="lm-flow-step" style={{ "--accent": accent }}>
		<div className="lm-flow-icon">{icon}</div>
		<div className="lm-flow-num">{step}</div>
		<h3 className="lm-flow-title">{title}</h3>
		<p className="lm-flow-desc">{desc}</p>
	</div>
);

// ─── Feature Card ─────────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, desc }) => (
	<div className="lm-feature-card">
		<div className="lm-feature-icon">{icon}</div>
		<h4 className="lm-feature-title">{title}</h4>
		<p className="lm-feature-desc">{desc}</p>
	</div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const LearnMore = () => {
	const navigate = useNavigate();

	const stats = [
		{ value: 10000, suffix: "+", label: "Active Users" },
		{ value: 5000, suffix: "+", label: "Listings Sold" },
		{ value: 50, suffix: "+", label: "Platform Types" },
		{ value: 99, suffix: "%", label: "Satisfaction Rate" },
	];

	const sellerFlow = [
		{
			step: "01",
			icon: (
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
					<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
				</svg>
			),
			title: "Create an Account",
			desc: "Sign up for free. Verify your email and set up your seller profile in under 2 minutes.",
			accent: "#7c3aed",
		},
		{
			step: "02",
			icon: (
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
					<path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
				</svg>
			),
			title: "Post a Listing",
			desc: "Choose a plan, add your social account details, set your price, and publish your listing.",
			accent: "#6366f1",
		},
		{
			step: "03",
			icon: (
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
					<rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
				</svg>
			),
			title: "Get Paid Securely",
			desc: "Buyers pay via Razorpay. Funds are held safely and released once the transfer is verified.",
			accent: "#3b82f6",
		},
		{
			step: "04",
			icon: (
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
					<polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
				</svg>
			),
			title: "Withdraw Earnings",
			desc: "Request a withdrawal anytime. Your balance hits your bank account within 1–2 business days.",
			accent: "#06b6d4",
		},
	];

	const buyerFlow = [
		{
			step: "01",
			icon: (
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
					<circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
				</svg>
			),
			title: "Browse Marketplace",
			desc: "Filter by platform, niche, followers, price range and engagement rate to find the perfect account.",
			accent: "#f59e0b",
		},
		{
			step: "02",
			icon: (
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
					<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
				</svg>
			),
			title: "Contact the Seller",
			desc: "Chat directly with the seller via our built-in messaging system. Ask questions before buying.",
			accent: "#10b981",
		},
		{
			step: "03",
			icon: (
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
					<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
				</svg>
			),
			title: "Purchase Safely",
			desc: "Pay via Razorpay with full buyer protection. Your money is only released after a successful transfer.",
			accent: "#7c3aed",
		},
		{
			step: "04",
			icon: (
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
					<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
				</svg>
			),
			title: "Own Your Account",
			desc: "Receive the login credentials and take ownership. Our admin team monitors every transfer.",
			accent: "#3b82f6",
		},
	];

	const features = [
		{
			icon: (
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
					<rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
				</svg>
			),
			title: "Escrow Payment Protection",
			desc: "Funds are securely held by our escrow system and released only after successful account transfer.",
		},
		{
			icon: (
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
					<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
				</svg>
			),
			title: "Real-Time Messaging",
			desc: "Built-in live chat system to negotiate and discuss details directly between buyer and seller.",
		},
		{
			icon: (
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
					<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
				</svg>
			),
			title: "Admin Verification",
			desc: "Every seller undergoes credential verification by our admin team before listings go live.",
		},
		{
			icon: (
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
					<line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
				</svg>
			),
			title: "Advanced Analytics",
			desc: "Track your listing views, engagement, and earnings with detailed analytics dashboards.",
		},
		{
			icon: (
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
					<circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
				</svg>
			),
			title: "Fast Withdrawals",
			desc: "Request payouts anytime. Withdrawals processed within 1–2 business days to your bank account.",
		},
		{
			icon: (
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
					<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
				</svg>
			),
			title: "Verified Badge",
			desc: "Premium sellers get a verified badge, boosting buyer trust and increasing conversion rates.",
		},
	];

	const platforms = [
		{ name: "Instagram", color: "#E1306C", icon: "📸" },
		{ name: "YouTube", color: "#FF0000", icon: "▶️" },
		{ name: "Twitter/X", color: "#1DA1F2", icon: "🐦" },
		{ name: "Telegram", color: "#26A5E4", icon: "✈️" },
		{ name: "Facebook", color: "#1877F2", icon: "👥" },
		{ name: "TikTok", color: "#010101", icon: "🎵" },
	];

	return (
		<div className="lm-root">
			<style>{`
				/* ── Reset & Root ─────────────────────────── */
				.lm-root {
					font-family: 'Inter', 'Segoe UI', sans-serif;
					color: #1e1b4b;
					background: #fafafa;
					overflow-x: hidden;
				}

				/* ── Hero ────────────────────────────────── */
				.lm-hero {
					position: relative;
					min-height: 88vh;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					text-align: center;
					padding: 120px 24px 80px;
					background: linear-gradient(135deg, #f0ebff 0%, #e8f4ff 50%, #f5f0ff 100%);
					overflow: hidden;
				}
				.lm-hero::before {
					content: '';
					position: absolute;
					width: 600px; height: 600px;
					background: radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%);
					top: -100px; left: -100px;
					border-radius: 50%;
					animation: lm-float 8s ease-in-out infinite;
				}
				.lm-hero::after {
					content: '';
					position: absolute;
					width: 500px; height: 500px;
					background: radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%);
					bottom: -80px; right: -80px;
					border-radius: 50%;
					animation: lm-float 10s ease-in-out infinite reverse;
				}
				@keyframes lm-float {
					0%,100% { transform: translateY(0); }
					50% { transform: translateY(-30px); }
				}

				.lm-hero-badge {
					display: inline-flex;
					align-items: center;
					gap: 6px;
					background: white;
					border: 1px solid #e0d9ff;
					border-radius: 999px;
					padding: 6px 16px;
					font-size: 13px;
					font-weight: 500;
					color: #6d28d9;
					margin-bottom: 24px;
					box-shadow: 0 2px 12px rgba(124,58,237,0.1);
					position: relative; z-index: 1;
				}
				.lm-hero h1 {
					font-size: clamp(2.4rem, 6vw, 4rem);
					font-weight: 800;
					line-height: 1.15;
					max-width: 760px;
					position: relative; z-index: 1;
					background: linear-gradient(135deg, #1e1b4b 0%, #5b21b6 50%, #3b82f6 100%);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					background-clip: text;
				}
				.lm-hero-sub {
					font-size: 1.1rem;
					color: #64748b;
					max-width: 560px;
					line-height: 1.7;
					margin: 20px auto 36px;
					position: relative; z-index: 1;
				}
				.lm-hero-btns {
					display: flex;
					gap: 14px;
					flex-wrap: wrap;
					justify-content: center;
					position: relative; z-index: 1;
				}
				.lm-btn-primary {
					background: linear-gradient(135deg, #7c3aed, #4f46e5);
					color: white;
					border: none;
					border-radius: 999px;
					padding: 14px 32px;
					font-size: 15px;
					font-weight: 600;
					cursor: pointer;
					box-shadow: 0 4px 20px rgba(124,58,237,0.35);
					transition: all 0.25s ease;
				}
				.lm-btn-primary:hover {
					transform: translateY(-2px);
					box-shadow: 0 8px 28px rgba(124,58,237,0.45);
				}
				.lm-btn-outline {
					background: white;
					color: #4f46e5;
					border: 1.5px solid #c4b5fd;
					border-radius: 999px;
					padding: 14px 32px;
					font-size: 15px;
					font-weight: 600;
					cursor: pointer;
					transition: all 0.25s ease;
				}
				.lm-btn-outline:hover {
					background: #f5f3ff;
					transform: translateY(-2px);
				}

				/* ── Stats Bar ───────────────────────────── */
				.lm-stats {
					background: white;
					border-top: 1px solid #f0ebff;
					border-bottom: 1px solid #f0ebff;
					display: grid;
					grid-template-columns: repeat(4, 1fr);
					gap: 0;
				}
				.lm-stat {
					text-align: center;
					padding: 36px 24px;
					border-right: 1px solid #f0ebff;
					transition: background 0.2s;
				}
				.lm-stat:last-child { border-right: none; }
				.lm-stat:hover { background: #faf5ff; }
				.lm-stat-value {
					font-size: 2.4rem;
					font-weight: 800;
					background: linear-gradient(135deg, #7c3aed, #3b82f6);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					background-clip: text;
				}
				.lm-stat-label {
					font-size: 13px;
					color: #94a3b8;
					font-weight: 500;
					margin-top: 4px;
				}
				@media (max-width: 640px) {
					.lm-stats { grid-template-columns: repeat(2, 1fr); }
					.lm-stat:nth-child(2) { border-right: none; }
					.lm-stat:nth-child(3) { border-top: 1px solid #f0ebff; }
					.lm-stat:nth-child(4) { border-top: 1px solid #f0ebff; border-right: none; }
				}

				/* ── Section ─────────────────────────────── */
				.lm-section {
					max-width: 1100px;
					margin: 0 auto;
					padding: 90px 24px;
				}
				.lm-section-label {
					display: inline-block;
					background: linear-gradient(135deg, #ede9fe, #dbeafe);
					color: #5b21b6;
					border-radius: 999px;
					padding: 5px 16px;
					font-size: 12px;
					font-weight: 700;
					text-transform: uppercase;
					letter-spacing: 0.08em;
					margin-bottom: 14px;
				}
				.lm-section-title {
					font-size: clamp(1.7rem, 4vw, 2.6rem);
					font-weight: 800;
					line-height: 1.2;
					color: #1e1b4b;
					max-width: 600px;
				}
				.lm-section-sub {
					color: #64748b;
					font-size: 1rem;
					line-height: 1.7;
					max-width: 560px;
					margin-top: 12px;
				}

				/* ── About ───────────────────────────────── */
				.lm-about-grid {
					display: grid;
					grid-template-columns: 1fr 1fr;
					gap: 60px;
					align-items: center;
					margin-top: 40px;
				}
				@media (max-width: 768px) {
					.lm-about-grid { grid-template-columns: 1fr; gap: 32px; }
				}
				.lm-about-visual {
					background: linear-gradient(135deg, #f0ebff, #dbeafe);
					border-radius: 24px;
					padding: 40px;
					display: flex;
					flex-direction: column;
					gap: 16px;
					position: relative;
					overflow: hidden;
				}
				.lm-about-visual::before {
					content: '';
					position: absolute;
					width: 200px; height: 200px;
					background: radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%);
					top: -40px; right: -40px;
					border-radius: 50%;
				}
				.lm-platform-chip {
					display: flex;
					align-items: center;
					gap: 12px;
					background: white;
					border-radius: 12px;
					padding: 12px 16px;
					font-size: 14px;
					font-weight: 600;
					box-shadow: 0 2px 8px rgba(0,0,0,0.06);
					transition: transform 0.2s;
					cursor: default;
				}
				.lm-platform-chip:hover { transform: translateX(6px); }
				.lm-platform-dot {
					width: 10px; height: 10px;
					border-radius: 50%;
					flex-shrink: 0;
				}
				.lm-about-text p {
					color: #475569;
					line-height: 1.8;
					margin-bottom: 16px;
					font-size: 1rem;
				}
				.lm-about-text strong { color: #4f46e5; }

				/* ── Flow Tabs ───────────────────────────── */
				.lm-flow-bg {
					background: linear-gradient(180deg, #faf5ff 0%, #f0f9ff 100%);
				}
				.lm-tabs {
					display: flex;
					gap: 8px;
					margin: 40px 0 48px;
					background: white;
					border-radius: 14px;
					padding: 6px;
					width: fit-content;
					box-shadow: 0 2px 12px rgba(0,0,0,0.06);
				}
				.lm-tab {
					padding: 10px 28px;
					border-radius: 10px;
					border: none;
					background: transparent;
					font-size: 14px;
					font-weight: 600;
					color: #94a3b8;
					cursor: pointer;
					transition: all 0.2s;
				}
				.lm-tab.active {
					background: linear-gradient(135deg, #7c3aed, #4f46e5);
					color: white;
					box-shadow: 0 4px 14px rgba(124,58,237,0.3);
				}
				.lm-flow-grid {
					display: grid;
					grid-template-columns: repeat(4, 1fr);
					gap: 20px;
					position: relative;
				}
				.lm-flow-grid::before {
					content: '';
					position: absolute;
					top: 52px;
					left: calc(12.5% + 10px);
					right: calc(12.5% + 10px);
					height: 2px;
					background: linear-gradient(90deg, #7c3aed33, #4f46e533);
					z-index: 0;
				}
				@media (max-width: 768px) {
					.lm-flow-grid { grid-template-columns: repeat(2, 1fr); }
					.lm-flow-grid::before { display: none; }
				}
				@media (max-width: 480px) {
					.lm-flow-grid { grid-template-columns: 1fr; }
				}
				.lm-flow-step {
					background: white;
					border-radius: 20px;
					padding: 28px 20px;
					text-align: center;
					position: relative;
					z-index: 1;
					box-shadow: 0 4px 20px rgba(0,0,0,0.06);
					border: 1px solid #f0ebff;
					transition: all 0.25s ease;
				}
				.lm-flow-step:hover {
					transform: translateY(-6px);
					box-shadow: 0 12px 32px rgba(124,58,237,0.15);
					border-color: #c4b5fd;
				}
				.lm-flow-icon {
					width: 52px; height: 52px;
					border-radius: 14px;
					background: var(--accent);
					display: flex;
					align-items: center;
					justify-content: center;
					margin: 0 auto 12px;
					color: white;
				}
				.lm-flow-icon svg { width: 24px; height: 24px; }
				.lm-flow-num {
					position: absolute;
					top: 14px; right: 18px;
					font-size: 11px;
					font-weight: 800;
					color: #c4b5fd;
					letter-spacing: 0.05em;
				}
				.lm-flow-title {
					font-size: 15px;
					font-weight: 700;
					color: #1e1b4b;
					margin-bottom: 8px;
				}
				.lm-flow-desc {
					font-size: 13px;
					color: #64748b;
					line-height: 1.6;
				}

				/* ── Features Grid ───────────────────────── */
				.lm-features-grid {
					display: grid;
					grid-template-columns: repeat(3, 1fr);
					gap: 24px;
					margin-top: 48px;
				}
				@media (max-width: 900px) {
					.lm-features-grid { grid-template-columns: repeat(2, 1fr); }
				}
				@media (max-width: 540px) {
					.lm-features-grid { grid-template-columns: 1fr; }
				}
				.lm-feature-card {
					background: white;
					border: 1px solid #f0ebff;
					border-radius: 20px;
					padding: 28px 24px;
					transition: all 0.25s ease;
					cursor: default;
				}
				.lm-feature-card:hover {
					transform: translateY(-4px);
					border-color: #c4b5fd;
					box-shadow: 0 12px 32px rgba(124,58,237,0.1);
				}
				.lm-feature-icon {
					width: 46px; height: 46px;
					border-radius: 12px;
					background: linear-gradient(135deg, #ede9fe, #dbeafe);
					display: flex;
					align-items: center;
					justify-content: center;
					margin-bottom: 16px;
					color: #6d28d9;
				}
				.lm-feature-icon svg { width: 22px; height: 22px; }
				.lm-feature-title {
					font-size: 15px;
					font-weight: 700;
					color: #1e1b4b;
					margin-bottom: 8px;
				}
				.lm-feature-desc {
					font-size: 13.5px;
					color: #64748b;
					line-height: 1.65;
				}

				/* ── Plans Strip ─────────────────────────── */
				.lm-plans-bg {
					background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
					padding: 80px 24px;
					text-align: center;
					position: relative;
					overflow: hidden;
				}
				.lm-plans-bg::before {
					content: '';
					position: absolute;
					inset: 0;
					background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
				}
				.lm-plans-title {
					font-size: clamp(1.7rem, 4vw, 2.6rem);
					font-weight: 800;
					color: white;
					position: relative;
					z-index: 1;
				}
				.lm-plans-sub {
					color: #a5b4fc;
					font-size: 1rem;
					margin: 12px auto 40px;
					max-width: 480px;
					position: relative;
					z-index: 1;
				}
				.lm-plans-grid {
					display: grid;
					grid-template-columns: repeat(3, 1fr);
					gap: 20px;
					max-width: 900px;
					margin: 0 auto;
					position: relative;
					z-index: 1;
				}
				@media (max-width: 680px) {
					.lm-plans-grid { grid-template-columns: 1fr; max-width: 400px; }
				}
				.lm-plan-card {
					background: rgba(255,255,255,0.07);
					border: 1px solid rgba(255,255,255,0.12);
					border-radius: 20px;
					padding: 30px 24px;
					text-align: left;
					transition: all 0.25s ease;
					backdrop-filter: blur(8px);
				}
				.lm-plan-card.featured {
					background: linear-gradient(135deg, rgba(124,58,237,0.4), rgba(79,70,229,0.4));
					border-color: rgba(167,139,250,0.4);
					transform: scale(1.04);
					box-shadow: 0 20px 48px rgba(0,0,0,0.3);
				}
				.lm-plan-card:hover { transform: scale(1.04); }
				.lm-plan-card.featured:hover { transform: scale(1.06); }
				.lm-plan-name {
					font-size: 14px;
					font-weight: 700;
					color: #a5b4fc;
					text-transform: uppercase;
					letter-spacing: 0.07em;
				}
				.lm-plan-price {
					font-size: 2.4rem;
					font-weight: 800;
					color: white;
					margin: 8px 0 20px;
					line-height: 1;
				}
				.lm-plan-price span {
					font-size: 14px;
					font-weight: 400;
					color: #94a3b8;
				}
				.lm-plan-feature {
					display: flex;
					align-items: center;
					gap: 8px;
					font-size: 13.5px;
					color: #c7d2fe;
					margin-bottom: 10px;
				}
				.lm-plan-feature svg {
					width: 15px; height: 15px;
					color: #34d399;
					flex-shrink: 0;
				}
				.lm-plans-cta {
					margin-top: 48px;
					position: relative;
					z-index: 1;
				}
				.lm-plans-cta button {
					background: white;
					color: #4f46e5;
					border: none;
					border-radius: 999px;
					padding: 14px 40px;
					font-size: 15px;
					font-weight: 700;
					cursor: pointer;
					box-shadow: 0 4px 20px rgba(0,0,0,0.2);
					transition: all 0.25s ease;
				}
				.lm-plans-cta button:hover {
					transform: translateY(-2px);
					box-shadow: 0 8px 28px rgba(0,0,0,0.3);
				}

				/* ── FAQ ─────────────────────────────────── */
				.lm-faq-list {
					margin-top: 48px;
					display: flex;
					flex-direction: column;
					gap: 12px;
					max-width: 700px;
					margin-left: auto;
					margin-right: auto;
				}
				.lm-faq-item {
					background: white;
					border: 1px solid #f0ebff;
					border-radius: 14px;
					overflow: hidden;
					transition: box-shadow 0.2s;
				}
				.lm-faq-item:hover { box-shadow: 0 4px 16px rgba(124,58,237,0.08); }
				.lm-faq-q {
					width: 100%;
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 18px 22px;
					background: none;
					border: none;
					font-size: 15px;
					font-weight: 600;
					color: #1e1b4b;
					cursor: pointer;
					text-align: left;
					gap: 12px;
				}
				.lm-faq-q svg {
					width: 18px; height: 18px;
					color: #7c3aed;
					flex-shrink: 0;
					transition: transform 0.25s ease;
				}
				.lm-faq-q.open svg { transform: rotate(45deg); }
				.lm-faq-a {
					font-size: 14px;
					color: #64748b;
					line-height: 1.7;
					padding: 0 22px 18px;
					display: none;
				}
				.lm-faq-a.show { display: block; }

				/* ── Final CTA ───────────────────────────── */
				.lm-final-cta {
					background: linear-gradient(135deg, #f5f3ff, #eff6ff);
					padding: 90px 24px;
					text-align: center;
				}
				.lm-final-cta h2 {
					font-size: clamp(1.8rem, 4vw, 2.8rem);
					font-weight: 800;
					color: #1e1b4b;
					max-width: 560px;
					margin: 0 auto 16px;
					line-height: 1.2;
				}
				.lm-final-cta p {
					color: #64748b;
					font-size: 1rem;
					max-width: 440px;
					margin: 0 auto 36px;
					line-height: 1.7;
				}
				.lm-final-btns {
					display: flex;
					gap: 14px;
					justify-content: center;
					flex-wrap: wrap;
				}

				/* ── Tabs animation ──────────────────────── */
				.lm-tab-content {
					animation: lm-fade-in 0.35s ease;
				}
				@keyframes lm-fade-in {
					from { opacity: 0; transform: translateY(10px); }
					to   { opacity: 1; transform: translateY(0); }
				}

				/* ── Tabs width fix ─────────────────────── */
				@media (max-width: 480px) {
					.lm-tabs { width: 100%; }
					.lm-tab { flex: 1; text-align: center; padding: 10px 8px; }
				}
			`}</style>

			{/* ── Hero ─────────────────────────────────────────── */}
			<section className="lm-hero">
				<div className="lm-hero-badge">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
					</svg>
					Trusted Social Profile Marketplace
				</div>
				<h1>The Safest Way to Buy &amp; Sell Social Media Accounts</h1>
				<p className="lm-hero-sub">
					A fully secured, admin-monitored platform where verified sellers list their social accounts
					and buyers purchase them with complete payment protection.
				</p>
				<div className="lm-hero-btns">
					<button className="lm-btn-primary" onClick={() => navigate("/marketplace")}>
						Browse Marketplace →
					</button>
					<button className="lm-btn-outline" onClick={() => navigate("/sign-up")}>
						Start Selling Free
					</button>
				</div>
			</section>

			{/* ── Stats ────────────────────────────────────────── */}
			<div className="lm-stats">
				{stats.map((s) => (
					<div className="lm-stat" key={s.label}>
						<div className="lm-stat-value">
							<Counter target={s.value} suffix={s.suffix} />
						</div>
						<div className="lm-stat-label">{s.label}</div>
					</div>
				))}
			</div>

			{/* ── About ────────────────────────────────────────── */}
			<div style={{ background: "white" }}>
				<section className="lm-section">
					<div className="lm-section-label">About the Platform</div>
					<h2 className="lm-section-title">What is Social Profile Marketplace?</h2>
					<div className="lm-about-grid">
						<div className="lm-about-text">
							<p>
								<strong>Social Profile Marketplace</strong> is a dedicated platform that connects
								people who want to <strong>sell their social media accounts</strong> with buyers
								looking for established audiences — safely, quickly, and transparently.
							</p>
							<p>
								Whether you're a creator wrapping up a project or an entrepreneur wanting to
								jumpstart growth, our platform handles the entire transaction end-to-end — from
								<strong> listing creation</strong> to <strong>credential verification</strong>,
								<strong> secure payment</strong>, and <strong>account handover</strong>.
							</p>
							<p>
								We support all major social networks including Instagram, YouTube, Twitter/X,
								Telegram, Facebook, and TikTok — with more platforms being added continuously.
							</p>
						</div>
						<div className="lm-about-visual">
							{platforms.map((p) => (
								<div className="lm-platform-chip" key={p.name}>
									<div className="lm-platform-dot" style={{ background: p.color }} />
									<span style={{ fontSize: "18px" }}>{p.icon}</span>
									<span style={{ color: "#1e1b4b" }}>{p.name}</span>
									<span style={{ marginLeft: "auto", fontSize: "11px", color: "#94a3b8" }}>
										Available
									</span>
								</div>
							))}
						</div>
					</div>
				</section>
			</div>

			{/* ── User Flow ─────────────────────────────────────── */}
			<div className="lm-flow-bg">
				<FlowSection sellerFlow={sellerFlow} buyerFlow={buyerFlow} />
			</div>

			{/* ── Features ─────────────────────────────────────── */}
			<div style={{ background: "white" }}>
				<section className="lm-section" style={{ textAlign: "center" }}>
					<div className="lm-section-label" style={{ margin: "0 auto 14px" }}>Platform Features</div>
					<h2 className="lm-section-title" style={{ margin: "0 auto" }}>
						Everything you need in one place
					</h2>
					<p className="lm-section-sub" style={{ margin: "12px auto 0" }}>
						Built with both buyers and sellers in mind — every feature is designed to make
						transactions faster, safer, and more transparent.
					</p>
					<div className="lm-features-grid">
						{features.map((f) => (
							<FeatureCard key={f.title} {...f} />
						))}
					</div>
				</section>
			</div>

			{/* ── Plans ────────────────────────────────────────── */}
			<div className="lm-plans-bg">
				<h2 className="lm-plans-title">Simple, Transparent Pricing</h2>
				<p className="lm-plans-sub">
					Start for free and upgrade as your business grows. No hidden fees.
				</p>
				<div className="lm-plans-grid">
					{[
						{
							name: "Free",
							price: "₹0",
							features: ["5 Listings", "Basic analytics", "Community support"],
							featured: false,
						},
						{
							name: "Basic",
							price: "₹299",
							priceSuffix: "/mo",
							features: ["25 Listings", "Advanced analytics", "Priority support", "Featured listing"],
							featured: true,
						},
						{
							name: "Premium",
							price: "₹999",
							priceSuffix: "/mo",
							features: ["Unlimited listings", "Premium analytics", "24/7 support", "Verified badge", "No commission"],
							featured: false,
						},
					].map((plan) => (
						<div key={plan.name} className={`lm-plan-card ${plan.featured ? "featured" : ""}`}>
							<div className="lm-plan-name">{plan.name}</div>
							<div className="lm-plan-price">
								{plan.price}
								{plan.priceSuffix && <span>{plan.priceSuffix}</span>}
							</div>
							{plan.features.map((f) => (
								<div className="lm-plan-feature" key={f}>
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
										<polyline points="20 6 9 17 4 12" />
									</svg>
									{f}
								</div>
							))}
						</div>
					))}
				</div>
				<div className="lm-plans-cta">
					<button onClick={() => navigate("/sign-up")}>Get Started for Free →</button>
				</div>
			</div>

			{/* ── FAQ ──────────────────────────────────────────── */}
			<div style={{ background: "white" }}>
				<section className="lm-section" style={{ textAlign: "center" }}>
					<div className="lm-section-label" style={{ margin: "0 auto 14px" }}>FAQ</div>
					<h2 className="lm-section-title" style={{ margin: "0 auto" }}>Frequently asked questions</h2>
					<FaqList />
				</section>
			</div>

			{/* ── Final CTA ─────────────────────────────────────── */}
			<div className="lm-final-cta">
				<h2>Ready to get started?</h2>
				<p>
					Join thousands of users buying and selling social media accounts safely every day.
				</p>
				<div className="lm-final-btns">
					<button className="lm-btn-primary" onClick={() => navigate("/sign-up")}>
						Create Free Account
					</button>
					<button className="lm-btn-outline" onClick={() => navigate("/marketplace")}>
						Browse Listings
					</button>
				</div>
			</div>

			<Footer />
		</div>
	);
};

// ─── Flow Section with tab state ─────────────────────────────────────────────
const FlowSection = ({ sellerFlow, buyerFlow }) => {
	const [tab, setTab] = useState("seller");
	const flow = tab === "seller" ? sellerFlow : buyerFlow;

	return (
		<section className="lm-section">
			<div className="lm-section-label">How It Works</div>
			<h2 className="lm-section-title">A step-by-step user journey</h2>
			<p className="lm-section-sub">
				Whether you're listing an account or buying one, the process is seamless and protected at every step.
			</p>
			<div className="lm-tabs">
				<button
					className={`lm-tab ${tab === "seller" ? "active" : ""}`}
					onClick={() => setTab("seller")}
				>
					🧑‍💼 I'm a Seller
				</button>
				<button
					className={`lm-tab ${tab === "buyer" ? "active" : ""}`}
					onClick={() => setTab("buyer")}
				>
					🛒 I'm a Buyer
				</button>
			</div>
			<div key={tab} className="lm-flow-grid lm-tab-content">
				{flow.map((step) => (
					<FlowStep key={step.step} {...step} />
				))}
			</div>
		</section>
	);
};

// ─── FAQ Component ────────────────────────────────────────────────────────────
const faqs = [
	{
		q: "Is it safe to buy a social media account?",
		a: "Yes. Our escrow system holds the payment until the seller successfully transfers the account credentials. Our admin team monitors every transaction and verifies the handover before releasing funds.",
	},
	{
		q: "How do sellers get paid?",
		a: "Once the buyer confirms the account transfer, funds are released from escrow to your wallet. You can request a withdrawal anytime, and it processes within 1–2 business days.",
	},
	{
		q: "What platforms are supported?",
		a: "We currently support Instagram, YouTube, Twitter/X, Telegram, Facebook, and TikTok. We're constantly adding more platforms based on user demand.",
	},
	{
		q: "What is the difference between the pricing plans?",
		a: "The Free plan allows up to 5 listings. Basic (₹299/mo) allows 25 listings with advanced analytics. Premium (₹999/mo) gives unlimited listings, a verified badge, and zero commission on sales.",
	},
	{
		q: "Can I cancel my subscription anytime?",
		a: "Yes. You can downgrade to the Free plan at any time directly from your account settings. No lock-ins.",
	},
	{
		q: "How does credential verification work?",
		a: "After you submit a listing, our admin team reviews your account credentials and ownership proof before the listing goes live to ensure authenticity.",
	},
];

const FaqList = () => {
	const [open, setOpen] = useState(null);
	return (
		<div className="lm-faq-list">
			{faqs.map((faq, i) => (
				<div className="lm-faq-item" key={i}>
					<button
						className={`lm-faq-q ${open === i ? "open" : ""}`}
						onClick={() => setOpen(open === i ? null : i)}
					>
						{faq.q}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<line x1="12" y1="5" x2="12" y2="19" />
							<line x1="5" y1="12" x2="19" y2="12" />
						</svg>
					</button>
					<div className={`lm-faq-a ${open === i ? "show" : ""}`}>{faq.a}</div>
				</div>
			))}
		</div>
	);
};

export default LearnMore;
