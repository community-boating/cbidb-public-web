import * as React from 'react'
import { Link } from 'react-router-dom';

import { postWrapper as abortRegistration } from "async/junior/abort-mem-reg"
import { makePostJSON } from 'core/APIWrapperUtil';
import { History } from 'history';
import {ratingsPageRoute} from 'app/routes/jp/ratings'
// import {classPageRoute} from 'app/routes/jp/class'
import {regPageRoute} from 'app/routes/jp/reg'
import {editPageRoute} from "app/routes/jp/edit"
import {postWrapper as offseasonWLDelete} from "async/junior/offseason-wl-delete"
import {offseasonPageRoute} from "app/routes/jp/offseason"
import { jpBasePath } from 'app/paths/jp/_base';
import { classPageRoute } from 'app/routes/jp/class';
import { jpManageStaggeredPaymentsRoute } from 'app/routes/jp/payments';
import asc from 'app/AppStateContainer';

function testBit(num: number, bit: number){
    return ((num>>bit) % 2 != 0)
}

//TODO: paths are duplicated here, import from classes and replace :personId
export default (bv: number, juniorId: number, history: History<any>, hasOpenOrder: boolean) => {
	const reg = regPageRoute.getPathFromArgs({personId: String(juniorId)});

    const actions = [{
        place: 3,
        element: <Link to={editPageRoute.getPathFromArgs({personId: String(juniorId)})}>{"Edit Information"}</Link>
    }, {
        place: 4,
        element: <Link to={ratingsPageRoute.getPathFromArgs({personId: String(juniorId)})}>{"View Ratings"}</Link>
    }, {
        place: 5,
        element: <Link to={classPageRoute.getPathFromArgs({personId: String(juniorId)})}>{"Signup for Summer Classes"}</Link>
    }, /*{
        place: 6,
        element: <PlaceholderLink>{"Signup for Fall Classes"}</PlaceholderLink>
    }, */ {
        place: 7,
        element: <Link to={offseasonPageRoute.getPathFromArgs({personId: String(juniorId)})}>{"Signup for Spring Classes"}</Link>
    }, {
        place: 8,
        element: <a href="#" onClick={e => {
            e.preventDefault();
            if (window.confirm(`Do you really want to abort membership registration?`)) {
                abortRegistration.sendJson({juniorId}).then(() => history.push("/redirect" + jpBasePath.getPathFromArgs({})))
            }
        }}>{"Cancel Membership Purchase"}</a>
    }/*, {
        place: 9,
        element: <PlaceholderLink>{"Cancel Class Purchase"}</PlaceholderLink>
    }, {
        place: 10,
        element: <PlaceholderLink>{"Enroll and Pay for Fall Class"}</PlaceholderLink>
    }, {
        place: 11,
        element: <PlaceholderLink>{"Enroll and Pay for Spring Class"}</PlaceholderLink>
    }, {
        place: 12,
        element: <PlaceholderLink>{"Cancel Fall Class Waitlist"}</PlaceholderLink>
    }*/, {
        place: 13,
        element: <a href="#" onClick={e => {
            e.preventDefault();
            if (window.confirm(`Do you really want to leave the waitlist?  This action cannot be undone.`)) {
                offseasonWLDelete.sendJson({juniorId}).then(() => history.push("/redirect" + jpBasePath.getPathFromArgs({})))
            }
        }}>{"Cancel Spring Class Waitlist"}</a>
    }/*, {
        place: 14,
        element: <PlaceholderLink>{"Rejoin Waitlist"}</PlaceholderLink>
    }*/ ,{
		place: 15,
		element: <a target="_blank" href={`http://www.eventbrite.com/e/560707600527/?discount=CBIjr`}>Buy 4th of July Tickets</a>
	}, {
		place: 18,
		element: <a href="https://www.eventbrite.com/e/community-boatings-all-boats-on-the-water-race-summer-dock-party-tickets-689597323157?discount=FYMEM" target="_blank">Click here to get your discounted All Boats on the Water Dock Party tickets and/or reserve your boat for the race</a>
	}]

    return (function() {
        if (!asc.state.jpRegistrationClosed && testBit(bv, 0)) {
            return [<Link to={reg}>{"Purchase Summer Membership and/or Spring Class"}</Link>];
        } else if (!asc.state.jpRegistrationClosed && testBit(bv, 1)) {
            return [<Link to={reg}>{"Purchase Summer Membership"}</Link>];
        } else if (!asc.state.jpRegistrationClosed && testBit(bv, 2)) {
            return [<Link to={reg}>{"Complete Registration"}</Link>]
        } else if (!asc.state.jpRegistrationClosed && testBit(bv, 16)) {
            return [<Link to={reg}>{"Edit Registration"}</Link>]
        } else return [];
    }()).concat(actions.filter(({place}) => testBit(bv, place)).map(({element}) => element))
    .concat(hasOpenOrder ? [<Link to={jpManageStaggeredPaymentsRoute.getPathFromArgs({juniorId: String(juniorId)})}>Manage Upcoming Payments</Link>]: [])
    .map((element, i) => <li key={i}>{element}</li>)
}
