import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Clock, Tag, ChevronRight, MapPin, AlertTriangle } from 'lucide-react';
import { TopBanner } from './TopBanner';
import { CallerTranscriptPanel } from './CallerTranscriptPanel';
import { FlightRefundOptionsPanel } from './FlightRefundOptionsPanel';
import { AICoPilotPanel } from './AICoPilotPanel';
interface CallData {
  location: string;
  event: string;
  transcript: Array<{
    speaker: string;
    text: string;
    timestamp: string;
  }>;
  sentiment: number;
  intent: string[];
  likelihood: string;
  suggestions: string[];
  caseNotes: string[];
}
const MOCK_CALL_PROGRESSION = [{
  location: "Chicago, IL",
  event: "Winter Storm Alert - ORD Operations Suspended",
  transcript: [{
    speaker: "Customer",
    text: "Hi, I'm calling about my flight UA1234 from Chicago to New York that was cancelled.",
    timestamp: "14:32:15"
  }],
  sentiment: 0.3,
  intent: ["Rebooking", "Information"],
  likelihood: "85% likely to accept rebooking",
  suggestions: ["Acknowledge cancellation", "Offer rebooking options", "Check waiver eligibility"],
  caseNotes: ["Flight UA1234 ORD-LGA cancelled due to weather", "Customer seeking rebooking"]
}, {
  location: "Chicago, IL",
  event: "Winter Storm Alert - ORD Operations Suspended",
  transcript: [{
    speaker: "Customer",
    text: "Hi, I'm calling about my flight UA1234 from Chicago to New York that was cancelled.",
    timestamp: "14:32:15"
  }, {
    speaker: "Agent",
    text: "I'm sorry to hear about your cancelled flight. Let me check your options for rebooking.",
    timestamp: "14:32:45"
  }, {
    speaker: "Customer",
    text: "I really need to get to New York today for an important meeting.",
    timestamp: "14:33:10"
  }],
  sentiment: 0.2,
  intent: ["Rebooking", "Urgency", "Same-day travel"],
  likelihood: "70% likely to accept JFK option",
  suggestions: ["Offer same-day alternatives", "Check JFK availability", "Mention waiver policy"],
  caseNotes: ["Flight UA1234 ORD-LGA cancelled due to weather", "Customer seeking rebooking", "Urgent same-day travel needed"]
}, {
  location: "Chicago, IL",
  event: "Winter Storm Alert - ORD Operations Suspended",
  transcript: [{
    speaker: "Customer",
    text: "Hi, I'm calling about my flight UA1234 from Chicago to New York that was cancelled.",
    timestamp: "14:32:15"
  }, {
    speaker: "Agent",
    text: "I'm sorry to hear about your cancelled flight. Let me check your options for rebooking.",
    timestamp: "14:32:45"
  }, {
    speaker: "Customer",
    text: "I really need to get to New York today for an important meeting.",
    timestamp: "14:33:10"
  }, {
    speaker: "Agent",
    text: "I understand the urgency. I can see flights to JFK departing at 6:15 PM and 8:30 PM today.",
    timestamp: "14:33:35"
  }, {
    speaker: "Customer",
    text: "The 6:15 PM would work perfectly. Is there any additional cost?",
    timestamp: "14:34:00"
  }],
  sentiment: 0.6,
  intent: ["Rebooking", "Cost inquiry", "Acceptance"],
  likelihood: "95% likely to accept 6:15 PM JFK flight",
  suggestions: ["Confirm no change fee due to waiver", "Process rebooking", "Offer seat selection"],
  caseNotes: ["Flight UA1234 ORD-LGA cancelled due to weather", "Customer seeking rebooking", "Urgent same-day travel needed", "Interested in 6:15 PM JFK flight"]
}, {
  location: "Chicago, IL",
  event: "Winter Storm Alert - ORD Operations Suspended",
  transcript: [{
    speaker: "Customer",
    text: "Hi, I'm calling about my flight UA1234 from Chicago to New York that was cancelled.",
    timestamp: "14:32:15"
  }, {
    speaker: "Agent",
    text: "I'm sorry to hear about your cancelled flight. Let me check your options for rebooking.",
    timestamp: "14:32:45"
  }, {
    speaker: "Customer",
    text: "I really need to get to New York today for an important meeting.",
    timestamp: "14:33:10"
  }, {
    speaker: "Agent",
    text: "I understand the urgency. I can see flights to JFK departing at 6:15 PM and 8:30 PM today.",
    timestamp: "14:33:35"
  }, {
    speaker: "Customer",
    text: "The 6:15 PM would work perfectly. Is there any additional cost?",
    timestamp: "14:34:00"
  }, {
    speaker: "Agent",
    text: "Great news—there are no additional costs due to the weather waiver. I'll book you on the 6:15 PM to JFK now and send the updated confirmation to your email.",
    timestamp: "14:34:20"
  }],
  sentiment: 0.9,
  intent: ["Rebooking", "Confirmation", "No change fee"],
  likelihood: "Rebooking confirmed: 6:15 PM to JFK",
  suggestions: ["Send confirmation email/SMS", "Assist with seat selection", "Offer a goodwill gesture"],
  caseNotes: [
    "Rebooked to UA1456 ORD-JFK at 6:15 PM",
    "No change fee applied under weather waiver",
    "Confirmation to be sent to customer"
  ]
}] as any[];

// Dummy email data for the Update tab
const DUMMY_EMAILS = [
  {
    id: 1,
    from: "notifications@united.com",
    subject: "Flight Delay Notification - UA1234",
    timestamp: "2024-01-15 13:45",
    content: "Dear Valued Customer,\n\nWe regret to inform you that your flight UA1234 scheduled to depart from Chicago O'Hare (ORD) to New York LaGuardia (LGA) at 3:30 PM has been delayed due to severe winter weather conditions affecting the Chicago area.\n\nNew estimated departure time: 6:15 PM\nReason: Winter storm with heavy snow and strong winds\nCurrent status: Aircraft de-icing in progress\n\nWe apologize for any inconvenience this may cause and appreciate your patience during these challenging weather conditions.\n\nBest regards,\nUnited Airlines Customer Service",
    category: "delay",
    summary: "Flight UA1234 delayed from 3:30 PM to 6:15 PM due to winter storm conditions in Chicago. Aircraft currently undergoing de-icing procedures.",
    resolution: "This delay occurred due to severe winter weather conditions with heavy snow and strong winds at Chicago O'Hare. Your new departure time is 6:15 PM today. The aircraft is currently undergoing mandatory de-icing procedures for safety. We recommend arriving at the gate 30 minutes before the new departure time."
  },
  {
    id: 2,
    from: "alerts@united.com",
    subject: "Weather Advisory - ORD Operations Update",
    timestamp: "2024-01-15 12:30",
    content: "WEATHER ADVISORY - CHICAGO O'HARE INTERNATIONAL AIRPORT\n\nEffective immediately, Chicago O'Hare Airport is experiencing significant operational impacts due to a major winter storm system.\n\nCurrent Conditions:\n- Heavy snowfall: 2-3 inches per hour\n- Wind gusts: 35-45 mph\n- Visibility: Less than 1/4 mile\n- Temperature: 15°F (-9°C)\n\nAirport Status:\n- Runways: 2 of 8 operational\n- Ground stop in effect until 5:00 PM\n- De-icing operations ongoing\n\nPassengers are advised to check flight status before departing for the airport. Rebooking options are available without change fees for affected flights.\n\nStay safe and warm,\nUnited Operations Center",
    category: "weather",
    summary: "Major winter storm impacting ORD operations. Only 2 of 8 runways operational, ground stop until 5 PM. Heavy snow and low visibility affecting all flights.",
    resolution: "Due to the severe winter storm, Chicago O'Hare has limited operations until 5:00 PM. We recommend checking your flight status before heading to the airport. Rebooking options are available without change fees. Consider staying warm indoors and monitor updates through our app or website."
  },
  {
    id: 3,
    from: "rebooking@united.com",
    subject: "Rebooking Options Available - No Change Fees",
    timestamp: "2024-01-15 14:20",
    content: "Hello,\n\nDue to the weather-related disruptions at Chicago O'Hare, we want to make your rebooking process as smooth as possible.\n\nAvailable Options for UA1234 passengers:\n\n1. Same-day flights to LGA:\n   - UA1456 departing 6:15 PM (Limited seats)\n   - UA1678 departing 8:30 PM (Good availability)\n\n2. Alternative airports:\n   - Flights to JFK: Multiple options available\n   - Flights to EWR: Evening departures available\n\n3. Next-day options:\n   - Multiple morning departures with full availability\n\nAll rebooking options are available with no change fees due to the weather waiver policy. You can rebook online, through our mobile app, or by calling our customer service line.\n\nWe're here to help get you to your destination safely.\n\nUnited Customer Relations",
    category: "rebooking",
    summary: "Multiple rebooking options available for UA1234 passengers. Same-day alternatives to LGA, JFK, and EWR. No change fees apply due to weather waiver.",
    resolution: "We have several options to get you to New York today: UA1456 at 6:15 PM to LGA (limited seats) or UA1678 at 8:30 PM to LGA. Alternative airports include JFK and Newark with multiple evening departures. All changes are free due to weather waiver. Book online, via our app, or call customer service to secure your preferred option."
  },
  {
    id: 4,
    from: "notifications@united.com",
    subject: "Flight Cancellation - UA1234 ORD to LGA",
    timestamp: "2024-01-15 15:45",
    content: "Dear Customer,\n\nWe regret to inform you that flight UA1234 from Chicago O'Hare (ORD) to New York LaGuardia (LGA) originally scheduled for January 15, 2024, has been cancelled due to continued severe weather conditions.\n\nCancellation Details:\n- Original flight: UA1234, January 15, 3:30 PM departure\n- Reason: Winter storm - unsafe operating conditions\n- Airport closure: Extended ground stop at ORD\n\nImmediate Actions:\n1. Full refund automatically processed (5-7 business days)\n2. Rebooking options available at no additional cost\n3. Hotel accommodations available for stranded passengers\n4. Meal vouchers provided for delays over 3 hours\n\nRecommended Alternatives:\n- UA1456 departing tomorrow at 7:30 AM\n- UA1892 departing tomorrow at 11:15 AM\n- Alternative airports: JFK and EWR options available\n\nWe sincerely apologize for this disruption to your travel plans and appreciate your understanding during these exceptional circumstances.\n\nUnited Airlines Operations",
    category: "cancellation",
    summary: "UA1234 cancelled due to severe weather and unsafe conditions. Full refund processing, rebooking options available. Hotel and meal accommodations provided.",
    resolution: "Your flight was cancelled due to unsafe weather conditions for passenger safety. You have three options: 1) Full refund (processed in 5-7 days), 2) Rebook on UA1456 tomorrow at 7:30 AM or UA1892 at 11:15 AM, or 3) Consider JFK/EWR alternatives. We'll provide hotel accommodation and meals if you're stranded overnight. Contact us to arrange your preferred solution."
  },
  {
    id: 5,
    from: "compensation@united.com",
    subject: "Travel Disruption Compensation - Your Rights",
    timestamp: "2024-01-15 16:30",
    content: "Dear Valued Customer,\n\nWe understand that flight disruptions can significantly impact your travel plans, and we want to ensure you're aware of your rights and the compensation available to you.\n\nFor Weather-Related Cancellations:\n✓ Full refund or rebooking at no additional cost\n✓ Hotel accommodations (if stranded overnight)\n✓ Meal vouchers for extended delays\n✓ Ground transportation to/from hotel\n✓ Priority rebooking on next available flight\n\nAdditional Goodwill Gestures:\n- $200 travel credit for future United flights\n- Complimentary upgrade on your rebooked flight (subject to availability)\n- Expedited baggage handling\n- Access to United Club lounges during extended waits\n\nYour Passenger Rights:\n- Right to full refund within 24 hours of request\n- Right to rebooking without additional fees\n- Right to accommodation during overnight delays\n- Right to timely communication about flight status\n\nTo claim your compensation or discuss your options, please contact our customer relations team at 1-800-UNITED-1 or visit united.com/feedback.\n\nThank you for your patience and continued loyalty.\n\nUnited Customer Relations Team",
    category: "compensation",
    summary: "Comprehensive compensation package for weather disruption including $200 travel credit, hotel accommodation, meals, and priority rebooking. Full passenger rights outlined.",
    resolution: "As compensation for this weather disruption, you'll receive: $200 travel credit for future United flights, complimentary upgrade on your rebooked flight (when available), hotel and meal accommodations, and expedited baggage handling. To claim your compensation, call 1-800-UNITED-1 or visit united.com/feedback. Your satisfaction is our priority."
  }
];

// @component: AgentAssistApp
export const AgentAssistApp = () => {
  const [currentTurn, setCurrentTurn] = useState(0);
  const [callData, setCallData] = useState<CallData>(MOCK_CALL_PROGRESSION[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'update'>('overview');
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);

  // Auto-select first email when switching to update tab
  React.useEffect(() => {
    if (activeTab === 'update' && selectedEmail === null) {
      setSelectedEmail(1); // Select the first email (ID: 1)
    }
  }, [activeTab, selectedEmail]);
  
  // Derive per-turn script snippets for AI Co-Pilot
  const scriptsForTurn = useMemo(() => {
    switch (currentTurn) {
      case 0:
        return [
          { id: 'empathy-1', title: 'Acknowledge Frustration', content: 'I completely understand how frustrating this must be, especially with your important meeting.', category: 'empathy' },
          { id: 'solution-1', title: 'Offer Alternatives', content: 'Let me check available options to get you to New York as soon as possible today.', category: 'solution' },
          { id: 'policy-1', title: 'Explain Waiver', content: "Due to the weather disruption, we’re waiving all change fees for rebooking to any available flight.", category: 'policy' },
        ];
      case 1:
        return [
          { id: 'empathy-2', title: 'Acknowledge Urgency', content: 'I hear the urgency—let’s aim to get you there today.', category: 'empathy' },
          { id: 'solution-2', title: 'Same‑day Options', content: 'I’ll search same‑day flights, including JFK and alternate airports if needed.', category: 'solution' },
          { id: 'policy-2', title: 'Waiver Coverage', content: 'The weather waiver lets us rebook you today without a change fee.', category: 'policy' },
        ];
      case 2:
        return [
          { id: 'solution-3', title: 'Present Options', content: 'I can see departures to JFK at 6:15 PM and 8:30 PM today—does 6:15 PM work?', category: 'solution' },
          { id: 'policy-3', title: 'Fees Clarification', content: 'There should be no additional cost due to the weather waiver.', category: 'policy' },
          { id: 'solution-4', title: 'Seat Assistance', content: 'I can also assist with seat selection once we confirm your flight.', category: 'solution' },
        ];
      case 3:
        return [
          { id: 'solution-5', title: 'Confirm Rebooking', content: 'I’ll book you on the 6:15 PM to JFK and send the confirmation now.', category: 'solution' },
          { id: 'policy-4', title: 'No Change Fee', content: 'There is no additional cost—change fees are waived for this disruption.', category: 'policy' },
          { id: 'solution-6', title: 'Follow‑up + Goodwill', content: 'I’ll share your confirmation via email/SMS and can add a goodwill gesture for the inconvenience.', category: 'solution' },
        ];
      default:
        return [] as any[];
    }
  }, [currentTurn]);
  // Manual progression controls (no autoplay)
  const playTurn = (turnIndex: number) => {
    const idx = Math.max(0, Math.min(MOCK_CALL_PROGRESSION.length - 1, turnIndex));
    setCurrentTurn(idx);
    setCallData(MOCK_CALL_PROGRESSION[idx]);
  };
  const playNext = () => {
    playTurn(currentTurn + 1);
  };
  const handleSendConfirmation = () => {
    // Simulate sending confirmation
    console.log('Confirmation sent');
  };

  // @return
  return <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopBanner />
      
      {/* Tab Navigation with Location Info */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Left side - Tabs */}
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                OVERVIEW
              </button>
              <button
                onClick={() => setActiveTab('update')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'update'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                UPDATE
              </button>
            </div>
            
            {/* Right side - Location and Event Info */}
            <div className="flex items-center space-x-6 py-4">
              <motion.div className="flex items-center space-x-2" initial={{
                opacity: 0,
                x: 10
              }} animate={{
                opacity: 1,
                x: 0
              }} transition={{
                delay: 0.2
              }}>
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium text-slate-600">
                  <span>Location:</span>
                </span>
                <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  <span>{callData.location}</span>
                </span>
              </motion.div>

              <motion.div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg px-3 py-1" initial={{
                opacity: 0,
                scale: 0.95
              }} animate={{
                opacity: 1,
                scale: 1
              }} transition={{
                delay: 0.3
              }}>
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-xs font-semibold text-red-700">
                  <span>{callData.event}</span>
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto w-full">
            <motion.div className="lg:col-span-1" initial={{
              opacity: 0,
              x: -20
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.5
            }}>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {MOCK_CALL_PROGRESSION.map((_, idx) => (
                <button
                  key={`turn-${idx}`}
                  onClick={() => playTurn(idx)}
                  className={`px-3 py-1 rounded-md text-sm font-medium border ${
                    idx === currentTurn
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Play {idx + 1}
                </button>
              ))}
            </div>
            <button
              onClick={playNext}
              disabled={currentTurn >= MOCK_CALL_PROGRESSION.length - 1}
              className={`px-3 py-1 rounded-md text-sm font-medium border ${
                currentTurn >= MOCK_CALL_PROGRESSION.length - 1
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              Next
            </button>
          </div>
          <CallerTranscriptPanel transcript={callData.transcript} sentiment={callData.sentiment} intent={callData.intent} likelihood={callData.likelihood} />
        </motion.div>

            <motion.div className="lg:col-span-1" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.5,
              delay: 0.1
            }}>
          <AICoPilotPanel suggestions={callData.suggestions} scripts={scriptsForTurn as any} />
        </motion.div>

            <motion.div className="lg:col-span-1" initial={{
              opacity: 0,
              x: 20
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.5,
              delay: 0.2
            }}>
          <FlightRefundOptionsPanel
            filterArrival={currentTurn >= 1 ? 'JFK' : null}
            highlightFlightId={currentTurn >= 2 ? 'ua1456' : null}
          />
            </motion.div>
          </div>

          <motion.div className="bg-white border-t border-slate-200 p-4" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.3
          }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">
              <span>Interaction Summary</span>
            </h3>
            <div className="text-sm text-slate-600 space-y-1">
              {callData.caseNotes.map((note, index) => <div key={`note-${index}`} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>{note}</span>
                </div>)}
            </div>
          </div>
          <motion.button onClick={handleSendConfirmation} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors" whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.98
        }}>
            <span>Send Confirmation</span>
          </motion.button>
        </div>
          </motion.div>
        </>
      )}

      {/* Update Tab Content - Email Interface */}
      {activeTab === 'update' && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-w-7xl mx-auto w-full">
          {/* Left Panel - Email List */}
          <motion.div 
            className="bg-white rounded-lg shadow-sm border border-slate-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Flight Communication Updates
              </h3>
              <p className="text-sm text-slate-500 mt-1">Recent emails regarding UA1234</p>
            </div>
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {DUMMY_EMAILS.map((email) => (
                <motion.div
                  key={email.id}
                  className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 ${
                    selectedEmail === email.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedEmail(email.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          email.category === 'delay' ? 'bg-yellow-100 text-yellow-800' :
                          email.category === 'cancellation' ? 'bg-red-100 text-red-800' :
                          email.category === 'weather' ? 'bg-blue-100 text-blue-800' :
                          email.category === 'rebooking' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          <Tag className="w-3 h-3 mr-1" />
                          {email.category}
                        </span>
                        <div className="flex items-center text-xs text-slate-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {email.timestamp}
                        </div>
                      </div>
                      <h4 className="font-medium text-slate-900 truncate">{email.subject}</h4>
                      <p className="text-sm text-slate-600 truncate">{email.from}</p>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${
                      selectedEmail === email.id ? 'rotate-90' : ''
                    }`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Panel - Email Summary */}
          <motion.div 
            className="bg-white rounded-lg shadow-sm border border-slate-200"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {selectedEmail ? (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800">Email Summary</h3>
                  <p className="text-sm text-slate-500 mt-1">AI-generated summary and key points</p>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  {(() => {
                    const email = DUMMY_EMAILS.find(e => e.id === selectedEmail);
                    if (!email) return null;
                    
                    return (
                      <div className="space-y-4">
                        {/* Email Header Info */}
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="font-medium text-slate-700">From:</span>
                              <p className="text-slate-600">{email.from}</p>
                            </div>
                            <div>
                              <span className="font-medium text-slate-700">Time:</span>
                              <p className="text-slate-600">{email.timestamp}</p>
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium text-slate-700">Subject:</span>
                              <p className="text-slate-600">{email.subject}</p>
                            </div>
                          </div>
                        </div>

                        {/* AI Summary */}
                        <div>
                          <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Quick Summary
                          </h4>
                          <p className="text-slate-700 leading-relaxed bg-blue-50 p-3 rounded-lg">
                            {email.summary}
                          </p>
                        </div>

                        {/* Customer Resolution */}
                        <div>
                          <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            Resolution for Customer
                          </h4>
                          <p className="text-slate-700 leading-relaxed bg-emerald-50 p-3 rounded-lg border-l-4 border-emerald-400">
                            {email.resolution}
                          </p>
                        </div>

                        {/* Category Badge */}
                        <div>
                          <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Category
                          </h4>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            email.category === 'delay' ? 'bg-yellow-100 text-yellow-800' :
                            email.category === 'cancellation' ? 'bg-red-100 text-red-800' :
                            email.category === 'weather' ? 'bg-blue-100 text-blue-800' :
                            email.category === 'rebooking' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {email.category.toUpperCase()}
                          </span>
                        </div>

                        {/* Full Email Content */}
                        <div>
                          <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            Full Email Content
                          </h4>
                          <div className="bg-slate-50 p-4 rounded-lg">
                            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                              {email.content}
                            </pre>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-8">
                <div>
                  <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-slate-600 mb-2">Select an Email</h4>
                  <p className="text-slate-500">Choose an email from the left panel to view its summary and details</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>;
};
