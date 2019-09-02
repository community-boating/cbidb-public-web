import * as React from 'react'
import { Link } from 'react-router-dom';

import PlaceholderLink from "../components/PlaceholderLink";
import {path as registrationPath} from "../containers/registration/pageflow/RegistrationWizard"

function testBit(num: number, bit: number){
    return ((num>>bit) % 2 != 0)
}

//TODO: paths are duplicated here, import from classes and replace :personId
export default (bv: number, juniorId: number) => {
	const req = registrationPath.replace(":personId", String(juniorId))
    const actions = [{
        place: 3,
        element: <Link to={req}>{"Edit Information"}</Link>
    }, {
        place: 4,
        element: <Link to={"/ratings/" + juniorId}>{"View Ratings"}</Link>
    }, {
        place: 5,
        element: <Link to={"/class/" + juniorId}>{"Signup for Summer Classes"}</Link>
    }, {
        place: 6,
        element: <PlaceholderLink>{"Signup for Fall Classes"}</PlaceholderLink>
    }, {
        place: 7,
        element: <PlaceholderLink>{"Signup for Spring Classes"}</PlaceholderLink>
    }, {
        place: 8,
        element: <PlaceholderLink>{"Cancel Membership Purchase"}</PlaceholderLink>
    }, {
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
    }, {
        place: 13,
        element: <PlaceholderLink>{"Cancel Spring Class Waitlist"}</PlaceholderLink>
    }, {
        place: 14,
        element: <PlaceholderLink>{"Rejoin Waitlist"}</PlaceholderLink>
    }, {
        place: 15,
        element: <PlaceholderLink>{"Buy 4th of July Tickets"}</PlaceholderLink>
    }]

    return (function() {
        if (testBit(bv, 0)) {
            return [<Link to={req}>{"Purchase Summer Membership and/or Spring Class"}</Link>];
        } else if (testBit(bv, 1)) {
            return [<Link to={req}>{"Purchase Summer Membership"}</Link>];
        } else if (testBit(bv, 2)) {
            return [<Link to={req}>{"Edit Registration"}</Link>]
        } else return [];
    }()).concat(actions.filter(({place}) => testBit(bv, place)).map(({element}) => element))
    .map((element, i) => <li key={i}>{element}</li>)
}