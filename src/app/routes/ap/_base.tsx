import RouteWrapper from "../../../core/RouteWrapper";
import apPath from "../../paths/ap/_base"
import { PageFlavor } from '../../../components/Page';
import LoginRoute from "../common/login";

export const apLoginPageRoute = new RouteWrapper(true, apPath, LoginRoute(PageFlavor.AP));
