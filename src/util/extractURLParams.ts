import { matchPath } from 'react-router-dom';

const extractURLParams: <T extends {[K: string]: string}>(pattern: string) => (location: string) => T =  <T>(pattern: string) => location => {
    console.log("pattern is " + pattern)
    console.log("location is " + location)
    const match = matchPath(
        location,
        { path: pattern }
    ) || { params: {} };
    console.log("found: ", match)
    return match.params as T;
}

export default extractURLParams;