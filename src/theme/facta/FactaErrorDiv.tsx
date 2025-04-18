import * as React from "react";

export const FactaErrorDiv = (props: { errors: string[], dontEscapeHTML?: boolean, suffixes?: React.ReactNode[] }) => {
	const ref = React.useRef<HTMLDivElement>()
	React.useEffect(() => {
		ref.current.scrollIntoView()
	}, props.errors)
	return <div ref={ref} className="alert-global alert-top alert-red" style={{marginBottom: "15px"}}>
		<div className="row no-gutters">
			<table><tbody><tr>
			<td style={{height: "100%"}}>
				<div style={{padding: "1px 0 0 0", height: "100%"}}>
					<div className="alert-subject">
						<div className="alert-subject-icon"><svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fillRule="evenodd" clipRule="evenodd" d="M25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50ZM30 15.0845C30 15.9354 29.6753 16.6609 29.0255 17.2585C28.3758 17.856 27.5953 18.1559 26.6804 18.1559C25.7692 18.1559 24.9813 17.856 24.3278 17.2585C23.6781 16.6609 23.3495 15.9354 23.3495 15.0845C23.3495 14.235 23.6781 13.5098 24.3278 12.9067C24.9813 12.3035 25.7692 12 26.6804 12C27.5953 12 28.3758 12.3035 29.0255 12.9067C29.6753 13.5098 30 14.235 30 15.0845ZM28.7118 35.2115C29.3206 35.6777 28.7006 36.697 27.528 37.2393C26.5123 37.7132 25.2577 38.0368 24.3802 38.0368C23.0284 38.0368 21.8746 37.428 21.1238 36.7711C20.3734 36.1161 20 35.2874 20 34.2826C20 33.8903 20.0261 33.4905 20.0821 33.0815C20.1418 32.6728 20.2316 32.212 20.351 31.6976L21.7513 26.8018C21.8784 26.3337 21.9789 25.8879 22.0649 25.4696C22.1471 25.0516 22.1956 24.6647 22.1956 24.3206C22.1956 23.6934 22.0612 23.2586 21.7998 23.0143C21.5384 22.7681 21.0455 22.6444 20.3099 22.6444C19.9478 22.6444 19.5854 21.2379 21.2173 20.6718C22.05 20.3869 22.8453 20.2777 23.5922 20.2777C24.9365 20.2777 25.9745 20.6017 26.699 21.2436C27.4272 21.8875 27.7933 22.7238 27.7933 23.7506C27.7933 23.8692 27.785 24.0392 27.7691 24.2614C27.7567 24.4344 27.7397 24.6392 27.7184 24.8758C27.6663 25.4104 27.5691 25.9027 27.4384 26.3505L26.0456 31.2278C25.9336 31.62 25.829 32.0698 25.7394 32.5728C25.6498 33.0745 25.6087 33.4537 25.6087 33.7126C25.6087 34.3602 25.7506 34.7988 26.0456 35.0356C26.3368 35.2705 26.8448 35.3871 27.5654 35.3871C27.6897 35.3871 27.8309 35.3264 27.9772 35.2634C28.2264 35.1561 28.4906 35.0424 28.7118 35.2115Z" fill="white"></path> </svg></div>
						<div className="alert-subject-content">
							<div className="alert-subject-content-title">Error</div>
						</div>
					</div>
				</div>
			</td>
			<td>
				<div className="col-12 col-lg">
					<div className="alert-body">
						<ul style={{margin: "auto"}}>
							{props.errors.map((err, i) => (
								<li key={"err_" + i} style={{color: "black"}}>
									{(
										props.dontEscapeHTML
										? <span dangerouslySetInnerHTML={{__html: err}} />
										: err
									)}
									{(props.suffixes || [])[i]}
								</li>
							))}
						</ul>
					</div>
				</div>
			</td>
			</tr></tbody></table>
			
			
		</div>
	</div>
}