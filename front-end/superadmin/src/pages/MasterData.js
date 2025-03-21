import React, { lazy, Suspense } from 'react'
import Tabs, { Tab } from 'react-best-tabs';
import 'react-best-tabs/dist/index.css';
import { Helmet } from 'react-helmet';

const EnergyCompany = lazy(() => import('../components/MasterData/EnergyCompany'));
const Zones = lazy(() => import('../components/MasterData/Zones'));
const RegionalOffices = lazy(() => import('../components/MasterData/RegionalOffices'));
const SalesArea = lazy(() => import('../components/MasterData/SalesArea'));
const District = lazy(() => import('../components/MasterData/District'));
const Outlets = lazy(() => import('../components/MasterData/Outlets'));
const EnergyCompanyTeam = lazy(() => import('../components/MasterData/EnergyCompanyTeam'));
const ComplaintTypes = lazy(() => import('../components/MasterData/ComplaintTypes'));
const SaleCompanies = lazy(() => import('../components/MasterData/SaleCompanies'));
const PurchaseCompanies = lazy(() => import('../components/MasterData/PurchaseCompanies'));
const Contractors = lazy(() => import('../components/MasterData/Contractors'));
const Dealers = lazy(() => import('../components/MasterData/Dealers'));


const MasterData = () => {
  const tabs = [
    { title: 'Energy Company', page: <EnergyCompany /> },
    { title: 'Zones', page: <Zones /> },
    { title: 'Regional Offices', page: <RegionalOffices /> },
    { title: 'Sales Area', page: <SalesArea /> },
    { title: 'District', page: <District /> },
    { title: 'Outlets', page: <Outlets /> },
    { title: 'Energy Company Team', page: <EnergyCompanyTeam /> },
    { title: 'Sale Companies', page: <SaleCompanies /> },
    { title: 'Purchase Companies', page: <PurchaseCompanies /> },
    { title: 'Contractors', page: <Contractors /> },
    { title: 'Dealers', page: <Dealers /> },
    { title: 'Complaint Types', page: <ComplaintTypes /> },
  ]
  return (
    <>
      <Helmet>
        <title>Master Data · CMS Electricals</title>
      </Helmet>
      <Suspense fallback={<div>loading....</div>}>
        <Tabs activeTab="1" ulClassName="border-primary border-bottom" activityClassName="bg-secondary">
          {tabs.map((tab, idx) => (
            <Tab key={idx} title={tab.title}>
              <div className="mt-3">
                {tab.page}
              </div>
            </Tab>
          ))}
        </Tabs>
      </Suspense>
    </>
  )
}

export default MasterData