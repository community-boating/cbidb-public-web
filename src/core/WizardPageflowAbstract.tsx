import { History } from "history";
import * as React from "react";

import { DoublyLinkedList } from "util/DoublyLinkedList";

export interface ComponentPropsFromWizard {
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	prevNodes: WizardNode[],
	currNode: WizardNode,
	nextNodes: WizardNode[]
}

export interface WizardNode {
	clazz: (fromWizard: ComponentPropsFromWizard) => JSX.Element,
	breadcrumbHTML?: JSX.Element
}

export type ElementDLL = DoublyLinkedList<() => JSX.Element>


export interface WizardBaseProps {
	history: History<any>,
	start: string,
	end: string,
}

export interface WizardBaseState {
	nodeList: DoublyLinkedList<() => JSX.Element>,
}

export abstract class WizardPageflowAbstract<Props extends WizardBaseProps, State extends WizardBaseState> extends React.Component<Props, State> {
	abstract calculateNodes(): WizardNode[]
	goNext = () => {
		this.updateNodeList();
		if (this.state.nodeList.hasNext()) {
			this.setState({
				...this.state,
				nodeList: this.state.nodeList.next()
			})
		} else {
			this.props.history.push(this.props.end);
		}
		return Promise.resolve();
	}
	goPrev = () => {
		this.updateNodeList();
		if (this.state.nodeList.hasPrev()) {
			this.setState({
				...this.state,
				nodeList: this.state.nodeList.prev()
			})
		} else {
			this.props.history.push(this.props.start);
		}
		return Promise.resolve();
	}
	updateNodeList() {
		const self = this;
		const currentPosition = (undefined === this.state || undefined === this.state.nodeList) ? 0 : this.state.nodeList.left.length;
		const nodes = this.calculateNodes();
		const nodesForRender = nodes.map((node, i, arr) => {
			const prevNodes = arr.filter((ee, ii) => ii < i)
			const nextNodes = arr.filter((ee, ii) => ii > i)
			return () => node.clazz({
				goNext: self.goNext.bind(self),
				goPrev: self.goPrev.bind(self),
				prevNodes,
				nextNodes,
				currNode: node
			})
		})
		const nodeList = DoublyLinkedList.from(nodesForRender).nextMany(currentPosition);
		this.state = {
			...this.state,
			nodeList
		};
	}
	render() {
		return this.state.nodeList.curr()
	}
}
