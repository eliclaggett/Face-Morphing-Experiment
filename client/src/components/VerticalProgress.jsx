import React from "react";

import { LinearProgress } from "@mui/joy";
import './VerticalProgress.css';


const VerticalProgress = ({determinate, value, className}) => {



  return (
    <LinearProgress determinate={determinate} value={value} className={className} style={{
      '--LinearProgress-progressThickness': value + '%',
      '--_LinearProgress-padding': '1px'}}
    />
  );
};

export default VerticalProgress;