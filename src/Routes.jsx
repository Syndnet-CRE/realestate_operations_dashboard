import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import DealPipelineDashboard from "pages/deal-pipeline-dashboard";
import UnderwritingAnalysisCenter from "pages/underwriting-analysis-center";
import PropertyAcquisitionWorkflow from "pages/property-acquisition-workflow";
import FinancialAnalyticsDashboard from "pages/financial-analytics-dashboard";
import ListingManagementHub from "pages/listing-management-hub";
import DealDetailManagement from "pages/deal-detail-management";
import GitHubRepository from "pages/github-repository";
import AuthCallback from "pages/AuthCallback";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<DealPipelineDashboard />} />
        <Route path="/deal-pipeline-dashboard" element={<DealPipelineDashboard />} />
        <Route path="/underwriting-analysis-center" element={<UnderwritingAnalysisCenter />} />
        <Route path="/property-acquisition-workflow" element={<PropertyAcquisitionWorkflow />} />
        <Route path="/financial-analytics-dashboard" element={<FinancialAnalyticsDashboard />} />
        <Route path="/listing-management-hub" element={<ListingManagementHub />} />
        <Route path="/deal-detail-management" element={<DealDetailManagement />} />
        <Route path="/github-repository" element={<GitHubRepository />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;