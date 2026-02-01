'use client';

import React, { use, useImperativeHandle } from 'react';

interface Props {
    ref: React.RefObject<{
        addTodo: (todo: string) => void;
    } | null>
}

let todoList = ['Todo 1', 'Todo 2', 'Todo 3'];

export const List: React.FC<Props> = (props) => {
    useImperativeHandle(props.ref, () => ({
        addTodo: (todo: string) => {
            todoList.push(todo);
        }
    }));

    return (
        <div>

        </div>
    );
};
