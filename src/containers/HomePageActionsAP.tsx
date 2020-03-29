import * as React from 'react'
import { History } from 'history';
import PlaceholderLink from '../components/PlaceholderLink';


function testBit(num: number, bit: number) {
	return ((num >> bit) % 2 != 0)
}

//TODO: paths are duplicated here, import from classes and replace :personId
export default (bv: number, juniorId: number, history: History<any>) => {
	const actions = [{
		place: 0,
		element: <PlaceholderLink>0</PlaceholderLink>
	}, {
		place: 1,
		element: <PlaceholderLink>1</PlaceholderLink>
	}, {
		place: 2,
		element: <PlaceholderLink>2</PlaceholderLink>
	}, {
		place: 3,
		element: <PlaceholderLink>3</PlaceholderLink>
	}, {
		place: 4,
		element: <PlaceholderLink>4</PlaceholderLink>
	}, {
		place: 5,
		element: <PlaceholderLink>5</PlaceholderLink>
	}, {
		place: 6,
		element: <PlaceholderLink>6</PlaceholderLink>
	}, {
		place: 7,
		element: <PlaceholderLink>7</PlaceholderLink>
	}, {
		place: 8,
		element: <PlaceholderLink>8</PlaceholderLink>
	}, {
		place: 9,
		element: <PlaceholderLink>9</PlaceholderLink>
	}, {
		place: 10,
		element: <PlaceholderLink>10</PlaceholderLink>
	}, {
		place: 11,
		element: <PlaceholderLink>11</PlaceholderLink>
	}, {
		place: 12,
		element: <PlaceholderLink>12</PlaceholderLink>
	}, {
		place: 13,
		element: <PlaceholderLink>13</PlaceholderLink>
	}]

	return actions
		.filter(({ place }) => testBit(bv, place))
		.map(({ element }) => element)
		.map((element, i) => <li key={i}>{element}</li>)
}