import * as React from 'react';
import * as t from "io-ts";
import RouteWrapper from "core/RouteWrapper";
import path from "app/paths/embedded/class-tables/jp-class-instances";
import PageWrapper from 'core/PageWrapper';
import { getJPClasses, validator } from 'async/embedded/class-tables/jp-class-sections';
import { JPClassTable } from 'containers/embedded/class-tables/JPClassTable';

export type AsyncPropsType = t.TypeOf<typeof validator>;

export const jpClassInstancesPageRoute = new RouteWrapper(true, path, history => <PageWrapper key={"jp-class-instances"} urlProps={undefined} getAsyncProps={() => getJPClasses().send()} component={(urlProps: unknown, asyncProps: AsyncPropsType, reload: () => void) => <JPClassTable jpClassInstances={asyncProps}/>} history={history} shadowComponent={<p>"Loading..."</p>} autoRefresh={10000} ></PageWrapper>);