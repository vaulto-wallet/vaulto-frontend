//import RenderAuthorized from 'ant-design-pro/lib/Authorized';
import { getAuthority } from './authority';

let Authorized = getAuthority(); // eslint-disable-line

// Reload the rights component
const reloadAuthorized = () => {
  Authorized = getAuthority();
};

export { reloadAuthorized };
export default Authorized;
