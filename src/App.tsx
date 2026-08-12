import React from 'react';
import { Box, CssBaseline, ThemeProvider, LinearProgress } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './utils/i18n';

// Import components
import ExamSelectionStep from './components/ExamSelectionStep';
import PersonalizationStep from './components/PersonalizationStep';
import RegistrationDetailsStep from './components/RegistrationDetailsStep';
import ConfirmationStep from './components/ConfirmationStep';
import PaymentStep from './components/PaymentStep';

// Import layout components
import { AppHeader, MainLayout, ProgressStepper, StepContent } from './components/layout';
import ResetDialog from './components/dialogs/ResetDialog';

// Import hooks
import { useAppState } from './hooks/useAppState';
import { useAppHandlers } from './hooks/useAppHandlers';

// Import theme
import { modernTheme } from './theme/modernTheme';

// Import types
import { FormStep } from './types';

function App() {
  // State management
  const state = useAppState();

  // Event handlers
  const handlers = useAppHandlers({
    currentStep: state.currentStep,
    setCurrentStep: state.setCurrentStep,
    formData: state.formData,
    setFormData: state.setFormData,
    setPaymentData: state.setPaymentData,
    setResetDialogOpen: state.setResetDialogOpen,
    loadExams: state.loadExams,
    loadExamDates: state.loadExamDates,
  });

  // Get step content based on current step
  const getStepContent = () => {
    switch (state.currentStep) {
      case FormStep.EXAM_SELECTION:
        return (
          <ExamSelectionStep
            initialData={state.formData}
            onNext={handlers.handleNext}
            onDataChange={handlers.handleDataChange}
            examNames={state.examNames}
            types={state.types}
            regions={state.regions}
            loading={{
              examNames: state.loading,
              types: state.loading,
              regions: state.loading,
            }}
          />
        );

      case FormStep.PERSONALIZATION:
        return (
          <PersonalizationStep
            initialData={state.formData}
            onNext={handlers.handleNext}
            onPrevious={handlers.handlePrevious}
            onDataChange={handlers.handleDataChange}
          />
        );

      case FormStep.REGISTRATION_DETAILS:
        return (
          <RegistrationDetailsStep
            initialData={state.formData}
            examNames={state.examNames}
            onNext={handlers.handleNext}
            onPrevious={handlers.handlePrevious}
            onDataChange={handlers.handleDataChange}
          />
        );

      case FormStep.CONFIRMATION:
        return (
          <ConfirmationStep
            formData={state.formData as any}
            types={state.types}
            regions={state.regions}
            examNames={state.examNames}
            exams={state.exams}
            examDates={state.examDates}
            onNext={handlers.handleNext}
            onPrevious={handlers.handlePrevious}
          />
        );

      case FormStep.PAYMENT:
        // Calculate original amount
        const selectedExam = state.exams.find(e => e.id === state.formData.exam);
        const originalAmount = selectedExam ? parseFloat(selectedExam.amount) : undefined;

        return (
          <PaymentStep
            paymentData={state.paymentData!}
            onNewRegistration={handlers.handleNewRegistration}
            formData={state.formData}
            originalAmount={originalAmount}
          />
        );

      default:
        return null;
    }
  };

  // Loading state
  if (state.loading) {
    return (
      <ThemeProvider theme={modernTheme}>
        <CssBaseline />
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress />
        </Box>
      </ThemeProvider>
    );
  }

  // Main render
  return (
    <ThemeProvider theme={modernTheme}>
      <CssBaseline />

      {/* Header */}
      <AppHeader
        currentStep={state.currentStep}
        onOpenResetDialog={handlers.handleOpenResetDialog}
      />

      {/* Main Content */}
      <MainLayout>
        {/* Progress Stepper */}
        <ProgressStepper currentStep={state.currentStep} />

        {/* Step Content */}
        <StepContent>{getStepContent()}</StepContent>
      </MainLayout>

      {/* Reset Confirmation Dialog */}
      <ResetDialog
        open={state.resetDialogOpen}
        onClose={handlers.handleCloseResetDialog}
        onConfirm={handlers.handleResetData}
      />

      {/* Toast Notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </ThemeProvider>
  );
}

export default App;
