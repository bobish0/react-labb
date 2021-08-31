import React, { useEffect, useState } from 'react';
import { Task } from '../app';

interface CounterProps {
    tasks: Task[]
}

export const Counter = ({ tasks }: CounterProps) => {
    const [count, setCount] = useState<number>(tasks.length)

    return (
        <p style={{display: 'inline-block', margin: '0 0 0 100px'}}>You have completed {count} tasks</p>
    )
}

