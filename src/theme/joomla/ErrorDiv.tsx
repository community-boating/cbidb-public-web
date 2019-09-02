import * as React from "react";

export default (props: {errors: string[]}) => (
	<div className="attention" style={{clear: "both"}}>
		<div className="a-Notification a-Notification--error">
			<h2 className="a-Notification-title aErrMsgTitle">
				{`${props.errors.length} error${props.errors.length > 1 ? "s have" : " has"} occurred`}
			</h2>
			<ul className="a-Notification-list htmldbUlErr">
				{props.errors.map((err, i) => (
					<li key={"err_" + i} className="a-Notification-item htmldbStdErr">
						{err}
					</li>
				))}
			</ul>
		</div>
	</div>
)