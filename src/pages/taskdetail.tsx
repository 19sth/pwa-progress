import {
  Button,
  ButtonGroup,
  Container,
  LinearProgress,
  Modal,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import MuTakoz from "../components/mutakoz";
import { updatePageState } from "../redux/slicePage";
import { removeTaskLogsByTaskId } from "../redux/sliceTaskLogs";
import { ITask, removeTask } from "../redux/sliceTasks";
import { RootState } from "../redux/store";
import {
  ITaskAnalytics,
  calculateDailyTaskAnalytics,
  getPossibleDates,
} from "../utils/funcs";

export default function TaskDetail() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [todaysIndex, setTodaysIndex] = useState(-1);
  const tasks = useSelector((rootState: RootState) => rootState.tasks.tasks);
  const taskLogs = useSelector(
    (rootState: RootState) => rootState.taskLogs.taskLogs
  );
  const [targetTask, setTargetTask] = useState({} as ITask | undefined);
  const [showModal, setShowModal] = useState(false);
  const [dailyAnalytics, setDailyTaskAnalytics] = useState(
    [] as ITaskAnalytics[]
  );
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    const timelineContainer = timelineRef.current;
    if (timelineContainer) {
      timelineContainer.scrollLeft = 80 * (todaysIndex - 1);
    }
  }, [todaysIndex]);

  useEffect(() => {
    const taskId = parseInt(id as string);
    const localTask = tasks.filter((e) => e.id === taskId)[0];
    const localTaskLogs = taskLogs.filter((e) => e.taskId === taskId);
    setTargetTask(localTask);

    if (localTask !== undefined) {
      const { possibleDates, todayIndex } = getPossibleDates(localTask);
      setTodaysIndex(todayIndex);
      const localDailyAnalytics = [] as ITaskAnalytics[];
      const totalPercentage = 100 * 30;
      let completedPercentage = 0;
      possibleDates.forEach((e) => {
        const analytics = calculateDailyTaskAnalytics(
          [localTask],
          localTaskLogs,
          new Date(e)
        )[0];
        localDailyAnalytics.push(analytics);
        completedPercentage += Math.min(analytics.pct, 100);
      });
      setDailyTaskAnalytics(localDailyAnalytics);
      setTotalPercentage(
        Math.floor((completedPercentage / totalPercentage) * 100)
      );
      setEndDate(new Date(possibleDates[possibleDates.length - 1]));
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
      <div
        className="w-full h-36 overflow-y-auto border-t-2 border-b-2 py-3"
        ref={timelineRef}
      >
        <div className="flex no-wrap">
          {dailyAnalytics.map((e, ix) => (
            <div
              key={`date_${e.dateIso}`}
              className={`h-25 mx-2 p-2 rounded-lg bg-gray-100 shadow-sm cursor-pointer hover:bg-gray-200 ${(ix===todaysIndex)?" brightness-90":""}`}
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
        <span style={{ borderBottom: "5px solid " + targetTask.color }}>
          {targetTask.name}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2 text-xl my-5">
        <div className="col-span-2">Start Date</div>
        <div className="col-span-3 font-bold">
          {format(new Date(targetTask.startIsoDate || 0), "MMM d, y")}
        </div>
        <div className="col-span-2">End Date</div>
        <div className="col-span-3 font-bold">
          {format(new Date(endDate || 0), "MMM d, y")}
        </div>
        <div className="col-span-2">Progress</div>
        <div className="col-span-3 font-bold">
          {totalPercentage} %
        </div>
        <div className="col-span-5" style={{color: targetTask.color}}>
          <LinearProgress variant="determinate" className="brightness-75 shadow rounded-full" value={totalPercentage} color="inherit" sx={{height: 20}}/>
        </div>
      </div>

      <MuTakoz/>

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
