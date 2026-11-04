import React from 'react';
import { Box, CssBaseline, ThemeProvider, LinearProgress, Typography } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import './utils/i18n';

// Import components
import ExamSelectionStep from './components/ExamSelectionStep';
import PersonalizationStep from './components/PersonalizationStep';
import ConfirmationStep from './components/ConfirmationStep';
import PaymentStep from './components/PaymentStep';

// Import layout components
import { AppHeader, MainLayout, ProgressStepper, StepContent } from './components/layout';
import SelectionPanel from './components/layout/SelectionPanel';
import ResetDialog from './components/dialogs/ResetDialog';

// Import hooks
import { useAppState } from './hooks/useAppState';
import { useAppHandlers } from './hooks/useAppHandlers';

// Import theme
import { modernColors, modernTheme } from './theme/modernTheme';

// Import types
import { FormStep } from './types';

function App() {
  const { t } = useTranslation();

  // State management
  const state = useAppState();
  const { loadExams, loadExamDates } = state;
  const { examName, exam, region } = state.formData;

  // O'ng panel va tasdiqlash uchun: tanlov o'zgarsa (yoki sessiya tiklansa) ro'yxatlar yangilanadi
  React.useEffect(() => {
    if (examName) {
      loadExams(examName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examName]);

  React.useEffect(() => {
    if (exam && region) {
      loadExamDates(exam, region);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam, region]);

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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Typography component="h1" sx={{ fontSize: { xs: '24px', sm: '32px' }, lineHeight: 1.2, fontWeight: 700, letterSpacing: '-0.01em' }}>
            {t('header.page_title')}
          </Typography>
          <Typography sx={{ fontSize: '16px', lineHeight: 1.5, color: modernColors.gray[600] }}>
            {t('header.page_subtitle')}
          </Typography>
        </Box>

        {/* Progress Stepper */}
        <ProgressStepper currentStep={state.currentStep} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-start' }}>
          {/* Step Content */}
          <StepContent>{getStepContent()}</StepContent>

          {state.currentStep !== FormStep.PAYMENT && (
            <SelectionPanel
              formData={state.formData}
              examNames={state.examNames}
              regions={state.regions}
              exams={state.exams}
              examDates={state.examDates}
              onChange={
                state.currentStep === FormStep.EXAM_SELECTION
                  ? undefined
                  : () => state.setCurrentStep(FormStep.EXAM_SELECTION)
              }
            />
          )}
        </Box>
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
