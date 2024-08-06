import * as React from 'react';

export type CyclerType = {
    slots?: number
    order?: number[]
    initialOrderIndex?: number
    delay?: number, slideDelay?: number
    left?: boolean, indexExternal?: number
    setIndexExternal?: React.Dispatch<React.SetStateAction<number>>
}

function cyclicPad(index: number, length: number){
    return index < 0 ? length - 1 : index % length;
}

enum TestState {
    QUEUED = 0,
    RUNNING = 1,
    DONE = 2
}

//Item Group, Item
export function DynamicCycler(props: {items: React.ReactNode[][], itemContainers: ((children: React.ReactNode, key: string) => React.ReactNode)[], singleItemContainer?: (children: React.ReactNode) => React.ReactNode} & Omit<CyclerType, 'items'>){
    const {items, indexExternal, setIndexExternal, singleItemContainer, ...otherProps} = props
    const [index, setIndex] = (props.indexExternal != undefined) ? [props.indexExternal, props.setIndexExternal] : React.useState(props.initialOrderIndex || 0);
    //Item Group, Item Page, Item Index (In Group)
    const [testing, setTesting] = React.useState(false)
    const [itemsStored, setItemsStored] = React.useState<React.ReactNode[]>([])
    const itemsPropsHash = props.items.reduce((a, b) => a + ":" + b.length, "")
    const groupsWithMultipleItems = React.useMemo(() => props.items.filter((a) => a.length > 1), [itemsPropsHash])
    const queue = () => {
        setTesting(true)
    }
    const mainRef = React.createRef<HTMLDivElement>()
    const refs = React.useMemo(() => groupsWithMultipleItems.map(a => a.map(() => React.createRef<HTMLDivElement>())), [itemsPropsHash])
    const itemsWithRef = React.useMemo(() => groupsWithMultipleItems.map((itemsSub, itemGroup) => {
        return itemsSub.map((itemSub, itemIndex) => <div key={itemGroup + "i" + itemIndex} ref={refs[itemGroup][itemIndex]}>{itemSub}</div>)
    }), [itemsPropsHash])

    React.useEffect(() => {
        var timeout: NodeJS.Timeout = undefined;
        const listener = () => {
            if(timeout)
                clearTimeout(timeout)
            timeout = setTimeout(() => {
                timeout = undefined
                queue()
            }, 100)
        }
        listener()
        window.addEventListener('resize', listener)
        return () => {
            window.removeEventListener('resize', listener)
            clearTimeout(timeout)
        }
    }, [])
    React.useEffect(() => {
        queue()
    }, [itemsPropsHash])
    //console.log(sizeTest)

    const makeContainer = (itemGroup: number) => (children: React.ReactNode, key: string) => {
        return (props.itemContainers[itemGroup] || ((c, k) =>  <div key={k} className='w-full h-full flex col'>{c}</div>))(children, key)
    }

    const singleContainer = singleItemContainer || ((children: React.ReactNode) => {
        return <div className='w-full h-full flex col'>
            {children}
        </div>
    })

    React.useEffect(() => {
        if(testing){
            const itemIndexes = groupsWithMultipleItems.map((a, itemGroup) => DynamicCyclerCell(a, refs[itemGroup], mainRef).calcCells())
            const values = itemIndexes.map((itemGroup, itemGroupIndex) => itemGroup.map((itemPage, itemPageIndex) =>  makeContainer(itemGroupIndex)(<>{itemPage.map((itemIndex) => itemsWithRef[itemGroupIndex][itemIndex])}</>, itemGroup + ":" + itemPageIndex))).flatten<JSX.Element>()
            setItemsStored(values)
            setTesting(false)
        }
    }, [testing])

    if(testing){
        const values = itemsWithRef.flatten().flatten()
        return <div id="testID" ref={mainRef} className='w-full h-full min-h-full flex col overflow-hidden'>
            {values}
        </div>
    }else{ 
        return <Cycler items={itemsStored.concat(props.items.filter((a) => a.length == 1).flatten().map(singleContainer))} indexExternal={index} setIndexExternal={setIndex} {...otherProps}/>
    }
}

function DynamicCyclerCell(groupItems: React.ReactNode[], refs: React.RefObject<HTMLDivElement>[], mainRef: React.RefObject<HTMLDivElement>) {
    const calcCells = () => {
        const newCells: number[][] = []
        var currentCellHeight = 0
        var currentCell: number[] = []
        const maxHeight = (mainRef.current || {clientHeight: 0}).clientHeight
        for(var i = 0; i < groupItems.length; i++){
            const currentItemHeight = (refs[i].current || {clientHeight: 0}).clientHeight
            if(currentCell.length == 0 || (currentCellHeight + currentItemHeight <= maxHeight)){
            }else{
                currentCellHeight = 0
                newCells.push(currentCell)
                currentCell = []
            }
            currentCell.push(i)
            currentCellHeight += currentItemHeight
        }
        if(currentCell.length > 0)
            newCells.push(currentCell)
        return newCells
    }
    return {
        calcCells
    }
}

export default function Cycler(props: {items: React.ReactNode[]} & CyclerType){
    const [index, setIndex] = (props.indexExternal != undefined) ? [props.indexExternal, props.setIndexExternal] : React.useState(props.initialOrderIndex || 0)
    const ref = React.createRef<HTMLDivElement>()
    const length = props.order != undefined ? props.order.length : props.items.length
    const slots = props.slots || 2
    const left = props.left === true
    React.useEffect(() => {
        if(props.items.length > 1){
            const current = ref.current;
            const intervalID = setInterval(() => {
                setIndex((s) => cyclicPad(left ? s+1 : s-1,length))
                current.animate(slideFrames, slideOptions)
            }, props.delay || 5000)
            return () => {
                clearInterval(intervalID)
            }
        }
    }, [length, slots, ref.current])
    React.useEffect(() =>  {
        setIndex(0)
    }, [props.items.length])
    const children = []
    const spacing = 40
    const sOff = Math.round((slots-1)/slots*spacing * 10000) / 10000
    const W = Math.round(1 / slots * 100 * 10000) / 10000
    const w = 'calc(' + W + '% - ' + sOff + 'px)'
    const translate = 'calc(-' + W + '% + ' + (sOff - spacing) + 'px)'
    for(var i = left ? -1 : 0; i < (left ? slots : slots + 1); i++){
        const indexS = cyclicPad(index + i, length)
        const itemIndex = props.order ? props.order[indexS] : indexS
        children.push(<InnerCycle w={w} key={itemIndex + ":" + i}>
                {props.items[itemIndex]}
            </InnerCycle>)
    }
    const slideFrames: Keyframe[] = [
        {
            transform: 'translateX(' + translate + ')'
        },
        {
            transform: 'translateX(0)'
        }
    ]
    const slideOptions: KeyframeAnimationOptions = {
        duration: props.slideDelay || 1000,
        direction: left ? 'reverse' : 'normal',
        fill: 'both',
        easing: 'ease-in-out'
    }
    React.useEffect(() => {
            if(left)
                ref.current.style.transform = 'translateX(' + translate + ')'
            ref.current.style.visibility = 'initial'
    }, [])
    return <div ref={ref} className='flex row gap-40 w-full hidden'>
        {children}
    </div>
}

function InnerCycle(props: {children: React.ReactNode, w: string}){
    return <div className='flex shrink basis-0 overflow-hidden relative' style={{minWidth: props.w, width: props.w, maxWidth: props.w}}>
        {props.children}
    </div>
}