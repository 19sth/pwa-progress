import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updatePageState } from "../redux/slicePage";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { Step, StepLabel, Stepper, SvgIconTypeMap } from "@mui/material";
import { CheckBoxOutlineBlank } from "@mui/icons-material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { startOfToday } from "date-fns";

interface IStep {
  label: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}

export default function Main() {
  const stepperRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [steps, setSteps] = useState([] as IStep[]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const localSteps = [] as IStep[];
    const now = new Date();
    let localActiveStep = 0;
    for (let i = 0; i < 24; i++) {
      if (now.getHours() === i) {
        const mins = now.getMinutes();
        localActiveStep = i * 3;
        if (mins > 39) {
          localActiveStep += 2;
        } else if (mins > 19) {
          localActiveStep += 1;
        }
      }
      const hourStr = String(i).padStart(2, "0");
      localSteps.push({
        label: `${hourStr}:00`,
        icon: CheckBoxOutlineBlank,
      });
      localSteps.push({
        label: `${hourStr}:20`,
        icon: CheckBoxOutlineBlank,
      });
      localSteps.push({
        label: `${hourStr}:40`,
        icon: CheckBoxOutlineBlank,
      });
    }
    setSteps(localSteps);
    setActiveStep(localActiveStep);

    setTimeout(() => {
      const stepperContainer = stepperRef.current;
      if (stepperContainer) {
        stepperContainer.scrollLeft = 51.789 * localActiveStep;
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
      <DateCalendar
        defaultValue={startOfToday()}
        loading={false}
        renderLoading={() => <DayCalendarSkeleton />}
      />

      <div className="border-t-2 rounded">
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          className="overflow-y-auto py-5 scroll-smooth"
          ref={stepperRef}
        >
          {steps.map((e) => (
            <Step key={e.label}>
              <StepLabel>{e.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
    </div>
  );
}
