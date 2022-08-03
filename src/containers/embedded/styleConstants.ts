export const tdStyle: React.CSSProperties = {}

export const headerFontSize: string = "30px";

export const inline: React.CSSProperties = {display: "inline", margin: "0px 0px 0px 0px", fontSize: "20px", verticalAlign: "bottom"};

export const spanStyle: React.CSSProperties = {margin: "0px 0px 0px 20px"};
export const thStyle: React.CSSProperties = {textAlign: "left", backgroundColor: "#b0cbe8", fontSize: headerFontSize, padding: "10px", margin: "0"};
export const borderStyle: string = "solid 1px #DDDDDD";
export const borderStyleTop: string = "solid 4px black";
export const tableStyle: React.CSSProperties = {width: "900px", fontFamily: "Helvetica Neue,Helvetica,sans-serif", color: "#333333", borderRight: borderStyle, borderTop: borderStyle, borderBottom: borderStyle, borderSpacing: "0", borderCollapse: "collapse"};
export const thWrap: React.CSSProperties = {...thStyle, width: "auto", whiteSpace: "nowrap"};
export const thFull: React.CSSProperties = {...thStyle, width: "100%", borderLeft: borderStyle};