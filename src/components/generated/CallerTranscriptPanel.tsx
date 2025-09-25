import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Headphones, TrendingUp, TrendingDown, Minus, Tag, Target, CheckCircle, Send } from 'lucide-react';
interface TranscriptEntry {
  speaker: string;
  text: string;
  timestamp: string;
}
interface CallerTranscriptPanelProps {
  transcript: TranscriptEntry[];
  sentiment: number;
  intent: string[];
  likelihood: string;
  pnrProvided?: boolean;
  showPnrInput?: boolean;
  pnrValue?: string;
  setPnrValue?: (value: string) => void;
  onPnrSubmit?: () => void;
  onPnrKeyPress?: (e: React.KeyboardEvent) => void;
}
const SENTIMENT_CONFIG = {
  positive: {
    color: 'text-green-600',
    bg: 'bg-green-100',
    icon: TrendingUp
  },
  neutral: {
    color: 'text-yellow-600',
    bg: 'bg-yellow-100',
    icon: Minus
  },
  negative: {
    color: 'text-red-600',
    bg: 'bg-red-100',
    icon: TrendingDown
  }
};
const INTENT_COLORS = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-green-100 text-green-700', 'bg-orange-100 text-orange-700', 'bg-pink-100 text-pink-700'];

// @component: CallerTranscriptPanel
export const CallerTranscriptPanel = ({
  transcript,
  sentiment,
  intent,
  likelihood,
  pnrProvided = false,
  showPnrInput = false,
  pnrValue = '',
  setPnrValue,
  onPnrSubmit,
  onPnrKeyPress
}: CallerTranscriptPanelProps) => {
  // Keep transcript scrolled within its own container without shifting the page
  const containerRef = useRef<HTMLDivElement>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'auto' });
  }, [transcript]);
  const getSentimentConfig = () => {
    if (sentiment > 0.5) return SENTIMENT_CONFIG.positive;
    if (sentiment < 0.3) return SENTIMENT_CONFIG.negative;
    return SENTIMENT_CONFIG.neutral;
  };
  const sentimentConfig = getSentimentConfig();
  const SentimentIcon = sentimentConfig.icon;

  // @return
  return <div className="bg-white rounded-xl shadow-lg border border-slate-200 h-full flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          <span>Live Transcript & AI Insights</span>
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
          <motion.div className={`${sentimentConfig.bg} rounded-lg p-4`} initial={{
          opacity: 0,
          scale: 0.95
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.3
        }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <SentimentIcon className={`w-5 h-5 ${sentimentConfig.color}`} />
                <span className={`text-sm font-medium ${sentimentConfig.color}`}>
                  <span>Agent Behaviour</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-white rounded-full h-2">
                  <motion.div className={`h-2 rounded-full ${sentiment > 0.5 ? 'bg-green-500' : sentiment < 0.3 ? 'bg-red-500' : 'bg-yellow-500'}`} initial={{
                  width: 0
                }} animate={{
                  width: `${sentiment * 100}%`
                }} transition={{
                  duration: 0.5
                }} />
                </div>
                <span className={`text-sm font-semibold ${sentimentConfig.color}`}>
                  <span>{Math.round(sentiment * 100)}%</span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* Agent Behaviour Attributes */}
          <motion.div
            className="bg-slate-50 rounded-lg p-4 border border-slate-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              Agent Behaviour Attributes
            </h4>
            <div className="space-y-2">
              {[
                { name: 'Listen Actively', percentage: 92 },
                { name: 'Understanding the issue', percentage: 88 },
                { name: 'Conveying Interest and Empathy', percentage: 95 },
                { name: 'Control the conversation', percentage: 85 },
                { name: 'Offers appropriate ancillary offers', percentage: 85 },
                { name: 'Comply with regulatory requirements', percentage: 96 }
              ].map((attribute, index) => (
                <motion.div
                  key={attribute.name}
                  className="flex items-center justify-between space-x-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      attribute.percentage >= 90 ? 'bg-green-500' : 
                      attribute.percentage >= 80 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}></div>
                    <span className="text-sm text-slate-700">{attribute.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-slate-200 rounded-full h-1.5">
                      <motion.div 
                        className={`h-1.5 rounded-full ${
                          attribute.percentage >= 90 ? 'bg-green-500' : 
                          attribute.percentage >= 80 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${attribute.percentage}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                      />
                    </div>
                    <span className={`text-xs font-semibold min-w-[2rem] text-right ${
                      attribute.percentage >= 90 ? 'text-green-600' : 
                      attribute.percentage >= 80 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {attribute.percentage}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div className="space-y-3" initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.3,
          delay: 0.2
        }}>
            <h3 className="text-sm font-medium text-slate-700 mb-2">Verification Checklist</h3>
            <div className="grid grid-cols-2 gap-2">
              {['VERIFY PNR', 'CHECK TICKET DETAILS', 'CHECK COMMENTS', 'CHECK TRAVEL HISTORY'].map((item, index) => (
                <motion.div 
                  key={item}
                  className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors ${
                    pnrProvided 
                      ? 'bg-green-50 border border-green-200 hover:bg-green-100' 
                      : 'bg-slate-50 border border-slate-200'
                  }`}
                  initial={{
                    opacity: 0,
                    x: -10
                  }}
                  animate={{
                    opacity: 1,
                    x: 0
                  }}
                  transition={{
                    duration: 0.3,
                    delay: pnrProvided ? 0.3 + (index * 0.2) : 0.3
                  }}
                  whileHover={pnrProvided ? {
                    scale: 1.02
                  } : {}}
                  whileTap={pnrProvided ? {
                    scale: 0.98
                  } : {}}
                >
                  {pnrProvided ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 0.3 + (index * 0.2),
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </motion.div>
                  ) : (
                    <div className="w-4 h-4 border-2 border-slate-300 rounded-full" />
                  )}
                  <span className={`text-xs font-medium ${
                    pnrProvided ? 'text-green-800' : 'text-slate-500'
                  }`}>
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Tag className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">
                <span>Intent Tags</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {intent.map((tag, index) => <motion.span key={`intent-${index}`} className={`px-3 py-1 rounded-full text-xs font-medium ${INTENT_COLORS[index % INTENT_COLORS.length]}`} initial={{
                opacity: 0,
                scale: 0.8
              }} animate={{
                opacity: 1,
                scale: 1
              }} exit={{
                opacity: 0,
                scale: 0.8
              }} transition={{
                duration: 0.2,
                delay: index * 0.1
              }}>
                    <span>{tag}</span>
                  </motion.span>)}
              </AnimatePresence>
            </div>
          </div>

          <motion.div className="bg-blue-50 rounded-lg p-3" initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.3
        }}>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                <span>Likelihood</span>
              </span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              <span>{likelihood}</span>
            </p>
          </motion.div>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          <AnimatePresence>
            {transcript.map((entry, index) => <motion.div key={`transcript-${index}`} className={`flex items-start space-x-3 ${entry.speaker === 'Customer' ? 'flex-row' : 'flex-row-reverse'}`} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.4,
            delay: index * 0.1
          }}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${entry.speaker === 'Customer' ? 'bg-slate-100' : 'bg-blue-100'}`}>
                  {entry.speaker === 'Customer' ? <User className="w-4 h-4 text-slate-600" /> : <Headphones className="w-4 h-4 text-blue-600" />}
                </div>
                <div className={`flex-1 ${entry.speaker === 'Customer' ? 'text-left' : 'text-right'}`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium text-slate-500">
                      <span>{entry.speaker}</span>
                    </span>
                    <span className="text-xs text-slate-400">
                      <span>{entry.timestamp}</span>
                    </span>
                  </div>
                  <div className={`inline-block max-w-xs lg:max-w-sm p-3 rounded-lg ${entry.speaker === 'Customer' ? 'bg-slate-100 text-slate-800' : 'bg-blue-600 text-white'}`}>
                    <p className="text-sm">
                      <span>{entry.text}</span>
                    </p>
                  </div>
                </div>
              </motion.div>)}
          </AnimatePresence>
          
          {/* PNR Input Field */}
          {showPnrInput && (
            <motion.div 
              className="flex items-center space-x-3 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-100">
                <User className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={pnrValue}
                  onChange={(e) => setPnrValue && setPnrValue(e.target.value)}
                  onKeyPress={onPnrKeyPress}
                  placeholder="Enter your PNR number..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  onClick={onPnrSubmit}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={!pnrValue?.trim()}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
          
          <div ref={transcriptEndRef} />
        </div>
      </div>
    </div>;
};
