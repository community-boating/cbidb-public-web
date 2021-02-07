import * as React from "react";
import Button, { PropsForUser as ButtonProps } from "./Button";


const PlainButton: React.FunctionComponent<ButtonProps> = 
	(props) => {
		return <Button
            {...props}
            container={(onClickWrapper, children) => <a style={{cursor: "pointer"}} onClick={onClickWrapper}>{children}</a>}
        />;
	}

export default PlainButton