import * as React from "react"

export type TabGroupProps = {
    tabGroups: {
        key: string
        display: React.ReactNode
        disabled: boolean
    }[]
    children: React.ReactNode[]
    locked: boolean
    controlled?: {
        tabKey: string
        setTabKey: React.Dispatch<React.SetStateAction<string>>
    }
}

export default function TabGroup(props: TabGroupProps) {
    const [currentTab, setCurrentTab] = props.controlled ? [props.controlled.tabKey, props.controlled.setTabKey] : React.useState(props.tabGroups[0].key)
    const currentTabIndex = props.tabGroups.findIndex(tab => tab.key == currentTab)
    return <div>
        <ul className="nav nav-tabs">
            {props.tabGroups.map(tab =>
                <li key={tab.key} className="nav-item" style={{height: "48px"}}>
                    <a className={"nav-link" + (tab.key == currentTab ? " active" : "") + (tab.disabled ? " disabled" : "")} aria-current="page" onClick={(e) => {e.preventDefault();!props.locked && setCurrentTab(tab.key)}}>{tab.display}</a>
                </li>
            )}
        </ul>
        <div style={{padding: "20px"}}>
            {props.children[currentTabIndex]}
        </div>
    </div>
}