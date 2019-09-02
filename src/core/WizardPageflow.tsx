import { History } from "history";
import * as React from "react";

import { DoublyLinkedList } from "../util/DoublyLinkedList";

export interface ComponentPropsFromWizard {
	goNext: () => void,
	goPrev: () => void,
	prevNodes: WizardNode[],
	currNode: WizardNode,
	nextNodes: WizardNode[],
	wizard: WizardPageflow
}

export interface WizardNode {
	clazz: (fromWizard: ComponentPropsFromWizard) => JSX.Element,
	breadcrumbHTML: JSX.Element
}

export type ElementDLL = DoublyLinkedList<() => JSX.Element>


interface Props {
	history: History<any>,
	formName: string,
	nodes: WizardNode[],
	start: string,
	end: string,
}

interface State {
	dll: ElementDLL
}

export default class WizardPageflow extends React.Component<Props, State> {
	// personId: number
	goNext: () => void
	goPrev: () => void
	static getNextDLL: (dll: ElementDLL) => ElementDLL = dll => dll.next()
	static getPrevDLL: (dll: ElementDLL) => ElementDLL = dll => dll.prev()
	pushNewDLL(dll: ElementDLL) {
		this.setState({
			...this.state,
			dll
		})
	}
	constructor(props: Props) {
		super(props)
		const self = this
		
		this.goNext = () => {
			console.log("pushed goNext!")
			if (self.state.dll.hasNext()) {
				self.setState({
					...self.state,
					dll: self.state.dll.next()
				})
			} else {
				console.log("going to end: ", self.props.end)
				self.props.history.push(self.props.end);
			}
		}

		this.goPrev = () => {
			console.log("pushed goPrev!")
			if (self.state.dll.hasPrev()) {
				self.setState({
					...self.state,
					dll: self.state.dll.prev()
				})
			} else {
				console.log("going back to start: ", self.props.start)
				self.props.history.push(self.props.start);
			}
			
		}

		const nodes = self.props.nodes.map((node, i, arr) => {
			const prevNodes = arr.filter((ee, ii) => ii < i)
			const nextNodes = arr.filter((ee, ii) => ii > i)
			return () => node.clazz({
				goNext: self.goNext.bind(self),
				goPrev: self.goPrev.bind(self),
				prevNodes,
				nextNodes,
				currNode: node,
				wizard: self
			})
		})

		this.state = {
			dll: DoublyLinkedList.from(nodes)
		}

		console.log("wizard constructor: setting this.dll ", this.state.dll)
		

		// console.log("about to set DLL in redux:  ", dll)
		// this.dll = dll
		// set(self.props.dispatch, config.formName, dll)
	}
	// componentWillReceiveProps(props: Props) {
	// 	// this.dll = config.getDLL(props.state).getOrElse(DoublyLinkedList.from([this.placeholder]))
	// 	// console.log("in wizard CDU, updating this.dll", this.dll)
	// }
	render() {
		console.log("rendering.....")
		console.log(this.state.dll)
		return this.state.dll.curr()
	}
}
