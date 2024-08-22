import React, { useEffect, useState } from "react";
import { Button, Container, IconButton } from '@mui/joy';
import { ThumbDown, ThumbDownAlt, ThumbDownOutlined, ThumbDownRounded, ThumbUpAlt, ThumbUpOutlined, ThumbUpRounded } from '@mui/icons-material';
import './DislikeButton.css';
import TimerMixin from 'react-timer-mixin';

export default function DislikeButton({setHolding, name}) {

    const [dislikeClass, setDislikeClass] = useState('dislikeBtnContainer');
    const [heldStartTime, setHeldStartTime] = useState(0);

    useEffect(() => {
        window.animationInterval = null;
        window.animationStep = 1;
    }, []);

    function handleMouseDown(e) { 
        setHolding(name, -1);
        setHeldStartTime(new Date());
        if (window.animationInterval) TimerMixin.clearInterval(window.animationInterval);

        window.animationInterval = TimerMixin.setInterval(() => {
            if (window.animationStep == 150) {
                setDislikeClass('dislikeBtnContainer held');
            }
            if (window.animationStep < 150) window.animationStep += 1;
        }, 20);
    }

    function handleMouseUp(e) {
        let diff = (new Date()) - heldStartTime;
        setHolding(name, diff);
        if (window.animationInterval) TimerMixin.clearInterval(window.animationInterval);
        window.animationStep = 1;
        setDislikeClass('dislikeBtnContainer');
    }

  return (
    <div className={dislikeClass}>
        <Button startDecorator={<ThumbDownAlt />} className='dislikeBtn' onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} >Dislike</Button>
    </div>
  );
}
