import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  CssBaseline,
  ThemeProvider,
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
  LinearProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { RestartAlt as RestartAltIcon } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

// Import components
import ExamSelectionStep from './components/ExamSelectionStep';
import PersonalizationStep from './components/PersonalizationStep';
import RegistrationDetailsStep from './components/RegistrationDetailsStep';
import ConfirmationStep from './components/ConfirmationStep';
import PaymentStep from './components/PaymentStep';
import LanguageSelector from './components/LanguageSelector';

// Import utilities and services
import { storageService } from './utils/storage';
import { apiService } from './services/api';
import './utils/i18n';

// Import theme
import { modernTheme, modernColors, modernBorderRadius } from './theme/modernTheme';

// Import types and constants
import { FormData, FormStep, Type, Region, ExamName, Exam, ExamDate, PaymentResponse } from './types';

function App() {
  const { t } = useTranslation();
  const isMobile = useMediaQuery('(max-width:600px)');


  // State
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.EXAM_SELECTION);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  // API Data
  const [types, setTypes] = useState<Type[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [examNames, setExamNames] = useState<ExamName[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [examDates, setExamDates] = useState<ExamDate[]>([]);

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  // Save form data to session storage
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      storageService.saveFormData(formData);
    }
  }, [formData]);

  // Save current step to session storage
  useEffect(() => {
    storageService.saveCurrentStep(currentStep);
  }, [currentStep]);

  const initializeApp = async () => {
    try {
      setLoading(true);
      
      // Load saved data from session storage
      const savedFormData = storageService.getFormData();
      const savedStep = storageService.getCurrentStep();
      
      if (Object.keys(savedFormData).length > 0) {
        setFormData(savedFormData);
        setCurrentStep(savedStep);
      }

      // Load initial API data
      await loadApiData();
    } catch (error) {
      console.error('App initialization error:', error);
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const loadApiData = async () => {
    try {
      const [typesData, regionsData, examNamesData] = await Promise.all([
        apiService.getTypes(),
        apiService.getRegions(),
        apiService.getExamNames(),
      ]);

      setTypes(typesData);
      setRegions(regionsData);
      setExamNames(examNamesData);
    } catch (error) {
      console.error('Error loading API data:', error);
      toast.error(t('common.error'));
    }
  };

  const loadExams = async (examNameId: number, typeId?: number) => {
    try {
      const params: any = { examname: examNameId };
      if (typeId) {
        params.type = typeId;
      }
      const examsData = await apiService.getExams(params);
      setExams(examsData);
      return examsData;
    } catch (error) {
      console.error('Error loading exams:', error);
      toast.error(t('common.error'));
      return [];
    }
  };

  const loadExamDates = async (examId: number, regionId: number) => {
    try {
      const params = { exam: examId, region: regionId };
      const examDatesData = await apiService.getExamDates(params);
      setExamDates(examDatesData);
      return examDatesData;
    } catch (error) {
      console.error('Error loading exam dates:', error);
      toast.error(t('common.error'));
      return [];
    }
  };

  const handleNext = async (stepData: Partial<FormData> | { paymentData: PaymentResponse }) => {
    if ('paymentData' in stepData) {
      // Payment step
      setPaymentData(stepData.paymentData);
      setCurrentStep(FormStep.PAYMENT);
    } else {
      // Regular form step
      const newFormData = { ...formData, ...stepData };
      setFormData(newFormData);

      // Load additional data if needed
      if (currentStep === FormStep.EXAM_SELECTION) {
        if (stepData.examName && stepData.type) {
          await loadExams(stepData.examName, stepData.type);
        } else if (stepData.examName) {
          await loadExams(stepData.examName);
        }
        
        if (stepData.exam && stepData.region) {
          await loadExamDates(stepData.exam, stepData.region);
        }
      }

      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > FormStep.EXAM_SELECTION) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDataChange = useCallback((stepData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  }, []);

  const handleNewRegistration = () => {
    setCurrentStep(FormStep.EXAM_SELECTION);
    setFormData({});
    setPaymentData(null);
    storageService.clearAll();
    toast.info('Yangi ro\'yxatdan o\'tish boshlandi');
  };

  const handleResetData = () => {
    setResetDialogOpen(false);
    setCurrentStep(FormStep.EXAM_SELECTION);
    setFormData({});
    setPaymentData(null);
    storageService.clearAll();
    toast.info('Ma\'lumotlar tozalandi. Qaytadan boshlashingiz mumkin');
  };

  const handleOpenResetDialog = () => {
    setResetDialogOpen(true);
  };

  const handleCloseResetDialog = () => {
    setResetDialogOpen(false);
  };

  const getStepContent = () => {
    switch (currentStep) {
      case FormStep.EXAM_SELECTION:
        return (
          <ExamSelectionStep
            initialData={formData}
            onNext={handleNext}
            onDataChange={handleDataChange}
            examNames={examNames}
            types={types}
            regions={regions}
            loading={{
              examNames: loading,
              types: loading,
              regions: loading,
            }}
          />
        );
      
      case FormStep.PERSONALIZATION:
        return (
          <PersonalizationStep
            initialData={formData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onDataChange={handleDataChange}
          />
        );
      
      case FormStep.REGISTRATION_DETAILS:
        return (
          <RegistrationDetailsStep
            initialData={formData}
            examNames={examNames}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onDataChange={handleDataChange}
          />
        );
      
      case FormStep.CONFIRMATION:
        return (
          <ConfirmationStep
            formData={formData as FormData}
            types={types}
            regions={regions}
            examNames={examNames}
            exams={exams}
            examDates={examDates}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      
      case FormStep.PAYMENT:
        return (
          <PaymentStep
            paymentData={paymentData!}
            onNewRegistration={handleNewRegistration}
          />
        );
      
      default:
        return null;
    }
  };

  const getStepperSteps = () => {
    return [
      t('steps.exam_selection'),
      t('steps.personalization'),
      t('steps.registration_details'),
      t('steps.confirmation'),
      t('steps.payment'),
    ];
  };

  if (loading) {
    return (
      <ThemeProvider theme={modernTheme}>
        <CssBaseline />
        <Box sx={{ width: '100%', mt: 4 }}>
          <LinearProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={modernTheme}>
      <CssBaseline />
      
      {/* Header - Clean modern design with logos */}
      <Box
        sx={{
          backgroundColor: modernColors.surface.primary,
          borderBottom: `1px solid ${modernColors.gray[200]}`,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: { xs: 'center', md: 'space-between' },
            py: { xs: 2, sm: 2.5, md: 3 },
            gap: { xs: 2, sm: 2.5, md: 4 },
            px: { xs: 2, sm: 3 },
          }}>
            {/* Logo Group */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 2, sm: 3, md: 4 },
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {/* IM Logo */}
              <img
                src="/im.png"
                alt="IM Logo"
                style={{
                  height: isMobile ? '50px' : '70px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />

              {/* UZBMB Logo */}
              <img
                src="/uzbmb.svg"
                alt="UZBMB Logo"
                style={{
                  height: isMobile ? '35px' : '50px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />

              {/* Title */}
              <Typography
                variant="h2"
                sx={{
                  color: modernColors.gray[900],
                  fontSize: { xs: '14px', sm: '16px', md: '20px', lg: '24px' },
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  textAlign: { xs: 'center', md: 'left' },
                  lineHeight: 1.2,
                  mx: { xs: 0, md: 2 },
                  maxWidth: { xs: '100%', sm: '300px', md: 'none' },
                }}
              >
                {t('header.title').split('\n').map((line: string, index: number) => (
                  <span key={index}>
                    {line}
                    {index < t('header.title').split('\n').length - 1 && <br />}
                  </span>
                ))}
              </Typography>
            </Box>

            {/* Language selector and Reset button */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1.5, sm: 2 },
              flexShrink: 0,
            }}>
              {currentStep !== FormStep.PAYMENT && (
                <Tooltip title="Ma'lumotlarni tozalash">
                  <IconButton
                    onClick={handleOpenResetDialog}
                    size={isMobile ? 'small' : 'medium'}
                    sx={{
                      backgroundColor: modernColors.gray[50],
                      border: `1px solid ${modernColors.gray[200]}`,
                      borderRadius: modernBorderRadius.md,
                      '&:hover': {
                        backgroundColor: modernColors.gray[100],
                      }
                    }}
                  >
                    <RestartAltIcon fontSize={isMobile ? 'small' : 'medium'} />
                  </IconButton>
                </Tooltip>
              )}
              <Box sx={{
                backgroundColor: modernColors.gray[50],
                border: `1px solid ${modernColors.gray[200]}`,
                borderRadius: modernBorderRadius.md,
                padding: { xs: '6px 12px', sm: '8px 16px' },
              }}>
                <LanguageSelector />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{
        backgroundColor: modernColors.gray[50],
        minHeight: '100vh',
        pt: { xs: 3, sm: 4, md: 6 },
        pb: { xs: 4, sm: 6, md: 8 },
      }}>
        <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2, md: 3, lg: 4 } }}>
          {/* Progress Stepper - Hide on mobile for payment step */}
          {!(isMobile && currentStep === FormStep.PAYMENT) && (
            <Box
              sx={{
                mb: { xs: 4, sm: 6, md: 8 },
                p: { xs: 2, sm: 3, md: 4, lg: 6 },
                backgroundColor: modernColors.surface.primary,
                borderRadius: modernBorderRadius.lg,
                border: `1px solid ${modernColors.gray[200]}`,
              }}
            >
              <Stepper 
                activeStep={currentStep - 1} 
                orientation={isMobile ? 'vertical' : 'horizontal'}
                sx={{ 
                  '& .MuiStepLabel-label': {
                    fontSize: '14px',
                    fontWeight: 400,
                    color: modernColors.gray[600],
                  },
                  '& .MuiStepLabel-label.Mui-active': {
                    fontWeight: 500,
                    color: modernColors.primary[600],
                  },
                  '& .MuiStepLabel-label.Mui-completed': {
                    color: modernColors.semantic.success,
                    fontWeight: 400,
                  },
                  '& .MuiStepIcon-root': {
                    fontSize: '24px',
                  },
                  '& .MuiStepIcon-root.Mui-active': {
                    color: modernColors.primary[600],
                  },
                  '& .MuiStepIcon-root.Mui-completed': {
                    color: modernColors.semantic.success,
                  },
                  '& .MuiStepConnector-line': {
                    borderColor: modernColors.gray[300],
                    borderTopWidth: 2,
                  },
                  '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                    borderColor: modernColors.primary[600],
                  },
                  '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                    borderColor: modernColors.semantic.success,
                  },
                }}
              >
                {getStepperSteps().map((label, index) => (
                  <Step key={index}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          )}

          {/* Step Content */}
          <Box
            sx={{
              p: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
              backgroundColor: modernColors.surface.primary,
              borderRadius: modernBorderRadius.lg,
              border: `1px solid ${modernColors.gray[200]}`,
              position: 'relative',
              overflow: 'visible',
              minHeight: { xs: '400px', sm: '500px', md: '600px' },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: modernColors.primary[600],
                borderRadius: `${modernBorderRadius.lg}px ${modernBorderRadius.lg}px 0 0`,
              }
            }}
          >
            {getStepContent()}
          </Box>
        </Container>
      </Box>

      {/* Reset Confirmation Dialog */}
      <Dialog
        open={resetDialogOpen}
        onClose={handleCloseResetDialog}
        aria-labelledby="reset-dialog-title"
        aria-describedby="reset-dialog-description"
      >
        <DialogTitle id="reset-dialog-title">
          Ma'lumotlarni tozalash
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="reset-dialog-description">
            Barcha kiritilgan ma'lumotlar o'chiriladi va ro'yxatdan o'tish jarayoni qaytadan boshlanadi.
            Davom etishni xohlaysizmi?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResetDialog} color="inherit">
            Bekor qilish
          </Button>
          <Button onClick={handleResetData} color="error" variant="contained">
            Tozalash
          </Button>
        </DialogActions>
      </Dialog>

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