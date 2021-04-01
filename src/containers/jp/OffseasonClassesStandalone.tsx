import * as React from 'react';
import * as t from 'io-ts';
import { History } from 'history';

import FactaArticleRegion from '@facta/FactaArticleRegion';
import Currency from '@util/Currency'
import { asDivOptionalSignupLink, ClassType } from "./class-signup/class-description";
import raceTeam from './class-signup/types/other/race-team'
import {validator as offseasonClassesValidator} from "@async/junior/offseason-classes"
import { setJPImage } from '@util/set-bg-image';
import FactaSidebarPage from '@facta/FactaSidebarPage';
import FactaSidebarRegion from '@facta/FactaSidebarRegion';

type Props = {
	history: History<any>,
	personId: number,
	currentSeason: number,
	offseasonPriceBase: Currency,
	offseasonClasses: t.TypeOf<typeof offseasonClassesValidator>
}

type State = {
	validationErrors: string[]
}

export default class OffseasonClassesStandalone extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			validationErrors: []
		}
	}
	render() {
		const self = this;
		console.log(self.props.offseasonClasses)

		const header = <FactaArticleRegion title="Spring Classes">
			Spring classes are available to all {self.props.currentSeason} Juniors. Classes are {self.props.offseasonPriceBase.format(true)} but discounts based on income will automatically apply.<br />
			<br />
			Please Note: As soon as you click "Signup," a spot in the class will be held you you for up to 20 minutes while you complete your purchase.
		</FactaArticleRegion>;

		const raceTeam22Seats: ClassType = {
			...raceTeam,
			classSize: 22
		}

		const classes = <FactaArticleRegion title="Available Classes">
			{asDivOptionalSignupLink(false)(self.props.personId)(raceTeam22Seats)}
		</FactaArticleRegion>;

		const main = <React.Fragment>
			{header}
			{classes}
		</React.Fragment>

		const sidebar = <FactaSidebarRegion title="Register for Classes"></FactaSidebarRegion>


		return <FactaSidebarPage setBGImage={setJPImage} main={main} right={sidebar} />
	}
}
