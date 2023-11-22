import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePageState } from "../redux/slicePage";
import { RootState } from "../redux/store";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { DAYS } from "../utils/constants";
import { Link } from "react-router-dom";

export default function TaskList() {
  const tasks = useSelector((rootState: RootState) => rootState.tasks.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      updatePageState({
        navItems: [{ icon: "Add", link: "./task-add" }],
        title: "tasks",
      })
    );
  }, [dispatch]);

  if (tasks.length < 1) {
    return <div className="w-full text-center">There is no defined task.</div>;
  }

  return (
    <div>
      <List>
        {tasks.map((e) => (
          <Link key={`task_item_${e.id}`} to={`../task-detail/${e.id}`}>
            <ListItemButton>
              <ListItemIcon>
                <Box
                  className="h-5 w-5 rounded-full border-2 border-black"
                  sx={{ backgroundColor: e.color }}
                ></Box>
              </ListItemIcon>
              <ListItemText
                primary={e.name}
                secondary={
                  e.days
                    .map((day) =>
                      DAYS.filter(
                        (dayInner) => dayInner.value === day
                      )[0].label.slice(0, 3)
                    )
                    .join(",") +
                  " > " +
                  e.duration.toString() +
                  " mins."
                }
              />
            </ListItemButton>
          </Link>
        ))}
        <ListItem></ListItem>
      </List>
    </div>
  );
}
