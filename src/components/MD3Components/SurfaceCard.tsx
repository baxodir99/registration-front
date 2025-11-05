import React from 'react';
import { Card, CardProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { modernColors, modernBorderRadius } from '../../theme/modernTheme';

// Modern Surface variants - Clean and simple
type SurfaceVariant = 'default' | 'elevated' | 'outlined' | 'subtle';

interface SurfaceCardProps extends Omit<CardProps, 'variant'> {
  surfaceVariant?: SurfaceVariant;
  children: React.ReactNode;
}

const ModernSurfaceCard = styled(Card)<{ surfaceVariant: SurfaceVariant }>(
  ({ theme, surfaceVariant }) => {
    const getStyles = () => {
      switch (surfaceVariant) {
        case 'default':
          return {
            backgroundColor: modernColors.surface.primary,
            border: `1px solid ${modernColors.gray[200]}`,
            '&:hover': {
              borderColor: modernColors.gray[300],
            },
          };
        case 'elevated':
          return {
            backgroundColor: modernColors.surface.primary,
            border: `1px solid ${modernColors.gray[300]}`,
            '&:hover': {
              borderColor: modernColors.primary[300],
              transform: 'translateY(-2px)',
            },
          };
        case 'outlined':
          return {
            backgroundColor: modernColors.surface.primary,
            border: `2px solid ${modernColors.primary[200]}`,
            '&:hover': {
              borderColor: modernColors.primary[400],
              backgroundColor: modernColors.primary[50],
            },
          };
        case 'subtle':
          return {
            backgroundColor: modernColors.gray[50],
            border: `1px solid ${modernColors.gray[100]}`,
            '&:hover': {
              backgroundColor: modernColors.surface.primary,
              borderColor: modernColors.gray[200],
            },
          };
        default:
          return {
            backgroundColor: modernColors.surface.primary,
            border: `1px solid ${modernColors.gray[200]}`,
            '&:hover': {
              borderColor: modernColors.gray[300],
            },
          };
      }
    };

    return {
      borderRadius: modernBorderRadius.xl,
      boxShadow: 'none', // No shadows in modern design
      transition: 'all 0.2s ease-in-out',
      ...getStyles(),
    };
  }
);

const SurfaceCard: React.FC<SurfaceCardProps> = ({ 
  surfaceVariant = 'default', 
  children, 
  ...props 
}) => {
  return (
    <ModernSurfaceCard surfaceVariant={surfaceVariant} {...props}>
      {children}
    </ModernSurfaceCard>
  );
};

export default SurfaceCard;