import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updatePageState } from "../redux/slicePage";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { Card, Step, StepLabel, Stepper, SvgIconTypeMap } from "@mui/material";
import { CheckBoxOutlineBlank } from "@mui/icons-material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

interface IStep {
    label: string
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>
}

export default function Main() {
  const dispatch = useDispatch();
  const [steps, setSteps] = useState([] as IStep[]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(()=>{
    const localSteps = [] as IStep[];
    const now = new Date();
    let localActiveStep = 0;
    for (let i=0; i<23; i++) {
        if (now.getHours() === i) {
            localActiveStep = (now.getMinutes() < 30)? i*2 : i*2+1
        }
        localSteps.push({
            label: `${String(i).padStart(2,'0')}:00`,
            icon: CheckBoxOutlineBlank
        });
        localSteps.push({
            label: `${String(i).padStart(2,'0')}:30`,
            icon: CheckBoxOutlineBlank
        });
    }
    setSteps(localSteps);
    setActiveStep(localActiveStep);
  }, [])

  useEffect(() => {
    dispatch(
      updatePageState({
        navItems: [{ icon: "Info", link: "./about" }],
        title: "",
      })
    );
  }, [dispatch]);

  return (
    <div>
      <Card variant="outlined">
        <DateCalendar
          defaultValue={new Date()}
          loading={false}
          onMonthChange={() => {
            console.log("month changed");
          }}
          renderLoading={() => <DayCalendarSkeleton />}
        />
      </Card>

        <Stepper
          alternativeLabel
          activeStep={activeStep}
          className="mt-10 overflow-y-auto py-5"
        >
          {steps.map((e) => (
            <Step key={e.label}>
              <StepLabel StepIconComponent={e.icon}>
                {e.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
    </div>
  );
}
