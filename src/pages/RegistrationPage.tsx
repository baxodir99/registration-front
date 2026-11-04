import React from 'react';
import { Box, LinearProgress, Typography, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Import components
import ExamSelectionStep from '../components/ExamSelectionStep';
import PersonalizationStep from '../components/PersonalizationStep';
import ConfirmationStep from '../components/ConfirmationStep';
import PaymentStep from '../components/PaymentStep';

// Import layout components
import { AppHeader, MainLayout, ProgressStepper } from '../components/layout';
import SelectionPanel from '../components/layout/SelectionPanel';
import ResetDialog from '../components/dialogs/ResetDialog';

// Import hooks
import { useAppState } from '../hooks/useAppState';
import { useAppHandlers } from '../hooks/useAppHandlers';

// Import theme
import { modernColors } from '../theme/modernTheme';

// Import types
import { FormStep } from '../types';
import { SubStep } from '../components/payment/SubStepper';
import { formatDate } from '../utils/validation';

function RegistrationPage() {
  const { t, i18n } = useTranslation();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [paymentSubStep, setPaymentSubStep] = React.useState<SubStep>('card');

  // State management
  const state = useAppState();
  const { loadExams, loadExamDates, currentStep, formData } = state;
  const { examName, exam, region } = formData;
  const firstStep = currentStep === FormStep.EXAM_SELECTION;

  // 1-bosqich ro'yxatlarni o'zi yuklaydi; keyingi bosqichlar uchun (sessiya tiklanganda ham) shu yerda
  React.useEffect(() => {
    if (!firstStep && examName) {
      loadExams(examName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstStep, examName]);

  React.useEffect(() => {
    if (!firstStep && exam && region) {
      loadExamDates(exam, region);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstStep, exam, region]);

  // Event handlers
  const handlers = useAppHandlers({
    currentStep,
    setCurrentStep: state.setCurrentStep,
    formData,
    setFormData: state.setFormData,
    setPaymentData: state.setPaymentData,
    setResetDialogOpen: state.setResetDialogOpen,
  });

  const selectedExam = state.exams.find((e) => e.id === exam);
  const selectedDate = state.examDates.find((d) => d.id === formData.examDate);

  const handleNewRegistration = () => {
    setPaymentSubStep('card');
    handlers.handleNewRegistration();
  };

  // Get step content based on current step
  const getStepContent = () => {
    switch (currentStep) {
      case FormStep.EXAM_SELECTION:
        return (
          <ExamSelectionStep
            initialData={formData}
            onNext={handlers.handleNext}
            onDataChange={handlers.handleDataChange}
            examNames={state.examNames}
            regions={state.regions}
          />
        );

      case FormStep.PERSONALIZATION:
        return (
          <PersonalizationStep
            initialData={formData}
            onNext={handlers.handleNext}
            onPrevious={handlers.handlePrevious}
            onDataChange={handlers.handleDataChange}
            aside={
              <SelectionPanel
                formData={formData}
                examNames={state.examNames}
                regions={state.regions}
                exams={state.exams}
                examDates={state.examDates}
                onChange={() => state.setCurrentStep(FormStep.EXAM_SELECTION)}
              />
            }
          />
        );

      case FormStep.CONFIRMATION:
        return (
          <ConfirmationStep
            formData={formData as any}
            types={state.types}
            regions={state.regions}
            examNames={state.examNames}
            exams={state.exams}
            examDates={state.examDates}
            onNext={handlers.handleNext}
            onPrevious={handlers.handlePrevious}
            onEdit={state.setCurrentStep}
          />
        );

      case FormStep.PAYMENT:
        return (
          <PaymentStep
            paymentData={state.paymentData!}
            onNewRegistration={handleNewRegistration}
            formData={formData as any}
            originalAmount={selectedExam ? parseFloat(selectedExam.amount) : undefined}
            onSubStepChange={setPaymentSubStep}
            examLabel={selectedExam?.name}
            dateLabel={selectedDate ? formatDate(selectedDate.date) : undefined}
            participant={formData.userProfile?.full_name}
            deadline={selectedDate?.regstration_close ? formatDate(selectedDate.regstration_close) : undefined}
          />
        );

      default:
        return null;
    }
  };

  // Loading state
  if (state.loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  const showStepper = currentStep !== FormStep.PAYMENT || paymentSubStep === 'card';

  // Main render
  return (
    <>
      {/* Header */}
      <AppHeader currentStep={currentStep} onOpenResetDialog={handlers.handleOpenResetDialog} />

      {/* Main Content */}
      <MainLayout>
        {firstStep && !isMobile && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            <Typography component="h1" sx={{ m: 0, fontSize: '32px', lineHeight: 1.2, fontWeight: 700, letterSpacing: '-0.01em' }}>
              {t('header.page_title')}
            </Typography>
            <Typography sx={{ m: 0, fontSize: '16px', lineHeight: 1.5, color: modernColors.gray[600] }}>
              {t('header.page_subtitle')}
            </Typography>
          </Box>
        )}

        {showStepper && <ProgressStepper key={i18n.language} currentStep={currentStep} />}

        {getStepContent()}
      </MainLayout>

      {/* Reset Confirmation Dialog */}
      <ResetDialog
        open={state.resetDialogOpen}
        onClose={handlers.handleCloseResetDialog}
        onConfirm={handlers.handleResetData}
      />
    </>
  );
}

export default RegistrationPage;
