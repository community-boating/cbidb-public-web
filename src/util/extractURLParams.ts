import { matchPath } from 'react-router-dom';

const extractURLParams: (pattern: string) => (location: string) => any = (pattern: string) => location => {
    const match = matchPath(
        location,
        { path: pattern }
    ) || { params: {} };
    return match.params as any;
}

export default extractURLParams;