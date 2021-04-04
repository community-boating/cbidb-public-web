import * as React from "react";
import Button, { PropsForUser as ButtonProps } from "@components/Button";

const JoomlaButton: React.FunctionComponent<ButtonProps> = 
	(props) => <Button
		{...props}
		container={(onClickWrapper, children) => <a className="readon" style={{ margin: "0 5px" }} onClick={onClickWrapper}>{children}</a>}
	/>

export default JoomlaButton;