import * as React from "react";

export default class Page<T> extends React.Component<T> {
    componentDidMount() {
        window.scrollTo(0, 0)
    }
}