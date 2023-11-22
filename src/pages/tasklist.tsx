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
import CircleIcon from "@mui/icons-material/Circle";
import { DAYS } from "../utils/constants";

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
  }, []);

  if (tasks.length < 1) {
    return <div className="w-full text-center">There is no defined task.</div>;
  }

  return (
    <div>
      <List>
        {tasks.map((e) => (
          <ListItemButton
            key={`task_item_${e.id}`}
            component="a"
            href={`./task-detail/${e.id}`}
          >
            <ListItemIcon>
              <Box
                className="h-5 w-5 rounded-full border-2 border-black"
                sx={{ backgroundColor: e.color }}
              ></Box>
            </ListItemIcon>
            <ListItemText
              primary={e.name}
              secondary={
                e.days.map((day) =>
                  DAYS.filter(
                    (dayInner) => dayInner.value === day
                  )[0].label.slice(0, 3)
                ).join(",") + " > " + e.duration.toString() + " mins."
              }
            />
          </ListItemButton>
        ))}
        <ListItem></ListItem>
      </List>
    </div>
  );
}
