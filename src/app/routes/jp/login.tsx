import RouteWrapper from "core/RouteWrapper";
import { PageFlavor } from 'components/Page';
import LoginRoute from "../common/login";
import { jpPathLogin } from "app/paths/jp/login";

export const jpLoginPageRoute = new RouteWrapper(true, jpPathLogin, LoginRoute(PageFlavor.JP));
