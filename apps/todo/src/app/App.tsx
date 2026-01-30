import React from 'react';

interface Props {

}

export const App: React.FC<Props> = (props) => {
    return (
        <div>
            testasasdfasdf
            <button onClick={() => {
                console.log('click');
            }}>Click</button>
        </div>
    );
};
