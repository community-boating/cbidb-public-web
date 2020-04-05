import RouteWrapper from "../../../core/RouteWrapper";
import {apBasePath} from "../../paths/ap/_base"
import { PageFlavor } from '../../../components/Page';
import LoginRoute from "../common/login";

export const apLoginPageRoute = new RouteWrapper(true, apBasePath, LoginRoute(PageFlavor.AP));
