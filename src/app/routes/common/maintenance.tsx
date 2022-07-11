import * as React from 'react';
import RouteWrapper from "core/RouteWrapper";
import path from "app/paths/common/maintenance"
import MaintenanceSplash from 'containers/MaintenanceSplash';

export const maintenancePageRoute = new RouteWrapper(true, path, () => <MaintenanceSplash />);
