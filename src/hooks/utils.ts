import React from "react";

export function useForceUpdate() {
    const [_, setState] = React.useState(false);
    return () => setState(prev => !prev);
}

export function useRefState(intialState: any) {
    const forceUpdate = useForceUpdate();
    const stateRef = React.useRef(intialState);

    return [stateRef, (newState: any) => {
        stateRef.current = newState;
        forceUpdate();
    }] as [React.MutableRefObject<any>, (newState: any) => void]
}