"use client";

import theme from "@/utils/theme";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  SvgIconTypeMap,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import * as icons from "@mui/icons-material";
import { APP_NAME } from "@/utils/constants";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import Link from "next/link";

const iconsMap = {
  Info: icons.Info,
  Save: icons.Save,
  Add: icons.AddCircle
} as Record<string, OverridableComponent<SvgIconTypeMap<{}, "svg">>>;

export interface INavItem {
  icon: string;
  link: string;
}

export interface ILayoutProps {
  children: React.ReactNode;
}

export default function Layout(props: Readonly<ILayoutProps>) {
  const pageState = useSelector((state: RootState) => state.page);

  return (
    <ThemeProvider theme={theme}>
      <AppBar sx={{ boxShadow: 0 }}>
        <Container maxWidth="sm">
          <Toolbar disableGutters>
            <Link className="grow" href="/">
              <Typography
                className="underline decoration-4 decoration-yellow-300"
                variant="h4"
                fontWeight="bold"
              >
                {APP_NAME}.
              </Typography>
            </Link>
            <Box>
              {pageState.navItems.map((item: INavItem, ix: number) => {
                const IconClass = iconsMap[item.icon] || icons.QuestionMark;
                return (
                  <Link key={`nav_button_${ix}`} href={item.link}>
                    <IconButton>
                      <IconClass className="text-black" />
                    </IconButton>
                  </Link>
                );
              })}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="sm" className="min-h-screen pt-20">
        {props.children}
      </Container>
    </ThemeProvider>
  );
}
