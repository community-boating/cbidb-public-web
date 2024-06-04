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

//itemIndex, subItemIndex
export function DynamicCycler(props: {items: React.ReactNode[][], itemContainers: ((children: React.ReactNode, key: string) => React.ReactNode)[], singleItemContainer?: (children: React.ReactNode) => React.ReactNode} & Omit<CyclerType, 'items'>){
    const {items, indexExternal, setIndexExternal, singleItemContainer, ...otherProps} = props
    const [sizeTest, setSizeTest] = React.useState(TestState.QUEUED)
    const [index, setIndex] = (props.indexExternal != undefined) ? [props.indexExternal, props.setIndexExternal] : React.useState(props.initialOrderIndex || 0);
    //itemIndex, subItemIndex
    const itemsWithSubItems = props.items.filter((a) => a.length > 1)
    //itemIndex, cellIndex, subItemIndex
    const cells = React.useRef<number[][][]>(itemsWithSubItems.map(a => [a.map((b, i) => i)]))
    //itemIndex, subItemIndex
    const queue = () => {
        setSizeTest(TestState.QUEUED)
    }
    const mainRef = React.createRef<HTMLDivElement>()
    const refs = itemsWithSubItems.map(a => a.map((b) => React.createRef<HTMLDivElement>()))
    const itemsWithRef = React.useMemo(() => itemsWithSubItems.map((itemsSub, itemIndex) => {
        return itemsSub.map((a, i) => <div key={itemIndex + "i" + i} ref={refs[itemIndex][i]}>{a}</div>)
    }), [refs])
    React.useEffect(() => {
        var timeout: NodeJS.Timeout = undefined;
        const listener = () => {
            if(timeout)
                clearTimeout(timeout)
            timeout = setTimeout(() => {
                timeout = undefined
                console.log("quertying")
                queue()
            }, 100)
        }
        window.addEventListener('resize', listener)
        return () => {
            window.removeEventListener('resize', listener)
            clearTimeout(timeout)
        }
    })
    React.useEffect(() => {
        queue()
    }, [props.items.reduce((a, b) => a + ":" + b.length, "")])
    //console.log(sizeTest)
    React.useEffect(() => {
        if(sizeTest == TestState.RUNNING){
            cells.current = itemsWithSubItems.map((a, itemIndex) => DynamicCyclerCell(a, refs[itemIndex], mainRef).calcCells())
            setSizeTest(TestState.DONE)
        }
    }, [sizeTest])

    const makeContainer = (itemIndex: number) => (children: React.ReactNode, key: string) => {
        console.log("hello", itemIndex)
        return (props.itemContainers[itemIndex] || ((c, k) =>  <div key={k} className='w-full h-full flex col'>{c}</div>))(children, key)
    }

    const singleContainer = singleItemContainer || ((children: React.ReactNode) => {
        return <div className='w-full h-full flex col'>
            {children}
        </div>
    })

    console.log("what what")

    //itemIndex, cellIndex, subItemIndex
    if(sizeTest != TestState.DONE){
        const values = itemsWithRef.flatten().flatten()
        if(sizeTest == TestState.QUEUED)
            setSizeTest(TestState.RUNNING)
        return <div id="testID" ref={mainRef} className='w-full h-full flex col overflow-hidden'>
            {values}
        </div>
    }else{
        const values: any = cells.current.map((a, itemIndex) => a.map((b, cellIndex) => makeContainer(itemIndex)(<>{b.map((c, subItemIndex) => itemsWithRef[itemIndex][c])}</>, itemIndex + ":" + cellIndex))).flatten<JSX.Element>()
        return <Cycler items={values.concat(props.items.filter((a) => a.length == 1).flatten().map(singleContainer))} indexExternal={index} setIndexExternal={setIndex} {...otherProps}/>
    }
}

function DynamicCyclerCell(subItems: React.ReactNode[], refs: React.RefObject<HTMLDivElement>[], mainRef: React.RefObject<HTMLDivElement>) {
    const calcCells = () => {
        const newCells: number[][] = []
        var currentCellHeight = 0
        var currentCell: number[] = []
        const maxHeight = (mainRef.current || {clientHeight: 0}).clientHeight
        for(var i = 0; i < subItems.length; i++){
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