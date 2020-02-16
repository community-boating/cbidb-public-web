import * as React from 'react';
import RouteWrapper from "../../../core/RouteWrapper";
import PathWrapper from '../../../core/PathWrapper';
import MaintenanceSplash from '../../../containers/MaintenanceSplash';

const path = new PathWrapper("/maintenance");

export const maintenancePageRoute = new RouteWrapper(true, path, () => <MaintenanceSplash />);
