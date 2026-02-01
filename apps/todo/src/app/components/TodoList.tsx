'use client';

import React, { Suspense, useRef } from 'react';
import { List } from './List';

interface Props {

}

export const TodoList: React.FC<Props> = (props) => {
    const listRef = useRef<{
        addTodo: (todo: string) => void;
    }>(null);

    return (
        <div>
            <h1>Todo</h1>
            <form>
                <input type="text" />
                <button>Add</button>
            </form>
            <Suspense fallback={<div>Loading...</div>}>
                <List ref={listRef} />
            </Suspense>

        </div>
    );
};
