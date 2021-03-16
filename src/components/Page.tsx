import * as React from "react";

export default class Page<T> extends React.Component<T & {setBGImage: () => void}> {
    componentDidMount() {
	  window.scrollTo(0, 0)
	  this.props.setBGImage();
    }
}

export enum PageFlavor {
	AP = "AP",
	JP = "JP",
	SHARED = "Shared",
	DONATE = "Donate",
	GC = "GC",
}