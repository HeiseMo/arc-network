import { useState } from 'react';
import Navbar from '../components/Layout/Navbar';
import { BookOpen, Users, Target, Shield, Award, Clock, AlertTriangle, CheckCircle, XCircle, Trophy } from 'lucide-react';

export default function Handbook() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'roles', label: 'Roles', icon: Users },
    { id: 'reporting', label: 'Reporting', icon: Target },
    { id: 'hunting', label: 'Hunting', icon: Shield },
    { id: 'proof', label: 'Proof Standards', icon: CheckCircle },
    { id: 'reputation', label: 'Reputation', icon: Award },
    { id: 'timing', label: 'Active Periods', icon: Clock },
    { id: 'conduct', label: 'Code of Conduct', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="crt-frame-static p-6 mb-6 rust-accent">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <BookOpen className="w-8 h-8 text-orange-400" />
              <h1 className="text-3xl font-display font-bold text-orange-400 uppercase tracking-wider">
                [ BOUNTY HUNTER HANDBOOK ]
              </h1>
            </div>
            <p className="text-steel-light font-mono text-sm">
              &gt; OPERATIONAL GUIDELINES & PROTOCOLS
            </p>
            <div className="readout mt-2">
              CLEARANCE LEVEL: OPERATIVE // VERSION 1.0
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="crt-frame-static p-4 sticky top-4">
              <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-3 font-mono">
                [ SECTIONS ]
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 font-mono text-sm transition-all ${
                        activeSection === section.id
                          ? 'bg-orange-900/30 border-l-2 border-orange-500 text-orange-400'
                          : 'text-gray-400 hover:text-orange-400 hover:bg-orange-900/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{section.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="crt-frame-static p-6 space-y-6">
              {activeSection === 'overview' && <OverviewSection />}
              {activeSection === 'roles' && <RolesSection />}
              {activeSection === 'reporting' && <ReportingSection />}
              {activeSection === 'hunting' && <HuntingSection />}
              {activeSection === 'proof' && <ProofSection />}
              {activeSection === 'reputation' && <ReputationSection />}
              {activeSection === 'timing' && <TimingSection />}
              {activeSection === 'conduct' && <ConductSection />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-orange-400 uppercase tracking-wider font-mono border-b-2 border-orange-500/30 pb-2">
        Mission Overview
      </h2>
      
      <div className="card-weathered border-denim-600/30 p-4">
        <p className="text-gray-300 font-mono leading-relaxed">
          The Arc Raiders Bounty Hunter Network is a community-driven justice system designed to track, hunt, 
          and eliminate hostile players who disrupt operations. All operatives must adhere to these protocols 
          to maintain network integrity and reputation standing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-weathered border-orange-600/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-orange-400 uppercase text-sm font-mono">Purpose</h3>
          </div>
          <ul className="text-sm text-gray-300 space-y-1 font-mono">
            <li>&gt; Track hostile players</li>
            <li>&gt; Community-driven justice</li>
            <li>&gt; Fair play enforcement</li>
            <li>&gt; Competitive ecosystem</li>
          </ul>
        </div>

        <div className="card-weathered border-olive-600/30 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-olive-400" />
            <h3 className="font-bold text-olive-400 uppercase text-sm font-mono">Core Values</h3>
          </div>
          <ul className="text-sm text-gray-300 space-y-1 font-mono">
            <li>&gt; Honesty & accuracy</li>
            <li>&gt; Fair verification</li>
            <li>&gt; Professional conduct</li>
            <li>&gt; Community trust</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function RolesSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-400 uppercase tracking-wider font-mono border-b-2 border-orange-500/30 pb-2">
        Roles & Responsibilities
      </h2>

      {/* Reporter */}
      <div className="card-weathered border-orange-600/30 p-5">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-orange-400" />
          <h3 className="text-xl font-bold text-orange-400 uppercase font-mono">Reporter</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-bold text-green-400 uppercase mb-2 font-mono">✓ Responsibilities</h4>
            <ul className="text-sm text-gray-300 space-y-1 font-mono">
              <li>• Provide accurate target info</li>
              <li>• Upload legitimate proof</li>
              <li>• Set appropriate periods</li>
              <li>• Review claims fairly</li>
              <li>• Award reputation</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-red-400 uppercase mb-2 font-mono">✗ Restrictions</h4>
            <ul className="text-sm text-gray-300 space-y-1 font-mono">
              <li>• Cannot claim own bounties</li>
              <li>• Cannot spam duplicates</li>
              <li>• Cannot falsify information</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hunter */}
      <div className="card-weathered border-denim-600/30 p-5">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-denim-400" />
          <h3 className="text-xl font-bold text-denim-400 uppercase font-mono">Hunter</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-bold text-green-400 uppercase mb-2 font-mono">✓ Responsibilities</h4>
            <ul className="text-sm text-gray-300 space-y-1 font-mono">
              <li>• Join target's session</li>
              <li>• Confirm kills with proof</li>
              <li>• Submit accurate data</li>
              <li>• Professional conduct</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-red-400 uppercase mb-2 font-mono">✗ Restrictions</h4>
            <ul className="text-sm text-gray-300 space-y-1 font-mono">
              <li>• Cannot hunt wrong sessions</li>
              <li>• Cannot submit fake proof</li>
              <li>• Cannot claim unconfirmed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportingSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-400 uppercase tracking-wider font-mono border-b-2 border-orange-500/30 pb-2">
        Bounty Reporting Rules
      </h2>

      <div className="card-weathered border-red-600/30 p-5">
        <h3 className="text-sm font-bold text-red-400 uppercase mb-3 font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Mandatory Information
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-orange-400 font-mono text-sm font-bold">1. SESSION ID</p>
            <p className="text-gray-400 text-sm font-mono">Format: XXXXX-XXXXX-XXXXX (case-sensitive)</p>
          </div>
          <div>
            <p className="text-orange-400 font-mono text-sm font-bold">2. TARGET NAME</p>
            <p className="text-gray-400 text-sm font-mono">Exact killer's username (min 3 chars)</p>
          </div>
          <div>
            <p className="text-orange-400 font-mono text-sm font-bold">3. LAST LOCATION</p>
            <p className="text-gray-400 text-sm font-mono">Specific area/landmark on map</p>
          </div>
        </div>
      </div>

      <div className="card-weathered border-olive-600/30 p-5">
        <h3 className="text-sm font-bold text-olive-400 uppercase mb-3 font-mono">
          Optional but Recommended
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="text-sm">
            <p className="text-orange-400 font-mono font-bold">Time Left</p>
            <p className="text-gray-400 font-mono">Minutes remaining (0-300)</p>
          </div>
          <div className="text-sm">
            <p className="text-orange-400 font-mono font-bold">Description</p>
            <p className="text-gray-400 font-mono">Context & tactics</p>
          </div>
          <div className="text-sm">
            <p className="text-orange-400 font-mono font-bold">Reward Offer</p>
            <p className="text-gray-400 font-mono">Items/credits/services</p>
          </div>
          <div className="text-sm">
            <p className="text-orange-400 font-mono font-bold">Visual Proof</p>
            <p className="text-gray-400 font-mono">Screenshot/video (10MB max)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HuntingSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-400 uppercase tracking-wider font-mono border-b-2 border-orange-500/30 pb-2">
        Hunter Engagement Protocols
      </h2>

      <div className="space-y-4">
        {[
          {
            phase: 'Phase 1: Target Acquisition',
            color: 'orange',
            steps: [
              'Browse active bounties in feed',
              'Identify targets in your session',
              'Note time left (if available)',
              'Check active period'
            ]
          },
          {
            phase: 'Phase 2: Session Entry',
            color: 'denim',
            steps: [
              'Join EXACT session from listing',
              'Verify target is present',
              'Begin tracking',
              'Maintain session awareness'
            ]
          },
          {
            phase: 'Phase 3: Engagement',
            color: 'rust',
            steps: [
              'Locate using last known location',
              'Engage in fair combat only',
              'No teaming in solo modes',
              'No exploits or cheats'
            ]
          },
          {
            phase: 'Phase 4: Confirmation',
            color: 'olive',
            steps: [
              'Screenshot kill feed',
              'Note exact session ID',
              'Click CLAIM BOUNTY',
              'Upload proof immediately',
              'Wait for approval'
            ]
          }
        ].map((phase, idx) => (
          <div key={idx} className={`card-weathered border-${phase.color}-600/30 p-4`}>
            <h3 className={`text-sm font-bold text-${phase.color}-400 uppercase mb-2 font-mono`}>
              {phase.phase}
            </h3>
            <ul className="space-y-1">
              {phase.steps.map((step, i) => (
                <li key={i} className="text-sm text-gray-300 font-mono">
                  {i + 1}. {step}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProofSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-400 uppercase tracking-wider font-mono border-b-2 border-orange-500/30 pb-2">
        Proof & Verification Standards
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Acceptable */}
        <div className="card-weathered border-green-600/30 p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h3 className="text-sm font-bold text-green-400 uppercase font-mono">Acceptable Proof</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-300 font-mono">
            <li>✓ Kill feed visible</li>
            <li>✓ Target name clear</li>
            <li>✓ Your username visible</li>
            <li>✓ Session ID shown</li>
            <li>✓ Timestamp visible</li>
            <li>✓ High quality image</li>
          </ul>
        </div>

        {/* Unacceptable */}
        <div className="card-weathered border-red-600/30 p-5">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-bold text-red-400 uppercase font-mono">Unacceptable Proof</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-300 font-mono">
            <li>✗ Blurry/illegible</li>
            <li>✗ Photoshopped</li>
            <li>✗ Wrong session</li>
            <li>✗ Practice matches</li>
            <li>✗ Team kills</li>
            <li>✗ Old screenshots</li>
          </ul>
        </div>
      </div>

      <div className="card-weathered border-orange-600/30 p-5">
        <h3 className="text-sm font-bold text-orange-400 uppercase mb-3 font-mono">Verification Process</h3>
        <div className="flex items-center gap-2 text-sm font-mono text-gray-300 flex-wrap">
          <span>Reporter Reviews</span>
          <span className="text-orange-400">→</span>
          <span>Check Session</span>
          <span className="text-orange-400">→</span>
          <span>Verify Quality</span>
          <span className="text-orange-400">→</span>
          <span>Confirm Identity</span>
          <span className="text-orange-400">→</span>
          <span className="text-green-400">[APPROVE]</span>
          <span>or</span>
          <span className="text-red-400">[REJECT]</span>
        </div>
        <div className="mt-3 pt-3 border-t border-orange-500/30">
          <p className="text-sm font-mono text-gray-300">
            <span className="text-green-400 font-bold">APPROVAL:</span> +10 REP (Hunter) / +5 REP (Reporter)
          </p>
          <p className="text-sm font-mono text-gray-300 mt-1">
            <span className="text-red-400 font-bold">REJECTION:</span> Proof removed, bounty stays active
          </p>
        </div>
      </div>
    </div>
  );
}

function ReputationSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-400 uppercase tracking-wider font-mono border-b-2 border-orange-500/30 pb-2">
        Reputation System
      </h2>

      <div className="card-weathered border-orange-600/30 p-5">
        <h3 className="text-sm font-bold text-orange-400 uppercase mb-3 font-mono">Earning Reputation</h3>
        <div className="space-y-2">
          {[
            { action: 'Bounty Confirmed', rep: '+10', role: 'Hunter' },
            { action: 'Bounty Verified', rep: '+5', role: 'Reporter' },
            { action: 'First Bounty Posted', rep: '+2', role: 'Reporter' },
            { action: 'Community Endorsement', rep: '+1', role: 'Any' }
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm font-mono p-2 bg-denim-dark/30 border border-steel-600">
              <span className="text-gray-300">{item.action}</span>
              <span className="text-green-400 font-bold">{item.rep}</span>
              <span className="text-gray-500">{item.role}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card-weathered border-rust-600/30 p-5">
        <h3 className="text-sm font-bold text-rust-400 uppercase mb-3 font-mono">Reputation Tiers</h3>
        <div className="space-y-3">
          {[
            { tier: 'NOVICE', range: '0-49', bars: '□□□□□' },
            { tier: 'OPERATIVE', range: '50-149', bars: '■■□□□' },
            { tier: 'SPECIALIST', range: '150-299', bars: '■■■□□' },
            { tier: 'ELITE', range: '300-499', bars: '■■■■□' },
            { tier: 'LEGENDARY', range: '500+', bars: '■■■■■' }
          ].map((tier, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm font-mono">
              <span className="text-orange-400 font-bold w-32">{tier.tier}</span>
              <span className="text-gray-400">[{tier.range}]</span>
              <span className="text-orange-400 font-mono">{tier.bars}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card-weathered border-red-600/30 p-5">
        <h3 className="text-sm font-bold text-red-400 uppercase mb-3 font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Reputation Loss
        </h3>
        <ul className="space-y-1 text-sm text-gray-300 font-mono">
          <li>• False report: <span className="text-red-400">-25 REP</span></li>
          <li>• Fake proof: <span className="text-red-400">-15 REP</span></li>
          <li>• Harassment: <span className="text-red-400">-50 REP</span></li>
          <li>• Multiple violations: <span className="text-red-400">SUSPENSION</span></li>
        </ul>
      </div>
    </div>
  );
}

function TimingSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-400 uppercase tracking-wider font-mono border-b-2 border-orange-500/30 pb-2">
        Active Period Guidelines
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {[
          {
            period: '24 HOURS',
            color: 'orange',
            icon: '⏱️',
            useWhen: ['Target in your session', 'Time-sensitive revenge', 'High-urgency threat'],
            pros: ['Quick turnaround', 'Focused effort', 'Immediate response'],
            cons: ['May expire fast', 'Limited window']
          },
          {
            period: '1 WEEK',
            color: 'denim',
            icon: '📅',
            useWhen: ['Standard bounty', 'Target plays frequently', 'Moderate urgency'],
            pros: ['Balanced duration', 'Good participation', 'Sufficient time'],
            cons: ['Not instant', 'May be forgotten']
          },
          {
            period: 'UNLIMITED',
            color: 'olive',
            icon: '∞',
            useWhen: ['Persistent problem', 'Major grievance', 'No rush'],
            pros: ['Never expires', 'Always available', 'Community time'],
            cons: ['Lower urgency', 'May clutter feed']
          }
        ].map((item, idx) => (
          <div key={idx} className={`card-weathered border-${item.color}-600/30 p-5`}>
            <h3 className={`text-lg font-bold text-${item.color}-400 uppercase mb-3 font-mono flex items-center gap-2`}>
              <span>{item.icon}</span>
              {item.period}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-orange-400 font-mono font-bold mb-1">USE WHEN:</p>
                <ul className="space-y-1 text-gray-300 font-mono">
                  {item.useWhen.map((u, i) => <li key={i}>• {u}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-green-400 font-mono font-bold mb-1">PROS:</p>
                <ul className="space-y-1 text-gray-300 font-mono">
                  {item.pros.map((p, i) => <li key={i}>✓ {p}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-red-400 font-mono font-bold mb-1">CONS:</p>
                <ul className="space-y-1 text-gray-300 font-mono">
                  {item.cons.map((c, i) => <li key={i}>✗ {c}</li>)}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConductSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-orange-400 uppercase tracking-wider font-mono border-b-2 border-orange-500/30 pb-2">
        Code of Conduct
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: 'Honesty', icon: CheckCircle, items: ['Report accurate info', 'Submit legitimate proof', 'Honor agreements'] },
          { title: 'Fair Play', icon: Shield, items: ['No exploits/cheats', 'No teaming violations', 'No harassment'] },
          { title: 'Respect', icon: Users, items: ['Professional communication', 'Accept fair rejections', 'No toxic behavior'] },
          { title: 'Sportsmanship', icon: Trophy, items: ['Accept defeats', 'Congratulate hunters', 'No revenge posting'] }
        ].map((rule, idx) => {
          const Icon = rule.icon;
          return (
            <div key={idx} className="card-weathered border-olive-600/30 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-5 h-5 text-olive-400" />
                <h3 className="font-bold text-olive-400 uppercase text-sm font-mono">{rule.title}</h3>
              </div>
              <ul className="space-y-1 text-sm text-gray-300 font-mono">
                {rule.items.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="card-weathered border-red-600/30 p-5">
        <h3 className="text-sm font-bold text-red-400 uppercase mb-3 font-mono flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Violation Levels
        </h3>
        <div className="space-y-3">
          {[
            { level: 'Level 1 - Minor', penalty: 'Warning + guidance', examples: ['Incomplete info', 'Poor proof quality'] },
            { level: 'Level 2 - Moderate', penalty: '-10 to -25 REP + 24h suspension', examples: ['Duplicate posts', 'Session mismatch'] },
            { level: 'Level 3 - Major', penalty: '-50 REP + 7-day suspension', examples: ['False reporting', 'Fake proof'] },
            { level: 'Level 4 - Critical', penalty: 'PERMANENT BAN', examples: ['Repeated violations', 'Doxxing/threats'] }
          ].map((violation, idx) => (
            <div key={idx} className="p-3 bg-denim-dark/30 border-l-2 border-red-500">
              <p className="text-red-400 font-mono font-bold text-sm">{violation.level}</p>
              <p className="text-gray-400 font-mono text-xs mt-1">Penalty: {violation.penalty}</p>
              <p className="text-gray-500 font-mono text-xs mt-1">
                Examples: {violation.examples.join(', ')}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="card-weathered border-orange-600/30 p-5 bg-orange-900/10">
        <h3 className="text-sm font-bold text-orange-400 uppercase mb-3 font-mono">Remember</h3>
        <ul className="space-y-2 text-sm text-gray-300 font-mono">
          <li>🎯 Hunt with honor</li>
          <li>📸 Proof is paramount</li>
          <li>⚖️ Fairness over vengeance</li>
          <li>🤝 Community over ego</li>
          <li>🏆 Reputation is earned</li>
        </ul>
      </div>
    </div>
  );
}
