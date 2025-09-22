import React, { useMemo, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Clock, Tag, ChevronRight, MapPin, AlertTriangle, Play, Pause, SkipForward, SkipBack, Volume2, Filter, ChevronDown } from 'lucide-react';
import { TopBanner } from './TopBanner';
import { CallerTranscriptPanel } from './CallerTranscriptPanel';
import { FlightRefundOptionsPanel } from './FlightRefundOptionsPanel';
import { AICoPilotPanel } from './AICoPilotPanel';
import audioFile from '../../Eleven labs audio.mp3';
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
    text: "Hi, I'm calling about my flight AA1234 from Chicago to New York that was cancelled.",
    timestamp: "14:32:15"
  }],
  sentiment: 0.85,
  intent: ["Rebooking", "Information"],
  likelihood: "85% likely to accept rebooking",
  suggestions: ["Acknowledge cancellation", "Offer rebooking options", "Check waiver eligibility"],
  caseNotes: ["Flight AA1234 ORD-LGA cancelled due to weather", "Customer seeking rebooking"]
}, {
  location: "Chicago, IL",
  event: "Winter Storm Alert - ORD Operations Suspended",
  transcript: [{
    speaker: "Customer",
    text: "Hi, I'm calling about my flight AA1234 from Chicago to New York that was cancelled.",
    timestamp: "14:32:15"
  }],
  sentiment: 0.88,
  intent: ["Rebooking", "Urgency", "Same-day travel"],
  likelihood: "70% likely to accept JFK option",
  suggestions: ["Offer same-day alternatives", "Check JFK availability", "Mention waiver policy"],
  caseNotes: ["Flight AA1234 ORD-LGA cancelled due to weather", "Customer seeking rebooking", "Urgent same-day travel needed"]
}, {
  location: "Chicago, IL",
  event: "Winter Storm Alert - ORD Operations Suspended",
  transcript: [{
    speaker: "Customer",
    text: "Hi, I'm calling about my flight AA1234 from Chicago to New York that was cancelled.",
    timestamp: "14:32:15"
  }],
  sentiment: 0.92,
  intent: ["Rebooking", "Cost inquiry", "Acceptance"],
  likelihood: "95% likely to accept 6:15 PM JFK flight",
  suggestions: ["Confirm no change fee due to waiver", "Process rebooking", "Offer seat selection"],
  caseNotes: ["Flight AA1234 ORD-LGA cancelled due to weather", "Customer seeking rebooking", "Urgent same-day travel needed", "Interested in 6:15 PM JFK flight"]
}, {
  location: "Chicago, IL",
  event: "Winter Storm Alert - ORD Operations Suspended",
  transcript: [{
    speaker: "Customer",
    text: "Hi, I'm calling about my flight AA1234 from Chicago to New York that was cancelled.",
    timestamp: "14:32:15"
  }],
  sentiment: 0.96,
  intent: ["Rebooking", "Confirmation", "No change fee"],
  likelihood: "Rebooking confirmed: 6:15 PM to JFK",
  suggestions: ["Send confirmation email/SMS", "Assist with seat selection", "Offer a goodwill gesture"],
  caseNotes: [
    "Rebooked to DL1456 ORD-JFK at 6:15 PM",
    "No change fee applied under weather waiver",
    "Confirmation to be sent to customer"
  ]
}] as any[];

// Dummy email data for the Update tab
const DUMMY_EMAILS = [
  {
    id: 1,
    from: "notifications@aa.com",
    subject: "Flight Delay Notification - AA1234",
    timestamp: "2024-01-15 13:45",
    content: "Dear Valued Customer,\n\nWe regret to inform you that your flight AA1234 scheduled to depart from Chicago O'Hare (ORD) to New York LaGuardia (LGA) at 3:30 PM has been delayed due to severe winter weather conditions affecting the Chicago area.\n\nNew estimated departure time: 6:15 PM\nReason: Winter storm with heavy snow and strong winds\nCurrent status: Aircraft de-icing in progress\n\nWe apologize for any inconvenience this may cause and appreciate your patience during these challenging weather conditions.\n\nBest regards,\nAmerican Airlines Customer Service",
    category: "delay",
    summary: "Flight AA1234 delayed from 3:30 PM to 6:15 PM due to winter storm conditions in Chicago. Aircraft currently undergoing de-icing procedures.",
    resolution: "This delay occurred due to severe winter weather conditions with heavy snow and strong winds at Chicago O'Hare. Your new departure time is 6:15 PM today. The aircraft is currently undergoing mandatory de-icing procedures for safety. We recommend arriving at the gate 30 minutes before the new departure time."
  },
  {
    id: 2,
    from: "alerts@aa.com",
    subject: "Weather Advisory - ORD Operations Update",
    timestamp: "2024-01-15 12:30",
    content: "WEATHER ADVISORY - CHICAGO O'HARE INTERNATIONAL AIRPORT\n\nEffective immediately, Chicago O'Hare Airport is experiencing significant operational impacts due to a major winter storm system.\n\nCurrent Conditions:\n- Heavy snowfall: 2-3 inches per hour\n- Wind gusts: 35-45 mph\n- Visibility: Less than 1/4 mile\n- Temperature: 15°F (-9°C)\n\nAirport Status:\n- Runways: 2 of 8 operational\n- Ground stop in effect until 5:00 PM\n- De-icing operations ongoing\n\nPassengers are advised to check flight status before departing for the airport. Rebooking options are available without change fees for affected flights.\n\nStay safe and warm,\nAmerican Airlines Operations Center",
    category: "weather",
    summary: "Major winter storm impacting ORD operations. Only 2 of 8 runways operational, ground stop until 5 PM. Heavy snow and low visibility affecting all flights.",
    resolution: "Due to the severe winter storm, Chicago O'Hare has limited operations until 5:00 PM. We recommend checking your flight status before heading to the airport. Rebooking options are available without change fees. Consider staying warm indoors and monitor updates through our app or website."
  },
  {
    id: 3,
    from: "rebooking@aa.com",
    subject: "Rebooking Options Available - No Change Fees",
    timestamp: "2024-01-15 14:20",
    content: "Hello,\n\nDue to the weather-related disruptions at Chicago O'Hare, we want to make your rebooking process as smooth as possible.\n\nAvailable Options for AA1234 passengers:\n\n1. Same-day flights to LGA:\n   - UAL1456 departing 6:15 PM (Limited seats)\n   - UAL1678 departing 8:30 PM (Good availability)\n\n2. Alternative airports:\n   - Flights to JFK: Multiple options available\n   - Flights to EWR: Evening departures available\n\n3. Next-day options:\n   - Multiple morning departures with full availability\n\nAll rebooking options are available with no change fees due to the weather waiver policy. You can rebook online, through our mobile app, or by calling our customer service line.\n\nWe're here to help get you to your destination safely.\n\nAmerican Airlines Customer Relations",
    category: "rebooking",
    summary: "Multiple rebooking options available for AA1234 passengers. Same-day alternatives to LGA, JFK, and EWR. No change fees apply due to weather waiver.",
    resolution: "We have several options to get you to New York today: UAL1456 at 6:15 PM to LGA (limited seats) or UAL1678 at 8:30 PM to LGA. Alternative airports include JFK and Newark with multiple evening departures. All changes are free due to weather waiver. Book online, via our app, or call customer service to secure your preferred option."
  },
  {
    id: 4,
    from: "notifications@aa.com",
    subject: "Flight Cancellation - AA1234 ORD to LGA",
    timestamp: "2024-01-15 15:45",
    content: "Dear Customer,\n\nWe regret to inform you that flight AA1234 from Chicago O'Hare (ORD) to New York LaGuardia (LGA) originally scheduled for January 15, 2024, has been cancelled due to continued severe weather conditions.\n\nCancellation Details:\n- Original flight: AA1234, January 15, 3:30 PM departure\n- Reason: Winter storm - unsafe operating conditions\n- Airport closure: Extended ground stop at ORD\n\nImmediate Actions:\n1. Full refund automatically processed (5-7 business days)\n2. Rebooking options available at no additional cost\n3. Hotel accommodations available for stranded passengers\n4. Meal vouchers provided for delays over 3 hours\n\nRecommended Alternatives:\n- UAL1456 departing tomorrow at 7:30 AM\n- UAL1892 departing tomorrow at 11:15 AM\n- Alternative airports: JFK and EWR options available\n\nWe sincerely apologize for this disruption to your travel plans and appreciate your understanding during these exceptional circumstances.\n\nAmerican Airlines Operations",
    category: "cancellation",
    summary: "AA1234 cancelled due to severe weather and unsafe conditions. Full refund processing, rebooking options available. Hotel and meal accommodations provided.",
    resolution: "Your flight was cancelled due to unsafe weather conditions for passenger safety. You have three options: 1) Full refund (processed in 5-7 days), 2) Rebook on UAL1456 tomorrow at 7:30 AM or UAL1892 at 11:15 AM, or 3) Consider JFK/EWR alternatives. We'll provide hotel accommodation and meals if you're stranded overnight. Contact us to arrange your preferred solution."
  },
  {
    id: 5,
    from: "compensation@aa.com",
    subject: "Travel Disruption Compensation - Your Rights",
    timestamp: "2024-01-15 16:30",
    content: "Dear Valued Customer,\n\nWe understand that flight disruptions can significantly impact your travel plans, and we want to ensure you're aware of your rights and the compensation available to you.\n\nFor Weather-Related Cancellations:\n✓ Full refund or rebooking at no additional cost\n✓ Hotel accommodations (if stranded overnight)\n✓ Meal vouchers for extended delays\n✓ Ground transportation to/from hotel\n✓ Priority rebooking on next available flight\n\nAdditional Goodwill Gestures:\n- $200 travel credit for future American Airlines flights\n- Complimentary upgrade on your rebooked flight (subject to availability)\n- Expedited baggage handling\n- Access to Admirals Club lounges during extended waits\n\nYour Passenger Rights:\n- Right to full refund within 24 hours of request\n- Right to rebooking without additional fees\n- Right to accommodation during overnight delays\n- Right to timely communication about flight status\n\nTo claim your compensation or discuss your options, please contact our customer relations team at 1-800-433-7300 or visit aa.com/feedback.\n\nThank you for your patience and continued loyalty.\n\nAmerican Airlines Customer Relations Team",
    category: "compensation",
    summary: "Comprehensive compensation package for weather disruption including $200 travel credit, hotel accommodation, meals, and priority rebooking. Full passenger rights outlined.",
    resolution: "As compensation for this weather disruption, you'll receive: $200 travel credit for future American Airlines flights, complimentary upgrade on your rebooked flight (when available), hotel and meal accommodations, and expedited baggage handling. To claim your compensation, call 1-800-433-7300 or visit aa.com/feedback. Your satisfaction is our priority."
  },
  {
    id: 6,
    from: "notifications@aa.com",
    subject: "Flight Delay Notification - AA2567 ORD to LAX",
    timestamp: "2024-01-15 11:15",
    content: "Dear Valued Customer,\n\nWe regret to inform you that your flight AA2567 scheduled to depart from Chicago O'Hare (ORD) to Los Angeles International (LAX) at 2:45 PM has been delayed due to severe winter weather conditions affecting the Chicago area.\n\nNew estimated departure time: 5:30 PM\nReason: Winter storm causing ground delays and aircraft de-icing requirements\nCurrent status: Awaiting runway clearance\n\nFlight Details:\n- Original departure: 2:45 PM CST\n- New departure: 5:30 PM CST\n- Estimated arrival: 7:15 PM PST (originally 4:30 PM PST)\n- Gate: B12\n\nWe apologize for any inconvenience this may cause to your travel plans. Complimentary snacks and beverages will be available at the gate.\n\nBest regards,\nAmerican Airlines Customer Service",
    category: "delay",
    summary: "Flight AA2567 to Los Angeles delayed from 2:45 PM to 5:30 PM due to winter weather. Ground delays and de-icing procedures causing extended wait times.",
    resolution: "Your flight to Los Angeles is delayed by 2 hours and 45 minutes due to severe winter weather in Chicago. The new departure time is 5:30 PM CST, arriving at 7:15 PM PST. Please remain near gate B12 for updates. Complimentary refreshments are available while you wait."
  },
  {
    id: 7,
    from: "rebooking@aa.com",
    subject: "Alternative Flight Options - AA8901 ORD to MIA",
    timestamp: "2024-01-15 09:30",
    content: "Hello,\n\nDue to the ongoing winter weather disruptions at Chicago O'Hare, your flight AA8901 to Miami International Airport (MIA) scheduled for 1:20 PM departure has been impacted.\n\nCurrent Status: Delayed until further notice\nReason: Crew scheduling conflicts due to weather-related delays\n\nAlternative Options Available:\n\n1. Same-day alternatives:\n   - AA8903 departing 7:45 PM (confirmed seats available)\n   - UA1205 departing 8:20 PM (partner airline, no change fee)\n\n2. Next-day options:\n   - AA8901 rescheduled to tomorrow 6:30 AM\n   - AA8905 departing tomorrow 12:15 PM\n\n3. Routing alternatives:\n   - Connect via Dallas (DFW): AA1234 + AA5678\n   - Connect via Charlotte (CLT): AA2345 + AA6789\n\nAll rebooking options are available with no change fees due to weather waiver policy. Hotel accommodations available for overnight stays.\n\nTo confirm your preferred option, please visit our rebooking counter at Terminal 3 or call 1-800-433-7300.\n\nThank you for your patience,\nAmerican Airlines Rebooking Team",
    category: "rebooking",
    summary: "AA8901 to Miami delayed indefinitely due to crew scheduling issues from weather. Multiple same-day and next-day alternatives available with no change fees.",
    resolution: "Your Miami flight is delayed due to crew scheduling conflicts caused by weather disruptions. Best options: 1) AA8903 tonight at 7:45 PM, 2) Original flight rescheduled to tomorrow 6:30 AM, or 3) Connecting flights via Dallas or Charlotte. All changes are free under weather waiver. Hotel provided if you choose tomorrow's option."
  },
  {
    id: 8,
    from: "alerts@aa.com",
    subject: "Flight Cancellation - AA4432 ORD to DEN",
    timestamp: "2024-01-15 14:50",
    content: "FLIGHT CANCELLATION NOTICE\n\nDear Customer,\n\nWe regret to inform you that flight AA4432 from Chicago O'Hare (ORD) to Denver International Airport (DEN) scheduled for January 15, 2024, at 4:15 PM has been cancelled.\n\nCancellation Details:\n- Flight: AA4432 ORD-DEN\n- Scheduled departure: 4:15 PM CST\n- Reason: Aircraft mechanical issue discovered during pre-flight inspection\n- Safety priority: Unable to secure replacement aircraft in time\n\nImmediate Rebooking Options:\n\n1. Tonight's alternatives:\n   - UA892 departing 6:30 PM (partner airline, 2 seats left)\n   - F91205 departing 8:45 PM (Frontier, budget option)\n\n2. Tomorrow's options:\n   - AA4432 rescheduled to 7:00 AM\n   - AA4434 departing 11:30 AM\n   - AA4436 departing 3:20 PM\n\nCompensation Available:\n- Full refund (processed within 24 hours)\n- $300 travel voucher for future flights\n- Hotel accommodation if overnight stay required\n- Ground transportation to/from hotel\n- Priority boarding on rebooked flight\n\nTo process your rebooking or refund, please visit our service desk at Terminal 3, Level 2, or contact our dedicated rebooking line at 1-800-433-7300.\n\nWe sincerely apologize for this disruption and appreciate your understanding.\n\nAmerican Airlines Operations Team",
    category: "cancellation",
    summary: "AA4432 to Denver cancelled due to aircraft mechanical issue. Multiple rebooking options available tonight and tomorrow. $300 travel voucher offered as compensation.",
    resolution: "Your Denver flight was cancelled due to a safety-related mechanical issue that couldn't be resolved in time. Options: 1) Tonight on UA892 at 6:30 PM or Frontier at 8:45 PM, 2) Tomorrow's AA flights at 7:00 AM, 11:30 AM, or 3:20 PM, or 3) Full refund. You'll receive a $300 travel voucher plus hotel/meals if staying overnight."
  }
];

// Helper functions for email filtering
const extractDestinationsFromEmail = (email: any) => {
  const subject = email.subject.toLowerCase();
  const content = email.content.toLowerCase();
  
  // Extract from/to information from subject and content
  let from = '';
  let to = '';
  
  // Check for Chicago origins
  if (subject.includes('ord') || content.includes("chicago o'hare") || content.includes('chicago')) {
    from = 'chicago';
  }
  
  // Check for destinations
  if (subject.includes('lga') || subject.includes('jfk') || subject.includes('ewr') || 
      content.includes('new york') || content.includes('laguardia') || content.includes('newark')) {
    to = 'new york';
  } else if (subject.includes('lax') || content.includes('los angeles')) {
    to = 'los angeles';
  } else if (subject.includes('mia') || content.includes('miami')) {
    to = 'miami';
  } else if (subject.includes('den') || content.includes('denver')) {
    to = 'denver';
  }
  
  return { from, to };
};

const getUniqueDestinations = (emails: any[], type: 'from' | 'to') => {
  const destinations = new Set<string>();
  emails.forEach(email => {
    const { from, to } = extractDestinationsFromEmail(email);
    if (type === 'from' && from) destinations.add(from);
    if (type === 'to' && to) destinations.add(to);
  });
  return Array.from(destinations).sort();
};

// @component: AgentAssistApp
export const AgentAssistApp = () => {
  const [currentTurn, setCurrentTurn] = useState(0);
  const [callData, setCallData] = useState<CallData>(MOCK_CALL_PROGRESSION[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'update'>('overview');
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);
  const [pnrProvided, setPnrProvided] = useState(false);
  const [showPnrInput, setShowPnrInput] = useState(false);
  const [pnrValue, setPnrValue] = useState('');
  const [submittedPnr, setSubmittedPnr] = useState('');
  const [autoAgentMessageShown, setAutoAgentMessageShown] = useState(false);
  
  // Email filter states
  const [fromFilter, setFromFilter] = useState<string>('all');
  const [toFilter, setToFilter] = useState<string>('all');
  
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioSrc, setAudioSrc] = useState(audioFile);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Auto agent message after 5 seconds for Play 1 (only if PNR not already provided)
  React.useEffect(() => {
    if (currentTurn === 0 && activeTab === 'overview' && !autoAgentMessageShown && !pnrProvided) {
      const timer = setTimeout(() => {
        const agentMessage = {
          speaker: "Agent",
          text: "I'm sorry to hear about your cancelled flight. Could you please provide me with your PNR number?",
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
        };
        
        setCallData(prev => ({
          ...prev,
          transcript: [...prev.transcript, agentMessage]
        }));
        setShowPnrInput(true);
        setAutoAgentMessageShown(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [currentTurn, activeTab, autoAgentMessageShown, pnrProvided]);
  
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

  // Get unique destinations for filter dropdowns
  const fromDestinations = useMemo(() => getUniqueDestinations(DUMMY_EMAILS, 'from'), []);
  const toDestinations = useMemo(() => getUniqueDestinations(DUMMY_EMAILS, 'to'), []);

  // Filter emails based on selected from/to destinations
  const filteredEmails = useMemo(() => {
    return DUMMY_EMAILS.filter(email => {
      const { from, to } = extractDestinationsFromEmail(email);
      
      const fromMatch = fromFilter === 'all' || from === fromFilter;
      const toMatch = toFilter === 'all' || to === toFilter;
      
      return fromMatch && toMatch;
    });
  }, [fromFilter, toFilter]);

  // Auto-select first email when switching to update tab or filters change
  React.useEffect(() => {
    if (activeTab === 'update' && selectedEmail === null && filteredEmails.length > 0) {
      setSelectedEmail(filteredEmails[0].id);
    }
  }, [activeTab, selectedEmail, filteredEmails]);
  
  // PNR handling functions
  const handlePnrSubmit = () => {
    if (pnrValue.trim()) {
      const customerMessage = {
        speaker: "Customer",
        text: `My PNR is ${pnrValue}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
      };
      
      const agentVerifiedMessage = {
        speaker: "Agent",
        text: "Verified. Thank you for providing your PNR. I can see your booking details now.",
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
      };
      
      setCallData(prev => ({
        ...prev,
        transcript: [...prev.transcript, customerMessage, agentVerifiedMessage]
      }));
      
      setSubmittedPnr(pnrValue);
      setPnrProvided(true);
      setShowPnrInput(false);
    }
  };

  const handlePnrKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePnrSubmit();
    }
  };

  // Manual progression controls (no autoplay)
  const playTurn = (turnIndex: number) => {
    const idx = Math.max(0, Math.min(MOCK_CALL_PROGRESSION.length - 1, turnIndex));
    setCurrentTurn(idx);
    
    let updatedCallData = MOCK_CALL_PROGRESSION[idx];
    
    // If PNR has been provided, replace the original conversation with PNR conversation
    if (pnrProvided && submittedPnr) {
      const transcript = [...updatedCallData.transcript];
      
      // Keep only the first customer message, then add PNR conversation, then continue with remaining messages
      const firstCustomerMessage = transcript[0];
      const remainingMessages = transcript.slice(1);
      
      const pnrMessages = [
        {
          speaker: "Agent",
          text: "I'm sorry to hear about your cancelled flight. Could you please provide me with your PNR number?",
          timestamp: "18:39:56"
        },
        {
          speaker: "Customer", 
          text: `My PNR is ${submittedPnr}`,
          timestamp: "18:40:01"
        },
        {
          speaker: "Agent",
          text: "Verified. Thank you for providing your PNR. I can see your booking details now.",
          timestamp: "18:40:01"
        }
      ];
      
      // For Play 2, 3, 4 - add the remaining original messages after PNR conversation
      let newTranscript = [firstCustomerMessage, ...pnrMessages];
      if (idx > 0) {
        newTranscript = [...newTranscript, ...remainingMessages];
      }
      
      updatedCallData = {
        ...updatedCallData,
        transcript: newTranscript
      };
    }
    
    setCallData(updatedCallData);
    
    // Reset states for Play 1, but maintain PNR verification for other plays
    if (idx === 0) {
      // If PNR is already provided, don't reset autoAgentMessageShown to prevent duplicate messages
      if (!pnrProvided) {
        setAutoAgentMessageShown(false);
      }
      setShowPnrInput(false);
      setPnrValue('');
      // Don't reset submittedPnr and pnrProvided - keep them for persistence
    } else {
      // For Play 2, 3, 4 - if PNR was already provided, keep it verified
      if (pnrProvided) {
        setShowPnrInput(false);
      }
    }
  };
  const playNext = () => {
    playTurn(currentTurn + 1);
  };
  const handleSendConfirmation = () => {
    // Simulate sending confirmation
    console.log('Confirmation sent');
  };

  // Audio player functions
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      console.log('Audio loaded successfully, duration:', audioRef.current.duration);
    }
  };

  const handleAudioError = (e: any) => {
    console.error('Audio failed to load:', e);
    console.error('Audio source:', audioSrc);
    
    // Try fallback to public directory
    if (audioSrc === audioFile) {
      console.log('Trying fallback path...');
      setAudioSrc('/Eleven labs audio.mp3');
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // @return
  return <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopBanner />
      
      {/* Tab Navigation with Location Info */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-none mx-auto px-8">
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
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-6 gap-6 p-6 max-w-none mx-auto w-full px-8">
            <motion.div className="lg:col-span-2" initial={{
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
          <CallerTranscriptPanel 
            transcript={callData.transcript} 
            sentiment={callData.sentiment} 
            intent={callData.intent} 
            likelihood={callData.likelihood}
            pnrProvided={pnrProvided}
            showPnrInput={showPnrInput}
            pnrValue={pnrValue}
            setPnrValue={setPnrValue}
            onPnrSubmit={handlePnrSubmit}
            onPnrKeyPress={handlePnrKeyPress}
          />
        </motion.div>

            <motion.div className="lg:col-span-2" initial={{
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

            <motion.div className="lg:col-span-2" initial={{
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
            highlightFlightId={currentTurn >= 2 ? 'ual1456' : null}
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
        <div className="max-w-none mx-auto flex items-center justify-between px-8">
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
        <div className="flex-1 p-6 max-w-none mx-auto w-full px-8">
          {/* Header with Audio Player on Right */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1"></div>
            
            {/* Compact Audio Player - Right Side */}
            <motion.div 
              className="bg-white rounded-md shadow-sm border border-slate-200 px-2 py-1 w-64"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 flex-1 min-w-0">
                  <Volume2 className="w-2 h-2 text-slate-500 flex-shrink-0" />
                  <span className="text-xs text-slate-700 truncate">Updates for the Day</span>
                </div>
                
                {/* Compact Controls */}
                <div className="flex items-center gap-0.5 ml-2">
                  <button
                    onClick={skipBackward}
                    className="p-0.5 rounded hover:bg-slate-100 transition-colors"
                    title="Skip backward 10s"
                  >
                    <SkipBack className="w-2 h-2 text-slate-500" />
                  </button>
                  
                  <button
                    onClick={togglePlay}
                    className="p-0.5 bg-blue-600 hover:bg-blue-700 rounded text-white transition-colors"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="w-2 h-2" />
                    ) : (
                      <Play className="w-2 h-2" />
                    )}
                  </button>
                  
                  <button
                    onClick={skipForward}
                    className="p-0.5 rounded hover:bg-slate-100 transition-colors"
                    title="Skip forward 10s"
                  >
                    <SkipForward className="w-2 h-2 text-slate-500" />
                  </button>
                  
                  <span className="text-xs text-slate-400 ml-1 text-xs">
                    {formatTime(currentTime)}
                  </span>
                </div>
              </div>
              
              {/* Audio Element */}
              <audio
                ref={audioRef}
                src={audioSrc}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                onError={handleAudioError}
                preload="metadata"
              />
              
              {/* Ultra Compact Progress Bar */}
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-0.5 bg-slate-200 rounded appearance-none cursor-pointer mt-0.5"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #e2e8f0 ${(currentTime / duration) * 100}%, #e2e8f0 100%)`
                }}
              />
            </motion.div>
          </div>

          {/* Row Container for Flight Updates and Email Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel - Flight Communication Updates */}
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
              <p className="text-sm text-slate-500 mt-1">Recent emails regarding flight communications</p>
              
              {/* Filter Controls */}
              <div className="flex items-center gap-4 mt-4 p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Filter by:</span>
                </div>
                
                {/* From Filter */}
                <div className="relative">
                  <select
                    value={fromFilter}
                    onChange={(e) => setFromFilter(e.target.value)}
                    className="appearance-none bg-white border border-slate-300 rounded-md px-3 py-1.5 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Origins</option>
                    {fromDestinations.map(dest => (
                      <option key={dest} value={dest}>
                        {dest.charAt(0).toUpperCase() + dest.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                </div>
                
                <span className="text-sm text-slate-500">to</span>
                
                {/* To Filter */}
                <div className="relative">
                  <select
                    value={toFilter}
                    onChange={(e) => setToFilter(e.target.value)}
                    className="appearance-none bg-white border border-slate-300 rounded-md px-3 py-1.5 pr-8 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Destinations</option>
                    {toDestinations.map(dest => (
                      <option key={dest} value={dest}>
                        {dest.charAt(0).toUpperCase() + dest.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                </div>
                
                {/* Clear Filters Button */}
                {(fromFilter !== 'all' || toFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setFromFilter('all');
                      setToFilter('all');
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Clear filters
                  </button>
                )}
                
                {/* Results Count */}
                <span className="text-xs text-slate-500 ml-auto">
                  {filteredEmails.length} email{filteredEmails.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {filteredEmails.map((email) => (
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
        </div>
      )}
    </div>;
};
