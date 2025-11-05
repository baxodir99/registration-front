import React from "react";
import { FormControl, Select, MenuItem, Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../constants";
import { modernColors, modernBorderRadius } from "../theme/modernTheme";
import { Language } from "../types";

// SVG Flag component
const FlagIcon: React.FC<{ countryCode: string }> = ({ countryCode }) => {
  return (
    <img
      src={`https://flagcdn.com/w20/${countryCode}.png`}
      srcSet={`https://flagcdn.com/w40/${countryCode}.png 2x`}
      width="20"
      alt={countryCode}
      style={{
        borderRadius: "2px",
        objectFit: "cover",
      }}
    />
  );
};

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (language: Language) => {
    i18n.changeLanguage(language);
  };

  // Map language codes to country codes for flags
  const getFlagCode = (langCode: string) => {
    const flagMap: Record<string, string> = {
      uz: "uz",
      ru: "ru",
      en: "us",
      kaa: "uz",
    };
    return flagMap[langCode] || "uz";
  };

  return (
    <FormControl
      size="small"
      sx={{
        minWidth: 140,
        backgroundColor: modernColors.gray[50],
        border: `1px solid ${modernColors.gray[200]}`,
        borderRadius: modernBorderRadius.xs,
      }}
    >
      <Select
        value={i18n.language}
        onChange={(e) => handleLanguageChange(e.target.value as Language)}
        displayEmpty
        renderValue={(selected) => {
          const lang = LANGUAGES.find((l) => l.code === selected);
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <FlagIcon countryCode={getFlagCode(selected)} />
              <Typography
                variant="body2"
                sx={{
                  color: "text.primary",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                {lang?.name}
              </Typography>
            </Box>
          );
        }}
        sx={{
          "& .MuiSelect-select": {
            py: 1.5,
            px: 2,
            border: "none",
            color: "text.primary",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "& .MuiSvgIcon-root": {
            color: modernColors.gray[600],
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: modernBorderRadius.xxs,
              mt: 0,
              border: `1px solid ${modernColors.gray[200]}`,
              boxShadow: "none",
              "& .MuiList-root": {
                py: 0,
              },
            },
          },
        }}
      >
        {LANGUAGES.map((language) => (
          <MenuItem
            key={language.code}
            value={language.code}
            sx={{
              py: 1.5,
              px: 2,
              "&:hover": {
                backgroundColor: modernColors.gray[50],
              },
              "&.Mui-selected": {
                backgroundColor: modernColors.primary[50],
                "&:hover": {
                  backgroundColor: modernColors.primary[100],
                },
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <FlagIcon countryCode={getFlagCode(language.code)} />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                {language.name}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
