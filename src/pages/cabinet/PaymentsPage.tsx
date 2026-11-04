import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { authApi, CabinetPayment } from '../../services/auth';
import { formatDate } from '../../utils/validation';
import { formatMoney } from '../../utils/price';
import { modernColors, statusColors } from '../../theme/modernTheme';

const STATUS = {
  paid: { key: 'payment_paid', ...statusColors.success },
  pending: { key: 'payment_pending', ...statusColors.warning },
  cancelled: { key: 'payment_cancelled', bg: modernColors.gray[50], text: modernColors.gray[600] },
};

const PaymentsPage: React.FC = () => {
  const { t } = useTranslation();
  const [rows, setRows] = useState<CabinetPayment[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    authApi.payments().then(setRows).catch(() => setFailed(true));
  }, []);

  const heads = ['col_date', 'col_invoice', 'col_exam', 'col_amount', 'col_status', 'col_action'];
  const cell = { p: '14px 16px', fontSize: '14px', borderTop: `1px solid ${modernColors.gray[200]}`, whiteSpace: 'nowrap' };

  return (
    <>
      <Typography component="h1" sx={{ m: 0, fontSize: { xs: '24px', sm: '28px' }, fontWeight: 700 }}>{t('cabinet.nav_payments')}</Typography>
      {failed && <Typography sx={{ m: 0, fontSize: '15px' }}>{t('common.error')}</Typography>}
      {rows && rows.length === 0 && (
        <Typography sx={{ m: 0, py: 4, textAlign: 'center', fontSize: '15px', color: modernColors.gray[600] }}>{t('cabinet.no_payments')}</Typography>
      )}
      {rows && rows.length > 0 && (
        <Box sx={{ overflowX: 'auto', borderRadius: '16px', backgroundColor: '#FFFFFF', border: `1px solid ${modernColors.gray[200]}` }}>
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {heads.map((head) => (
                  <Box component="th" scope="col" key={head} sx={{ p: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: modernColors.gray[500], whiteSpace: 'nowrap' }}>
                    {t(`cabinet.${head}`)}
                  </Box>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const status = STATUS[row.status];
                return (
                  <tr key={row.invoice}>
                    <Box component="td" sx={cell}>{formatDate(row.created_at)}</Box>
                    <Box component="td" sx={{ ...cell, fontVariantNumeric: 'tabular-nums' }}>{row.invoice}</Box>
                    <Box component="td" sx={{ ...cell, fontWeight: 600 }}>{row.exam}</Box>
                    <Box component="td" sx={{ ...cell, fontVariantNumeric: 'tabular-nums' }}>{formatMoney(row.amount)} {t('payment.currency')}</Box>
                    <Box component="td" sx={cell}>
                      <Box component="span" sx={{ px: 1.25, py: 0.5, borderRadius: '10px', fontSize: '13px', fontWeight: 600, backgroundColor: status.bg, color: status.text }}>
                        {t(`cabinet.${status.key}`)}
                      </Box>
                    </Box>
                    <Box component="td" sx={cell}>
                      {row.status === 'pending' && (
                        <Link component={RouterLink} to={`/tolov/${row.invoice}`} sx={{ fontWeight: 600 }}>{t('cabinet.pay')}</Link>
                      )}
                    </Box>
                  </tr>
                );
              })}
            </tbody>
          </Box>
        </Box>
      )}
    </>
  );
};

export default PaymentsPage;
