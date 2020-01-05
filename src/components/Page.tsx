import * as React from "react";
import { setJPImage } from "../util/set-bg-image";

export default class Page<T> extends React.Component<T> {
    componentDidMount() {
      window.scrollTo(0, 0)
      setJPImage();
    }
}