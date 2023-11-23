import { Button, ButtonGroup, Container, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import MuTakoz from "../components/mutakoz";
import { updatePageState } from "../redux/slicePage";
import { ITask, removeTask } from "../redux/sliceTasks";
import { RootState } from "../redux/store";
import { removeTaskLogsByTaskId } from "../redux/sliceTaskLogs";

export default function TaskDetail() {
  const { id } = useParams();
  const tasks = useSelector((rootState: RootState) => rootState.tasks.tasks);
  const [task, setTask] = useState({} as ITask | undefined);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTask(tasks.filter((e) => e.id === parseInt(id as string))[0]);
  }, [tasks, id]);

  useEffect(() => {
    dispatch(
      updatePageState({
        navItems: [],
        title: "detail",
      })
    );
  }, [dispatch]);

  if (!task) {
    return <div></div>;
  }

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        {task.name}
      </Typography>

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
        <Container maxWidth="sm" className="w-full bg-white rounded px-2 py-5 flex flex-col items-center">
          <Typography>Will you delete this task?</Typography>
          <MuTakoz/>
          <ButtonGroup variant="text">
            <Button color="error" onClick={()=>{
                dispatch(removeTask(parseInt(id as string)))
                dispatch(removeTaskLogsByTaskId(parseInt(id as string)))
                navigate(-1);
            }}>Delete</Button>
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
