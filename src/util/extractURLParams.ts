import { matchPath } from 'react-router-dom';

const extractURLParams: <T extends {[K: string]: string}>(pattern: string) => (location: string) => T =  <T>(pattern: string) => location => {
    const match = matchPath(
        location,
        { path: pattern }
    ) || { params: {} };
    return match.params as T;
}

export default extractURLParams;