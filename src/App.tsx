import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab, Language, ViewMode } from './types';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LandingHero } from './components/landing/LandingHero';
import { LandingSections } from './components/landing/LandingSections';
import { RiskMap } from './components/map/RiskMap';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { RiskExplorer } from './components/explorer/RiskExplorer';
import { DistrictAnalysis } from './components/districts/DistrictAnalysis';
import { IncidentHistory } from './components/incidents/IncidentHistory';
import { EmergencyCoverage } from './components/emergency/EmergencyCoverage';
import { RiskCalendar } from './components/calendar/RiskCalendar';
import { WeatherModule } from './components/weather/WeatherModule';
import { SafetyCenter } from './components/safety/SafetyCenter';
import { ReportCenter } from './components/reports/ReportCenter';
import { DataSourcesModal } from './components/common/DataSourcesModal';
import { FamilyQuickView } from './components/common/FamilyQuickView';
import { FireSimulationLab } from './components/simulation/FireSimulationLab';
import { GlobalFireBackground } from './components/common/GlobalFireBackground';
import { PersonalPortal } from './components/personal/PersonalPortal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [language, setLanguage] = useState<Language>('mn');
  const [viewMode, setViewMode] = useState<ViewMode>('public');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('bayanzurkh');
  const [isDataSourcesModalOpen, setIsDataSourcesModalOpen] = useState(false);
  const [isFamilyModeOpen, setIsFamilyModeOpen] = useState(false);

  // Smooth scroll to top when changing views
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const handleSelectDistrictAndMap = (districtId: string) => {
    setSelectedDistrictId(districtId);
    setActiveTab('map');
  };

  const handleSelectDistrictAndDetail = (districtId: string) => {
    setSelectedDistrictId(districtId);
    setActiveTab('districts');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#12152A] antialiased selection:bg-[#FF633C]/20 selection:text-[#0B124D] relative">
      
      {/* Omnipresent Living Ambient Fire Atmosphere Across Whole Site */}
      <GlobalFireBackground initialMode="vivid" />

      {/* Universal Top Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenDemoInfo={() => setIsDataSourcesModalOpen(true)}
        onToggleFamilyMode={() => setIsFamilyModeOpen(!isFamilyModeOpen)}
        isFamilyModeOpen={isFamilyModeOpen}
      />

      {/* Optional Family & Elder Friendly Quick Panel */}
      <AnimatePresence>
        {isFamilyModeOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden px-4"
          >
            <FamilyQuickView
              language={language}
              onClose={() => setIsFamilyModeOpen(false)}
              onOpenMap={() => {
                setIsFamilyModeOpen(false);
                setActiveTab('map');
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main View Router with Apple-Grade Smooth Transition */}
      <main className="flex-1 flex flex-col relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col"
          >
            {activeTab === 'landing' && (
              <div className="flex-1 flex flex-col">
                <LandingHero
                  language={language}
                  onExploreMap={() => setActiveTab('map')}
                  onSelectTab={setActiveTab}
                  onOpenDemoInfo={() => setIsDataSourcesModalOpen(true)}
                  onOpenFamilyMode={() => setIsFamilyModeOpen(true)}
                />
                <LandingSections
                  language={language}
                  onSelectTab={setActiveTab}
                  onSelectDistrict={handleSelectDistrictAndDetail}
                  onOpenDemoInfo={() => setIsDataSourcesModalOpen(true)}
                />
              </div>
            )}

            {activeTab === 'overview' && (
              <OverviewDashboard
                language={language}
                viewMode={viewMode}
                onSelectTab={setActiveTab}
                onSelectDistrict={handleSelectDistrictAndMap}
                onOpenDemoInfo={() => setIsDataSourcesModalOpen(true)}
              />
            )}

            {activeTab === 'map' && (
              <RiskMap
                language={language}
                viewMode={viewMode}
                selectedDistrictId={selectedDistrictId}
                onSelectDistrict={(id) => setSelectedDistrictId(id)}
                onNavigateToDetail={handleSelectDistrictAndDetail}
              />
            )}

            {activeTab === 'explorer' && (
              <div className="space-y-8">
                <RiskExplorer
                  language={language}
                  onNavigateToMapWithDistrict={handleSelectDistrictAndMap}
                />
                <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
                  <FireSimulationLab
                    language={language}
                    onExploreMap={() => setActiveTab('map')}
                  />
                </div>
              </div>
            )}

            {activeTab === 'districts' && (
              <DistrictAnalysis
                language={language}
                initialDistrictId={selectedDistrictId}
                onNavigateToMapWithDistrict={handleSelectDistrictAndMap}
              />
            )}

            {activeTab === 'incidents' && (
              <IncidentHistory
                language={language}
                onNavigateToMapWithDistrict={handleSelectDistrictAndMap}
                onOpenDemoInfo={() => setIsDataSourcesModalOpen(true)}
              />
            )}

            {activeTab === 'emergency' && (
              <EmergencyCoverage
                language={language}
                onNavigateToMap={() => setActiveTab('map')}
              />
            )}

            {activeTab === 'calendar' && (
              <RiskCalendar language={language} />
            )}

            {activeTab === 'weather' && (
              <div className="space-y-8">
                <WeatherModule language={language} />
                <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
                  <FireSimulationLab
                    language={language}
                    onExploreMap={() => setActiveTab('map')}
                  />
                </div>
              </div>
            )}

            {activeTab === 'safety' && (
              <div className="space-y-8">
                <SafetyCenter language={language} />
                <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pb-12">
                  <FamilyQuickView
                    language={language}
                    onOpenMap={() => setActiveTab('map')}
                  />
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <ReportCenter language={language} />
            )}

            {activeTab === 'sources' && (
              <div className="p-8 max-w-4xl mx-auto my-8">
                <div className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl border border-black/[0.06] shadow-sm space-y-6">
                  <span className="text-xs font-mono font-bold text-[#FF633C] uppercase tracking-wider block">
                    GOVERNANCE
                  </span>
                  <h2 className="font-editorial text-3xl font-bold text-[#0B124D]">
                    {language === 'mn' ? 'Өгөгдлийн эх сурвалж ба ил тод байдал' : 'Data Governance & Sources'}
                  </h2>
                  <p className="text-sm text-[#72778A] leading-relaxed">
                    {language === 'mn'
                      ? 'ОБЕГ, Үндэсний статистикийн хороо, ЦУОШГ-ын албан ёсны өгөгдлийг нэгтгэн орон зайн математик загварчлалаар боловсруулсан арга зүй.'
                      : 'Aggregated datasets processed with open multi-variable decision analysis formulas.'}
                  </p>
                  <button
                    onClick={() => setIsDataSourcesModalOpen(true)}
                    className="px-6 py-3 bg-[#0B124D] hover:bg-[#11166B] text-white text-xs font-bold rounded-2xl transition-all shadow-md active:scale-95"
                  >
                    {language === 'mn' ? 'Эх сурвалжийн самбар нээх' : 'Open Data Governance Panel'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'personal' && (
              <PersonalPortal
                language={language}
                onExploreMap={() => setActiveTab('map')}
                onSelectDistrict={handleSelectDistrictAndMap}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer (Hidden only on full GIS map view for immersion) */}
      {activeTab !== 'map' && (
        <Footer
          language={language}
          onSelectTab={setActiveTab}
          onOpenSources={() => setIsDataSourcesModalOpen(true)}
        />
      )}

      {/* Data Governance & Demo Transparency Modal */}
      <DataSourcesModal
        isOpen={isDataSourcesModalOpen}
        onClose={() => setIsDataSourcesModalOpen(false)}
        language={language}
      />

    </div>
  );
}
