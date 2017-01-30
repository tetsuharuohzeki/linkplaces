// original https://gist.github.com/rpl/6cda4a1cbfcfb96dcba088919b15facc
// Auto-generated WebExtensions Flow types definitions generated from WebExtensions JSON API schema.

declare type webext$alarms$Alarm = {|
  name: string,
  scheduledTime: number,
  periodInMinutes?: number
|};

declare function webext$alarms$create(alarmInfo: {|
  when?: number,
  delayInMinutes?: number,
  periodInMinutes?: number
|}): void;
declare function webext$alarms$create(name: string, alarmInfo: {|
  when?: number,
  delayInMinutes?: number,
  periodInMinutes?: number
|}): void;

declare function webext$alarms$get(callback?: (alarm: webext$alarms$Alarm) => void): Promise<webext$alarms$Alarm>;
declare function webext$alarms$get(name: string, callback?: (alarm: webext$alarms$Alarm) => void): Promise<webext$alarms$Alarm>;

declare function webext$alarms$getAll(callback?: (alarms: Array<webext$alarms$Alarm>) => void): Promise<Array<webext$alarms$Alarm>>;

declare function webext$alarms$clear(callback?: (wasCleared: boolean) => void): Promise<boolean>;
declare function webext$alarms$clear(name: string, callback?: (wasCleared: boolean) => void): Promise<boolean>;

declare function webext$alarms$clearAll(callback?: (wasCleared: boolean) => void): Promise<boolean>;

declare type webext$alarms$onAlarm = {|
  addListener: (listener: (name: webext$alarms$Alarm) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$alarms$alarms = {|
  onAlarm: webext$alarms$onAlarm,
  create: typeof webext$alarms$create,
  get: typeof webext$alarms$get,
  getAll: typeof webext$alarms$getAll,
  clear: typeof webext$alarms$clear,
  clearAll: typeof webext$alarms$clearAll
|};

declare type webext$manifest$WebExtensionManifest = {|
  manifest_version: number,
  minimum_chrome_version?: string,
  applications?: {|
    gecko?: webext$manifest$FirefoxSpecificProperties
  |},
  browser_specific_settings?: {|
    gecko?: webext$manifest$FirefoxSpecificProperties
  |},
  name: string,
  short_name?: string,
  description?: string,
  author?: string,
  version: string,
  homepage_url?: string,
  icons?: {},
  incognito?: string,
  background?: any,
  options_ui?: any,
  content_scripts?: Array<webext$manifest$ContentScript>,
  content_security_policy?: string,
  permissions?: Array<any>,
  web_accessible_resources?: Array<string>,
  developer?: {|
    name?: string,
    url?: string
  |}
|};

declare type webext$manifest$Permission = any;

declare type webext$manifest$ExtensionURL = string;

declare type webext$manifest$ExtensionID = any;

declare type webext$manifest$FirefoxSpecificProperties = {|
  id?: webext$manifest$ExtensionID,
  update_url?: string,
  strict_min_version?: string,
  strict_max_version?: string
|};

declare type webext$manifest$MatchPattern = any;

declare type webext$manifest$ContentScript = {|
  matches: Array<webext$manifest$MatchPattern>,
  exclude_matches?: Array<webext$manifest$MatchPattern>,
  include_globs?: Array<string>,
  exclude_globs?: Array<string>,
  css?: Array<webext$manifest$ExtensionURL>,
  js?: Array<webext$manifest$ExtensionURL>,
  all_frames?: boolean,
  match_about_blank?: boolean,
  run_at?: webext$extensionTypes$RunAt
|};

declare type webext$manifest$IconPath = any;

declare type webext$manifest$IconImageData = any;

declare type webext$manifest$UnrecognizedProperty = any;

declare type webext$manifest$PersistentBackgroundProperty = boolean;

declare type webext$manifest$NativeHostManifest = {|
  name: string,
  description: string,
  path: string,
  type: string,
  allowed_extensions: Array<webext$manifest$ExtensionID>
|};

declare type webext$manifest$KeyName = any;

declare type webext$manifest$manifest = {};

declare type webext$cookies$Cookie = {|
  name: string,
  value: string,
  domain: string,
  hostOnly: boolean,
  path: string,
  secure: boolean,
  httpOnly: boolean,
  session: boolean,
  expirationDate?: number,
  storeId: string
|};

declare type webext$cookies$CookieStore = {|
  id: string,
  tabIds: Array<number>
|};

declare type webext$cookies$OnChangedCause = string;

declare function webext$cookies$get(details: {|
  url: string,
  name: string,
  storeId?: string
|}, callback?: (cookie?: webext$cookies$Cookie) => void): Promise<webext$cookies$Cookie>;

declare function webext$cookies$getAll(details: {|
  url?: string,
  name?: string,
  domain?: string,
  path?: string,
  secure?: boolean,
  session?: boolean,
  storeId?: string
|}, callback?: (cookies: Array<webext$cookies$Cookie>) => void): Promise<Array<webext$cookies$Cookie>>;

declare function webext$cookies$set(details: {|
  url: string,
  name?: string,
  value?: string,
  domain?: string,
  path?: string,
  secure?: boolean,
  httpOnly?: boolean,
  expirationDate?: number,
  storeId?: string
|}, callback?: (cookie?: webext$cookies$Cookie) => void): Promise<webext$cookies$Cookie>;

declare function webext$cookies$remove(details: {|
  url: string,
  name: string,
  storeId?: string
|}, callback?: (details?: {|
  url: string,
  name: string,
  storeId: string
|}) => void): Promise<{|
    url: string,
    name: string,
    storeId: string
  |}>;

declare function webext$cookies$getAllCookieStores(callback?: (cookieStores: Array<webext$cookies$CookieStore>) => void): Promise<Array<webext$cookies$CookieStore>>;

declare type webext$cookies$onChanged = {|
  addListener: (listener: (changeInfo: {|
  removed: boolean,
  cookie: webext$cookies$Cookie,
  cause: webext$cookies$OnChangedCause
|}) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$cookies$cookies = {|
  onChanged: webext$cookies$onChanged,
  get: typeof webext$cookies$get,
  getAll: typeof webext$cookies$getAll,
  set: typeof webext$cookies$set,
  remove: typeof webext$cookies$remove,
  getAllCookieStores: typeof webext$cookies$getAllCookieStores
|};

declare type webext$downloads$FilenameConflictAction = string;

declare type webext$downloads$InterruptReason = string;

declare type webext$downloads$DangerType = string;

declare type webext$downloads$State = string;

declare type webext$downloads$DownloadItem = {|
  id: number,
  url: string,
  referrer: string,
  filename: string,
  incognito: boolean,
  danger: webext$downloads$DangerType,
  mime: string,
  startTime: string,
  endTime?: string,
  estimatedEndTime?: string,
  state: webext$downloads$State,
  paused: boolean,
  canResume: boolean,
  error?: webext$downloads$InterruptReason,
  bytesReceived: number,
  totalBytes: number,
  fileSize: number,
  exists: boolean,
  byExtensionId?: string,
  byExtensionName?: string
|};

declare type webext$downloads$StringDelta = {|
  current?: string,
  previous?: string
|};

declare type webext$downloads$DoubleDelta = {|
  current?: number,
  previous?: number
|};

declare type webext$downloads$BooleanDelta = {|
  current?: boolean,
  previous?: boolean
|};

declare type webext$downloads$DownloadTime = any;

declare type webext$downloads$DownloadQuery = {|
  query?: Array<string>,
  startedBefore?: webext$downloads$DownloadTime,
  startedAfter?: webext$downloads$DownloadTime,
  endedBefore?: webext$downloads$DownloadTime,
  endedAfter?: webext$downloads$DownloadTime,
  totalBytesGreater?: number,
  totalBytesLess?: number,
  filenameRegex?: string,
  urlRegex?: string,
  limit?: number,
  orderBy?: Array<string>,
  id?: number,
  url?: string,
  filename?: string,
  danger?: webext$downloads$DangerType,
  mime?: string,
  startTime?: string,
  endTime?: string,
  state?: webext$downloads$State,
  paused?: boolean,
  error?: webext$downloads$InterruptReason,
  bytesReceived?: number,
  totalBytes?: number,
  fileSize?: number,
  exists?: boolean
|};

declare function webext$downloads$download(options: {|
  url: string,
  filename?: string,
  conflictAction?: webext$downloads$FilenameConflictAction,
  saveAs?: boolean,
  method?: string,
  headers?: Array<{|
      name: string,
      value: string
    |}>,
  body?: string
|}, callback?: (downloadId: number) => void): Promise<number>;

declare function webext$downloads$search(query: webext$downloads$DownloadQuery, callback?: (results: Array<webext$downloads$DownloadItem>) => void): Promise<Array<webext$downloads$DownloadItem>>;

declare function webext$downloads$pause(downloadId: number, callback?: () => void): Promise<void>;

declare function webext$downloads$resume(downloadId: number, callback?: () => void): Promise<void>;

declare function webext$downloads$cancel(downloadId: number, callback?: () => void): Promise<void>;

declare function webext$downloads$getFileIcon(downloadId: number, options?: {|
  size?: number
|}, callback?: (iconURL?: string) => void): Promise<string>;

declare function webext$downloads$open(downloadId: number, callback?: () => void): Promise<void>;

declare function webext$downloads$show(downloadId: number, callback?: (success: boolean) => void): Promise<boolean>;

declare function webext$downloads$showDefaultFolder(): void;

declare function webext$downloads$erase(query: webext$downloads$DownloadQuery, callback?: (erasedIds: Array<number>) => void): Promise<Array<number>>;

declare function webext$downloads$removeFile(downloadId: number, callback?: () => void): Promise<void>;

declare function webext$downloads$acceptDanger(downloadId: number, callback?: () => void): void;

declare function webext$downloads$drag(downloadId: number): void;

declare function webext$downloads$setShelfEnabled(enabled: boolean): void;

declare type webext$downloads$onCreated = {|
  addListener: (listener: (downloadItem: webext$downloads$DownloadItem) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$downloads$onErased = {|
  addListener: (listener: (downloadId: number) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$downloads$onChanged = {|
  addListener: (listener: (downloadDelta: {|
  id: number,
  url?: webext$downloads$StringDelta,
  filename?: webext$downloads$StringDelta,
  danger?: webext$downloads$StringDelta,
  mime?: webext$downloads$StringDelta,
  startTime?: webext$downloads$StringDelta,
  endTime?: webext$downloads$StringDelta,
  state?: webext$downloads$StringDelta,
  canResume?: webext$downloads$BooleanDelta,
  paused?: webext$downloads$BooleanDelta,
  error?: webext$downloads$StringDelta,
  totalBytes?: webext$downloads$DoubleDelta,
  fileSize?: webext$downloads$DoubleDelta,
  exists?: webext$downloads$BooleanDelta
|}) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$downloads$downloads = {|
  onCreated: webext$downloads$onCreated,
  onErased: webext$downloads$onErased,
  onChanged: webext$downloads$onChanged,
  download: typeof webext$downloads$download,
  search: typeof webext$downloads$search,
  pause: typeof webext$downloads$pause,
  resume: typeof webext$downloads$resume,
  cancel: typeof webext$downloads$cancel,
  getFileIcon: typeof webext$downloads$getFileIcon,
  open: typeof webext$downloads$open,
  show: typeof webext$downloads$show,
  showDefaultFolder: typeof webext$downloads$showDefaultFolder,
  erase: typeof webext$downloads$erase,
  removeFile: typeof webext$downloads$removeFile,
  acceptDanger: typeof webext$downloads$acceptDanger,
  drag: typeof webext$downloads$drag,
  setShelfEnabled: typeof webext$downloads$setShelfEnabled
|};

declare type webext$events$Rule = {|
  id?: string,
  tags?: Array<string>,
  conditions: Array<any>,
  actions: Array<any>,
  priority?: number
|};

declare type webext$events$Event = {};

declare type webext$events$UrlFilter = {|
  hostContains?: string,
  hostEquals?: string,
  hostPrefix?: string,
  hostSuffix?: string,
  pathContains?: string,
  pathEquals?: string,
  pathPrefix?: string,
  pathSuffix?: string,
  queryContains?: string,
  queryEquals?: string,
  queryPrefix?: string,
  querySuffix?: string,
  urlContains?: string,
  urlEquals?: string,
  urlMatches?: string,
  originAndPathMatches?: string,
  urlPrefix?: string,
  urlSuffix?: string,
  schemes?: Array<string>,
  ports?: Array<any>
|};

declare type webext$events$events = {};

declare type webext$extension$ViewType = string;

declare function webext$extension$getURL(path: string): string;

declare function webext$extension$getViews(fetchProperties?: {|
  type?: webext$extension$ViewType,
  windowId?: number
|}): Array<any>;

declare function webext$extension$getBackgroundPage(): any;

declare function webext$extension$isAllowedIncognitoAccess(callback?: (isAllowedAccess: boolean) => void): Promise<boolean>;

declare function webext$extension$isAllowedFileSchemeAccess(callback?: (isAllowedAccess: boolean) => void): Promise<boolean>;

declare function webext$extension$setUpdateUrlData(data: string): void;

declare type webext$runtime$MessageSender = {|
  tab?: webext$tabs$Tab,
  frameId?: number,
  id?: string,
  url?: string
|};

declare type webext$extension$onRequest = {|
  addListener: (listener: (request?: any, sender: webext$runtime$MessageSender, sendResponse: Function) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$extension$onRequestExternal = {|
  addListener: (listener: (request?: any, sender: webext$runtime$MessageSender, sendResponse: Function) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$extension$extension = {|
  onRequest: webext$extension$onRequest,
  onRequestExternal: webext$extension$onRequestExternal,
  getURL: typeof webext$extension$getURL,
  getViews: typeof webext$extension$getViews,
  getBackgroundPage: typeof webext$extension$getBackgroundPage,
  isAllowedIncognitoAccess: typeof webext$extension$isAllowedIncognitoAccess,
  isAllowedFileSchemeAccess: typeof webext$extension$isAllowedFileSchemeAccess,
  setUpdateUrlData: typeof webext$extension$setUpdateUrlData
|};

declare type webext$extensionTypes$ImageFormat = string;

declare type webext$extensionTypes$ImageDetails = {|
  format?: webext$extensionTypes$ImageFormat,
  quality?: number
|};

declare type webext$extensionTypes$RunAt = string;

declare type webext$extensionTypes$InjectDetails = {|
  code?: string,
  file?: string,
  allFrames?: boolean,
  matchAboutBlank?: boolean,
  frameId?: number,
  runAt?: webext$extensionTypes$RunAt
|};

declare type webext$extensionTypes$Date = any;

declare type webext$extensionTypes$extensionTypes = {};

declare type webext$i18n$LanguageCode = string;

declare function webext$i18n$getAcceptLanguages(callback?: (languages: Array<webext$i18n$LanguageCode>) => void): Promise<Array<webext$i18n$LanguageCode>>;

declare function webext$i18n$getMessage(messageName: string, substitutions?: any): string;

declare function webext$i18n$getUILanguage(): string;

declare function webext$i18n$detectLanguage(text: string, callback?: (result: {|
  isReliable: boolean,
  languages: Array<{|
      language: webext$i18n$LanguageCode,
      percentage: number
    |}>
|}) => void): Promise<{|
    isReliable: boolean,
    languages: Array<{|
        language: webext$i18n$LanguageCode,
        percentage: number
      |}>
  |}>;

declare type webext$i18n$i18n = {|
  getAcceptLanguages: typeof webext$i18n$getAcceptLanguages,
  getMessage: typeof webext$i18n$getMessage,
  getUILanguage: typeof webext$i18n$getUILanguage,
  detectLanguage: typeof webext$i18n$detectLanguage
|};

declare type webext$idle$IdleState = string;

declare function webext$idle$queryState(detectionIntervalInSeconds: number, callback?: (newState: webext$idle$IdleState) => void): Promise<webext$idle$IdleState>;

declare function webext$idle$setDetectionInterval(intervalInSeconds: number): void;

declare type webext$idle$onStateChanged = {|
  addListener: (listener: (newState: webext$idle$IdleState) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$idle$idle = {|
  onStateChanged: webext$idle$onStateChanged,
  queryState: typeof webext$idle$queryState,
  setDetectionInterval: typeof webext$idle$setDetectionInterval
|};

declare type webext$management$IconInfo = {|
  size: number,
  url: string
|};

declare type webext$management$ExtensionDisabledReason = string;

declare type webext$management$ExtensionType = string;

declare type webext$management$ExtensionInstallType = string;

declare type webext$management$ExtensionInfo = {|
  id: string,
  name: string,
  shortName: string,
  description: string,
  version: string,
  versionName?: string,
  mayDisable: boolean,
  enabled: boolean,
  disabledReason?: webext$management$ExtensionDisabledReason,
  type: webext$management$ExtensionType,
  homepageUrl?: string,
  updateUrl?: string,
  optionsUrl: string,
  icons?: Array<webext$management$IconInfo>,
  permissions: Array<string>,
  hostPermissions: Array<string>,
  installType: webext$management$ExtensionInstallType
|};

declare function webext$management$getAll(callback?: (result: Array<webext$management$ExtensionInfo>) => void): Promise<Array<webext$management$ExtensionInfo>>;

declare function webext$management$get(id: webext$manifest$ExtensionID, callback?: (result: webext$management$ExtensionInfo) => void): Promise<webext$management$ExtensionInfo>;

declare function webext$management$getSelf(callback?: (result: webext$management$ExtensionInfo) => void): Promise<webext$management$ExtensionInfo>;

declare function webext$management$uninstallSelf(options?: {|
  showConfirmDialog?: boolean,
  dialogMessage?: string
|}, callback?: () => void): Promise<void>;

declare type webext$management$management = {|
  getAll: typeof webext$management$getAll,
  get: typeof webext$management$get,
  getSelf: typeof webext$management$getSelf,
  uninstallSelf: typeof webext$management$uninstallSelf
|};

declare type webext$notifications$TemplateType = string;

declare type webext$notifications$PermissionLevel = string;

declare type webext$notifications$NotificationItem = {|
  title: string,
  message: string
|};

declare type webext$notifications$CreateNotificationOptions = {|
  type: webext$notifications$TemplateType,
  iconUrl?: string,
  appIconMaskUrl?: string,
  title: string,
  message: string,
  contextMessage?: string,
  priority?: number,
  eventTime?: number,
  imageUrl?: string,
  items?: Array<webext$notifications$NotificationItem>,
  progress?: number,
  isClickable?: boolean
|};

declare type webext$notifications$UpdateNotificationOptions = {|
  type?: webext$notifications$TemplateType,
  iconUrl?: string,
  appIconMaskUrl?: string,
  title?: string,
  message?: string,
  contextMessage?: string,
  priority?: number,
  eventTime?: number,
  imageUrl?: string,
  items?: Array<webext$notifications$NotificationItem>,
  progress?: number,
  isClickable?: boolean
|};

declare function webext$notifications$create(options: webext$notifications$CreateNotificationOptions, callback?: (notificationId: string) => void): Promise<string>;
declare function webext$notifications$create(notificationId: string, options: webext$notifications$CreateNotificationOptions, callback?: (notificationId: string) => void): Promise<string>;

declare function webext$notifications$update(notificationId: string, options: webext$notifications$UpdateNotificationOptions, callback?: (wasUpdated: boolean) => void): Promise<boolean>;

declare function webext$notifications$clear(notificationId: string, callback?: (wasCleared: boolean) => void): Promise<boolean>;

declare function webext$notifications$getAll(callback?: (notifications: {}) => void): Promise<{}>;

declare function webext$notifications$getPermissionLevel(callback?: (level: webext$notifications$PermissionLevel) => void): Promise<webext$notifications$PermissionLevel>;

declare type webext$notifications$onClosed = {|
  addListener: (listener: (notificationId: string, byUser: boolean) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$notifications$onClicked = {|
  addListener: (listener: (notificationId: string) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$notifications$onButtonClicked = {|
  addListener: (listener: (notificationId: string, buttonIndex: number) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$notifications$onPermissionLevelChanged = {|
  addListener: (listener: (level: webext$notifications$PermissionLevel) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$notifications$onShowSettings = {|
  addListener: (listener: () => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$notifications$notifications = {|
  onClosed: webext$notifications$onClosed,
  onClicked: webext$notifications$onClicked,
  onButtonClicked: webext$notifications$onButtonClicked,
  onPermissionLevelChanged: webext$notifications$onPermissionLevelChanged,
  onShowSettings: webext$notifications$onShowSettings,
  create: typeof webext$notifications$create,
  update: typeof webext$notifications$update,
  clear: typeof webext$notifications$clear,
  getAll: typeof webext$notifications$getAll,
  getPermissionLevel: typeof webext$notifications$getPermissionLevel
|};

declare type webext$runtime$Port = any;

declare type webext$runtime$PlatformOs = string;

declare type webext$runtime$PlatformArch = string;

declare type webext$runtime$PlatformInfo = {|
  os: webext$runtime$PlatformOs,
  arch: webext$runtime$PlatformArch
|};

declare type webext$runtime$BrowserInfo = {|
  name: string,
  vendor: string,
  version: string,
  buildID: string
|};

declare type webext$runtime$RequestUpdateCheckStatus = string;

declare type webext$runtime$OnInstalledReason = string;

declare type webext$runtime$OnRestartRequiredReason = string;

declare function webext$runtime$getBackgroundPage(callback?: (backgroundPage?: any) => void): Promise<any>;

declare function webext$runtime$openOptionsPage(callback?: () => void): Promise<void>;

declare function webext$runtime$getManifest(): any;

declare function webext$runtime$getURL(path: string): string;

declare function webext$runtime$setUninstallURL(url: string, callback?: () => void): Promise<void>;

declare function webext$runtime$reload(): void;

declare function webext$runtime$requestUpdateCheck(callback?: (status: webext$runtime$RequestUpdateCheckStatus, details?: {|
  version: string
|}) => void): Promise<[webext$runtime$RequestUpdateCheckStatus, {|
    version: string
  |}]>;

declare function webext$runtime$restart(): void;

declare function webext$runtime$connect(extensionId?: string, connectInfo?: {|
  name?: string,
  includeTlsChannelId?: boolean
|}): webext$runtime$Port;

declare function webext$runtime$connectNative(application: string): webext$runtime$Port;

declare function webext$runtime$sendMessage(message: any, options?: {|
  includeTlsChannelId?: boolean
|}, responseCallback?: (response: any) => void): Promise<any>;
declare function webext$runtime$sendMessage(extensionId: string, message: any, options?: {|
  includeTlsChannelId?: boolean
|}, responseCallback?: (response: any) => void): Promise<any>;

declare function webext$runtime$sendNativeMessage(application: string, message: any, responseCallback?: (response: any) => void): Promise<any>;

declare function webext$runtime$getBrowserInfo(callback?: (browserInfo: webext$runtime$BrowserInfo) => void): Promise<webext$runtime$BrowserInfo>;

declare function webext$runtime$getPlatformInfo(callback?: (platformInfo: webext$runtime$PlatformInfo) => void): Promise<webext$runtime$PlatformInfo>;

declare function webext$runtime$getPackageDirectoryEntry(callback?: (directoryEntry: any) => void): Promise<any>;

declare type webext$runtime$onStartup = {|
  addListener: (listener: Function) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$runtime$onInstalled = {|
  addListener: (listener: (details: {|
  reason: webext$runtime$OnInstalledReason
|}) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$runtime$onSuspend = {|
  addListener: (listener: Function) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$runtime$onSuspendCanceled = {|
  addListener: (listener: Function) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$runtime$onUpdateAvailable = {|
  addListener: (listener: (details: any) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$runtime$onBrowserUpdateAvailable = {|
  addListener: (listener: () => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$runtime$onConnect = {|
  addListener: (listener: (port: webext$runtime$Port) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$runtime$onConnectExternal = {|
  addListener: (listener: (port: webext$runtime$Port) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$runtime$onMessage = {|
  addListener: (listener: (message?: any, sender: webext$runtime$MessageSender, sendResponse: Function) => ?boolean) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$runtime$onMessageExternal = {|
  addListener: (listener: (message?: any, sender: webext$runtime$MessageSender, sendResponse: Function) => ?boolean) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$runtime$onRestartRequired = {|
  addListener: (listener: (reason: webext$runtime$OnRestartRequiredReason) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$runtime$runtime = {|
  onStartup: webext$runtime$onStartup,
  onInstalled: webext$runtime$onInstalled,
  onSuspend: webext$runtime$onSuspend,
  onSuspendCanceled: webext$runtime$onSuspendCanceled,
  onUpdateAvailable: webext$runtime$onUpdateAvailable,
  onBrowserUpdateAvailable: webext$runtime$onBrowserUpdateAvailable,
  onConnect: webext$runtime$onConnect,
  onConnectExternal: webext$runtime$onConnectExternal,
  onMessage: webext$runtime$onMessage,
  onMessageExternal: webext$runtime$onMessageExternal,
  onRestartRequired: webext$runtime$onRestartRequired,
  getBackgroundPage: typeof webext$runtime$getBackgroundPage,
  openOptionsPage: typeof webext$runtime$openOptionsPage,
  getManifest: typeof webext$runtime$getManifest,
  getURL: typeof webext$runtime$getURL,
  setUninstallURL: typeof webext$runtime$setUninstallURL,
  reload: typeof webext$runtime$reload,
  requestUpdateCheck: typeof webext$runtime$requestUpdateCheck,
  restart: typeof webext$runtime$restart,
  connect: typeof webext$runtime$connect,
  connectNative: typeof webext$runtime$connectNative,
  sendMessage: typeof webext$runtime$sendMessage,
  sendNativeMessage: typeof webext$runtime$sendNativeMessage,
  getBrowserInfo: typeof webext$runtime$getBrowserInfo,
  getPlatformInfo: typeof webext$runtime$getPlatformInfo,
  getPackageDirectoryEntry: typeof webext$runtime$getPackageDirectoryEntry
|};

declare type webext$storage$StorageChange = {|
  oldValue?: any,
  newValue?: any
|};

declare type webext$storage$StorageArea = {};

declare type webext$storage$onChanged = {|
  addListener: (listener: (changes: {}, areaName: string) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$storage$storage = {|
  onChanged: webext$storage$onChanged
|};

declare type webext$topSites$MostVisitedURL = {|
  url: string,
  title?: string
|};

declare function webext$topSites$get(callback?: (results: Array<webext$topSites$MostVisitedURL>) => void): Promise<Array<webext$topSites$MostVisitedURL>>;

declare type webext$topSites$topSites = {|
  get: typeof webext$topSites$get
|};

declare type webext$history$TransitionType = string;

declare type webext$webNavigation$TransitionQualifier = string;

declare type webext$webNavigation$EventUrlFilters = {|
  url: Array<webext$events$UrlFilter>
|};

declare function webext$webNavigation$getFrame(details: {|
  tabId: number,
  processId?: number,
  frameId: number
|}, callback?: (details?: {|
  url: string,
  parentFrameId: number
|}) => void): Promise<{|
    url: string,
    parentFrameId: number
  |}>;

declare function webext$webNavigation$getAllFrames(details: {|
  tabId: number
|}, callback?: (details?: Array<{|
    frameId: number,
    parentFrameId: number,
    url: string
  |}>) => void): Promise<Array<{|
      frameId: number,
      parentFrameId: number,
      url: string
    |}>>;

declare type webext$webNavigation$onBeforeNavigate = {|
  addListener: (listener: (details: {|
  tabId: number,
  url: string,
  frameId: number,
  parentFrameId: number,
  timeStamp: number
|}) => void, filters?: webext$webNavigation$EventUrlFilters) => void,
  removeListener: (listener: Function, filters?: webext$webNavigation$EventUrlFilters) => void
|};

declare type webext$webNavigation$onCommitted = {|
  addListener: (listener: (details: {|
  tabId: number,
  url: string,
  frameId: number,
  timeStamp: number
|}) => void, filters?: webext$webNavigation$EventUrlFilters) => void,
  removeListener: (listener: Function, filters?: webext$webNavigation$EventUrlFilters) => void
|};

declare type webext$webNavigation$onDOMContentLoaded = {|
  addListener: (listener: (details: {|
  tabId: number,
  url: string,
  frameId: number,
  timeStamp: number
|}) => void, filters?: webext$webNavigation$EventUrlFilters) => void,
  removeListener: (listener: Function, filters?: webext$webNavigation$EventUrlFilters) => void
|};

declare type webext$webNavigation$onCompleted = {|
  addListener: (listener: (details: {|
  tabId: number,
  url: string,
  frameId: number,
  timeStamp: number
|}) => void, filters?: webext$webNavigation$EventUrlFilters) => void,
  removeListener: (listener: Function, filters?: webext$webNavigation$EventUrlFilters) => void
|};

declare type webext$webNavigation$onErrorOccurred = {|
  addListener: (listener: (details: {|
  tabId: number,
  url: string,
  frameId: number,
  timeStamp: number
|}) => void, filters?: webext$webNavigation$EventUrlFilters) => void,
  removeListener: (listener: Function, filters?: webext$webNavigation$EventUrlFilters) => void
|};

declare type webext$webNavigation$onCreatedNavigationTarget = {|
  addListener: (listener: (details: {|
  sourceTabId: number,
  sourceProcessId: number,
  sourceFrameId: number,
  url: string,
  tabId: number,
  timeStamp: number
|}) => void, filters?: webext$webNavigation$EventUrlFilters) => void,
  removeListener: (listener: Function, filters?: webext$webNavigation$EventUrlFilters) => void
|};

declare type webext$webNavigation$onReferenceFragmentUpdated = {|
  addListener: (listener: (details: {|
  tabId: number,
  url: string,
  frameId: number,
  timeStamp: number
|}) => void, filters?: webext$webNavigation$EventUrlFilters) => void,
  removeListener: (listener: Function, filters?: webext$webNavigation$EventUrlFilters) => void
|};

declare type webext$webNavigation$onTabReplaced = {|
  addListener: (listener: (details: {|
  replacedTabId: number,
  tabId: number,
  timeStamp: number
|}) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$webNavigation$onHistoryStateUpdated = {|
  addListener: (listener: (details: {|
  tabId: number,
  url: string,
  frameId: number,
  timeStamp: number
|}) => void, filters?: webext$webNavigation$EventUrlFilters) => void,
  removeListener: (listener: Function, filters?: webext$webNavigation$EventUrlFilters) => void
|};

declare type webext$webNavigation$webNavigation = {|
  onBeforeNavigate: webext$webNavigation$onBeforeNavigate,
  onCommitted: webext$webNavigation$onCommitted,
  onDOMContentLoaded: webext$webNavigation$onDOMContentLoaded,
  onCompleted: webext$webNavigation$onCompleted,
  onErrorOccurred: webext$webNavigation$onErrorOccurred,
  onCreatedNavigationTarget: webext$webNavigation$onCreatedNavigationTarget,
  onReferenceFragmentUpdated: webext$webNavigation$onReferenceFragmentUpdated,
  onTabReplaced: webext$webNavigation$onTabReplaced,
  onHistoryStateUpdated: webext$webNavigation$onHistoryStateUpdated,
  getFrame: typeof webext$webNavigation$getFrame,
  getAllFrames: typeof webext$webNavigation$getAllFrames
|};

declare type webext$webRequest$ResourceType = string;

declare type webext$webRequest$OnBeforeRequestOptions = string;

declare type webext$webRequest$OnBeforeSendHeadersOptions = string;

declare type webext$webRequest$OnSendHeadersOptions = string;

declare type webext$webRequest$OnHeadersReceivedOptions = string;

declare type webext$webRequest$OnAuthRequiredOptions = string;

declare type webext$webRequest$OnResponseStartedOptions = string;

declare type webext$webRequest$OnBeforeRedirectOptions = string;

declare type webext$webRequest$OnCompletedOptions = string;

declare type webext$webRequest$RequestFilter = {|
  urls: Array<string>,
  types?: Array<webext$webRequest$ResourceType>,
  tabId?: number,
  windowId?: number
|};

declare type webext$webRequest$HttpHeaders = Array<{|
    name: string,
    value?: string,
    binaryValue?: Array<number>
  |}>;

declare type webext$webRequest$BlockingResponse = {|
  cancel?: boolean,
  redirectUrl?: string,
  requestHeaders?: webext$webRequest$HttpHeaders,
  responseHeaders?: webext$webRequest$HttpHeaders,
  authCredentials?: {|
    username: string,
    password: string
  |}
|};

declare type webext$webRequest$UploadData = {|
  bytes?: any,
  file?: string
|};

declare function webext$webRequest$handlerBehaviorChanged(callback?: () => void): Promise<void>;

declare type webext$webRequest$onBeforeRequest = {|
  addListener: (listener: (details: {|
  requestId: string,
  url: string,
  method: string,
  frameId: number,
  parentFrameId: number,
  requestBody?: {|
    error?: string,
    formData?: {},
    raw?: Array<webext$webRequest$UploadData>
  |},
  tabId: number,
  type: webext$webRequest$ResourceType,
  timeStamp: number
|}) => ?webext$webRequest$BlockingResponse, filter: webext$webRequest$RequestFilter, extraInfoSpec?: Array<webext$webRequest$OnBeforeRequestOptions>) => void,
  removeListener: (listener: Function, filter: webext$webRequest$RequestFilter, extraInfoSpec?: Array<webext$webRequest$OnBeforeRequestOptions>) => void
|};

declare type webext$webRequest$onBeforeSendHeaders = {|
  addListener: (listener: (details: {|
  requestId: string,
  url: string,
  method: string,
  frameId: number,
  parentFrameId: number,
  tabId: number,
  type: webext$webRequest$ResourceType,
  timeStamp: number,
  requestHeaders?: webext$webRequest$HttpHeaders
|}) => ?webext$webRequest$BlockingResponse, filter: webext$webRequest$RequestFilter, extraInfoSpec?: Array<webext$webRequest$OnBeforeSendHeadersOptions>) => void,
  removeListener: (listener: Function, filter: webext$webRequest$RequestFilter, extraInfoSpec?: Array<webext$webRequest$OnBeforeSendHeadersOptions>) => void
|};

declare type webext$webRequest$onSendHeaders = {|
  addListener: (listener: (details: {|
  requestId: string,
  url: string,
  method: string,
  frameId: number,
  parentFrameId: number,
  tabId: number,
  type: webext$webRequest$ResourceType,
  timeStamp: number,
  requestHeaders?: webext$webRequest$HttpHeaders
|}) => void, filter: webext$webRequest$RequestFilter, extraInfoSpec?: Array<webext$webRequest$OnSendHeadersOptions>) => void,
  removeListener: (listener: Function, filter: webext$webRequest$RequestFilter, extraInfoSpec?: Array<webext$webRequest$OnSendHeadersOptions>) => void
|};

declare type webext$webRequest$onHeadersReceived = {|
  addListener: (listener: (details: {|
  requestId: string,
  url: string,
  method: string,
  frameId: number,
  parentFrameId: number,
  tabId: number,
  type: webext$webRequest$ResourceType,
  timeStamp: number,
  statusLine: string,
  responseHeaders?: webext$webRequest$HttpHeaders,
  statusCode: number
|}) => ?webext$webRequest$BlockingResponse, filter: webext$webRequest$RequestFilter, extraInfoSpec?: Array<webext$webRequest$OnHeadersReceivedOptions>) => void,
  removeListener: (listener: Function, filter: webext$webRequest$RequestFilter, extraInfoSpec?: Array<webext$webRequest$OnHeadersReceivedOptions>) => void
|};

declare type webext$webRequest$onAuthRequired = {|
  addListener: (listener: (details: {|
  requestId: string,
  url: string,
  method: string,
  frameId: number,
  parentFrameId: number,
  tabId: number,
  type: webext$webRequest$ResourceType,
  timeStamp: number,
  scheme: string,
  realm?: string,
  challenger: {|
    host: string,
    port: number
  |},
  isProxy: boolean,
  responseHeaders?: webext$webRequest$HttpHeaders,
  statusLine: string,
  statusCode: number
|}, callback?: (response: webext$webRequest$BlockingResponse) => void) => ?webext$webRequest$BlockingResponse, filter: webext$webRequest$RequestFilter, extraInfoSpec?: Array<webext$webRequest$OnAuthRequiredOptions>) => void,
  removeListener: (listener: Function, filter: webext$webRequest$RequestFilter, extraInfoSpec?: Array<webext$webRequest$OnAuthRequiredOptions>) => void
|};

declare type webext$webRequest$onResponseStarted = {|
  addListener: (listener: (details: {|
  requestId: string,
  url: string,
  method: string,
  frameId: number,
  parentFrameId: number,
  tabId: number,
  type: webext$webRequest$ResourceType,
  timeStamp: number,
  ip?: string,
  fromCache: boolean,
  statusCode: number,
  responseHeaders?: webext$webRequest$HttpHeaders,
  statusLine: string
|}) => void, filter: webext$webRequest$RequestFilter, extraInfoSpec?: Array<webext$webRequest$OnResponseStartedOptions>) => void,
  removeListener: (listener: Function, filter: webext$webRequest$RequestFilter, extraInfoSpec?: Array<webext$webRequest$OnResponseStartedOptions>) => void
|};

declare type webext$webRequest$onBeforeRedirect = {|
  addListener: (listener: (details: {|
  requestId: string,
  url: string,
  method: string,
  frameId: number,
  parentFrameId: number,
  tabId: number,
  type: webext$webRequest$ResourceType,
  timeStamp: number,
  ip?: string,
  fromCache: boolean,
  statusCode: number,
  redirectUrl: string,
  responseHeaders?: webext$webRequest$HttpHeaders,
  statusLine: string
|}) => void, filter: webext$webRequest$RequestFilter, extraInfoSpec?: Array<webext$webRequest$OnBeforeRedirectOptions>) => void,
  removeListener: (listener: Function, filter: webext$webRequest$RequestFilter, extraInfoSpec?: Array<webext$webRequest$OnBeforeRedirectOptions>) => void
|};

declare type webext$webRequest$onCompleted = {|
  addListener: (listener: (details: {|
  requestId: string,
  url: string,
  method: string,
  frameId: number,
  parentFrameId: number,
  tabId: number,
  type: webext$webRequest$ResourceType,
  timeStamp: number,
  ip?: string,
  fromCache: boolean,
  statusCode: number,
  responseHeaders?: webext$webRequest$HttpHeaders,
  statusLine: string
|}) => void, filter: webext$webRequest$RequestFilter, extraInfoSpec?: Array<webext$webRequest$OnCompletedOptions>) => void,
  removeListener: (listener: Function, filter: webext$webRequest$RequestFilter, extraInfoSpec?: Array<webext$webRequest$OnCompletedOptions>) => void
|};

declare type webext$webRequest$onErrorOccurred = {|
  addListener: (listener: (details: {|
  requestId: string,
  url: string,
  method: string,
  frameId: number,
  parentFrameId: number,
  tabId: number,
  type: webext$webRequest$ResourceType,
  timeStamp: number,
  ip?: string,
  fromCache: boolean,
  error: string
|}) => void, filter: webext$webRequest$RequestFilter) => void,
  removeListener: (listener: Function, filter: webext$webRequest$RequestFilter) => void
|};

declare type webext$webRequest$webRequest = {|
  onBeforeRequest: webext$webRequest$onBeforeRequest,
  onBeforeSendHeaders: webext$webRequest$onBeforeSendHeaders,
  onSendHeaders: webext$webRequest$onSendHeaders,
  onHeadersReceived: webext$webRequest$onHeadersReceived,
  onAuthRequired: webext$webRequest$onAuthRequired,
  onResponseStarted: webext$webRequest$onResponseStarted,
  onBeforeRedirect: webext$webRequest$onBeforeRedirect,
  onCompleted: webext$webRequest$onCompleted,
  onErrorOccurred: webext$webRequest$onErrorOccurred,
  handlerBehaviorChanged: typeof webext$webRequest$handlerBehaviorChanged
|};

declare type webext$bookmarks$BookmarkTreeNodeUnmodifiable = string;

declare type webext$bookmarks$BookmarkTreeNode = {|
  id: string,
  parentId?: string,
  index?: number,
  url?: string,
  title: string,
  dateAdded?: number,
  dateGroupModified?: number,
  unmodifiable?: webext$bookmarks$BookmarkTreeNodeUnmodifiable,
  children?: Array<webext$bookmarks$BookmarkTreeNode>
|};

declare type webext$bookmarks$CreateDetails = {|
  parentId?: string,
  index?: number,
  title?: string,
  url?: string
|};

declare function webext$bookmarks$get(idOrIdList: any, callback?: (results: Array<webext$bookmarks$BookmarkTreeNode>) => void): Promise<Array<webext$bookmarks$BookmarkTreeNode>>;

declare function webext$bookmarks$getChildren(id: string, callback?: (results: Array<webext$bookmarks$BookmarkTreeNode>) => void): Promise<Array<webext$bookmarks$BookmarkTreeNode>>;

declare function webext$bookmarks$getRecent(numberOfItems: number, callback?: (results: Array<webext$bookmarks$BookmarkTreeNode>) => void): Promise<Array<webext$bookmarks$BookmarkTreeNode>>;

declare function webext$bookmarks$getTree(callback?: (results: Array<webext$bookmarks$BookmarkTreeNode>) => void): Promise<Array<webext$bookmarks$BookmarkTreeNode>>;

declare function webext$bookmarks$getSubTree(id: string, callback?: (results: Array<webext$bookmarks$BookmarkTreeNode>) => void): Promise<Array<webext$bookmarks$BookmarkTreeNode>>;

declare function webext$bookmarks$search(query: any, callback?: (results: Array<webext$bookmarks$BookmarkTreeNode>) => void): Promise<Array<webext$bookmarks$BookmarkTreeNode>>;

declare function webext$bookmarks$create(bookmark: webext$bookmarks$CreateDetails, callback?: (result: webext$bookmarks$BookmarkTreeNode) => void): Promise<webext$bookmarks$BookmarkTreeNode>;

declare function webext$bookmarks$move(id: string, destination: {|
  parentId?: string,
  index?: number
|}, callback?: (result: webext$bookmarks$BookmarkTreeNode) => void): Promise<webext$bookmarks$BookmarkTreeNode>;

declare function webext$bookmarks$update(id: string, changes: {|
  title?: string,
  url?: string
|}, callback?: (result: webext$bookmarks$BookmarkTreeNode) => void): Promise<webext$bookmarks$BookmarkTreeNode>;

declare function webext$bookmarks$remove(id: string, callback?: () => void): Promise<void>;

declare function webext$bookmarks$removeTree(id: string, callback?: () => void): Promise<void>;

declare function webext$bookmarks$import(callback?: () => void): Promise<void>;

declare function webext$bookmarks$export(callback?: () => void): Promise<void>;

declare type webext$bookmarks$onCreated = {|
  addListener: (listener: (id: string, bookmark: webext$bookmarks$BookmarkTreeNode) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$bookmarks$onRemoved = {|
  addListener: (listener: (id: string, removeInfo: {|
  parentId: string,
  index: number,
  node: webext$bookmarks$BookmarkTreeNode
|}) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$bookmarks$onChanged = {|
  addListener: (listener: (id: string, changeInfo: {|
  title: string,
  url?: string
|}) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$bookmarks$onMoved = {|
  addListener: (listener: (id: string, moveInfo: {|
  parentId: string,
  index: number,
  oldParentId: string,
  oldIndex: number
|}) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$bookmarks$onChildrenReordered = {|
  addListener: (listener: (id: string, reorderInfo: {|
  childIds: Array<string>
|}) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$bookmarks$onImportBegan = {|
  addListener: (listener: () => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$bookmarks$onImportEnded = {|
  addListener: (listener: () => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$bookmarks$bookmarks = {|
  onCreated: webext$bookmarks$onCreated,
  onRemoved: webext$bookmarks$onRemoved,
  onChanged: webext$bookmarks$onChanged,
  onMoved: webext$bookmarks$onMoved,
  onChildrenReordered: webext$bookmarks$onChildrenReordered,
  onImportBegan: webext$bookmarks$onImportBegan,
  onImportEnded: webext$bookmarks$onImportEnded,
  get: typeof webext$bookmarks$get,
  getChildren: typeof webext$bookmarks$getChildren,
  getRecent: typeof webext$bookmarks$getRecent,
  getTree: typeof webext$bookmarks$getTree,
  getSubTree: typeof webext$bookmarks$getSubTree,
  search: typeof webext$bookmarks$search,
  create: typeof webext$bookmarks$create,
  move: typeof webext$bookmarks$move,
  update: typeof webext$bookmarks$update,
  remove: typeof webext$bookmarks$remove,
  removeTree: typeof webext$bookmarks$removeTree,
  import: typeof webext$bookmarks$import,
  export: typeof webext$bookmarks$export
|};

declare type webext$browserAction$ColorArray = Array<number>;

declare type webext$pageAction$ImageDataType = any;

declare function webext$browserAction$setTitle(details: {|
  title: string,
  tabId?: number
|}, callback?: () => void): Promise<void>;

declare function webext$browserAction$getTitle(details: {|
  tabId?: number
|}, callback?: (result: string) => void): Promise<string>;

declare function webext$browserAction$setIcon(details: {|
  imageData?: any,
  path?: any,
  tabId?: number
|}, callback?: () => void): Promise<void>;

declare function webext$browserAction$setPopup(details: {|
  tabId?: number,
  popup: string
|}, callback?: () => void): Promise<void>;

declare function webext$browserAction$getPopup(details: {|
  tabId?: number
|}, callback?: (result: string) => void): Promise<string>;

declare function webext$browserAction$setBadgeText(details: {|
  text: string,
  tabId?: number
|}, callback?: () => void): Promise<void>;

declare function webext$browserAction$getBadgeText(details: {|
  tabId?: number
|}, callback?: (result: string) => void): Promise<string>;

declare function webext$browserAction$setBadgeBackgroundColor(details: {|
  color: any,
  tabId?: number
|}, callback?: () => void): Promise<void>;

declare function webext$browserAction$getBadgeBackgroundColor(details: {|
  tabId?: number
|}, callback?: (result: webext$browserAction$ColorArray) => void): Promise<webext$browserAction$ColorArray>;

declare function webext$browserAction$enable(tabId?: number, callback?: () => void): Promise<void>;

declare function webext$browserAction$disable(tabId?: number, callback?: () => void): Promise<void>;

declare function webext$browserAction$openPopup(callback?: (popupView?: any) => void): Promise<any>;

declare type webext$tabs$Tab = {|
  id?: number,
  index: number,
  windowId: number,
  highlighted: boolean,
  active: boolean,
  pinned: boolean,
  audible?: boolean,
  mutedInfo?: webext$tabs$MutedInfo,
  url?: string,
  title?: string,
  favIconUrl?: string,
  status?: string,
  incognito: boolean,
  width?: number,
  height?: number,
  cookieStoreId: string
|};

declare type webext$browserAction$onClicked = {|
  addListener: (listener: (tab: webext$tabs$Tab) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$browserAction$browserAction = {|
  onClicked: webext$browserAction$onClicked,
  setTitle: typeof webext$browserAction$setTitle,
  getTitle: typeof webext$browserAction$getTitle,
  setIcon: typeof webext$browserAction$setIcon,
  setPopup: typeof webext$browserAction$setPopup,
  getPopup: typeof webext$browserAction$getPopup,
  setBadgeText: typeof webext$browserAction$setBadgeText,
  getBadgeText: typeof webext$browserAction$getBadgeText,
  setBadgeBackgroundColor: typeof webext$browserAction$setBadgeBackgroundColor,
  getBadgeBackgroundColor: typeof webext$browserAction$getBadgeBackgroundColor,
  enable: typeof webext$browserAction$enable,
  disable: typeof webext$browserAction$disable,
  openPopup: typeof webext$browserAction$openPopup
|};

declare type webext$commands$Command = {|
  name?: string,
  description?: string,
  shortcut?: string
|};

declare function webext$commands$getAll(callback?: (commands: Array<webext$commands$Command>) => void): Promise<Array<webext$commands$Command>>;

declare type webext$commands$onCommand = {|
  addListener: (listener: (command: string) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$commands$commands = {|
  onCommand: webext$commands$onCommand,
  getAll: typeof webext$commands$getAll
|};

declare type webext$contextMenus$ContextType = string;

declare type webext$contextMenus$ItemType = string;

declare type webext$contextMenusInternal$OnClickData = {|
  menuItemId: any,
  parentMenuItemId?: any,
  mediaType?: string,
  linkUrl?: string,
  srcUrl?: string,
  pageUrl?: string,
  frameUrl?: string,
  selectionText?: string,
  editable: boolean,
  wasChecked?: boolean,
  checked?: boolean
|};

declare function webext$contextMenus$create(createProperties: {|
  type?: webext$contextMenus$ItemType,
  id?: string,
  title?: string,
  checked?: boolean,
  contexts?: Array<webext$contextMenus$ContextType>,
  onclick?: (info: webext$contextMenusInternal$OnClickData, tab: webext$tabs$Tab) => void,
  parentId?: any,
  documentUrlPatterns?: Array<string>,
  targetUrlPatterns?: Array<string>,
  enabled?: boolean
|}, callback?: () => void): any;

declare function webext$contextMenus$createInternal(createProperties: {|
  type?: webext$contextMenus$ItemType,
  id: any,
  title?: string,
  checked?: boolean,
  contexts?: Array<webext$contextMenus$ContextType>,
  parentId?: any,
  documentUrlPatterns?: Array<string>,
  targetUrlPatterns?: Array<string>,
  enabled?: boolean
|}, callback?: () => void): Promise<void>;

declare function webext$contextMenus$update(id: any, updateProperties: {|
  type?: webext$contextMenus$ItemType,
  title?: string,
  checked?: boolean,
  contexts?: Array<webext$contextMenus$ContextType>,
  onclick?: (info: webext$contextMenusInternal$OnClickData, tab: webext$tabs$Tab) => void,
  parentId?: any,
  documentUrlPatterns?: Array<string>,
  targetUrlPatterns?: Array<string>,
  enabled?: boolean
|}, callback?: () => void): Promise<void>;

declare function webext$contextMenus$remove(menuItemId: any, callback?: () => void): Promise<void>;

declare function webext$contextMenus$removeAll(callback?: () => void): Promise<void>;

declare type webext$contextMenus$onClicked = {|
  addListener: (listener: (info: webext$contextMenusInternal$OnClickData, tab?: webext$tabs$Tab) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$contextMenus$contextMenus = {|
  onClicked: webext$contextMenus$onClicked,
  create: typeof webext$contextMenus$create,
  createInternal: typeof webext$contextMenus$createInternal,
  update: typeof webext$contextMenus$update,
  remove: typeof webext$contextMenus$remove,
  removeAll: typeof webext$contextMenus$removeAll
|};

declare type webext$contextMenusInternal$contextMenusInternal = {};

declare type webext$history$HistoryItem = {|
  id: string,
  url?: string,
  title?: string,
  lastVisitTime?: number,
  visitCount?: number,
  typedCount?: number
|};

declare type webext$history$VisitItem = {|
  id: string,
  visitId: string,
  visitTime?: number,
  referringVisitId: string,
  transition: webext$history$TransitionType
|};

declare function webext$history$search(query: {|
  text: string,
  startTime?: webext$extensionTypes$Date,
  endTime?: webext$extensionTypes$Date,
  maxResults?: number
|}, callback?: (results: Array<webext$history$HistoryItem>) => void): Promise<Array<webext$history$HistoryItem>>;

declare function webext$history$getVisits(details: {|
  url: string
|}, callback?: (results: Array<webext$history$VisitItem>) => void): Promise<Array<webext$history$VisitItem>>;

declare function webext$history$addUrl(details: {|
  url: string,
  title?: string,
  transition?: webext$history$TransitionType,
  visitTime?: webext$extensionTypes$Date
|}, callback?: () => void): Promise<void>;

declare function webext$history$deleteUrl(details: {|
  url: string
|}, callback?: () => void): Promise<void>;

declare function webext$history$deleteRange(range: {|
  startTime: webext$extensionTypes$Date,
  endTime: webext$extensionTypes$Date
|}, callback?: () => void): Promise<void>;

declare function webext$history$deleteAll(callback?: () => void): Promise<void>;

declare type webext$history$onVisited = {|
  addListener: (listener: (result: webext$history$HistoryItem) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$history$onVisitRemoved = {|
  addListener: (listener: (removed: {|
  allHistory: boolean,
  urls: Array<string>
|}) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$history$history = {|
  onVisited: webext$history$onVisited,
  onVisitRemoved: webext$history$onVisitRemoved,
  search: typeof webext$history$search,
  getVisits: typeof webext$history$getVisits,
  addUrl: typeof webext$history$addUrl,
  deleteUrl: typeof webext$history$deleteUrl,
  deleteRange: typeof webext$history$deleteRange,
  deleteAll: typeof webext$history$deleteAll
|};

declare function webext$pageAction$show(tabId: number, callback?: () => void): Promise<void>;

declare function webext$pageAction$hide(tabId: number, callback?: () => void): Promise<void>;

declare function webext$pageAction$setTitle(details: {|
  tabId: number,
  title: string
|}): void;

declare function webext$pageAction$getTitle(details: {|
  tabId: number
|}, callback?: (result: string) => void): Promise<string>;

declare function webext$pageAction$setIcon(details: {|
  tabId: number,
  imageData?: any,
  path?: any
|}, callback?: () => void): Promise<void>;

declare function webext$pageAction$setPopup(details: {|
  tabId: number,
  popup: string
|}): void;

declare function webext$pageAction$getPopup(details: {|
  tabId: number
|}, callback?: (result: string) => void): Promise<string>;

declare type webext$pageAction$onClicked = {|
  addListener: (listener: (tab: webext$tabs$Tab) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$pageAction$pageAction = {|
  onClicked: webext$pageAction$onClicked,
  show: typeof webext$pageAction$show,
  hide: typeof webext$pageAction$hide,
  setTitle: typeof webext$pageAction$setTitle,
  getTitle: typeof webext$pageAction$getTitle,
  setIcon: typeof webext$pageAction$setIcon,
  setPopup: typeof webext$pageAction$setPopup,
  getPopup: typeof webext$pageAction$getPopup
|};

declare type webext$tabs$MutedInfoReason = string;

declare type webext$tabs$MutedInfo = {|
  muted: boolean,
  reason?: webext$tabs$MutedInfoReason,
  extensionId?: string
|};

declare type webext$tabs$ZoomSettingsMode = string;

declare type webext$tabs$ZoomSettingsScope = string;

declare type webext$tabs$ZoomSettings = {|
  mode?: webext$tabs$ZoomSettingsMode,
  scope?: webext$tabs$ZoomSettingsScope,
  defaultZoomFactor?: number
|};

declare type webext$tabs$TabStatus = string;

declare type webext$windows$WindowType = string;

declare function webext$tabs$get(tabId: number, callback?: (tab: webext$tabs$Tab) => void): Promise<webext$tabs$Tab>;

declare function webext$tabs$getCurrent(callback?: (tab?: webext$tabs$Tab) => void): Promise<webext$tabs$Tab>;

declare function webext$tabs$connect(tabId: number, connectInfo?: {|
  name?: string,
  frameId?: number
|}): webext$runtime$Port;

declare function webext$tabs$sendRequest(tabId: number, request: any, responseCallback?: (response: any) => void): void;

declare function webext$tabs$sendMessage(tabId: number, message: any, options?: {|
  frameId?: number
|}, responseCallback?: (response: any) => void): Promise<any>;

declare function webext$tabs$getSelected(callback?: (tab: webext$tabs$Tab) => void): Promise<webext$tabs$Tab>;
declare function webext$tabs$getSelected(windowId: number, callback?: (tab: webext$tabs$Tab) => void): Promise<webext$tabs$Tab>;

declare function webext$tabs$getAllInWindow(callback?: (tabs: Array<webext$tabs$Tab>) => void): Promise<Array<webext$tabs$Tab>>;
declare function webext$tabs$getAllInWindow(windowId: number, callback?: (tabs: Array<webext$tabs$Tab>) => void): Promise<Array<webext$tabs$Tab>>;

declare function webext$tabs$create(createProperties: {|
  windowId?: number,
  index?: number,
  url?: string,
  active?: boolean,
  pinned?: boolean,
  cookieStoreId?: string
|}, callback?: (tab: webext$tabs$Tab) => void): Promise<webext$tabs$Tab>;

declare function webext$tabs$duplicate(tabId: number, callback?: (tab?: webext$tabs$Tab) => void): Promise<webext$tabs$Tab>;

declare function webext$tabs$query(queryInfo: {|
  active?: boolean,
  pinned?: boolean,
  audible?: boolean,
  muted?: boolean,
  highlighted?: boolean,
  currentWindow?: boolean,
  lastFocusedWindow?: boolean,
  status?: webext$tabs$TabStatus,
  title?: string,
  url?: any,
  windowId?: number,
  windowType?: webext$windows$WindowType,
  index?: number,
  cookieStoreId?: string
|}, callback?: (result: Array<webext$tabs$Tab>) => void): Promise<Array<webext$tabs$Tab>>;

declare function webext$tabs$highlight(highlightInfo: {|
  windowId?: number,
  tabs: any
|}, callback?: (window: webext$windows$Window) => void): Promise<webext$windows$Window>;

declare function webext$tabs$update(updateProperties: {|
  url?: string,
  active?: boolean,
  pinned?: boolean,
  muted?: boolean
|}, callback?: (tab?: webext$tabs$Tab) => void): Promise<webext$tabs$Tab>;
declare function webext$tabs$update(tabId: number, updateProperties: {|
  url?: string,
  active?: boolean,
  pinned?: boolean,
  muted?: boolean
|}, callback?: (tab?: webext$tabs$Tab) => void): Promise<webext$tabs$Tab>;

declare function webext$tabs$move(tabIds: any, moveProperties: {|
  windowId?: number,
  index: number
|}, callback?: (tabs: any) => void): Promise<any>;

declare function webext$tabs$reload(tabId?: number, reloadProperties?: {|
  bypassCache?: boolean
|}, callback?: () => void): Promise<void>;

declare function webext$tabs$remove(tabIds: any, callback?: () => void): Promise<void>;

declare function webext$tabs$detectLanguage(callback?: (language: string) => void): Promise<string>;
declare function webext$tabs$detectLanguage(tabId: number, callback?: (language: string) => void): Promise<string>;

declare function webext$tabs$captureVisibleTab(windowId?: number, options?: webext$extensionTypes$ImageDetails, callback?: (dataUrl: string) => void): Promise<string>;

declare function webext$tabs$executeScript(details: webext$extensionTypes$InjectDetails, callback?: (result?: Array<any>) => void): Promise<Array<any>>;
declare function webext$tabs$executeScript(tabId: number, details: webext$extensionTypes$InjectDetails, callback?: (result?: Array<any>) => void): Promise<Array<any>>;

declare function webext$tabs$insertCSS(details: webext$extensionTypes$InjectDetails, callback?: () => void): Promise<void>;
declare function webext$tabs$insertCSS(tabId: number, details: webext$extensionTypes$InjectDetails, callback?: () => void): Promise<void>;

declare function webext$tabs$removeCSS(details: webext$extensionTypes$InjectDetails, callback?: () => void): Promise<void>;
declare function webext$tabs$removeCSS(tabId: number, details: webext$extensionTypes$InjectDetails, callback?: () => void): Promise<void>;

declare function webext$tabs$setZoom(zoomFactor: number, callback?: () => void): Promise<void>;
declare function webext$tabs$setZoom(tabId: number, zoomFactor: number, callback?: () => void): Promise<void>;

declare function webext$tabs$getZoom(callback?: (zoomFactor: number) => void): Promise<number>;
declare function webext$tabs$getZoom(tabId: number, callback?: (zoomFactor: number) => void): Promise<number>;

declare function webext$tabs$setZoomSettings(zoomSettings: webext$tabs$ZoomSettings, callback?: () => void): Promise<void>;
declare function webext$tabs$setZoomSettings(tabId: number, zoomSettings: webext$tabs$ZoomSettings, callback?: () => void): Promise<void>;

declare function webext$tabs$getZoomSettings(callback?: (zoomSettings: webext$tabs$ZoomSettings) => void): Promise<webext$tabs$ZoomSettings>;
declare function webext$tabs$getZoomSettings(tabId: number, callback?: (zoomSettings: webext$tabs$ZoomSettings) => void): Promise<webext$tabs$ZoomSettings>;

declare type webext$tabs$onCreated = {|
  addListener: (listener: (tab: webext$tabs$Tab) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$tabs$onUpdated = {|
  addListener: (listener: (tabId: number, changeInfo: {|
  status?: string,
  url?: string,
  pinned?: boolean,
  audible?: boolean,
  mutedInfo?: webext$tabs$MutedInfo,
  favIconUrl?: string
|}, tab: webext$tabs$Tab) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$tabs$onMoved = {|
  addListener: (listener: (tabId: number, moveInfo: {|
  windowId: number,
  fromIndex: number,
  toIndex: number
|}) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$tabs$onSelectionChanged = {|
  addListener: (listener: (tabId: number, selectInfo: {|
  windowId: number
|}) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$tabs$onActiveChanged = {|
  addListener: (listener: (tabId: number, selectInfo: {|
  windowId: number
|}) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$tabs$onActivated = {|
  addListener: (listener: (activeInfo: {|
  tabId: number,
  windowId: number
|}) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$tabs$onHighlightChanged = {|
  addListener: (listener: (selectInfo: {|
  windowId: number,
  tabIds: Array<number>
|}) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$tabs$onHighlighted = {|
  addListener: (listener: (highlightInfo: {|
  windowId: number,
  tabIds: Array<number>
|}) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$tabs$onDetached = {|
  addListener: (listener: (tabId: number, detachInfo: {|
  oldWindowId: number,
  oldPosition: number
|}) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$tabs$onAttached = {|
  addListener: (listener: (tabId: number, attachInfo: {|
  newWindowId: number,
  newPosition: number
|}) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$tabs$onRemoved = {|
  addListener: (listener: (tabId: number, removeInfo: {|
  windowId: number,
  isWindowClosing: boolean
|}) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$tabs$onReplaced = {|
  addListener: (listener: (addedTabId: number, removedTabId: number) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$tabs$onZoomChange = {|
  addListener: (listener: (ZoomChangeInfo: {|
  tabId: number,
  oldZoomFactor: number,
  newZoomFactor: number,
  zoomSettings: webext$tabs$ZoomSettings
|}) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$tabs$tabs = {|
  onCreated: webext$tabs$onCreated,
  onUpdated: webext$tabs$onUpdated,
  onMoved: webext$tabs$onMoved,
  onSelectionChanged: webext$tabs$onSelectionChanged,
  onActiveChanged: webext$tabs$onActiveChanged,
  onActivated: webext$tabs$onActivated,
  onHighlightChanged: webext$tabs$onHighlightChanged,
  onHighlighted: webext$tabs$onHighlighted,
  onDetached: webext$tabs$onDetached,
  onAttached: webext$tabs$onAttached,
  onRemoved: webext$tabs$onRemoved,
  onReplaced: webext$tabs$onReplaced,
  onZoomChange: webext$tabs$onZoomChange,
  get: typeof webext$tabs$get,
  getCurrent: typeof webext$tabs$getCurrent,
  connect: typeof webext$tabs$connect,
  sendRequest: typeof webext$tabs$sendRequest,
  sendMessage: typeof webext$tabs$sendMessage,
  getSelected: typeof webext$tabs$getSelected,
  getAllInWindow: typeof webext$tabs$getAllInWindow,
  create: typeof webext$tabs$create,
  duplicate: typeof webext$tabs$duplicate,
  query: typeof webext$tabs$query,
  highlight: typeof webext$tabs$highlight,
  update: typeof webext$tabs$update,
  move: typeof webext$tabs$move,
  reload: typeof webext$tabs$reload,
  remove: typeof webext$tabs$remove,
  detectLanguage: typeof webext$tabs$detectLanguage,
  captureVisibleTab: typeof webext$tabs$captureVisibleTab,
  executeScript: typeof webext$tabs$executeScript,
  insertCSS: typeof webext$tabs$insertCSS,
  removeCSS: typeof webext$tabs$removeCSS,
  setZoom: typeof webext$tabs$setZoom,
  getZoom: typeof webext$tabs$getZoom,
  setZoomSettings: typeof webext$tabs$setZoomSettings,
  getZoomSettings: typeof webext$tabs$getZoomSettings
|};

declare type webext$windows$WindowState = string;

declare type webext$windows$Window = {|
  id?: number,
  focused: boolean,
  top?: number,
  left?: number,
  width?: number,
  height?: number,
  tabs?: Array<webext$tabs$Tab>,
  incognito: boolean,
  type?: webext$windows$WindowType,
  state?: webext$windows$WindowState,
  alwaysOnTop: boolean
|};

declare type webext$windows$CreateType = string;

declare function webext$windows$get(windowId: number, getInfo?: {|
  populate?: boolean,
  windowTypes?: Array<webext$windows$WindowType>
|}, callback?: (window: webext$windows$Window) => void): Promise<webext$windows$Window>;

declare function webext$windows$getCurrent(callback?: (window: webext$windows$Window) => void): Promise<webext$windows$Window>;
declare function webext$windows$getCurrent(getInfo: {|
  populate?: boolean,
  windowTypes?: Array<webext$windows$WindowType>
|}, callback?: (window: webext$windows$Window) => void): Promise<webext$windows$Window>;

declare function webext$windows$getLastFocused(callback?: (window: webext$windows$Window) => void): Promise<webext$windows$Window>;
declare function webext$windows$getLastFocused(getInfo: {|
  populate?: boolean,
  windowTypes?: Array<webext$windows$WindowType>
|}, callback?: (window: webext$windows$Window) => void): Promise<webext$windows$Window>;

declare function webext$windows$getAll(callback?: (windows: Array<webext$windows$Window>) => void): Promise<Array<webext$windows$Window>>;
declare function webext$windows$getAll(getInfo: {|
  populate?: boolean,
  windowTypes?: Array<webext$windows$WindowType>
|}, callback?: (windows: Array<webext$windows$Window>) => void): Promise<Array<webext$windows$Window>>;

declare function webext$windows$create(createData?: {|
  url?: any,
  tabId?: number,
  left?: number,
  top?: number,
  width?: number,
  height?: number,
  incognito?: boolean,
  type?: webext$windows$CreateType,
  state?: webext$windows$WindowState,
  allowScriptsToClose?: boolean
|}, callback?: (window?: webext$windows$Window) => void): Promise<webext$windows$Window>;

declare function webext$windows$update(windowId: number, updateInfo: {|
  left?: number,
  top?: number,
  width?: number,
  height?: number,
  focused?: boolean,
  drawAttention?: boolean,
  state?: webext$windows$WindowState
|}, callback?: (window: webext$windows$Window) => void): Promise<webext$windows$Window>;

declare function webext$windows$remove(windowId: number, callback?: () => void): Promise<void>;

declare type webext$windows$onCreated = {|
  addListener: (listener: (window: webext$windows$Window) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$windows$onRemoved = {|
  addListener: (listener: (windowId: number) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$windows$onFocusChanged = {|
  addListener: (listener: (windowId: number) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$windows$windows = {|
  onCreated: webext$windows$onCreated,
  onRemoved: webext$windows$onRemoved,
  onFocusChanged: webext$windows$onFocusChanged,
  get: typeof webext$windows$get,
  getCurrent: typeof webext$windows$getCurrent,
  getLastFocused: typeof webext$windows$getLastFocused,
  getAll: typeof webext$windows$getAll,
  create: typeof webext$windows$create,
  update: typeof webext$windows$update,
  remove: typeof webext$windows$remove
|};

declare function webext$test$notifyFail(message: string): void;

declare function webext$test$notifyPass(message?: string): void;

declare function webext$test$log(message: string): void;

declare function webext$test$sendMessage(arg1?: any, arg2?: any): void;

declare function webext$test$fail(message?: any): void;

declare function webext$test$succeed(message?: any): void;

declare function webext$test$assertTrue(test?: any, message?: string): void;

declare function webext$test$assertFalse(test?: any, message?: string): void;

declare function webext$test$assertBool(test: any, expected: boolean, message?: string): void;

declare function webext$test$checkDeepEq(expected: any, actual: any): void;

declare function webext$test$assertEq(expected?: any, actual?: any, message?: string): void;

declare function webext$test$assertNoLastError(): void;

declare function webext$test$assertLastError(expectedError: string): void;

declare function webext$test$assertThrows(fn: Function, self?: any, args?: Array<any>, message?: any): void;

declare type webext$test$onMessage = {|
  addListener: (listener: (message: string, argument: any) => void) => void,
  removeListener: (listener: Function) => void
|};

declare type webext$test$test = {|
  onMessage: webext$test$onMessage,
  notifyFail: typeof webext$test$notifyFail,
  notifyPass: typeof webext$test$notifyPass,
  log: typeof webext$test$log,
  sendMessage: typeof webext$test$sendMessage,
  fail: typeof webext$test$fail,
  succeed: typeof webext$test$succeed,
  assertTrue: typeof webext$test$assertTrue,
  assertFalse: typeof webext$test$assertFalse,
  assertBool: typeof webext$test$assertBool,
  checkDeepEq: typeof webext$test$checkDeepEq,
  assertEq: typeof webext$test$assertEq,
  assertNoLastError: typeof webext$test$assertNoLastError,
  assertLastError: typeof webext$test$assertLastError,
  assertThrows: typeof webext$test$assertThrows
|};

declare var chrome: {
  alarms: webext$alarms$alarms,
  cookies: webext$cookies$cookies,
  downloads: webext$downloads$downloads,
  extension: webext$extension$extension,
  i18n: webext$i18n$i18n,
  idle: webext$idle$idle,
  management: webext$management$management,
  notifications: webext$notifications$notifications,
  runtime: webext$runtime$runtime,
  storage: webext$storage$storage,
  test: webext$test$test,
  topSites: webext$topSites$topSites,
  webNavigation: webext$webNavigation$webNavigation,
  webRequest: webext$webRequest$webRequest,
  bookmarks: webext$bookmarks$bookmarks,
  browserAction: webext$browserAction$browserAction,
  commands: webext$commands$commands,
  contextMenus: webext$contextMenus$contextMenus,
  contextMenusInternal: webext$contextMenusInternal$contextMenusInternal,
  history: webext$history$history,
  pageAction: webext$pageAction$pageAction,
  tabs: webext$tabs$tabs,
  windows: webext$windows$windows,
};

declare var browser: {
  alarms: webext$alarms$alarms,
  cookies: webext$cookies$cookies,
  downloads: webext$downloads$downloads,
  extension: webext$extension$extension,
  i18n: webext$i18n$i18n,
  idle: webext$idle$idle,
  management: webext$management$management,
  notifications: webext$notifications$notifications,
  runtime: webext$runtime$runtime,
  storage: webext$storage$storage,
  test: webext$test$test,
  topSites: webext$topSites$topSites,
  webNavigation: webext$webNavigation$webNavigation,
  webRequest: webext$webRequest$webRequest,
  bookmarks: webext$bookmarks$bookmarks,
  browserAction: webext$browserAction$browserAction,
  commands: webext$commands$commands,
  contextMenus: webext$contextMenus$contextMenus,
  contextMenusInternal: webext$contextMenusInternal$contextMenusInternal,
  history: webext$history$history,
  pageAction: webext$pageAction$pageAction,
  tabs: webext$tabs$tabs,
  windows: webext$windows$windows,
};
