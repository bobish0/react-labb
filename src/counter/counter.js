import React, { useEffect, useState } from 'react';

export const Counter = ({ tasks }) => {
    const [count, setCount] = useState(tasks.length)

    return (
        <p style={{display: 'inline-block', margin: '0 0 0 100px'}}>You have completed {count} tasks</p>
    )
}

