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
import MuSlider from "../components/muslider";
import MuTakoz from "../components/mutakoz";
import { useDispatch } from "react-redux";
import { addTask } from "../redux/sliceTasks";
import { useNavigate } from "react-router-dom";
import CircleIcon from '@mui/icons-material/Circle';
import { DAYS } from "../utils/constants";


const colors = [
  { label: "Red", value: "#ffadad"},
  { label: "Orange", value: "#ffd6a5"},
  { label: "Yellow", value: "#fdffb6"},
  { label: "Green", value: "#caffbf"},
  { label: "Blue", value: "#9bf6ff"},
  { label: "Dark Blue", value: "#a0c4ff"},
  { label: "Purple", value: "#bdb2ff"},
  { label: "Pink", value: "#ffc6ff"},
]

export default function TaskAdd() {
  const [name, setName] = useState("");
  const [color, setColor] = useState(colors[0].value);
  const [selectedDays, setSelectedDays] = useState([] as number[]);
  const [duration, setDuration] = useState(20);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="px-2">
      <MuTakoz />

      <TextField
        label="Name"
        className="w-full"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        autoComplete="off"
      />
      <MuTakoz />

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
                    label={DAYS.filter((x) => x.value === value)[0].label}
                  />
                ))}
            </Box>
          )}
        >
          {DAYS.map((day) => (
            <MenuItem key={`menu_item_${day.value}`} value={day.value}>
              {day.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <MuTakoz />

      <FormControl className="w-full">
        <InputLabel>Color</InputLabel>
        <Select
          value={color}
          onChange={(e) => {
            const val = e.target.value as string;
            setColor(val);
          }}
          input={<OutlinedInput label="Color" />}
          renderValue={(color) => (
            <Box>
              {colors.filter(x=>x.value === color)[0].label}
            </Box>
          )}
        >
          {colors.map((color) => (
            <MenuItem key={`menu_item_color_${color.value}`} value={color.value}>
              <CircleIcon sx={{color: color.value}} className="mr-3"/>
              <span>{color.label}</span>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <MuTakoz/>

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
      <MuTakoz height={"8rem"} />

      <Button
        className="w-full"
        variant="contained"
        size="large"
        onClick={() => {
          dispatch(
            addTask({
              name: name.charAt(0).toUpperCase() + name.slice(1),
              days: selectedDays,
              duration,
              color,
              startIsoDate: new Date().toISOString()
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
