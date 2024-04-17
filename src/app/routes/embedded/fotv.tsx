import * as React from 'react';
import * as t from "io-ts";
import RouteWrapper from "core/RouteWrapper";
import path from "app/paths/embedded/fotv";
import PageWrapper from 'core/PageWrapper';
import { getWrapper, validator } from 'async/embedded/fotv';
import { option } from 'fp-ts';
import FOTVPage from 'containers/embedded/fo-tv/FOTVPage';

export type AsyncPropsType = t.TypeOf<typeof validator>

//export const tempParams = option.some({host: "localhost", https: false, port:6969});

export const FOTVPageRoute = new RouteWrapper(true, path, history => <PageWrapper key={"fotv"} urlProps={undefined} getAsyncProps={() => getWrapper.sendWithParams(option.none)(null)} component={(urlProps: unknown, asyncProps: AsyncPropsType, reload: () => void) => <FOTVPage fotvData={asyncProps}/>} history={history} shadowComponent={<p>"Loading..."</p>} autoRefresh={5000} ></PageWrapper>);