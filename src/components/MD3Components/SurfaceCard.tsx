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
              borderColor: modernColors.gray[200],
            },
          };
        case 'elevated':
          return {
            backgroundColor: modernColors.surface.primary,
            border: `1px solid ${modernColors.gray[200]}`,
            '&:hover': {
              borderColor: modernColors.gray[300],
            },
          };
        case 'outlined':
          return {
            backgroundColor: modernColors.surface.primary,
            border: `1px solid ${modernColors.primary[200]}`,
            '&:hover': {
              borderColor: modernColors.primary[300],
              backgroundColor: modernColors.primary[50],
            },
          };
        case 'subtle':
          return {
            backgroundColor: modernColors.surface.secondary,
            border: `1px solid ${modernColors.gray[200]}`,
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
              borderColor: modernColors.gray[200],
            },
          };
      }
    };

    return {
      borderRadius: modernBorderRadius.xs,
      boxShadow: 'none',
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