import {
  CheckCircleOutline,
  ChevronLeft,
  ChevronRight,
  RadioButtonUnchecked,
  Refresh
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  ButtonGroup,
  Container,
  Fade,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  SvgIconTypeMap,
} from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { addDays, format, getDay, startOfDay } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MuTakoz from "../components/mutakoz";
import { updatePageState } from "../redux/slicePage";
import { ITaskLog, removeTaskLog, upsertTaskLog } from "../redux/sliceTaskLogs";
import { ITask } from "../redux/sliceTasks";
import { RootState } from "../redux/store";

interface IStep {
  label: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  color: string;
  slotId: number;
}

interface ITaskAnalytics {
  task: ITask;
  completed: number;
  total: number;
}

function getCurrentSlot() {
  let slotId = 0;
  const now = new Date();
  for (let i = 0; i < 24; i++) {
    if (now.getHours() === i) {
      const mins = now.getMinutes();
      slotId = i * 3;
      if (mins > 39) {
        slotId += 2;
      } else if (mins > 19) {
        slotId += 1;
      }
      break;
    }
  }
  return slotId;
}

function convertSlotToTimeString(slotId: number) {
  const hour = Math.floor(slotId / 3);
  const minute = (slotId - hour * 3) * 20;
  const timeString = `${String(hour).padStart(2, "0")}:${String(
    minute
  ).padStart(2, "0")}`;
  return timeString;
}

function getPossibleTasks(tasks: ITask[], targetDate: Date) {
  const targetIsoDate = targetDate.toISOString();
  return tasks.filter(
    (e) =>
      e.startIsoDate <= targetIsoDate && e.days.includes(getDay(targetDate))
  );
}

function calculateDailyTaskAnalytics(
  tasks: ITask[],
  taskLogs: ITaskLog[],
  targetDate: Date
) {
  const possibleTasks = getPossibleTasks(tasks, targetDate);
  const targetIsoDate = targetDate.toISOString();
  const dailyTaskLogs = taskLogs.filter((e) => e.dateIso === targetIsoDate);

  const taskAnalyticsList = [] as ITaskAnalytics[];
  for (let i = 0; i < possibleTasks.length; i++) {
    const completed =
      dailyTaskLogs.filter((e) => e.taskId === possibleTasks[i].id).length * 20;
    const total = possibleTasks[i].duration;
    taskAnalyticsList.push({
      task: possibleTasks[i],
      completed,
      total,
    });
  }

  return taskAnalyticsList;
}

export default function Main() {
  const [targetDate, setTargetDate] = useState(startOfDay(new Date()));
  const [showTargetDate, setShowTargetDate] = useState(true);
  const [showTimeSlotLine, setShowTimeSlotLine] = useState(false);
  const [dailyTaskAnalytics, setDailyTaskAnalytics] = useState(
    [] as ITaskAnalytics[]
  );
  const tasks = useSelector((rootState: RootState) => rootState.tasks.tasks);
  const taskLogs = useSelector(
    (rootState: RootState) => rootState.taskLogs.taskLogs
  );
  const stepperRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [steps, setSteps] = useState([] as IStep[]);
  const [showModal, setShowModal] = useState(false);
  const [taskLog, setTaskLog] = useState({} as ITaskLog);

  useEffect(() => {
    if (steps.length > 0 && showTimeSlotLine === false) {
      const stepperContainer = stepperRef.current;
      const currentSlot = getCurrentSlot();
      if (stepperContainer) {
        stepperContainer.scrollLeft = 80 * currentSlot;
      }
      setShowTimeSlotLine(true);
    }
  }, [steps, showTimeSlotLine]);

  useEffect(() => {
    const localSteps = [] as IStep[];
    const currentSlot = getCurrentSlot();
    const lTaskLogs = taskLogs.filter(
      (e) => e.dateIso === targetDate.toISOString()
    );

    for (let i = 0; i < 24 * 3; i++) {
      const lTaskLog = lTaskLogs.filter((e) => e.slot === i);
      let iconColor = i >= currentSlot ? "#888" : "#ddd";
      let icon = RadioButtonUnchecked;

      if (lTaskLog.length > 0) {
        const lTask = tasks.filter((e) => e.id === lTaskLog[0].taskId)[0];
        icon = CheckCircleOutline;
        iconColor = lTask.color;
      }

      const timeString = convertSlotToTimeString(i);
      localSteps.push({
        label: timeString,
        icon,
        color: iconColor,
        slotId: i,
      });
    }

    setSteps(localSteps);

    setDailyTaskAnalytics(
      calculateDailyTaskAnalytics(tasks, lTaskLogs, targetDate)
    );
  }, [taskLogs, tasks, targetDate]);

  useEffect(() => {
    dispatch(
      updatePageState({
        navItems: [
          { icon: "ImportExport", link: "./importexport" },
          { icon: "List", link: "./task-list" },
        ],
        title: "",
      })
    );
  }, [dispatch]);

  return (
    <div>
      <div className="w-full flex justify-between items-center mb-5">
        <Fade in={showTargetDate}>
          <div className="font-bold text-lg align-middle transition-all">
            {format(targetDate, "LLLL do, E")}
          </div>
        </Fade>

        <div>
          <IconButton
            onClick={() => {
              setShowTargetDate(false);
              setTimeout(() => {
                setTargetDate(addDays(targetDate, -1));
                setShowTargetDate(true);
              }, 200);
            }}
          >
            <ChevronLeft />
          </IconButton>

          <IconButton
            onClick={() => {
              setShowTargetDate(false);
              setTimeout(() => {
                setTargetDate(startOfDay(new Date()));
                setShowTargetDate(true);
              }, 200);
            }}
          >
            <Refresh />
          </IconButton>

          <IconButton
            onClick={() => {
              setShowTargetDate(false);
              setTimeout(() => {
                setTargetDate(addDays(targetDate, 1));
                setShowTargetDate(true);
              }, 200);
            }}
          >
            <ChevronRight />
          </IconButton>
        </div>
      </div>

      <Fade in={showTimeSlotLine}>
        <div className="border-t-2 border-b-2">
          <div className="overflow-y-auto flex py-5" ref={stepperRef}>
            {steps.map((e) => (
              <div
                key={`time_slot_line_item_${e.slotId}`}
                className="h-20 mx-2 p-2 rounded-lg bg-gray-100 shadow-sm cursor-pointer hover:bg-gray-200"
                style={{ minWidth: "4rem" }}
                onClick={() => {
                  const lTaskLogs = taskLogs
                    .filter((le) => le.dateIso === targetDate.toISOString())
                    .filter((le) => e.slotId === le.slot);
                  const lTaskLog =
                    lTaskLogs.length > 0
                      ? lTaskLogs[0] as ITaskLog
                      : {
                          taskId: 0,
                          slot: e.slotId,
                          dateIso: targetDate.toISOString(),
                        } as ITaskLog;
                  setTaskLog(lTaskLog);
                  setShowModal(true);
                }}
              >
                <div className="font-bold">{e.label}</div>
                <div className="flex justify-center items-center mt-1">
                  <e.icon fontSize="large" sx={{ color: e.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Fade>

      <MuTakoz />

      <Fade in={showTargetDate}>
        <List>
          {dailyTaskAnalytics.map((e) => (
            <Link
              key={`task_item_${e.task.id}`}
              to={`./task-detail/${e.task.id}`}
            >
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: e.task.color }}>
                    {e.completed >= e.total ? (
                      <CheckCircleOutline sx={{ color: "black" }} />
                    ) : (
                      <RadioButtonUnchecked sx={{ color: "black" }} />
                    )}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={e.task.name}
                  secondary={
                    e.completed.toString() + " / " + e.total.toString()
                  }
                />
              </ListItemButton>
            </Link>
          ))}
        </List>
      </Fade>

      <Modal
        open={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="flex justify-center items-center p-2"
      >
        <Container
          maxWidth="sm"
          className="w-full bg-white rounded px-2 py-5 flex flex-col items-center"
        >
          <div className="font-bold text-lg mb-5">
            Assign Task - {convertSlotToTimeString(taskLog.slot)}
          </div>

          <FormControl className="w-full">
            <InputLabel>Task</InputLabel>
            <Select
              input={<OutlinedInput label="Task" />}
              value={taskLog.taskId || 0}
              onChange={(e) => {
                setTaskLog({
                  ...taskLog,
                  taskId: (e.target.value as number) || 0,
                });
              }}
            >
              {getPossibleTasks(tasks, targetDate).map((e) => (
                <MenuItem key={`modal_task_select_${e.id}`} value={e.id}>
                  {e.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <ButtonGroup variant="text" className="mt-5 ms-auto">
            <Button
              color="error"
              onClick={() => {
                dispatch(removeTaskLog(taskLog.id || -1));
                setShowModal(false);
              }}
            >
              Clear
            </Button>
            <Button
              color="success"
              onClick={() => {
                dispatch(upsertTaskLog(taskLog));
                setShowModal(false);
              }}
            >
              Save
            </Button>
          </ButtonGroup>
        </Container>
      </Modal>
    </div>
  );
}
