import RouteWrapper from "@core/RouteWrapper";
import { PageFlavor } from '@components/Page';
import LoginRoute from "../common/login";
import { apPathLogin } from "@paths/ap/login";

export const apLoginPageRoute = new RouteWrapper(true, apPathLogin, LoginRoute(PageFlavor.AP));
