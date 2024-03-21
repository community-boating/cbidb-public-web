import { FOTVType, LogoImageType } from 'async/embedded/fotv';
import FlagColorProvider, { FlagColorContext } from 'async/providers/FlagColorProvider';
import * as moment from 'moment';
import * as React from 'react';
import { FlagStatusIcon, getFlagIcon } from './FlagStatusIcon';
import Cycler from './Cycler';
import APClassInstancesProvider, { APClassInstancesContext } from 'async/providers/APClassInstancesProvider';
import { FlagColor } from 'async/util/flag-color';
import { APClassTable } from '../class-tables/APClassTable';
import JPClassInstancesProvider, { JPClassInstancesContext } from 'async/providers/JPClassInstancesProvider';
import { JPClassTable } from '../class-tables/JPClassTable';
import { tempParams } from 'app/routes/embedded/fotv';
import RestrictionIcon from './RestrictionIcon';

function programIDToName(programID: number){
    const programMap = new Map<number, string>([
        [0, 'Adult Program'],
        [1, 'Junior Program']
    ]);
    
    return programMap.get(programID) || 'Unknown Program';
}

function flagShortToName(flag: FlagColor){
    const flagMap = new Map<FlagColor, string>([
        [FlagColor.GREEN, 'Green Flag'],
        [FlagColor.YELLOW, 'Yellow Flag'],
        [FlagColor.RED, 'Red Flag'],
        [FlagColor.BLACK, 'Closed']
    ]);
    
    return flagMap.get(flag) || 'Closed';
}

function ScrollingDiv(props: {children?: React.ReactNode, className?: string}){
    const [scrolling, setScrolling] = React.useState(false);
    const outerRef = React.createRef<HTMLDivElement>();
    const innerRef = React.createRef<HTMLDivElement>();
    const textMeasureRef = React.createRef<HTMLDivElement>();
    const updateScrolling = () => {
        setScrolling((textMeasureRef.current.clientWidth) > ( outerRef.current.clientWidth));
    }
    const animationRef = React.useRef<Animation>(undefined)
    const updateScrollClasses = () => {
        if(!innerRef.current){
            return;
        }
        if(!animationRef.current){
            animationRef.current = innerRef.current.animate([
                { transform: 'translateX(0%)' },
                { transform: 'translateX(-50%)' }
            ], {
                duration: 15000,
                iterations: Infinity,
                direction: 'reverse'
            })
        }
        if(!scrolling){
            if(animationRef.current.playState != 'idle')
                animationRef.current.cancel();
        }else{
            if(animationRef.current.playState != 'running'){
                console.log("playing");
                console.log(animationRef.current.playState);
                animationRef.current.play();
            }
        }
        //innerRef.current.clientWidth.toString();
        //innerRef.current.className = "inline-block left-full transition transform ease-linear -translate-x-[50%] + duration-[5000ms]";
    }
    React.useEffect(() => {
        updateScrollClasses();
    });
    const eventListener = (ev: any) => {
        updateScrolling();
    }
    React.useEffect(() => {
        window.addEventListener("resize", eventListener);
        return () => {
            window.removeEventListener("resize", eventListener);
        }
    });
    React.useEffect(() => {
        updateScrolling();
    }, [props.children]);
    return <div ref={outerRef} className={"max-w-full relative hidden-scrollbar whitespace-nowrap overflow-scroll " + (props.className || "")}>
        <div ref={innerRef} className={'h-full whitespace-nowrap fit-content' + (scrolling ? "" : " mx-auto")}>
            <div ref={textMeasureRef} className="pr-5 h-full inline-block fit-content">
                {props.children}
            </div>
            { scrolling ? 
            <div className="pr-5 fit-content h-full inline-block">
                {props.children}
            </div>
            : <></>}
        </div>
    </div>
}

export default function FOTVPage(props: {fotvData: FOTVType}){
    React.useEffect(() => {
        /*document.body.requestFullscreen().catch((err) => {
            //alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
        })*/
    }, []);
    return <FlagColorProvider>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Domine"/>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto"/>
            <APClassInstancesProvider>
                <JPClassInstancesProvider>
                    <FOTVPageInternal {...props}/>
                </JPClassInstancesProvider>
            </APClassInstancesProvider>
    </FlagColorProvider>
}

function WrappedJPClassTable(){
    const jpClassInstances = React.useContext(JPClassInstancesContext);
    return <div className='flex col w-full h-full'>
        <h1 className='align-center font-lg'>Today's Calendar:</h1>
        <JPClassTable jpClassInstances={jpClassInstances}/>
    </div>;
}

function WrappedAPClassTable(){
    const apClassInstances = React.useContext(APClassInstancesContext);
    return <div className='flex col w-full h-full'>
        <h1 className='align-center font-lg'>Today's Calendar:</h1>
        <APClassTable apClassInstances={apClassInstances}/>
    </div>;
}

function makeItemsRight(fotvData: FOTVType){
    const items = [];
    //JP 3, AP 4
    items.push(<ImageDiv fotv={fotvData}/>);
    const versionByID = imageVersionByID(fotvData);
    const bigImage = fotvData.logoImages.find((a) => a.imageType == (fotvData.activeProgramID == 0 ? -3 : -4));
    if(bigImage != undefined){
        items.push(<img className='h-full w-full' src={getImageSRC(bigImage.imageID, versionByID)}/>)
    }
    return items;
}

function makeItemsLeft(fotvData: FOTVType){
    const items = fotvData.activeProgramID == 0 ? [<WrappedAPClassTable/>] :
    [<WrappedJPClassTable/>];
    if(fotvData.activeProgramID == 0 && fotvData.restrictions.findIndex((a) => a.active) >= 0)
        items.push(<RestrictionsList fotvData={fotvData}/>)
    return items;
}

function FOTVPageInternal(props: {fotvData: FOTVType}){
    const itemsLeft = makeItemsLeft(props.fotvData);
    const itemsRight = makeItemsRight(props.fotvData);
    const flagColor = React.useContext(FlagColorContext);
    const versionByID = imageVersionByID(props.fotvData);
    const backgroundImage = props.fotvData.logoImages.find((a) => a.imageType == -5)
    const bgSRC = backgroundImage == undefined ? '/images/fotv/background.jpeg' : getImageSRC(backgroundImage.imageID, versionByID);
    return <>
        <title>Front Office Display</title>
        <link rel='stylesheet' href='/css/fotv/style.css'/>
        <link rel='stylesheet' href='/css/fotv/newstyle.css'/>
        <div className='content flex col overflow-scroll' style={{backgroundImage: 'URL(' + bgSRC + ')'}}>
            <div className='padding-t-10'>
                <table className='items-center'>
                    <tr>
                        <td width='50%' className='text-center'>
                            <img className='mx-auto h-full min-h-0 min-w-0' height={'100px'} width={'100px'} src='/images/fotv/logo.svg'/>
                        </td>
                        <td className='nowrap'>
                            <h1 className='font-roboto color-blue font-50pt mx-auto my-0 align-center'>Welcome To Community Boating</h1>
                            <h1 className='font-serif color-blue font-30pt mx-auto my-0 align-center'>Sailing for All!</h1>
                        </td>
                        <td className='relative' width='50%'>
                                {<FlagStatusIcon preserveAspectRatio='meet' height='100%' className='full-parent' flag={getFlagIcon(flagColor.flagColor)}/>}
                        </td>
                    </tr>
                </table>
            </div>
            <div className='flex row w-full bg-blue text-white justify-around dotted mt-10'>
                <h2>Learning</h2>
                <h2>Volunteerism</h2>
                <h2>Community</h2>
                <h2>Inclusivity</h2>
                <h2>Excellence</h2>
                <h2>Fun</h2>
            </div>
            <div className='flex row w-full justify-around color-blue padding-10'>
                <div className='flex row grow justify-around basis-0'>
                    <div className='flex col h-full align-center'>
                        <h2 className=''>Close:</h2>
                        <h2>{moment(props.fotvData.sunset).format("hh:mm")}</h2>
                    </div>
                    <div className='flex col h-full align-center'>
                        <h2 className=''>Call In:</h2>
                        <h2>{moment(props.fotvData.sunset).subtract(30, 'minutes').format("hh:mm")}</h2>
                    </div>
                </div>
                    <Clock className='font-3em font-roboto'/>
                <div className='flex row grow justify-around center basis-0'>
                    <h2 className=''>{programIDToName(props.fotvData.activeProgramID)}</h2>
                    <h2 className=''>{flagShortToName(flagColor.flagColor)}</h2>
                </div>
            </div>
            <div className='flex relative row grow min-h-0 basis-0 padding-x-20 gap-20 padding-b-20'>
                <div className='flex h-full basis-0 grow overflow-hidden bg-opaque absolute min-w-0'>
                    <Cycler slots={1} items={itemsLeft} initialOrderIndex={1} delay={10000}/>
                </div>
                <div className='flex h-full basis-0 grow overflow-hidden bg-opaque min-w-0'>
                    <Cycler slots={1} initialOrderIndex={0} items={itemsRight} delay={10000}/>
                </div>
            </div>
        </div>
    </>;
}

function imageVersionByID(fotv: FOTVType){
    const versionByID: any = {};
    fotv.images.forEach((a) => {
        versionByID[a.imageID] = a.version;
    })
    return versionByID;
}

export function getImageSRC(imageID: number, versionByID: {[key: number]: string}) {
    const params = tempParams.getOrElse({https: false, host: "", port: 0});
    return (params.https ? "https" : "http") + "://" + params.host + ":" + params.port + "/images/" + imageID + '/' + versionByID[imageID];
}

function ImageDiv(props: {fotv: FOTVType}){
    const versionByID = imageVersionByID(props.fotv);
    const sortLogos = (a: LogoImageType, b: LogoImageType) => a.displayOrder - b.displayOrder;
    const logoMap = (size: string) => (a: LogoImageType) => 
        <img className={size + ' '} src={getImageSRC(a.imageID, versionByID)}/>
    return <div className='flex col w-full space-around'>
        <div className='mx-auto min-h-50 h-50'>
            {props.fotv.logoImages.filter((a) => a.imageType == -2).map(logoMap('h-full'))}
        </div>
    <ScrollingDiv className='min-h-25 h-25'>
        <div className='flex row h-full gap-10 px-10 max-fit-content'>
            {props.fotv.logoImages.filter((a) => a.imageType == 0).sort(sortLogos).map((logoMap('h-full shrink')))}
        </div>
    </ScrollingDiv>
    <ScrollingDiv className='min-h-15 h-15'>
        <div className='flex row h-full gap-10 px-10 max-fit-content'>
            {props.fotv.logoImages.filter((a) => a.imageType == -1).sort(sortLogos).map((logoMap('h-full shrink')))}
        </div>
    </ScrollingDiv>
    </div>
}

type FOTVItemType = ((fotvData: FOTVType) => JSX.Element)[]

const itemsAP: FOTVItemType = [
    ClassesItem
]

const pagesJP: FOTVItemType = [
    PageOneJP,
    PageTwoJP
]

function ClassesItem(fotvData: FOTVType){
    return <div className=''>
        <iframe className='ap_class_iframe' src='/embedded/ap-class-instances'/>
    </div>
}

function PageOneAP(fotvData: FOTVType){
    return <div className='content'>
        <div className='flex col h-full w-full'>
            <h1>Welcome To Community Boating</h1>
            <div className='flex row h-full w-full'>
                <div className='flex col grow'>
                    <div className='flex row grow'>
                        <div className='flex grow'>
                            <FlagColorContext.Consumer>
                                {(a) => <>{<FlagStatusIcon className='flag_img img_normal' flag={getFlagIcon(a.flagColor)}/>}</>}
                            </FlagColorContext.Consumer>
                        </div>
                        <div className='times grow'>
                            <h2 className='clock_main'>{moment(fotvData.sunset).format("hh:mm")}</h2>
                            <Clock className='clock_main'/>
                        </div>
                    </div>
                    <div className="flex flex-row ap_main_image_div">
                        <img src='/images/fotv/logo.png'/>
                        <img src='/images/fotv/dcr.png'/>
                        <img src='/images/fotv/csc.png'/>
                    </div>
                </div>
                <div>
                    <iframe className='ap_class_iframe' src='/embedded/ap-class-instances'/>
                </div>
            </div>
        </div>
    </div>
}

function PageTwoAP(){
    return <div className='content'>
        <div className='social'>
            <div className='infobar'>
                Time:
            </div>
        </div>
    </div>
}

function PageOneJP(){
    return <div className='content'>
        <div className='inline-block h-full'>
            <iframe className='jp_class_iframe' src='/embedded/jp-class-instances'/>
        </div>
        <div className='inline-block h-full grow'>
            <div className='flex col h-full'>
                <h1 className='jp_h1'>Welcome To Community Boating</h1>
                <h3 className='jp_h3 jp_green_bluebg'>
                    Junior Program
                </h3>
                <h3 className='jp_h3'>
                    <strong>
                        ** NO ADULTS ON THE DOCK PLEASE! **
                    </strong>
                </h3>
                <Clock/>
                <div className='flex flag grow w-full center'>
                    <FlagColorContext.Consumer>
                        {(a) => <>{<FlagStatusIcon className='flag_img img_normal' flag={getFlagIcon(a.flagColor)}/>}</>}
                    </FlagColorContext.Consumer>
                </div>
            </div>
        </div>
    </div>
}

function PageTwoJP(){
    return <div className="jp_big_image"/>
}

function RestrictionsList(props: {fotvData: FOTVType}){
    const versionByID = imageVersionByID(props.fotvData);
    return <ul className='w-full padding-8'>
        {props.fotvData.restrictions.sort((a, b) => (a.groupID - b.groupID)*1000 + a.displayOrder - b.displayOrder).filter((a) => a.active).map((a) => <li key={a.restrictionID} style={{color: a.textColor, backgroundColor: a.backgroundColor, fontWeight: a.fontWeight.getOrElse('normal'), borderColor: a.textColor}} className='w-full no-list-style p-5 br-10 flex row mt-10'>
            <div className='flex center padding-5'>
                {a.imageID.isSome() ? <img height={'50px'} width={'50px'} src={getImageSRC(a.imageID.value, versionByID)}/>
                : <RestrictionIcon fill={a.textColor} width="50px" height="50px"/>}
            </div>
            <div className='w-full'>
                <p className='font-roboto black'>{a.title}</p>
                <p className='text-center'>{a.message}</p>
            </div>
            </li>)}
    </ul>
}

function Clock(props: any){
    const [time, setTime] = React.useState(moment());
    React.useEffect(() => {
        const interval = setInterval(() => {
            setTime(moment());
        }, 1000);
        return () => {
            clearInterval(interval);
        }
    }, []);
    return <h2 {...props}>{time.format("hh:mm A")}</h2>
}