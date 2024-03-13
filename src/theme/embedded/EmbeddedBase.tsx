import * as React from "react";

export default class EmbeddedBase extends React.Component {
    componentDidMount() {
        // Every 20ms, check if we are ready to unhide the content
        // Check on an animation frame just to be ultra safe
        const interval = window.setInterval(function() {
            window.requestAnimationFrame(function() {
                if (document.readyState === 'complete') {
                    document.body.style.display = "";
                    window.clearInterval(interval);
                } else {
                //	console.log("not ready to show.....")
                }
            })
        }, 20)
    }

    render() {
        return (<>
            {this.props.children}
        </>)
    }
}