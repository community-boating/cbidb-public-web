import RouteWrapper from "../../../core/RouteWrapper";
import jpPath from "../../paths/jp/_base"
import { PageFlavor } from '../../../components/Page';
import LoginRoute from "../common/login";

export const jpLoginPageRoute = new RouteWrapper(true, jpPath, LoginRoute(PageFlavor.JP));