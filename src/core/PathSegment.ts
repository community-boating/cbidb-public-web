import { matchPath } from 'react-router-dom';

export type StringObject = {[K: string]: string};

export default class PathSegment<T_Props extends StringObject> {
    constructor(
        public path: string
    ) {  }

    extractURLParams(location: string): T_Props {
        const match = matchPath(
            location,
            { path: this.path }
        ) || { params: {} };
        return match.params as T_Props;
    }

    appendPathSegment<T_NewProps extends StringObject>(subPath: string) {
        return new PathSegment<T_Props & T_NewProps>(this.path + subPath)
    }
}