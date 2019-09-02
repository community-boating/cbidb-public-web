import * as t from 'io-ts';
import * as React from "react";

import { validator } from '../../async/junior/get-class-instances';
import JpClassesAvailTable from "../../components/JpClassesAvailTable";
import Joomla8_4 from "../../theme/joomla/Joomla8_4";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaSidebarRegion from "../../theme/joomla/JoomlaSidebarRegion";

export type APIResult = t.TypeOf<typeof validator>

interface Props {
	personId: number,
	apiResult: APIResult
}

export default class SelectClassTime extends React.Component<Props> {
	render() {
		const self = this;

        const allRegions = (
            <JoomlaArticleRegion title="Class Availability">
                <JpClassesAvailTable classes={self.props.apiResult} />
            </JoomlaArticleRegion>
		);

		return (
			<Joomla8_4 main={allRegions} right={<JoomlaSidebarRegion title="sidebar"></JoomlaSidebarRegion>} />
		)
	}
}