/* @flow */

/*::
export interface IpcMsg<T> {
  id: number;
  type: string;
  value: T;
}
*/

export const MSG_TYPE_OPEN_URL = "linkplaces-open-tab";
export const MSG_TYPE_OPEN_URL_RESULT = "linkplaces-open-tab-result";

/*::
export interface OpenUrlMsg extends IpcMsg<{
  where: string;
  url: string;
}> {
  type: typeof MSG_TYPE_OPEN_URL;
};
*/
