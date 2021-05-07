import * as React from 'react';
import {History} from 'history';

type Props = {
    history: History<any>
    groupedByDate: any[]
}

export class APClassSchedule extends React.Component<Props> {
	constructor(props: Props) {
		super(props);
	}
	componentDidMount() {
		this.queueRefresh();

        // Every 20ms, check if we are ready to unhide the content
		// Check on an animation frame just to be ultra safe
		const interval = window.setInterval(function() {
			window.requestAnimationFrame(function() {
				if (document.readyState === 'complete') {
					document.body.style.display = "";
					document.body.style.margin = "0";
					window.clearInterval(interval);
				} else {
				//	console.log("not ready to show.....")
				}
			})
		}, 20)
	}
    queueRefresh = () => {
        var self = this;
        window.setTimeout(() => {
            console.log(window.location)
            self.props.history.push("/redirect" + window.location.pathname)
            self.queueRefresh();
        }, 30000);
    };
	render() {
		var dayComponents = {
			// multiDay : (
			// 	<div>
			// 		{this.props.groupedByDate.map(day =>
			// 			<div key={day.date}>
			// 				<table className="tv-table">
			// 					<tbody><tr><td colSpan={3} style={{fontSize:"30px", padding: "10px", backgroundColor: "#b0cbe8"}}><b>
			// 						{moment(new Date(day.date)).format("dddd, MMMM Do")}
			// 					</b></td></tr>
			// 					</tbody>
			// 				</table>
			// 				<table cellSpacing="5" style={tableStyle}><tbody>
			// 				{day.classes.map((c: any) =>
			// 					<tr key={c["INSTANCE_ID"]}><td width="150px" style={{fontSize: "30px", padding: "10px"}}>
			// 						{c["START_TIME"]}
			// 					</td><td width="300px" style={{fontSize: "30px", padding: "10px"}}>
			// 						{c["TYPE_NAME"]}
			// 					</td><td width="450px" style={{fontSize: "30px", padding: "10px"}}>
			// 						{c["LOCATION_STRING"]}
			// 					</td></tr>
			// 				)}
			// 				</tbody></table>
			// 			</div>
			// 		)}
			// 	</div>
			// ),
			singleDay : (
				<div>
					{this.props.groupedByDate.map(day =>
						<div key={day.date}>
							<table className="tv-table"><tbody>
							<tr><td style={{fontSize:"30px", padding: "10px", backgroundColor: "#b0cbe8"}}><b>
								TIME
							</b></td><td style={{fontSize:"30px", padding: "10px", backgroundColor: "#b0cbe8"}}><b>
								CLASS
							</b></td><td style={{fontSize:"30px", padding: "10px", backgroundColor: "#b0cbe8"}}><b>
								LOCATION
							</b></td></tr>
							{day.classes.map((c: any) =>
								<tr key={c["INSTANCE_ID"]}><td width="150px" style={{fontSize: "30px", padding: "10px"}}>
									{c["START_TIME"]}
								</td><td width="300px" style={{fontSize: "30px", padding: "10px"}}>
									{c["TYPE_NAME"]}
								</td><td width="450px" style={{fontSize: "30px", padding: "10px"}}>
									{c["LOCATION_STRING"]}
								</td></tr>
							)}
							</tbody></table>
						</div>
					)}
				</div>
			)
		};
		return dayComponents.singleDay;
	}
}