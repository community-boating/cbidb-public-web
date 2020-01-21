import * as React from 'react';
import { History } from 'history';
import PathSegment, { StringObject } from './PathSegment';
import { Route } from 'react-router';

export default class RouteWrapper<T extends StringObject>{
	constructor(
		public requiresAuth: boolean,
		public pathSegment: PathSegment<T>,
		public render: (history: History<any>) => JSX.Element
	) {}

	asRoute(history: History<any>) {
		return <Route key={this.pathSegment.path} path={this.pathSegment.path} render={() => this.render(history)} />;
	}

	getPathFromArgs(args: T): string {
		return this.pathSegment.getPathFromArgs(args);
	}
}