import * as React from 'react';

export default function RestrictionIcon(props: React.SVGProps<SVGSVGElement> & {fill: string}) {
const style = {strokeWidth: 0, fill: props.fill};
return <svg {...props} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33.37 29.55">
  <g>
    <path style={style} d="M16.68,2.19l14.55,25.37H2.14L16.68,2.19M16.68,0c-.61,0-1.23.3-1.58.91L.24,26.84c-.69,1.21.18,2.72,1.58,2.72h29.73c1.4,0,2.27-1.51,1.58-2.72L18.26.91c-.35-.61-.96-.91-1.58-.91h0Z"/>
  </g>
  <path style={style} d="M18.46,24.42c0,.46-.17.85-.52,1.18s-.77.49-1.25.49-.9-.16-1.25-.49-.52-.72-.52-1.18.17-.86.52-1.19.77-.5,1.25-.5.9.17,1.25.5.52.73.52,1.19ZM18.34,9.55c0,.41-.14,1.79-.43,4.14s-.54,4.62-.75,6.82h-1.01c-.19-2.19-.43-4.47-.71-6.82s-.42-3.73-.42-4.14c0-.47.16-.86.47-1.18s.71-.48,1.19-.48.88.16,1.19.47.47.71.47,1.19Z"/>
</svg>
}