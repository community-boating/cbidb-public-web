import * as React from 'react';
import * as t from "io-ts";
import RouteWrapper from "core/RouteWrapper";
import path from "app/paths/embedded/class-tables/ap-class-instances";
import PageWrapper from 'core/PageWrapper';
import { getWrapper, validator } from 'async/embedded/class-tables/ap-class-instances';
import { APClassTable } from 'containers/embedded/class-tables/APClassTable';

export type AsyncPropsType = t.TypeOf<typeof validator>

export const apClassInstancesPageRoute = new RouteWrapper(true, path, history => <PageWrapper key={"ap-class-instances"} urlProps={undefined} getAsyncProps={() => getWrapper.send(null)} component={(urlProps: unknown, asyncProps: AsyncPropsType, reload: () => void) => <APClassTable apClassInstances={asyncProps} />} history={history} shadowComponent={<p>"Loading..."</p>} autoRefresh={10000} ></PageWrapper>);