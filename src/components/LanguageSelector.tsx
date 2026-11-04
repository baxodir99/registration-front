import React from "react";
import { FormControl, Select, MenuItem, Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../constants";
import { modernColors } from "../theme/modernTheme";
import { Language } from "../types";

const LanguageLabel: React.FC<{ short: string; name: string }> = ({ short, name }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Typography
      component="span"
      sx={{ fontSize: "12px", fontWeight: 600, color: modernColors.gray[600] }}
    >
      {short}
    </Typography>
    <Typography component="span" sx={{ fontSize: "14px", fontWeight: 600 }}>
      {name}
    </Typography>
  </Box>
);

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();

  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <Select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value as Language)}
        inputProps={{ "aria-label": t("header.language") }}
        renderValue={(selected) => {
          const lang = LANGUAGES.find((l) => l.code === selected);
          return lang ? <LanguageLabel short={lang.short} name={lang.name} /> : null;
        }}
        sx={{
          minHeight: 44,
          borderRadius: "10px",
          backgroundColor: modernColors.surface.primary,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: modernColors.gray[200],
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: "10px",
              mt: 0.5,
              border: `1px solid ${modernColors.gray[200]}`,
              boxShadow: "none",
            },
          },
        }}
      >
        {LANGUAGES.map((language) => (
          <MenuItem key={language.code} value={language.code} sx={{ minHeight: 44 }}>
            <LanguageLabel short={language.short} name={language.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
