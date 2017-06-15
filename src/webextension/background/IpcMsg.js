/* @flow */

/*::
export interface IpcMsg<T> {
  id: number;
  type: string;
  value: T;
}
*/

export const MSG_TYPE_OPEN_URL = 'linkplaces-open-tab';
export const MSG_TYPE_OPEN_URL_RESULT = 'linkplaces-open-tab-result';
export const MSG_TYPE_ENABLE_WEBEXT_CTXMENU = 'linkplaces-enable-webext-ctxmenu';
export const MSG_TYPE_DISABLE_WEBEXT_CTXMENU = 'linkplaces-disable-webext-ctxmenu';
export const MSG_TYPE_OPEN_URL_FROM_POPUP = 'linkplaces-open-url-from-popup';

/*::
export interface OpenUrlMsg extends IpcMsg<{
  where: string;
  url: string;
}> {
  type: typeof MSG_TYPE_OPEN_URL;
};
*/
