import * as React from "react";
import Button, { PropsForUser as ButtonProps } from "components/Button";

type FactaButtonProps = ButtonProps & {
	big?: boolean
}

const FactaButton: React.FunctionComponent<FactaButtonProps> = 
	(props) => {
		const classNames = [
			"facta-button"
		].concat(props.big ? []: ["facta-button-small"])
		.join(" ");

		return <Button
		{...props}
		container={(onClickWrapper, children) => <a className={classNames} onClick={onClickWrapper}>{children}</a>}
	/>;
	}

export default FactaButton