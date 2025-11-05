import React from "react";
import { FormControl, Select, MenuItem, Box, Typography } from "@mui/material";
import { Language as LanguageIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../constants";
import { modernColors, modernBorderRadius } from "../theme/modernTheme";
import { Language } from "../types";

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (language: Language) => {
    i18n.changeLanguage(language);
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LanguageIcon
                fontSize="small"
                sx={{ color: modernColors.gray[600] }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "text.primary",
                  fontWeight: 500,
                  fontSize: "14px",
                }}
              >
                {lang?.flag} {lang?.name}
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
              borderRadius: modernBorderRadius.xs,
              mt: 1,
              border: `1px solid ${modernColors.gray[200]}`,
              boxShadow: "none",
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span style={{ fontSize: "16px" }}>{language.flag}</span>
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
