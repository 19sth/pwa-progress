import { RadioButtonUnchecked } from "@mui/icons-material";
import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { updatePageState } from "../redux/slicePage";
import { RootState } from "../redux/store";
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
              <ListItemAvatar>
                <Avatar sx={{bgcolor: e.color}}>
                  <RadioButtonUnchecked sx={{color: "black"}}/>
                </Avatar>
              </ListItemAvatar>
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
      </List>
    </div>
  );
}
