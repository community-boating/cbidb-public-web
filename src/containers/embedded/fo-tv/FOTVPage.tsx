import { FOTVType, LogoImageType, RestrictionType } from 'async/embedded/fotv';
import FlagColorProvider, { FlagColorContext } from 'async/providers/FlagColorProvider';
import * as moment from 'moment';
import * as React from 'react';
import { FlagStatusIcon, getFlagIcon } from './FlagStatusIcon';
import Cycler from './Cycler';
import APClassInstancesProvider, { APClassInstancesContext } from 'async/providers/APClassInstancesProvider';
import { FlagColor } from 'async/util/flag-color';
import { APClassTable } from '../class-tables/APClassTable';
import JPClassSectionsProvider, { JPClassSectionsContext } from 'async/providers/JPClassSectionsProvider';
import { JPClassTable } from '../class-tables/JPClassTable';
import { tempParams } from 'app/routes/embedded/fotv';
import RestrictionIcon from './RestrictionIcon';
import { MAGIC_NUMBERS } from 'app/magicNumbers';

const PROGRAM_JP: number = 2
const PROGRAM_AP: number = 1

const RESTRICTION_CONDITION_TYPES = {
    ACTIONS: {
        ENABLE: 0,
        DISABLE: 1,
        TOGGLE: 2
    },
    TYPES: {
        TIME: 0,
        STATE: 1
    },
    INFOS: {
        OPEN: 'OPEN',
        CLOSE: 'CLOSE',
        GREEN: 'GREEN',
        YELLOW: 'YELLOW',
        RED: 'RED',
        AP: 'AP',
        JP: 'JP'
    }
}

const INFO_FLAG_MAP = {
    [RESTRICTION_CONDITION_TYPES.INFOS.CLOSE]: FlagColor.BLACK,
    [RESTRICTION_CONDITION_TYPES.INFOS.GREEN]: FlagColor.GREEN,
    [RESTRICTION_CONDITION_TYPES.INFOS.YELLOW]: FlagColor.YELLOW,
    [RESTRICTION_CONDITION_TYPES.INFOS.RED]: FlagColor.RED
}

function processCondition(currentRestrictionStates: {[key: number]: boolean}, restrictionID: number, restrictionConditionAction: number){
    if(restrictionConditionAction == RESTRICTION_CONDITION_TYPES.ACTIONS.ENABLE)
        currentRestrictionStates[restrictionID] = true
    else if(restrictionConditionAction == RESTRICTION_CONDITION_TYPES.ACTIONS.DISABLE)
        currentRestrictionStates[restrictionID] = false
    else if(restrictionConditionAction == RESTRICTION_CONDITION_TYPES.ACTIONS.TOGGLE)
        currentRestrictionStates[restrictionID] = !currentRestrictionStates[restrictionID]
}

function calculateRestrictionConditions(fotvData: FOTVType, currentFlag: FlagColor){
    const currentRestrictionStates: {[key: number]: boolean} = {}
    fotvData.restrictions.forEach((a, i) => {
        currentRestrictionStates[a.restrictionID] = a.active
    })
    const currentProgramID = getActiveProgramID(fotvData);
    fotvData.restrictionConditions.forEach((a) => {
        if(a.conditionType.getOrElse(-1) == RESTRICTION_CONDITION_TYPES.TYPES.STATE){
            const conditionInfo = a.conditionInfo.getOrElse("");
            if(conditionInfo == RESTRICTION_CONDITION_TYPES.INFOS.AP && currentProgramID == PROGRAM_AP)
                processCondition(currentRestrictionStates, a.restrictionID, a.conditionAction.getOrElse(-1))
            else if(conditionInfo == RESTRICTION_CONDITION_TYPES.INFOS.JP && currentProgramID == PROGRAM_JP)
                processCondition(currentRestrictionStates, a.restrictionID, a.conditionAction.getOrElse(-1))
            else if(conditionInfo == RESTRICTION_CONDITION_TYPES.INFOS.OPEN && currentFlag != FlagColor.BLACK)
                processCondition(currentRestrictionStates, a.restrictionID, a.conditionAction.getOrElse(-1))
            else if(currentFlag == INFO_FLAG_MAP[conditionInfo])
                processCondition(currentRestrictionStates, a.restrictionID, a.conditionAction.getOrElse(-1))
        }else if(a.conditionType.getOrElse(-1) == RESTRICTION_CONDITION_TYPES.TYPES.TIME){
            const time = moment(a.conditionInfo.getOrElse(""));
            if(moment().isAfter(time))
                processCondition(currentRestrictionStates, a.restrictionID, a.conditionAction.getOrElse(-1))
        }
    })
    return currentRestrictionStates;
}

function programIDToName(programID: number){
    const programMap = new Map<number, string>([
        [PROGRAM_AP, 'Adult Program'],
        [PROGRAM_JP, 'Junior Program']
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

function ScrollingDiv(props: {children?: React.ReactNode, className?: string, style?: React.CSSProperties}){
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
    return <div ref={outerRef} className={"relative hidden-scrollbar whitespace-nowrap overflow-scroll " + (props.className || "")} style={props.style}>
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
                <JPClassSectionsProvider>
                    <FOTVPageInternal {...props}/>
                </JPClassSectionsProvider>
            </APClassInstancesProvider>
    </FlagColorProvider>
}

function WrappedJPClassTable(){
    const jpClassInstances = React.useContext(JPClassSectionsContext);
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

function getActiveProgramID(fotvData: FOTVType){
    return parseInt((fotvData.singletonData.find((a) => a.data_key == "ACTIVE_PROGRAM_ID") || {value: "0"}).value)
}

function makeItemsRight(fotvData: FOTVType){
    const items = [];
    //JP 3, AP 4
    items.push(<ImageDiv fotv={fotvData}/>);
    const versionByID = imageVersionByID(fotvData);
    const bigImage = fotvData.logoImages.find((a) => a.imageType == (getActiveProgramID(fotvData) == PROGRAM_JP ? -3 : -4));
    if(bigImage != undefined){
        items.push(<img className='h-full w-full' src={getImageSRC(bigImage.imageID, versionByID)}/>)
    }
    return items;
}

function makeItemsLeft(restrictionsForList: RestrictionType[], activeProgramID: number, versionByID: NToN){
    const items = activeProgramID == PROGRAM_AP ? [<WrappedAPClassTable/>] :
    [<WrappedJPClassTable/>];
    if(restrictionsForList.length > 0)
        items.push(<RestrictionsList restrictionsForList={restrictionsForList} versionByID={versionByID}/>)
    return items;
}

function FOTVPageInternal(props: {fotvData: FOTVType}){
    const [restrictionIndex, setRestrictionIndex] = React.useState(0)
    const flagColor = React.useContext(FlagColorContext)
    const versionByID = imageVersionByID(props.fotvData)
    const activeProgramID = getActiveProgramID(props.fotvData)
    const currentRestrictionStates = calculateRestrictionConditions(props.fotvData, flagColor.flagColor)
    const filtered = props.fotvData.restrictions.filter((a) => currentRestrictionStates[a.restrictionID] == true)
    const itemsLeft = makeItemsLeft(filtered, activeProgramID, versionByID)
    const itemsRight = makeItemsRight(props.fotvData)

    const backgroundImage = props.fotvData.logoImages.find((a) => a.imageType == -5)
    const bgSRC = backgroundImage == undefined ? '/images/fotv/background.jpeg' : getImageSRC(backgroundImage.imageID, versionByID);
    const headerCyclerItems = filtered.filter((a) => a.isPriority).map((a, i) => <div className='h-60 br-10 mx-auto b-solid b-2 min-w-0 w-full px-10 flex row' style={{backgroundColor: a.backgroundColor, borderColor: a.textColor}}>
        <RestrictionImage restriction={a} versionByID={versionByID} className="mt-5 mr-30 min-w-50px"/>
        <ScrollingDiv className='min-w-0 overflow-hidden grow-1'>
            <h1 className="font-serif font-30pt inline lh-60 align-top pr-10" style={{color: a.textColor, fontWeight: a.fontWeight.getOrElse('normal'), borderColor: a.textColor}}>{a.title}</h1>
        </ScrollingDiv>
    </div>)
    const closeTime = activeProgramID == 2 ? moment("15:00", "HH:mm") : moment(props.fotvData.sunset)
    return <>
        <title>Front Office Display</title>
        <link rel='stylesheet' href='/css/fotv/style.css'/>
        <link rel='stylesheet' href='/css/fotv/newstyle.css'/>
        <div className='content flex col overflow-scroll' style={{backgroundImage: 'URL(' + bgSRC + ')'}}>
            <div className='padding-t-10'>
                <table className='items-center'>
                    <tbody>
                        <tr>
                            <td width='50%' className='text-center'>
                                <img className='mx-auto h-full min-h-0 min-w-0' height={'100px'} width={'100px'} src='/images/fotv/logo.svg'/>
                            </td>
                            <td className='nowrap w-main'>
                                <h1 className='font-roboto color-blue font-50pt mx-auto my-0 align-center'>Welcome To Community Boating</h1>
                                <div className='w-80 relative mx-auto'>
                                    <div className='overflow-hidden w-full'>
                                        {filtered.length > 0 ? <Cycler items={headerCyclerItems} slots={1} indexExternal={restrictionIndex} setIndexExternal={setRestrictionIndex}/> :
                                        <h1 className='font-serif color-blue font-30pt mx-auto my-0 align-center lh-60'>Sailing for All!</h1>}
                                    </div>
                                    {filtered.length > 1 ? <p className="inline r-0 w-0 m-0 absolute t-0">{restrictionIndex+1}/{filtered.length}</p> : <></>}
                                </div>
                            </td>
                            <td className='text-center' width='50%'>
                                    {<FlagStatusIcon preserveAspectRatio='meet' height='100px' width='100px' className='mx-auto h-full min-h-0 min-w-0' flag={getFlagIcon(flagColor.flagColor)}/>}
                            </td>
                        </tr>
                    </tbody>
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
                        <h2>{closeTime.format("hh:mm")}</h2>
                    </div>
                    <div className='flex col h-full align-center'>
                        <h2 className=''>Call In:</h2>
                        <h2>{closeTime.subtract(30, 'minutes').format("hh:mm")}</h2>
                    </div>
                </div>
                    <Clock className='font-3em font-roboto'/>
                <div className='flex row grow justify-around center basis-0'>
                    <h2 className=''>{programIDToName(getActiveProgramID(props.fotvData))}</h2>
                    <h2 className=''>{flagShortToName(flagColor.flagColor)}</h2>
                </div>
            </div>
            <div className='flex relative row grow min-h-0 basis-0 padding-x-20 gap-20 padding-b-20'>
                <div className='flex h-full basis-0 grow overflow-hidden bg-opaque min-w-0'>
                    <Cycler slots={1} items={itemsLeft} initialOrderIndex={1} delay={10000}/>
                </div>
                <div className='flex h-full basis-0 grow overflow-hidden bg-opaque min-w-0'>
                    <Cycler slots={1} initialOrderIndex={0} items={itemsRight} delay={10000}/>
                </div>
            </div>
        </div>
    </>;
}

type NToN = {[key: number]: number}

function imageVersionByID(fotv: FOTVType): NToN {
    const versionByID: NToN = {}
    fotv.images.forEach((a) => {
        versionByID[a.imageID] = a.version
    })
    return versionByID
}

export function getImageSRC(imageID: number, versionByID: NToN) {
    const params = tempParams.getOrElse({https: false, host: "", port: 0})
    return (params.https ? "https" : "http") + "://" + params.host + ":" + params.port + "/images/" + imageID + '/' + versionByID[imageID]
}

function ImageDiv(props: {fotv: FOTVType}){
    const versionByID = imageVersionByID(props.fotv);
    const sortLogos = (a: LogoImageType, b: LogoImageType) => a.displayOrder - b.displayOrder
    const logoMap = (size: string) => (a: LogoImageType) => 
        <img className={size + ' '} src={getImageSRC(a.imageID, versionByID)} key={a.imageID}/>
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

function RestrictionImage(props:{ className?: string, restriction: RestrictionType, versionByID: NToN}){
    return <>
                {props.restriction.imageID.isSome() ? <img className={props.className} height={'50px'} width={'50px'} src={getImageSRC(props.restriction.imageID.value, props.versionByID)}/>
                : <RestrictionIcon className={props.className} fill={props.restriction.textColor} width="50px" height="50px"/>}
    </>
}

function RestrictionsList(props: {restrictionsForList: RestrictionType[], versionByID: NToN}){
    const versionByID = props.versionByID;
    return <ul className='w-full padding-8'>
        {props.restrictionsForList.sort((a, b) => (a.groupID - b.groupID) + (a.displayOrder - b.displayOrder) * 1000).map((a) => <li key={a.restrictionID} style={{color: a.textColor, backgroundColor: a.backgroundColor, fontWeight: a.fontWeight.getOrElse('normal'), borderColor: a.textColor}} className='w-full no-list-style p-5 br-10 flex row mt-10 b-2 b-solid'>
            <div className='flex center padding-5'>
                <RestrictionImage restriction={a} versionByID={versionByID}/>
            </div>
            <div className='w-full'>
                <p className='font-roboto black'>{a.title}</p>
                <p className='text-left px-10ish'>{a.message}</p>
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