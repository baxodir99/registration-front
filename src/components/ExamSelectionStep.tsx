import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Alert,
  CardContent,
  Chip,
  useMediaQuery,
} from '@mui/material';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/uz-latn';
import 'dayjs/locale/ru';
import { SurfaceCard, FilledButton } from './MD3Components';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { apiService } from '../services/api';
import { examSelectionSchema } from '../utils/validation';
import { modernColors, modernBorderRadius } from '../theme/modernTheme';
import {
  Type,
  Region,
  ExamName,
  Exam,
  ExamDate,
  FormData,
} from '../types';

// Availability status color constants for consistency
const AVAILABILITY_COLORS = {
  available: {
    main: '#2e7d32',      // Green
    light: '#e8f5e8',     // Light green
    icon: '✓'             // Check mark
  },
  half: {
    main: '#f57c00',      // Orange
    light: '#fff3e0',     // Light orange
    icon: '!'             // Exclamation mark
  },
  full: {
    main: '#d32f2f',      // Red
    light: '#ffebee',     // Light red
    icon: '✕'             // X mark
  }
} as const;

interface ExamSelectionStepProps {
  initialData?: Partial<FormData>;
  onNext: (data: Partial<FormData>) => void;
  onDataChange: (data: Partial<FormData>) => void;
  // Data passed from parent to avoid duplicate API calls
  examNames: ExamName[];
  types: Type[];
  regions: Region[];
  loading: {
    examNames: boolean;
    types: boolean;
    regions: boolean;
  };
}

const ExamSelectionStep: React.FC<ExamSelectionStepProps> = ({
  initialData,
  onNext,
  onDataChange,
  examNames: propsExamNames,
  types: propsTypes,
  regions: propsRegions,
  loading: propsLoading,
}) => {
  const { t, i18n } = useTranslation();
  const isMobile = useMediaQuery('(max-width:600px)');

  // Set dayjs locale based on current language
  React.useEffect(() => {
    const currentLang = i18n.language;
    if (currentLang === 'uz') {
      dayjs.locale('uz-latn');
    } else if (currentLang === 'ru') {
      dayjs.locale('ru');
    } else {
      dayjs.locale('en');
    }
  }, [i18n.language]);
  
  // Use data from props to avoid duplicate API calls
  const examNames = propsExamNames;
  const types = propsTypes;
  const regions = propsRegions;
  
  // Local state only for data that needs to be loaded based on form changes
  const [exams, setExams] = useState<Exam[]>([]);
  const [examDates, setExamDates] = useState<ExamDate[]>([]);
  
  // Loading states - use props for initial data, local for conditional data
  const [localLoading, setLocalLoading] = useState({
    exams: false,
    examDates: false,
  });
  
  const loading = {
    examNames: propsLoading.examNames,
    types: propsLoading.types,
    regions: propsLoading.regions,
    exams: localLoading.exams,
    examDates: localLoading.examDates,
  };
  
  // Error state
  const [error, setError] = useState<string | null>(null);
  
  // Selected exam for price display
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  
  // Selected date for calendar
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  
  // Available dates for the calendar
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  const formik = useFormik({
    initialValues: {
      examName: initialData?.examName || '',
      region: initialData?.region || '',
      exam: initialData?.exam || '',
      examDate: initialData?.examDate || '',
    },
    validationSchema: examSelectionSchema,
    onSubmit: (values) => {
      const formData: Partial<FormData> = {
        examName: Number(values.examName),
        region: Number(values.region),
        exam: Number(values.exam),
        examDate: Number(values.examDate),
      };
      onNext(formData);
    },
  });

  // Initial data loading removed - now using props from parent

  // Watch form changes and notify parent - optimized to prevent excessive calls
  useEffect(() => {
    onDataChange({
      examName: formik.values.examName ? Number(formik.values.examName) : undefined,
      region: formik.values.region ? Number(formik.values.region) : undefined,
      exam: formik.values.exam ? Number(formik.values.exam) : undefined,
      examDate: formik.values.examDate ? Number(formik.values.examDate) : undefined,
    });
  }, [
    formik.values.examName, 
    formik.values.region, 
    formik.values.exam, 
    formik.values.examDate,
    onDataChange
  ]);

  // Load exams when examName changes
  useEffect(() => {
    if (formik.values.examName && formik.values.examName !== '') {
      loadExams();
    }
  }, [formik.values.examName]);

  // Load exam dates when exam and region change
  useEffect(() => {
    if (formik.values.exam && formik.values.exam !== '' && formik.values.region && formik.values.region !== '') {
      loadExamDates();
    }
  }, [formik.values.exam, formik.values.region]);

  // Update selected exam for price display
  useEffect(() => {
    if (formik.values.exam && formik.values.exam !== '') {
      const exam = exams.find(e => e.id === Number(formik.values.exam));
      setSelectedExam(exam || null);
    } else {
      setSelectedExam(null);
    }
  }, [formik.values.exam, exams]);


  const loadExams = async () => {
    try {
      setLocalLoading(prev => ({ ...prev, exams: true }));
      setError(null);
      
      const params = { examname: Number(formik.values.examName) };
      
      const examsData = await apiService.getExams(params);
      setExams(examsData);
      
      // Reset exam and examDate if they're not valid anymore
      if (formik.values.exam && !examsData.find(e => e.id === Number(formik.values.exam))) {
        formik.setFieldValue('exam', '');
        formik.setFieldValue('examDate', '');
      }
      
      setLocalLoading(prev => ({ ...prev, exams: false }));
    } catch (error) {
      console.error('Error loading exams:', error);
      setError(t('common.error'));
      setLocalLoading(prev => ({ ...prev, exams: false }));
    }
  };

  const loadExamDates = async () => {
    try {
      setLocalLoading(prev => ({ ...prev, examDates: true }));
      setError(null);
      
      const params = {
        exam: Number(formik.values.exam),
        region: Number(formik.values.region),
      };
      
      console.log('Loading exam dates with params:', params);
      const examDatesData = await apiService.getExamDates(params);
      console.log('Loaded exam dates:', examDatesData);
      
      setExamDates(examDatesData);
      
      // Update available dates for calendar
      const dates = examDatesData.map(ed => new Date(ed.date));
      setAvailableDates(dates);
      
      console.log('Available dates set:', dates.map(d => d.toISOString()));
      
      // Reset examDate if it's not valid anymore
      if (formik.values.examDate && !examDatesData.find(ed => ed.id === Number(formik.values.examDate))) {
        formik.setFieldValue('examDate', '');
        setSelectedDate(null);
      }
      
      setLocalLoading(prev => ({ ...prev, examDates: false }));
    } catch (error) {
      console.error('Error loading exam dates:', error);
      setError(t('common.error'));
      setLocalLoading(prev => ({ ...prev, examDates: false }));
      // Clear dates on error
      setExamDates([]);
      setAvailableDates([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  const handleDateChange = (date: Dayjs | null) => {
    console.log('handleDateChange called with:', date?.format('YYYY-MM-DD'));
    setSelectedDate(date);
    
    if (date) {
      // Find the exam date that matches the selected date using consistent date comparison
      const matchingExamDate = examDates.find(ed => {
        const examDateDayjs = dayjs(ed.date);
        return examDateDayjs.format('YYYY-MM-DD') === date.format('YYYY-MM-DD');
      });
      
      console.log('Matching exam date found:', matchingExamDate);
      
      if (matchingExamDate) {
        formik.setFieldValue('examDate', String(matchingExamDate.id));
        console.log('Set examDate to:', matchingExamDate.id);
      } else {
        formik.setFieldValue('examDate', '');
        console.log('No matching exam date, cleared examDate');
      }
    } else {
      formik.setFieldValue('examDate', '');
      console.log('Date is null, cleared examDate');
    }
  };

  const shouldDisableDate = (date: Dayjs) => {
    if (!date || !availableDates.length) return true;
    
    return !availableDates.some(availableDate => {
      const availableDateDayjs = dayjs(availableDate);
      return availableDateDayjs.format('YYYY-MM-DD') === date.format('YYYY-MM-DD');
    });
  };

  const getDateAvailability = (date: Dayjs) => {
    if (!date || !examDates.length) return null;
    
    const matchingExamDate = examDates.find(ed => {
      // Use dayjs for consistent date comparison
      const examDateDayjs = dayjs(ed.date);
      return examDateDayjs.format('YYYY-MM-DD') === date.format('YYYY-MM-DD');
    });
    
    // Debug only for first few dates to avoid spam
    if (examDates.length > 0 && date.date() <= 3) {
      console.log('getDateAvailability:', {
        dateFormatted: date.format('YYYY-MM-DD'),
        examDatesCount: examDates.length,
        matchingExamDate: matchingExamDate ? {
          id: matchingExamDate.id,
          date: matchingExamDate.date,
          status: matchingExamDate.availability_status
        } : null
      });
    }
    
    return matchingExamDate ? matchingExamDate.availability_status : null;
  };

  // Define CustomDay outside of render to prevent re-creation
  const CustomDay = React.useMemo(() => {
    return (props: any) => {
      const { day, ...otherProps } = props;

      // Early return if day is invalid
      if (!day) {
        return <PickersDay {...otherProps} day={day} />;
      }

      const availabilityStatus = getDateAvailability(day);

      // Color mapping functions using constants for consistency
      const getColors = () => {
        if (!availabilityStatus) {
          return { main: 'transparent', light: 'transparent', icon: '' };
        }

        switch (availabilityStatus) {
          case 'full':
            return AVAILABILITY_COLORS.full;
          case 'half':
            return AVAILABILITY_COLORS.half;
          case 'available':
            return AVAILABILITY_COLORS.available;
          default:
            return { main: 'transparent', light: 'transparent', icon: '' };
        }
      };

      const colors = getColors();

      // Debug log for ALL days
      if (typeof window !== 'undefined') {
        console.log('[CustomDay] Rendering day:', day?.format('YYYY-MM-DD'), 'Status:', availabilityStatus, 'Colors:', colors);
      }

      // Remove event.stopPropagation() to allow proper date selection
      const handleDayClick = (event: React.MouseEvent) => {
        if (availabilityStatus) {
          console.log('CustomDay clicked:', day?.format('YYYY-MM-DD'), 'Status:', availabilityStatus);
        }
        // Let the original onClick handler run
        if (otherProps.onClick) {
          otherProps.onClick(event);
        }
      };

      // Base styles for ALL days (with or without availability)
      const baseStyles = {
        position: 'relative !important',
        transition: 'all 0.2s ease',
        // Set text color - always dark for visibility
        color: '#1C1917 !important',
        fontWeight: '500 !important',
        // Mobile-first: explicit sizing with !important to override MUI defaults
        fontSize: '0.875rem !important',
        width: '40px !important',
        height: '40px !important',
        minWidth: '40px !important',
        minHeight: '40px !important',
        display: 'inline-flex !important',
        alignItems: 'center !important',
        justifyContent: 'center !important',
        // Ensure text is visible and not hidden
        visibility: 'visible !important',
        opacity: '1 !important',

        // Target MUI PickersDay internal button
        '& button': {
          color: '#1C1917 !important',
          fontSize: 'inherit !important',
        },

        // Target all possible text elements in MUI PickersDay
        '& *': {
          color: '#1C1917 !important',
          visibility: 'visible !important',
          opacity: '1 !important',
        },

        // Target MUI internal classes
        '& .MuiButtonBase-root': {
          color: '#1C1917 !important',
        },

        '& .MuiPickersDay-root': {
          color: '#1C1917 !important',
        },

        // Tablet (sm: 600px+)
        '@media (min-width: 600px)': {
          fontSize: '0.9375rem !important',
          width: '46px !important',
          height: '46px !important',
          minWidth: '46px !important',
          minHeight: '46px !important',
        },

        // Medium (md: 900px+)
        '@media (min-width: 900px)': {
          fontSize: '0.9375rem !important',
          width: '48px !important',
          height: '48px !important',
          minWidth: '48px !important',
          minHeight: '48px !important',
        },

        // Desktop (lg: 1200px+)
        '@media (min-width: 1200px)': {
          fontSize: '1rem !important',
          width: '52px !important',
          height: '52px !important',
          minWidth: '52px !important',
          minHeight: '52px !important',
        },

        '&.Mui-selected': {
          backgroundColor: '#0284C7 !important',
          color: '#FFFFFF !important',
          fontWeight: '700 !important',
          '& *': {
            color: '#FFFFFF !important',
          },
          '&:hover': {
            backgroundColor: '#0369A1 !important',
            color: '#FFFFFF !important',
          }
        },

        // Ensure disabled days are properly styled
        '&.Mui-disabled': {
          backgroundColor: 'transparent !important',
          border: '2px solid transparent !important',
          color: '#A8A29E !important',
          '& *': {
            color: '#A8A29E !important',
          },
        },
      };

      // Styles specific to days with availability status
      const availabilityStyles = availabilityStatus ? {
        backgroundColor: colors.light,
        border: `2px solid ${colors.main}`,
        borderRadius: modernBorderRadius.md,

        '&:hover': {
          backgroundColor: colors.light,
          transform: 'scale(1.02)',
          color: '#1C1917 !important',
        },

        '&.Mui-selected': {
          backgroundColor: `${colors.main} !important`,
          color: '#FFFFFF !important',
          '&:hover': {
            backgroundColor: `${colors.main} !important`,
          }
        },
      } : {
        // No availability - simple border
        borderRadius: modernBorderRadius.md,

        '&:hover': {
          backgroundColor: '#FAFAF9',
          transform: 'scale(1.02)',
        },
      };

      // Manually merge styles to ensure media queries work correctly
      const mergedStyles = {
        ...baseStyles,
        ...availabilityStyles,
        // Ensure base styles are not overridden
        color: baseStyles.color,
        fontWeight: baseStyles.fontWeight,
        fontSize: baseStyles.fontSize,
        width: baseStyles.width,
        height: baseStyles.height,
        minWidth: baseStyles.minWidth,
        minHeight: baseStyles.minHeight,
        display: baseStyles.display,
        alignItems: baseStyles.alignItems,
        justifyContent: baseStyles.justifyContent,
      };

      // Merge badge back into sx to maintain grid layout
      const finalStyles = {
        ...mergedStyles,
        // Badge as ::before to not break grid
        ...(availabilityStatus ? {
          '&::before': {
            content: `"${colors.icon}"`,
            position: 'absolute',
            top: '-3px',
            right: '-3px',
            width: '15px',
            height: '15px',
            borderRadius: '50%',
            backgroundColor: 'white',
            border: `2px solid ${colors.main}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '9px',
            fontWeight: 700,
            color: colors.main,
            lineHeight: 1,
            zIndex: 10,
            boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            pointerEvents: 'none',
          },
          '@media (min-width: 600px)': {
            '&::before': {
              width: '16px',
              height: '16px',
              fontSize: '10px',
            }
          },
          '@media (min-width: 900px)': {
            '&::before': {
              width: '17px',
              height: '17px',
              fontSize: '11px',
            }
          },
          '@media (min-width: 1200px)': {
            '&::before': {
              top: '-4px',
              right: '-4px',
              width: '18px',
              height: '18px',
              fontSize: '12px',
            }
          },
        } : {}),
      };

      return (
        <PickersDay
          {...otherProps}
          day={day}
          onClick={handleDayClick}
          sx={finalStyles}
          style={{
            color: '#1C1917',
            fontSize: '0.875rem',
            width: '40px',
            height: '40px',
            minWidth: '40px',
            minHeight: '40px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            visibility: 'visible',
            opacity: 1,
          }}
        />
      );
    };
  }, [examDates]); // Re-create only when examDates change

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h2" gutterBottom sx={{
        fontSize: { xs: '20px', sm: '24px', md: '28px' },
        fontWeight: 600,
        mb: { xs: 2, sm: 3, md: 4 },
        color: 'text.primary'
      }}>
        {t('exam_selection.title')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: { xs: 2, sm: 3, md: 4 }, borderRadius: modernBorderRadius.xs }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3, md: 4 } }}>
        {/* Exam Name - First step */}
        <FormControl fullWidth>
          <InputLabel>{t('exam_selection.exam_name')}</InputLabel>
          {loading.examNames ? (
            <Skeleton variant="rectangular" height={56} />
          ) : (
            <Select
              name="examName"
              value={formik.values.examName}
              onChange={formik.handleChange}
              error={formik.touched.examName && Boolean(formik.errors.examName)}
              label={t('exam_selection.exam_name')}
            >
              <MenuItem value="">{t('exam_selection.exam_name_placeholder')}</MenuItem>
              {examNames.map((examName) => (
                <MenuItem key={examName.id} value={examName.id}>
                  {examName.name}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>


        {/* Region - Third step */}
        <FormControl fullWidth>
          <InputLabel>{t('exam_selection.region')}</InputLabel>
          {loading.regions ? (
            <Skeleton variant="rectangular" height={56} />
          ) : (
            <Select
              name="region"
              value={formik.values.region}
              onChange={formik.handleChange}
              error={formik.touched.region && Boolean(formik.errors.region)}
              label={t('exam_selection.region')}
            >
              <MenuItem value="">{t('exam_selection.region_placeholder')}</MenuItem>
              {regions.map((region) => (
                <MenuItem key={region.id} value={region.id}>
                  {region.name}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>

        {/* Exam */}
        <FormControl fullWidth>
          <InputLabel>{t('exam_selection.exam')}</InputLabel>
          {loading.exams ? (
            <Skeleton variant="rectangular" height={56} />
          ) : (
            <Select
              name="exam"
              value={formik.values.exam}
              onChange={formik.handleChange}
              error={formik.touched.exam && Boolean(formik.errors.exam)}
              label={t('exam_selection.exam')}
              disabled={exams.length === 0}
            >
              <MenuItem value="">{t('exam_selection.exam_placeholder')}</MenuItem>
              {exams.map((exam) => (
                <MenuItem key={exam.id} value={exam.id}>
                  {exam.name}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>

        {/* Exam Date */}
        <Box>
          <Typography variant="h4" gutterBottom sx={{
            fontWeight: 600,
            mb: { xs: 2, sm: 3, md: 4 },
            fontSize: { xs: '16px', sm: '18px', md: '20px' }
          }}>
            {t('exam_selection.exam_date')}
          </Typography>

          {examDates.length === 0 && !loading.examDates && (
            <Alert severity="warning" sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
              {t('exam_selection.no_dates_available')}
            </Alert>
          )}

          {formik.touched.examDate && formik.errors.examDate && (
            <Alert severity="error" sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
              {t(formik.errors.examDate as string)}
            </Alert>
          )}

          {loading.examDates ? (
            <Skeleton variant="rectangular" height={320} sx={{ borderRadius: modernBorderRadius.xs }} />
          ) : (
            <>
              {/* Debug info */}
              <Box sx={{
                mb: { xs: 2, sm: 3, md: 4 },
                p: { xs: 2, sm: 2.5, md: 3 },
                backgroundColor: modernColors.gray[50],
                borderRadius: modernBorderRadius.md
              }}>
                <Typography variant="caption">
                  {t('exam_selection.debug_exam_dates')}: {examDates.length}, {t('exam_selection.debug_available')}: {availableDates.length}
                  {selectedDate && `, ${t('exam_selection.debug_selected')}: ${selectedDate.format('YYYY-MM-DD')}`}
                </Typography>
              </Box>

              <SurfaceCard surfaceVariant="elevated" sx={{
                p: { xs: 2, sm: 3, md: 4, lg: 6 },
                width: '100%',
                maxWidth: '100%',
              }}>
              <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', lg: 'row' },
                gap: { xs: 3, sm: 4, lg: 6 },
                alignItems: { xs: 'flex-start', lg: 'flex-start' },
                width: '100%',
              }}>
                {/* Calendar */}
                <Box sx={{
                  flex: { xs: '0 0 auto', lg: '1 1 65%' },
                  display: 'flex',
                  justifyContent: { xs: 'center', sm: 'center' },
                  width: '100%',
                  minHeight: { xs: '380px', sm: '420px', md: '450px', lg: '500px' },
                  maxHeight: { xs: 'none', sm: 'none' },
                  overflow: 'visible',
                }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StaticDatePicker
                      value={selectedDate}
                      onChange={handleDateChange}
                      shouldDisableDate={shouldDisableDate}
                      disabled={examDates.length === 0}
                      minDate={dayjs()}
                      maxDate={dayjs().add(6, 'month')}
                      displayStaticWrapperAs="desktop"
                      slots={{
                        day: CustomDay,
                      }}
                      slotProps={{
                        layout: {
                          sx: {
                            width: '100%',
                            maxWidth: '100%',

                            '& .MuiDateCalendar-root': {
                              backgroundColor: 'transparent',
                              width: '100%',
                              maxWidth: '100%',
                              height: 'auto',
                              minHeight: { xs: 'auto', sm: 'auto', md: '450px', lg: '500px' },

                              // Mobile specific fixes
                              '@media (max-width: 899px)': {
                                width: '100% !important',
                                maxWidth: '100% !important',
                              },
                            },
                            '& .MuiPickersCalendarHeader-root': {
                              paddingLeft: { xs: 1, sm: 1.5, md: 2 },
                              paddingRight: { xs: 1, sm: 1.5, md: 2 },
                              marginBottom: { xs: 1, sm: 1.5, md: 2 },
                            },
                            '& .MuiDayCalendar-root': {
                              height: 'auto',
                              width: '100%',

                              // Mobile: ensure full width
                              '@media (max-width: 899px)': {
                                width: '100% !important',
                              },
                            },
                            '& .MuiDayCalendar-header': {
                              justifyContent: 'space-between',
                              paddingLeft: { xs: '6px', sm: '6px', md: '8px', lg: '8px' },
                              paddingRight: { xs: '6px', sm: '6px', md: '8px', lg: '8px' },
                              marginBottom: { xs: '6px', sm: '8px', md: '8px', lg: '10px' },
                            },
                            '& .MuiDayCalendar-weekDayLabel': {
                              width: { xs: '40px', sm: '46px', md: '48px', lg: '52px' },
                              height: { xs: '40px', sm: '46px', md: '48px', lg: '52px' },
                              fontSize: { xs: '0.75rem', sm: '0.8125rem', md: '0.8125rem', lg: '0.875rem' },
                              margin: 0,
                              fontWeight: 600,
                            },
                            '& .MuiDayCalendar-slideTransition': {
                              minHeight: { xs: 'auto', sm: 'auto', md: '320px', lg: '340px' },
                              overflow: 'visible !important',

                              // Mobile: calculate height for 6 weeks
                              '@media (max-width: 599px)': {
                                minHeight: 'calc(6 * 40px + 5 * 6px) !important', // 6 rows * 40px + 5 gaps * 6px = 270px
                                height: 'auto !important',
                              },

                              // Tablet
                              '@media (min-width: 600px) and (max-width: 899px)': {
                                minHeight: 'calc(6 * 46px + 5 * 6px) !important', // 6 rows * 46px + 5 gaps * 6px = 306px
                                height: 'auto !important',
                              },
                            },
                            '& .MuiDayCalendar-monthContainer': {
                              height: 'auto',
                              minHeight: { xs: 'auto', sm: 'auto', md: 'auto' },

                              // Mobile: ensure it takes full height
                              '@media (max-width: 899px)': {
                                height: 'auto !important',
                                display: 'flex !important',
                                flexDirection: 'column !important',
                              },
                            },
                            '& .MuiDayCalendar-weekContainer': {
                              justifyContent: 'space-between',
                              margin: 0,
                              marginBottom: { xs: '6px', sm: '6px', md: '6px', lg: '6px' },
                              paddingLeft: { xs: '6px', sm: '6px', md: '8px', lg: '8px' },
                              paddingRight: { xs: '6px', sm: '6px', md: '8px', lg: '8px' },
                              height: { xs: '40px', sm: '46px', md: '48px', lg: '52px' },

                              // Mobile: enforce height with !important
                              '@media (max-width: 899px)': {
                                height: '40px !important',
                                minHeight: '40px !important',
                                maxHeight: '40px !important',
                                display: 'flex !important',
                                alignItems: 'center !important',
                                justifyContent: 'space-between !important',
                                marginBottom: '6px !important',
                              },

                              // Tablet
                              '@media (min-width: 600px) and (max-width: 899px)': {
                                height: '46px !important',
                                minHeight: '46px !important',
                                maxHeight: '46px !important',
                              },

                              // Medium
                              '@media (min-width: 900px) and (max-width: 1199px)': {
                                height: '48px !important',
                                minHeight: '48px !important',
                                maxHeight: '48px !important',
                              },

                              // Desktop
                              '@media (min-width: 1200px)': {
                                height: '52px !important',
                                minHeight: '52px !important',
                                maxHeight: '52px !important',
                              },
                            },
                            '& .MuiPickersDay-root': {
                              borderRadius: modernBorderRadius.md,
                              margin: 0,
                              fontSize: { xs: '0.875rem', sm: '0.9375rem', md: '0.9375rem', lg: '1rem' },
                              width: { xs: '40px', sm: '46px', md: '48px', lg: '52px' },
                              height: { xs: '40px', sm: '46px', md: '48px', lg: '52px' },
                              fontWeight: 500,

                              // Mobile: ensure visibility and proper sizing
                              '@media (max-width: 899px)': {
                                color: '#1C1917 !important',
                                fontSize: '0.875rem !important',
                                width: '40px !important',
                                height: '40px !important',
                                minWidth: '40px !important',
                                minHeight: '40px !important',
                                display: 'flex !important',
                                alignItems: 'center !important',
                                justifyContent: 'center !important',
                              },

                              // Tablet
                              '@media (min-width: 600px) and (max-width: 899px)': {
                                fontSize: '0.9375rem !important',
                                width: '46px !important',
                                height: '46px !important',
                                minWidth: '46px !important',
                                minHeight: '46px !important',
                              },

                              '&.Mui-disabled': {
                                color: 'text.disabled',
                                backgroundColor: 'transparent',
                              },
                            },
                          }
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Box>

                {/* Calendar Legend */}
                <Box sx={{
                  flex: { xs: '0 0 auto', lg: '1 1 35%' },
                  p: { xs: 2.5, sm: 3, md: 4 },
                  backgroundColor: modernColors.gray[50],
                  borderRadius: modernBorderRadius.xxs,
                  border: `1px solid ${modernColors.gray[200]}`,
                  width: { xs: '100%', lg: 'auto' },
                  alignSelf: { xs: 'stretch', lg: 'flex-start' },
                }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('exam_selection.legend')}:
                </Typography>
                <Box sx={{
                  display: 'flex',
                  gap: { xs: 2, sm: 3, md: 4 },
                  flexWrap: 'wrap'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      width: '24px',
                      height: '24px',
                      borderRadius: modernBorderRadius.sm + 'px',
                      backgroundColor: AVAILABILITY_COLORS.available.light,
                      border: `2px solid ${AVAILABILITY_COLORS.available.main}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}>
                      <Box sx={{
                        position: 'absolute',
                        top: '0px',
                        right: '0px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        border: `2px solid ${AVAILABILITY_COLORS.available.main}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '6px',
                        color: AVAILABILITY_COLORS.available.main,
                        fontWeight: 'bold'
                      }}>{AVAILABILITY_COLORS.available.icon}</Box>
                    </Box>
                    <Typography variant="caption">{t('exam_selection.available')}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      width: '24px',
                      height: '24px',
                      borderRadius: modernBorderRadius.sm + 'px',
                      backgroundColor: AVAILABILITY_COLORS.half.light,
                      border: `2px solid ${AVAILABILITY_COLORS.half.main}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}>
                      <Box sx={{
                        position: 'absolute',
                        top: '0px',
                        right: '0px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        border: `2px solid ${AVAILABILITY_COLORS.half.main}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '6px',
                        color: AVAILABILITY_COLORS.half.main,
                        fontWeight: 'bold'
                      }}>{AVAILABILITY_COLORS.half.icon}</Box>
                    </Box>
                    <Typography variant="caption">{t('exam_selection.half_full')}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      width: '24px',
                      height: '24px',
                      borderRadius: modernBorderRadius.sm + 'px',
                      backgroundColor: AVAILABILITY_COLORS.full.light,
                      border: `2px solid ${AVAILABILITY_COLORS.full.main}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}>
                      <Box sx={{
                        position: 'absolute',
                        top: '0px',
                        right: '0px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        border: `2px solid ${AVAILABILITY_COLORS.full.main}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '6px',
                        color: AVAILABILITY_COLORS.full.main,
                        fontWeight: 'bold'
                      }}>{AVAILABILITY_COLORS.full.icon}</Box>
                    </Box>
                    <Typography variant="caption">{t('exam_selection.full')}</Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {t('exam_selection.availability_explanation')}
                </Typography>
                </Box>
              </Box>

              {selectedDate && (
                <Box sx={{
                  mt: { xs: 2, sm: 2 },
                  p: { xs: 2, sm: 2.5, md: 3 },
                  backgroundColor: modernColors.primary[50],
                  borderRadius: modernBorderRadius.xxs,
                  border: `1px solid ${modernColors.primary[200]}`
                }}>
                  <Typography variant="body2" sx={{
                    color: modernColors.primary[700],
                    mb: 0.5,
                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                  }}>
                    {t('exam_selection.selected_date')}:
                  </Typography>
                  <Typography variant="body1" sx={{
                    fontWeight: 600,
                    mb: 1,
                    color: modernColors.gray[900],
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}>
                    {selectedDate.format('DD MMMM YYYY')}
                  </Typography>
                  
                  {(() => {
                    const selectedExamDate = examDates.find(ed => {
                      const examDateDayjs = dayjs(ed.date);
                      return examDateDayjs.format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD');
                    });
                    
                    if (selectedExamDate) {
                      return (
                        <Box>
                          <Typography variant="body2" sx={{ color: modernColors.gray[700], mb: 1 }}>
                            <strong>{t('exam_selection.availability')}:</strong> {selectedExamDate.booked}/{selectedExamDate.capacity} 
                            ({selectedExamDate.availability_percentage.toFixed(1)}%)
                          </Typography>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2, 
                            mt: 1 
                          }}>
                            <Box sx={{ 
                              width: '120px', 
                              height: '8px', 
                              backgroundColor: modernColors.gray[200],
                              borderRadius: modernBorderRadius.sm + 'px',
                              overflow: 'hidden'
                            }}>
                              <Box sx={{ 
                                width: `${selectedExamDate.availability_percentage}%`,
                                height: '100%',
                                backgroundColor: selectedExamDate.availability_status === 'full' 
                                  ? AVAILABILITY_COLORS.full.main 
                                  : selectedExamDate.availability_status === 'half' 
                                    ? AVAILABILITY_COLORS.half.main 
                                    : AVAILABILITY_COLORS.available.main,
                                transition: 'width 0.3s ease'
                              }} />
                            </Box>
                            <Typography variant="body2" sx={{ 
                              color: selectedExamDate.availability_status === 'full' 
                                ? AVAILABILITY_COLORS.full.main 
                                : selectedExamDate.availability_status === 'half' 
                                  ? AVAILABILITY_COLORS.half.main 
                                  : AVAILABILITY_COLORS.available.main,
                              fontWeight: 600
                            }}>
                              {t(`exam_selection.${selectedExamDate.availability_status}`)}
                            </Typography>
                          </Box>

                          {/* Warning message when date is full */}
                          {selectedExamDate.availability_status === 'full' && (
                            <Alert
                              severity="error"
                              sx={{
                                mt: 2,
                                borderRadius: modernBorderRadius.xxs,
                                backgroundColor: AVAILABILITY_COLORS.full.light,
                                color: AVAILABILITY_COLORS.full.main,
                                '& .MuiAlert-icon': {
                                  color: AVAILABILITY_COLORS.full.main,
                                }
                              }}
                            >
                              {t('exam_selection.date_full_warning')}
                            </Alert>
                          )}
                        </Box>
                      );
                    }
                    return null;
                  })()}
                </Box>
              )}
            </SurfaceCard>
            </>
          )}
        </Box>

        {/* Price Display */}
        {selectedExam && (
          <SurfaceCard surfaceVariant="elevated" sx={{ mt: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontSize: '18px', fontWeight: 600 }}>
                  {t('exam_selection.amount')}:
                </Typography>
                <Chip 
                  label={`${selectedExam.amount} so'm`}
                  color="primary"
                  size="medium"
                  sx={{
                    borderRadius: modernBorderRadius.xs,
                    fontWeight: 600,
                    fontSize: '14px',
                    px: 2,
                    py: 1,
                    height: 'auto',
                  }}
                />
              </Box>
            </CardContent>
          </SurfaceCard>
        )}
      </Box>

      {/* Navigation Button */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        mt: { xs: 4, sm: 6, md: 8 }
      }}>
        <FilledButton
          type="submit"
          disabled={
            !formik.values.examName ||
            !formik.values.region ||
            !formik.values.exam ||
            !formik.values.examDate ||
            !formik.isValid ||
            (() => {
              // Check if selected date is full
              const selectedExamDate = examDates.find(ed => ed.id === Number(formik.values.examDate));
              return selectedExamDate?.availability_status === 'full';
            })()
          }
          sx={{
            width: { xs: '100%', sm: 'auto' },
            borderRadius: modernBorderRadius.xs,
          }}
        >
          {t('common.next')}
        </FilledButton>
      </Box>
    </Box>
  );
};

export default ExamSelectionStep;