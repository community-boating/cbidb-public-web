import * as React from 'react';

function cyclicPad(index: number, length: number){
    return index < 0 ? length - 1 : index % length;
}

export default function Cycler(props: {items: React.ReactNode[], slots?: number, order?: number[], initialOrderIndex?: number, delay?: number, slideDelay?: number, left?: boolean, indexExternal?: number, setIndexExternal?: React.Dispatch<React.SetStateAction<number>>}){
    const [index, setIndex] = (props.indexExternal != undefined) ? [props.indexExternal, props.setIndexExternal] : React.useState(props.initialOrderIndex || 0);
    const ref = React.createRef<HTMLDivElement>();
    const length = props.order != undefined ? props.order.length : props.items.length;
    const slots = props.slots || 2;
    const left = props.left === true;
    React.useEffect(() => {
        if(props.items.length > 1){
            const current = ref.current;
            const intervalID = setInterval(() => {
                //setIndex((s) => cyclicPad(left ? s+1 : s-1,length));
                //current.animate(slideFrames, slideOptions);
            }, props.delay || 5000);
            return () => {
                clearInterval(intervalID);
                console.log("stopping");
            }
        }
    }, [length, slots, ref.current, props.items.length]);
    React.useEffect(() =>  {
        setIndex(1);
    }, [props.items.length])
    const children = [];
    const spacing = 40;
    const sOff = Math.round((slots-1)/slots*spacing * 10000) / 10000;
    const W = Math.round(1 / slots * 100 * 10000) / 10000;
    const w = 'calc(' + W + '% - ' + sOff + 'px)';
    const translate = 'calc(-' + W + '% + ' + (sOff - spacing) + 'px)';
    for(var i = left ? -1 : 0; i < (left ? slots : slots + 1); i++){
        const indexS = cyclicPad(index + i, length);
        const itemIndex = props.order ? props.order[indexS] : indexS;
        children.push(<InnerCycle w={w} key={itemIndex}>
                {props.items[itemIndex]}
            </InnerCycle>);
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
    }, []);
    return <div ref={ref} className='flex row gap-40 w-full hidden'>
        {children}
    </div>
}

function InnerCycle(props: {children: React.ReactNode, w: string}){
    return <div className='flex shrink basis-0 overflow-hidden relative' style={{minWidth: props.w, width: props.w, maxWidth: props.w}}>
        {props.children}
    </div>
}