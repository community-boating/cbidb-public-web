import * as React from "react";
import Button, { PropsForUser as ButtonProps } from "../../components/Button";

const FactaButton: React.FunctionComponent<ButtonProps> = 
	(props) => <Button
		{...props}
		container={(onClickWrapper, children) => <a className="facta-button" onClick={onClickWrapper}>{children}</a>}
	/>;

export default FactaButton