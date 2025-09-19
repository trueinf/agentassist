import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Clock, MapPin, DollarSign, CheckCircle, AlertCircle, ArrowUpDown } from 'lucide-react';
interface FlightOption {
  id: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  aircraft: string;
  waiverStatus: 'eligible' | 'not-eligible';
  voucher: number;
  seats: number;
}
// Primary airport set (Same Airport tab)
interface AirlineInfo {
  name: string;
  website: string;
  tollNumber: string;
}
const FLIGHT_OPTIONS: FlightOption[] = [{
  id: 'ual1456',
  departure: 'ORD',
  arrival: 'JFK',
  departureTime: '18:15',
  arrivalTime: '21:45',
  duration: '2h 30m',
  aircraft: '737-800',
  waiverStatus: 'eligible',
  voucher: 0,
  seats: 12
}, {
  id: 'ual2234',
  departure: 'ORD',
  arrival: 'JFK',
  departureTime: '20:30',
  arrivalTime: '23:55',
  duration: '2h 25m',
  aircraft: '787-9',
  waiverStatus: 'eligible',
  voucher: 0,
  seats: 8
}, {
  id: 'ual3456',
  departure: 'ORD',
  arrival: 'EWR',
  departureTime: '19:45',
  arrivalTime: '23:10',
  duration: '2h 25m',
  aircraft: '737-900',
  waiverStatus: 'eligible',
  voucher: 100,
  seats: 15
}];
const AIRLINE_INFO: AirlineInfo[] = [{
  name: 'JetBlue',
  website: 'www.jetblue.com',
  tollNumber: '1-800-538-2583'
}, {
  name: 'Alaska Airlines',
  website: 'www.alaskaair.com',
  tollNumber: '1-800-252-7522'
}, {
  name: 'Spirit Airlines',
  website: 'www.spirit.com',
  tollNumber: '1-801-401-2222'
}, {
  name: 'Southwest Airlines',
  website: 'www.southwest.com',
  tollNumber: '1-800-435-9792'
}, {
  name: 'American Airlines',
  website: 'www.aa.com',
  tollNumber: '1-800-433-7300'
}];
const TABS = [{
  id: 'same-airport',
  label: 'Same Airport'
}, {
  id: 'alternate',
  label: 'Alternate Airports'
}, {
  id: 'star-alliance',
  label: 'JV Alliance'
}, {
  id: 'refund',
  label: 'Airline Website & Toll Number'
}] as any[];

// Alternate airports within ~300 miles of EWR with sample options to Chicago (ORD/MDW)
const ALTERNATE_FLIGHT_OPTIONS: FlightOption[] = [
  {
    id: 'ue301',
    departure: 'JFK',
    arrival: 'ORD',
    departureTime: '17:45',
    arrivalTime: '19:20',
    duration: '2h 35m',
    aircraft: 'A321',
    waiverStatus: 'eligible',
    voucher: 0,
    seats: 14
  },
  {
    id: 'ual512',
    departure: 'LGA',
    arrival: 'ORD',
    departureTime: '18:10',
    arrivalTime: '19:55',
    duration: '2h 45m',
    aircraft: '737-800',
    waiverStatus: 'eligible',
    voucher: 0,
    seats: 11
  },
  {
    id: 'ue3670',
    departure: 'JFK',
    arrival: 'MDW',
    departureTime: '19:05',
    arrivalTime: '20:55',
    duration: '2h 50m',
    aircraft: 'A320',
    waiverStatus: 'eligible',
    voucher: 0,
    seats: 9
  },
  {
    id: 'ue2241',
    departure: 'HPN',
    arrival: 'ORD',
    departureTime: '18:25',
    arrivalTime: '20:05',
    duration: '2h 40m',
    aircraft: 'E175',
    waiverStatus: 'eligible',
    voucher: 0,
    seats: 6
  },
  {
    id: 'ue1182',
    departure: 'ISP',
    arrival: 'MDW',
    departureTime: '18:50',
    arrivalTime: '21:05',
    duration: '3h 15m',
    aircraft: '737-700',
    waiverStatus: 'eligible',
    voucher: 0,
    seats: 18
  },
  {
    id: 'ual901',
    departure: 'PHL',
    arrival: 'ORD',
    departureTime: '17:30',
    arrivalTime: '19:15',
    duration: '2h 45m',
    aircraft: '737-900',
    waiverStatus: 'eligible',
    voucher: 0,
    seats: 16
  },
  {
    id: 'ue1412',
    departure: 'BDL',
    arrival: 'ORD',
    departureTime: '19:20',
    arrivalTime: '21:05',
    duration: '2h 45m',
    aircraft: '737-800',
    waiverStatus: 'eligible',
    voucher: 0,
    seats: 7
  },
  {
    id: 'ual2183',
    departure: 'ALB',
    arrival: 'ORD',
    departureTime: '18:00',
    arrivalTime: '20:00',
    duration: '2h 00m',
    aircraft: 'E190',
    waiverStatus: 'eligible',
    voucher: 0,
    seats: 10
  },
  {
    id: 'ue332',
    departure: 'BWI',
    arrival: 'ORD',
    departureTime: '17:55',
    arrivalTime: '19:35',
    duration: '2h 40m',
    aircraft: '737-800',
    waiverStatus: 'eligible',
    voucher: 0,
    seats: 20
  },
  {
    id: 'ual441',
    departure: 'IAD',
    arrival: 'ORD',
    departureTime: '20:05',
    arrivalTime: '21:45',
    duration: '2h 40m',
    aircraft: 'A319',
    waiverStatus: 'eligible',
    voucher: 0,
    seats: 12
  }
];

// JV Alliance options to Chicago (ORD/MDW) from NY/NJ region and nearby hubs
const STAR_ALLIANCE_FLIGHT_OPTIONS: FlightOption[] = [
  {
    id: 'aa1288',
    departure: 'EWR',
    arrival: 'ORD',
    departureTime: '17:20',
    arrivalTime: '18:55',
    duration: '2h 35m',
    aircraft: '737-800',
    waiverStatus: 'eligible',
    voucher: 0,
    seats: 13
  },
  {
    id: 'dl2196',
    departure: 'EWR',
    arrival: 'ORD',
    departureTime: '19:10',
    arrivalTime: '20:45',
    duration: '2h 35m',
    aircraft: '737-900',
    waiverStatus: 'eligible',
    voucher: 0,
    seats: 9
  },
  {
    id: 'sw347',
    departure: 'LGA',
    arrival: 'ORD',
    departureTime: '18:05',
    arrivalTime: '19:45',
    duration: '2h 40m',
    aircraft: 'A319',
    waiverStatus: 'eligible',
    voucher: 0,
    seats: 7
  },
  {
    id: 'b65102',
    departure: 'HPN',
    arrival: 'ORD',
    departureTime: '18:30',
    arrivalTime: '20:15',
    duration: '2h 45m',
    aircraft: 'E175',
    waiverStatus: 'eligible',
    voucher: 0,
    seats: 5
  },
  {
    id: 'b68998',
    departure: 'EWR',
    arrival: 'YYZ',
    departureTime: '17:10',
    arrivalTime: '18:30',
    duration: '1h 20m',
    aircraft: 'E190',
    waiverStatus: 'eligible',
    voucher: 0,
    seats: 12
  },
  {
    id: 'as4503',
    departure: 'YYZ',
    arrival: 'ORD',
    departureTime: '19:30',
    arrivalTime: '20:40',
    duration: '1h 10m',
    aircraft: 'A220-300',
    waiverStatus: 'eligible',
    voucher: 0,
    seats: 10
  },
  {
    id: 'as4410',
    departure: 'IAD',
    arrival: 'ORD',
    departureTime: '20:05',
    arrivalTime: '21:45',
    duration: '2h 40m',
    aircraft: '737-800',
    waiverStatus: 'eligible',
    voucher: 0,
    seats: 16
  }
];

interface FlightRefundOptionsPanelProps {
  activeTabOverride?: 'same-airport' | 'alternate' | 'star-alliance' | 'refund';
  filterArrival?: string | null;
  highlightFlightId?: string | null;
}

// @component: FlightRefundOptionsPanel
export const FlightRefundOptionsPanel = ({
  activeTabOverride,
  filterArrival,
  highlightFlightId
}: FlightRefundOptionsPanelProps) => {
  const [activeTab, setActiveTab] = useState('same-airport');
  // Sync active tab with overrides from parent when provided
  useEffect(() => {
    if (activeTabOverride) {
      setActiveTab(activeTabOverride);
    }
  }, [activeTabOverride]);
  const [sortBy, setSortBy] = useState<'time' | 'duration' | 'seats'>('time');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const handleSort = (field: 'time' | 'duration' | 'seats') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  // Choose dataset by tab; for Alternate we show airports within ~300 miles of EWR to Chicago
  const baseFlights = activeTab === 'alternate'
    ? ALTERNATE_FLIGHT_OPTIONS
    : activeTab === 'star-alliance'
    ? STAR_ALLIANCE_FLIGHT_OPTIONS
    : FLIGHT_OPTIONS;

  // Apply optional filtering by arrival airport for tabs other than Alternate and JV Alliance
  const visibleFlights = useMemo(() => {
    if (activeTab === 'alternate' || activeTab === 'star-alliance') return baseFlights;
    return baseFlights.filter((f) =>
      filterArrival ? f.arrival.toLowerCase() === filterArrival.toLowerCase() : true
    );
  }, [filterArrival, baseFlights, activeTab]);

  const sortedFlights = [...visibleFlights].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'time':
        comparison = a.departureTime.localeCompare(b.departureTime);
        break;
      case 'duration':
        comparison = a.duration.localeCompare(b.duration);
        break;
      case 'seats':
        comparison = a.seats - b.seats;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // @return
  return <div className="bg-white rounded-xl shadow-lg border border-slate-200 h-full flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          <span>Flight & Refund Options</span>
        </h2>
        
        <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
          {TABS.map(tab => <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`} whileHover={{
          scale: 1.02
        }} whileTap={{
          scale: 0.98
        }}>
              <span>{tab.label}</span>
            </motion.button>)}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'refund' ? <motion.div key="refund" className="p-6 h-full overflow-y-auto" initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -20
        }} transition={{
          duration: 0.3
        }}>
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 mb-4">Airline Contact Information</h3>
                {AIRLINE_INFO.map((airline, index) => <motion.div key={`airline-${index}`} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: index * 0.1
            }} whileHover={{
              scale: 1.02
            }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Plane className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-slate-800">
                          <span>{airline.name}</span>
                        </h4>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">
                          <span>Website:</span>
                        </span>
                        <a href={`https://${airline.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 underline">
                          <span>{airline.website}</span>
                        </a>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">
                          <span>Toll Number:</span>
                        </span>
                        <a href={`tel:${airline.tollNumber}`} className="text-sm text-blue-600 hover:text-blue-800">
                          <span>{airline.tollNumber}</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>)}
              </div>
            </motion.div> : <motion.div key="flights" className="h-full flex flex-col" initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -20
        }} transition={{
          duration: 0.3
        }}>
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-slate-700">
                    <span>Sort by:</span>
                  </span>
                  <div className="flex space-x-2">
                    {[{
                  key: 'time',
                  label: 'Departure'
                }, {
                  key: 'duration',
                  label: 'Duration'
                }, {
                  key: 'seats',
                  label: 'Seats'
                }].map(sort => <button key={sort.key} onClick={() => handleSort(sort.key as 'time' | 'duration' | 'seats')} className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm transition-colors ${sortBy === sort.key ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:text-slate-800'}`}>
                        <span>{sort.label}</span>
                        {sortBy === sort.key && <ArrowUpDown className="w-3 h-3" />}
                      </button>)}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'alternate' && (
                  <div className="mb-3 text-xs text-slate-600">
                    Showing alternate departure airports within ~300 miles of EWR to Chicago (ORD/MDW).
                  </div>
                )}
                {activeTab === 'star-alliance' && (
                  <div className="mb-3 text-xs text-slate-600">
                    Showing JV Alliance partner options to Chicago (United, Air Canada, etc.).
                  </div>
                )}
                <div className="space-y-3">
                  {sortedFlights.map((flight, index) => <motion.div key={flight.id} className={`border rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer ${highlightFlightId === flight.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200'}`} initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: index * 0.1
              }} whileHover={{
                scale: 1.02
              }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Plane className="w-5 h-5 text-blue-600" />
                          <div>
                            <h3 className="font-semibold text-slate-800">
                              <span>{flight.id.toUpperCase()}</span>
                            </h3>
                            <p className="text-sm text-slate-600">
                              <span>{flight.aircraft}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {flight.waiverStatus === 'eligible' ? <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                              <span>Waiver Eligible</span>
                            </span> : <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                              <span>No Waiver</span>
                            </span>}
                          {flight.voucher > 0 && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                              <span>${flight.voucher} Voucher</span>
                            </span>}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-slate-500" />
                          <div>
                            <p className="font-medium text-slate-800">
                              <span>{flight.departureTime}</span>
                            </p>
                            <p className="text-slate-600">
                              <span>{flight.departure}</span>
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-slate-600">
                            <span>{flight.duration}</span>
                          </p>
                          <div className="w-full h-px bg-slate-300 my-1"></div>
                        </div>

                        <div className="flex items-center justify-end space-x-2">
                          <div className="text-right">
                            <p className="font-medium text-slate-800">
                              <span>{flight.arrivalTime}</span>
                            </p>
                            <p className="text-slate-600">
                              <span>{flight.arrival}</span>
                            </p>
                          </div>
                          <MapPin className="w-4 h-4 text-slate-500" />
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-sm text-slate-600">
                          <span>{flight.seats} seats available</span>
                        </span>
                        <motion.button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors" whileHover={{
                    scale: 1.05
                  }} whileTap={{
                    scale: 0.95
                  }}>
                          <span>Select Flight</span>
                        </motion.button>
                      </div>
                    </motion.div>)}
                </div>
              </div>
            </motion.div>}
        </AnimatePresence>
      </div>
    </div>;
};
