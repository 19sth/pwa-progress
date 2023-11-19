import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Slider,
  TextField,
} from "@mui/material";
import { useState } from "react";

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
  const [selectedDays, setSelectedDays] = useState([] as number[]);

  return (
    <div className="px-5">
      <TextField label="Name" className="w-full" />
      <div className="h-5"></div>

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
      <div className="h-3"></div>

      <FormControl className="w-full">
        <InputLabel>Duration (mins)</InputLabel>
        <Slider
          className="mt-9"
          defaultValue={60}
          valueLabelDisplay="auto"
          step={20}
          marks
          min={20}
          max={300}
        />
      </FormControl>
      <div className="h-32"></div>

      <Button className="w-full" variant="outlined" size="large">Add New Task</Button>
    </div>
  );
}
