import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Lightbulb, MessageSquare, Gift, Copy, CheckCircle, Zap, Star, ChevronDown, ChevronUp } from 'lucide-react';
interface AICoPilotPanelProps {
  suggestions: string[];
  scripts?: ScriptSnippet[];
}
interface ScriptSnippet {
  id: string;
  title: string;
  content: string;
  category: 'empathy' | 'solution' | 'policy';
}
interface GoodwillOffer {
  id: string;
  type: string;
  value: string;
  description: string;
  icon: React.ElementType;
}
const DEFAULT_SCRIPT_SNIPPETS: ScriptSnippet[] = [{
  id: 'empathy-1',
  title: 'Acknowledge Frustration',
  content: "I completely understand how frustrating this situation must be, especially with your important meeting.",
  category: 'empathy'
}, {
  id: 'solution-1',
  title: 'Offer Alternative',
  content: "Let me check our available options to get you to New York as soon as possible today.",
  category: 'solution'
}, {
  id: 'policy-1',
  title: 'Explain Waiver',
  content: "Due to the weather disruption, we're waiving all change fees for rebooking to any available flight.",
  category: 'policy'
}, {
  id: 'solution-2',
  title: 'Seat Selection',
  content: "I can also help you select your preferred seat at no additional charge due to the disruption.",
  category: 'solution'
}];
const GOODWILL_OFFERS: GoodwillOffer[] = [{
  id: 'miles-500',
  type: 'Miles',
  value: '500 Miles',
  description: 'Apologetic gesture for inconvenience',
  icon: Star
}, {
  id: 'voucher-100',
  type: 'Voucher',
  value: '$100 Voucher',
  description: 'Future travel credit',
  icon: Gift
}, {
  id: 'upgrade',
  type: 'Upgrade',
  value: 'Complimentary Upgrade',
  description: 'Subject to availability',
  icon: Zap
}];
const CATEGORY_COLORS = {
  empathy: 'bg-purple-100 text-purple-700 border-purple-200',
  solution: 'bg-blue-100 text-blue-700 border-blue-200',
  policy: 'bg-green-100 text-green-700 border-green-200'
};

// @component: AICoPilotPanel
export const AICoPilotPanel = ({
  suggestions,
  scripts
}: AICoPilotPanelProps) => {
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [selectedGoodwill, setSelectedGoodwill] = useState<string | null>(null);
  const [showGoodwillOffers, setShowGoodwillOffers] = useState<boolean>(false);
  const handleCopyScript = (scriptId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedScript(scriptId);
    setTimeout(() => setCopiedScript(null), 2000);
  };
  const handleSelectGoodwill = (offerId: string) => {
    setSelectedGoodwill(offerId);
    setTimeout(() => setSelectedGoodwill(null), 3000);
  };
  const toggleGoodwillOffers = () => {
    setShowGoodwillOffers(!showGoodwillOffers);
  };

  // @return
  return <div className="bg-white rounded-xl shadow-lg border border-slate-200 h-full flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              <span>AI Co-Pilot</span>
            </h2>
            <p className="text-sm text-slate-600">
              <span>Smart suggestions & assistance</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }}>
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-slate-800">
                <span>Next Best Actions</span>
              </h3>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {suggestions.map((suggestion, index) => <motion.div key={`suggestion-${index}`} className="bg-amber-50 border border-amber-200 rounded-lg p-3 hover:bg-amber-100 transition-colors cursor-pointer" initial={{
                opacity: 0,
                x: -20
              }} animate={{
                opacity: 1,
                x: 0
              }} exit={{
                opacity: 0,
                x: 20
              }} transition={{
                duration: 0.3,
                delay: index * 0.1
              }} whileHover={{
                scale: 1.02
              }}>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-amber-700">
                          <span>{index + 1}</span>
                        </span>
                      </div>
                      <p className="text-sm text-amber-800 flex-1">
                        <span>{suggestion}</span>
                      </p>
                    </div>
                  </motion.div>)}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }}>
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-slate-800">
                <span>Script Snippets</span>
              </h3>
            </div>
            <div className="space-y-3">
              {(scripts ?? DEFAULT_SCRIPT_SNIPPETS).map((script, index) => <motion.div key={script.id} className={`border rounded-lg p-4 hover:shadow-md transition-all ${CATEGORY_COLORS[script.category]}`} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: index * 0.1
            }}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">
                      <span>{script.title}</span>
                    </h4>
                    <motion.button onClick={() => handleCopyScript(script.id, script.content)} className="p-1 hover:bg-white/50 rounded transition-colors" whileHover={{
                  scale: 1.1
                }} whileTap={{
                  scale: 0.9
                }}>
                      {copiedScript === script.id ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </motion.button>
                  </div>
                  <p className="text-sm leading-relaxed">
                    <span>{script.content}</span>
                  </p>
                </motion.div>)}
            </div>
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.4
        }}>
            <div 
              className="flex items-center justify-between mb-4 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors" 
              onClick={toggleGoodwillOffers}
            >
              <div className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-slate-800">
                  <span>Goodwill Offers</span>
                </h3>
              </div>
              {showGoodwillOffers ? (
                <ChevronUp className="w-5 h-5 text-slate-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-500" />
              )}
            </div>
            <AnimatePresence>
              {showGoodwillOffers && (
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {GOODWILL_OFFERS.map((offer, index) => <motion.div key={offer.id} className={`border border-slate-200 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition-all cursor-pointer ${selectedGoodwill === offer.id ? 'bg-green-50 border-green-300' : 'bg-white'}`} initial={{
                  opacity: 0,
                  y: 20
                }} animate={{
                  opacity: 1,
                  y: 0
                }} transition={{
                  delay: index * 0.1
                }} onClick={() => handleSelectGoodwill(offer.id)} whileHover={{
                  scale: 1.02
                }} whileTap={{
                  scale: 0.98
                }}>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <offer.icon className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-slate-800">
                              <span>{offer.value}</span>
                            </h4>
                            {selectedGoodwill === offer.id && <CheckCircle className="w-5 h-5 text-green-600" />}
                          </div>
                          <p className="text-sm text-slate-600">
                            <span>{offer.description}</span>
                          </p>
                        </div>
                      </div>
                    </motion.div>)}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <div className="p-6 border-t border-slate-200">
        <motion.button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all" whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }}>
          <span>Apply Recommendations</span>
        </motion.button>
      </div>
    </div>;
};
