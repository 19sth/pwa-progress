import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updatePageState } from '../redux/slicePage';

export default function Main() {
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(updatePageState({
            navItems: [
                {icon: "Info", link: "./about"}
            ],
            title: ""
        }));
    }, [dispatch]);

    return (
        <div>
            <h1>HELLO</h1>
        </div>
    )
}