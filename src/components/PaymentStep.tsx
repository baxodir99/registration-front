import React from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Payment as PaymentIcon,
  Launch as LaunchIcon,
  Download as DownloadIcon,
  LocationOn as LocationOnIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { PaymentResponse } from '../types';
import { modernColors, modernBorderRadius } from '../theme/modernTheme';

interface PaymentStepProps {
  paymentData: PaymentResponse;
  onNewRegistration: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  paymentData,
  onNewRegistration,
}) => {
  const { t } = useTranslation();

  const handlePayment = () => {
    if (paymentData.pay_url) {
      window.open(paymentData.pay_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownloadInfo = () => {
    if (paymentData.info_doc) {
      // Create a download link
      const link = document.createElement('a');
      link.href = paymentData.info_doc;
      link.download = `imtihon_malumoti_${paymentData.invoice}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Box sx={{
      width: '100%',
      maxWidth: 1200,
      mx: 'auto',
      p: { xs: 2, sm: 3, md: 4 }
    }}>
      {/* Primary Payment Section */}
      <Box>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: { xs: 4, sm: 5, md: 6 },
          gap: { xs: 2, sm: 0 }
        }}>
          <CheckCircleIcon sx={{
            fontSize: { xs: 40, sm: 48, md: 56 },
            color: 'success.main',
            mr: { xs: 0, sm: 2, md: 3 }
          }} />
          <Box>
            <Typography variant="h3" sx={{
              fontSize: { xs: '24px', sm: '28px', md: '32px' },
              fontWeight: 700,
              color: modernColors.gray[900],
              mb: 1
            }}>
              {t('payment.title')}
            </Typography>
            <Typography variant="body1" sx={{
              color: modernColors.gray[600],
              fontSize: { xs: '14px', sm: '15px', md: '16px' }
            }}>
              Ro'yxatdan o'tish muvaffaqiyatli yakunlandi
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: { xs: 4, sm: 5, md: 6 } }} />

        {/* Invoice Details */}
        <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: { xs: 3, sm: 4 },
            pb: { xs: 2, sm: 3 },
            borderBottom: `1px solid ${modernColors.gray[200]}`,
            gap: { xs: 1, sm: 0 }
          }}>
            <Typography variant="body1" sx={{
              color: modernColors.gray[600],
              fontSize: { xs: '15px', sm: '16px', md: '18px' }
            }}>
              {t('payment.invoice_number')}
            </Typography>
            <Typography variant="h5" sx={{
              fontWeight: 700,
              fontSize: { xs: '18px', sm: '19px', md: '20px' },
              color: modernColors.gray[900]
            }}>
              {paymentData.invoice}
            </Typography>
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: { xs: 1, sm: 0 }
          }}>
            <Typography variant="body1" sx={{
              color: modernColors.gray[600],
              fontSize: { xs: '15px', sm: '16px', md: '18px' }
            }}>
              {t('payment.amount')}
            </Typography>
            <Typography variant="h4" sx={{
              fontWeight: 700,
              fontSize: { xs: '22px', sm: '25px', md: '28px' },
              color: modernColors.primary[600]
            }}>
              {paymentData.amount.toLocaleString()} so'm
            </Typography>
          </Box>
        </Box>

        <Box sx={{
          pl: { xs: 2, sm: 2.5, md: 3 },
          mb: { xs: 4, sm: 5, md: 6 },
          borderLeft: `4px solid ${modernColors.primary[600]}`
        }}>
          <Typography variant="body1" sx={{
            color: modernColors.gray[700],
            fontSize: { xs: '14px', sm: '15px', md: '16px' },
            lineHeight: 1.8
          }}>
            {t('payment.payment_instructions')}
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handlePayment}
          startIcon={<PaymentIcon />}
          endIcon={<LaunchIcon />}
          sx={{
            py: { xs: 2, sm: 2.2, md: 2.5 },
            fontSize: { xs: '15px', sm: '16px', md: '18px' },
            fontWeight: 600,
            backgroundColor: modernColors.primary[600],
            borderRadius: modernBorderRadius.md,
            '&:hover': {
              backgroundColor: modernColors.primary[700],
              transform: 'scale(1.02)',
              transition: 'all 0.2s',
            }
          }}
        >
          {t('payment.pay_now')}
        </Button>

        {/* Exam Information Download - Integrated into Payment Section */}
        {paymentData.info_doc && (
          <Box sx={{
            mt: { xs: 4, sm: 5, md: 6 },
            pt: { xs: 4, sm: 5, md: 6 },
            borderTop: `1px solid ${modernColors.gray[200]}`
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: { xs: 2, sm: 0 }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                <LocationOnIcon sx={{
                  fontSize: { xs: 20, sm: 22, md: 24 },
                  color: modernColors.primary[600],
                  mr: { xs: 1.5, sm: 2 },
                  mt: 0.5
                }} />
                <Box>
                  <Typography variant="body1" sx={{
                    fontWeight: 600,
                    color: modernColors.gray[900],
                    fontSize: { xs: '14px', sm: '15px', md: '16px' }
                  }}>
                    {t('payment.exam_info_title')}
                  </Typography>
                  <Typography variant="body2" sx={{
                    color: modernColors.gray[600],
                    fontSize: { xs: '12px', sm: '13px', md: '14px' },
                    mt: 0.5
                  }}>
                    {t('payment.exam_info_description')}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="text"
                onClick={handleDownloadInfo}
                startIcon={<DownloadIcon />}
                sx={{
                  color: modernColors.primary[600],
                  fontSize: { xs: '13px', sm: '14px' },
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    backgroundColor: modernColors.primary[50],
                  }
                }}
              >
                {t('payment.download_exam_info')}
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* If no exam info, show important info below */}
      {!paymentData.info_doc && (
        <Box sx={{
          mt: { xs: 6, sm: 7, md: 8 },
          pt: { xs: 4, sm: 5, md: 6 },
          borderTop: `1px solid ${modernColors.gray[200]}`
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: { xs: 1.5, sm: 2 },
            maxWidth: 600,
            mx: 'auto',
            px: { xs: 0, sm: 2 }
          }}>
            <InfoIcon sx={{
              fontSize: { xs: 20, sm: 22, md: 24 },
              color: modernColors.primary[600],
              mt: 0.5,
              flexShrink: 0
            }} />
            <Box>
              <Typography variant="body1" sx={{
                fontWeight: 600,
                color: modernColors.gray[900],
                mb: { xs: 1.5, sm: 2 },
                fontSize: { xs: '14px', sm: '15px', md: '16px' }
              }}>
                Muhim:
              </Typography>
              <Typography variant="body2" sx={{
                color: modernColors.gray[600],
                lineHeight: 1.8,
                fontSize: { xs: '13px', sm: '14px' }
              }}>
                • To'lovni amalga oshirgandan keyin, imtihon ma'lumotlari sizning telefon raqamingizga SMS orqali yuboriladi<br />
                • To'lov muvaffaqiyatsiz bo'lgan hollarda, 24 soat ichida qayta urinib ko'ring<br />
                • Savol va muammolar uchun: support@dtm.uz
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* New Registration Button */}
      <Box sx={{
        textAlign: 'center',
        mt: { xs: 6, sm: 7, md: 8 },
        pt: { xs: 4, sm: 5, md: 6 },
        borderTop: `1px solid ${modernColors.gray[200]}`
      }}>
        <Button
          variant="outlined"
          onClick={onNewRegistration}
          size="large"
          sx={{
            px: { xs: 4, sm: 6, md: 8 },
            py: { xs: 1.2, sm: 1.4, md: 1.5 },
            borderRadius: modernBorderRadius.md,
            borderColor: modernColors.gray[400],
            color: modernColors.gray[700],
            fontSize: { xs: '14px', sm: '15px' },
            width: { xs: '100%', sm: 'auto' },
            '&:hover': {
              borderColor: modernColors.gray[600],
              backgroundColor: modernColors.gray[50],
            }
          }}
        >
          {t('payment.new_registration')}
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentStep;