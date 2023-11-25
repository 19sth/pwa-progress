import {
  Button,
  ButtonGroup,
  Container,
  Modal,
  Typography,
} from "@mui/material";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import MuTakoz from "../components/mutakoz";
import { updatePageState } from "../redux/slicePage";
import { ITask, removeTask } from "../redux/sliceTasks";
import { RootState } from "../redux/store";
import { ITaskLog, removeTaskLogsByTaskId } from "../redux/sliceTaskLogs";
import {
  ITaskAnalytics,
  calculateDailyTaskAnalytics,
  getPossibleDates,
} from "../utils/funcs";
import { format } from "date-fns";

export default function TaskDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector((rootState: RootState) => rootState.tasks.tasks);
  const taskLogs = useSelector(
    (rootState: RootState) => rootState.taskLogs.taskLogs
  );
  const [targetTask, setTargetTask] = useState({} as ITask | undefined);
  const [showModal, setShowModal] = useState(false);
  const [dailyAnalytics, setDailyTaskAnalytics] = useState(
    [] as ITaskAnalytics[]
  );

  useEffect(() => {
    const taskId = parseInt(id as string);
    const localTask = tasks.filter((e) => e.id === taskId)[0];
    const localTaskLogs = taskLogs.filter((e) => e.taskId === taskId);
    setTargetTask(localTask);

    if (localTask !== undefined) {
      const possibleDates = getPossibleDates(localTask);
      const localDailyAnalytics = [] as ITaskAnalytics[];
      possibleDates.forEach((e) => {
        const analytics = calculateDailyTaskAnalytics(
          [localTask],
          localTaskLogs,
          new Date(e)
        )[0];
        localDailyAnalytics.push(analytics);
      });
      setDailyTaskAnalytics(localDailyAnalytics);
    }
  }, [tasks, id, taskLogs]);

  useEffect(() => {
    dispatch(
      updatePageState({
        navItems: [],
        title: "detail",
      })
    );
  }, [dispatch]);

  if (!targetTask) {
    return <div></div>;
  }

  return (
    <div className="pt-5">
      <div className="w-full h-36 overflow-y-auto border-t-2 border-b-2 py-3">
        <div className="flex no-wrap">
          {dailyAnalytics.map((e) => (
            <div
              key={`date_${e.dateIso}`}
              className="h-25 mx-2 p-2 rounded-lg bg-gray-100 shadow-sm cursor-pointer hover:bg-gray-200"
              style={{ minWidth: "4rem" }}
              onClick={() => {
                navigate("../", { state: { dateIso: e.dateIso } });
              }}
            >
              <CircularProgress
                sx={{ marginLeft: "3px" }}
                variant="determinate"
                value={e.pct}
              />
              <div
                className="text-xs text-center"
                style={{ marginTop: "-33px" }}
              >
                <div>{e.pct}%</div>
              </div>
              <div className="mt-5 text-center text-sm">
                {format(new Date(e.dateIso), "MMM d")}
              </div>
              <div className="text-center text-xs">
                {format(new Date(e.dateIso), "EEE")}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-3xl font-semibold my-5 w-full">
        {targetTask.name}
      </div>

      <Button
        onClick={() => {
          setShowModal(true);
        }}
        variant="outlined"
        color="error"
      >
        Delete
      </Button>

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
          <Typography>Will you delete this task?</Typography>
          <MuTakoz />
          <ButtonGroup variant="text">
            <Button
              color="error"
              onClick={() => {
                dispatch(removeTask(parseInt(id as string)));
                dispatch(removeTaskLogsByTaskId(parseInt(id as string)));
                navigate(-1);
              }}
            >
              Delete
            </Button>
            <Button
              onClick={() => {
                setShowModal(false);
              }}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </Container>
      </Modal>
    </div>
  );
}
