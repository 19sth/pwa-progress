import { ChevronLeft, ChevronRight, DoDisturb } from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  SvgIconTypeMap
} from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { addDays, format, startOfDay } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePageState } from "../redux/slicePage";
import { ITaskLog, addTaskLog } from "../redux/sliceTaskLogs";
import { RootState } from "../redux/store";

interface IStep {
  label: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  color: string;
  slotId: number;
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

export default function Main() {
  const [targetDate, setTargetDate] = useState(startOfDay(new Date()));
  const tasks = useSelector((rootState: RootState) => rootState.tasks.tasks);
  const stepperRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [steps, setSteps] = useState([] as IStep[]);
  const [showModal, setShowModal] = useState(false);
  const [taskLog, setTaskLog] = useState({} as ITaskLog);

  useEffect(() => {
    const localSteps = [] as IStep[];
    const currentSlot = getCurrentSlot();
    for (let i = 0; i < 24 * 3; i++) {
      const timeString = convertSlotToTimeString(i);
      localSteps.push({
        label: timeString,
        icon: DoDisturb,
        color: "#ccc",
        slotId: i,
      });
    }
    setSteps(localSteps);
    setTimeout(() => {
      const stepperContainer = stepperRef.current;
      if (stepperContainer) {
        stepperContainer.scrollLeft = 80 * currentSlot;
      }
    }, 500);
  }, []);

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
        <div className="font-bold text-lg align-middle">
          {format(targetDate, "LLLL do, E")}
        </div>

        <div>
          <IconButton
            onClick={() => {
              setTargetDate(addDays(targetDate, -1));
            }}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            onClick={() => {
              setTargetDate(addDays(targetDate, 1));
            }}
          >
            <ChevronRight />
          </IconButton>
        </div>
      </div>

      <div className="border-t-2 border-b-2">
        <div className="overflow-y-auto flex py-5" ref={stepperRef}>
          {steps.map((e) => (
            <div
              className="h-20 mx-2 p-2 rounded-lg bg-gray-100 shadow-sm cursor-pointer hover:bg-gray-200"
              style={{ minWidth: "4rem" }}
              onClick={() => {
                setTaskLog({
                  taskId: 0,
                  slot: e.slotId,
                  dateIso: targetDate.toISOString()
                })
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
              {tasks.map((e) => (
                <MenuItem value={e.id}>{e.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <ButtonGroup variant="text" className="mt-5 ms-auto">
            <Button color="error">Clear</Button>
            <Button color="success" onClick={() => {
              dispatch(addTaskLog(taskLog));
              setShowModal(false);
            }}>
              Save
            </Button>
          </ButtonGroup>
        </Container>
      </Modal>
    </div>
  );
}
