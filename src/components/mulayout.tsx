import theme from "../utils/theme";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Snackbar,
  SvgIconTypeMap,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import * as icons from "@mui/icons-material";
import { APP_NAME } from "../utils/constants";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { Link, Outlet } from "react-router-dom";

const iconsMap = {
  Info: icons.Info,
  Save: icons.Save,
  Add: icons.AddCircle,
} as Record<string, OverridableComponent<SvgIconTypeMap<{}, "svg">>>;

export interface INavItem {
  icon: string;
  link: string;
}

export interface INotifyingState {
  notificationMessage: string;
  notificationIsoDt: string;
}

export default function MuLayout() {
  const [notify, setNotify] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(
    undefined as string | undefined
  );
  const pageState = useSelector((state: RootState) => state.page);
  const notifications = [
    useSelector((state: RootState) => state.tasks),
  ] as INotifyingState[];

  useEffect(() => {
    document.title = pageState.title;
  }, [pageState]);

  useEffect(() => {
    setNotify(false);
    const lNotifications = [...notifications];
    const latestNotification = lNotifications.sort((a, b) =>
      a.notificationIsoDt > b.notificationIsoDt ? 1 : -1
    )[0];
    const now = new Date();
    if (
      now.getTime() - new Date(latestNotification.notificationIsoDt).getTime() <
      5000
    ) {
      setNotify(false);
      setNotificationMessage(latestNotification.notificationMessage);
      setNotify(true);
    }
  }, [notifications]);

  return (
    <ThemeProvider theme={theme}>
      <AppBar sx={{ boxShadow: 0, bgcolor: "#fff", color: "#000" }}>
        <Container maxWidth="sm">
          <Toolbar disableGutters>
            <Link className="grow" to={"./"}>
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
                  <Link key={`nav_button_${ix}`} to={item.link}>
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

      <Container maxWidth="sm" className="min-h-screen pt-28">
        <Outlet />
        <Snackbar
          open={notify}
          autoHideDuration={6000}
          onClose={() => {
            setNotify(false);
          }}
          message={notificationMessage}
        />
      </Container>
    </ThemeProvider>
  );
}
