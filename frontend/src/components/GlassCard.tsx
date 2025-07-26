import { Component, JSX, ParentProps } from "solid-js";

const GlassCard: Component<{children: JSX.Element}> = (props: ParentProps) => {
    return (
        <div class="bg-gray-800 bg-opacity-20 backdrop-blur-lg p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-700">
            {props.children}
        </div>
    );
}

export default GlassCard;