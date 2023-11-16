"use client";

import { updatePageState } from "@/redux/slicePage";

import { useEffect } from "react";
import { useDispatch } from "react-redux";


export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      updatePageState({
        navItems: [
          { icon: "Info", link: "https://mujdecisy.github.io" },
          { icon: "Save", link: "https://www.google.com" }
        ],
      })
    );
  }, [dispatch]);

  return (
    <div>
      <h1>HELLO</h1>
    </div>
  );
}
