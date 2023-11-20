import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import MuSlider from "../components/slider";
import Takoz from "../components/takoz";
import { useDispatch } from "react-redux";
import { addTask } from "../redux/sliceTasks";
import { useNavigate } from "react-router-dom";


const days = [
  { label: "Monday", value: 0 },
  { label: "Tuesday", value: 1 },
  { label: "Wednesday", value: 2 },
  { label: "Thursday", value: 3 },
  { label: "Friday", value: 4 },
  { label: "Saturday", value: 5 },
  { label: "Sunday", value: 6 },
];

export default function Add() {
  const [name, setName] = useState("");
  const [selectedDays, setSelectedDays] = useState([] as number[]);
  const [duration, setDuration] = useState(20);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="px-2">
      <TextField
        label="Name"
        className="w-full"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <Takoz />

      <FormControl className="w-full">
        <InputLabel>Days</InputLabel>
        <Select
          multiple
          value={selectedDays}
          onChange={(e) => {
            const val = e.target.value as number[];
            setSelectedDays(val);
          }}
          input={<OutlinedInput label="Days" />}
          renderValue={(selected) => (
            <Box className="flex flex-wrap gap-0.5">
              {selected
                .sort((a, b) => a - b)
                .map((value) => (
                  <Chip
                    key={`chip_${value}`}
                    label={days.filter((x) => x.value === value)[0].label}
                  />
                ))}
            </Box>
          )}
        >
          {days.map((day) => (
            <MenuItem key={`menu_item_${day.value}`} value={day.value}>
              {day.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Takoz />

      <MuSlider
        defaultValue={60}
        min={20}
        max={300}
        step={20}
        value={duration}
        onChange={(e) => {
          setDuration(e.target.value);
        }}
        label="Duration"
        unit="mins"
      />
      <Takoz height={"8rem"} />

      <Button
        className="w-full"
        variant="contained"
        size="large"
        onClick={() => {
          dispatch(
            addTask({
              name,
              days: selectedDays,
              duration,
            })
          );
          navigate(-1);
        }}
      >
        Add New Task
      </Button>
    </div>
  );
}
