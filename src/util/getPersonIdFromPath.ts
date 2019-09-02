import { matchPath } from "react-router";

// TODO: replace this with a more generic arch for parsing GET params
// TODO: also this is error prone and generally terrible.
export default function(pattern: string, currentPath: string): number {
    console.log("Pattern:", pattern)
    console.log("Current path: ", currentPath)
    const match = matchPath(
        currentPath,
        { path: pattern }
        ) || {params: {}};
    const result = match.params
    console.log(result)
    return Number((result as any).personId);
}