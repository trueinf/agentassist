import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, HelpCircle, FileText, Plane } from 'lucide-react';
interface TopBannerProps {}
const QUICK_LINKS = [{
  label: 'Weather FAQs',
  icon: HelpCircle,
  href: '#'
}, {
  label: 'Waiver Rules',
  icon: FileText,
  href: '#'
}, {
  label: 'Affected Airports',
  icon: Plane,
  href: '#'
}, {
  label: 'Wingtips',
  icon: ExternalLink,
  href: '#'
}, {
  label: 'Snapcoms',
  icon: ExternalLink,
  href: '#'
}] as any[];

// @component: TopBanner
export const TopBanner = () => {
  // @return
  return <motion.div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg" initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-start">
          <div className="flex items-center space-x-6">
            <span className="text-sm font-medium text-blue-200">
              <span>Quick Links:</span>
            </span>
            <div className="flex items-center space-x-4">
              {QUICK_LINKS.map((link, index) => <motion.a key={`link-${index}`} href={link.href} className="flex items-center space-x-1 text-sm hover:text-blue-200 transition-colors group" initial={{
                opacity: 0,
                y: -5
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.2 + index * 0.1
              }} whileHover={{
                scale: 1.05
              }}>
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>;
};