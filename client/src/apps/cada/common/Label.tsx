import PropTypes from "prop-types";
import { forwardRef } from "react";
// @mui
import { alpha, styled, useTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import { Box } from "@mui/material";
import type { BoxProps } from "@mui/material";

// ----------------------------------------------------------------------

type LabelColor = "default" | "primary" | "secondary" | "info" | "success" | "warning" | "error";
type LabelVariant = "filled" | "outlined" | "ghost" | "soft";

interface OwnerState {
  color: LabelColor;
  variant: LabelVariant;
}

interface StyledLabelProps extends BoxProps {
  ownerState?: OwnerState;
  theme?: Theme;
}

export const StyledLabel = styled(Box)<StyledLabelProps>(({ theme, ownerState }) => {
  const os = ownerState as OwnerState;
  const isLight = theme.palette.mode === "light";
  const filledVariant = os?.variant === "filled";
  const outlinedVariant = os?.variant === "outlined";
  const softVariant = os?.variant === "soft";

  const defaultStyle = {
    ...(os?.color === "default" && {
      // OUTLINED
      ...(outlinedVariant && {
        backgroundColor: "transparent",
        color: theme.palette.text.primary,
        border: `1px solid ${alpha(theme.palette.grey[500], 0.32)}`,
      }),
      // SOFT
      ...(softVariant && {
        color: isLight
          ? theme.palette.text.primary
          : theme.palette.common.white,
        backgroundColor: alpha(theme.palette.grey[500], 0.16),
      }),
    }),
  };

  const palette = theme.palette as any;

  const colorStyle = {
    ...(os?.color !== "default" && {
      // FILLED
      ...(filledVariant && {
        color: palette[os?.color]?.contrastText,
        backgroundColor: palette[os?.color]?.main,
      }),
      // OUTLINED
      ...(outlinedVariant && {
        backgroundColor: "transparent",
        color: palette[os?.color]?.main,
        border: `1px solid ${palette[os?.color]?.main}`,
      }),
      // SOFT
      ...(softVariant && {
        color: palette[os?.color]?.[isLight ? "dark" : "light"],
        backgroundColor: alpha(palette[os?.color]?.main, 0.16),
      }),
    }),
  };

  return {
    height: 24,
    minWidth: 22,
    lineHeight: 0,
    borderRadius: 6,
    cursor: "default",
    alignItems: "center",
    whiteSpace: "nowrap",
    display: "inline-flex",
    justifyContent: "center",
    textTransform: "capitalize",
    padding: theme.spacing(0, 1),
    color: theme.palette.grey[800],
    fontSize: theme.typography.pxToRem(12),
    fontFamily: theme.typography.fontFamily,
    backgroundColor: theme.palette.grey[300],
    fontWeight: theme.typography.fontWeightBold,
    ...colorStyle,
    ...defaultStyle,
  };
});

interface LabelProps {
  children?: React.ReactNode;
  color?: LabelColor;
  variant?: LabelVariant;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  sx?: any;
  [key: string]: any;
}

const Label = forwardRef<unknown, LabelProps>(
  (
    {
      children,
      color = "default",
      variant = "soft",
      startIcon,
      endIcon,
      sx,
      ...other
    },
    ref
  ) => {
    const theme = useTheme();

    const iconStyle = {
      width: 16,
      height: 16,
      "& svg, img": { width: 1, height: 1, objectFit: "cover" },
    };

    return (
      <StyledLabel
        ref={ref}
        component={"span" as any}
        ownerState={{ color, variant }}
        sx={{
          ...(startIcon && { pl: 0.75 }),
          ...(endIcon && { pr: 0.75 }),
          ...sx,
        }}
        theme={theme}
        {...other}
      >
        {startIcon && <Box sx={{ mr: 0.75, ...iconStyle }}> {startIcon} </Box>}

        {children}

        {endIcon && <Box sx={{ ml: 0.75, ...iconStyle }}> {endIcon} </Box>}
      </StyledLabel>
    );
  }
);

Label.propTypes = {
  sx: PropTypes.object,
  endIcon: PropTypes.node,
  children: PropTypes.node,
  startIcon: PropTypes.node,
  variant: PropTypes.oneOf(["filled", "outlined", "ghost", "soft"]),
  color: PropTypes.oneOf([
    "default",
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
  ]),
};

export default Label;
