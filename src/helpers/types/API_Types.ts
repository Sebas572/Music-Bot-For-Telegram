/**
 * This entire file is responsible for creating
 * a data structure to read the entire API.
 * */

interface Thumbnail2 {
    url: string;
    width: number;
    height: number;
}

interface Thumbnail {
    thumbnails: Thumbnail2[];
}

interface WebCommandMetadata {
    url: string;
    webPageType: string;
    rootVe: number;
    apiUrl: string;
}

interface CommandMetadata {
    webCommandMetadata: WebCommandMetadata;
}

interface BrowseEndpoint {
    browseId: string;
    canonicalBaseUrl: string;
}

interface NavigationEndpoint {
    clickTrackingParams: string;
    commandMetadata: CommandMetadata;
    browseEndpoint: BrowseEndpoint;
}

interface Run {
    text: string;
    navigationEndpoint: NavigationEndpoint;
}

interface ShortBylineText {
    runs: Run[];
}

interface AccessibilityData {
    label: string;
}

interface Accessibility {
    accessibilityData: AccessibilityData;
}

interface Length {
    accessibility: Accessibility;
    simpleText: string;
}

interface Item {
    id: string;
    type: string;
    thumbnail: Thumbnail;
    title: string;
    channelTitle: string;
    shortBylineText: ShortBylineText;
    length: Length;
    isLive: boolean;
}

interface ConfigInfo {
    appInstallData: string;
}

interface Client {
    hl: string;
    gl: string;
    remoteHost: string;
    deviceMake: string;
    deviceModel: string;
    visitorData: string;
    userAgent: string;
    clientName: string;
    clientVersion: string;
    osName: string;
    osVersion: string;
    originalUrl: string;
    platform: string;
    clientFormFactor: string;
    configInfo: ConfigInfo;
    acceptHeader: string;
    deviceExperimentId: string;
}

interface User {
    lockedSafetyMode: boolean;
}

interface Request {
    useSsl: boolean;
}

interface ClickTracking {
    clickTrackingParams: string;
}

interface Context {
    client: Client;
    user: User;
    request: Request;
    clickTracking: ClickTracking;
}

interface NextPageContext {
    context: Context;
    continuation: string;
}

interface NextPage {
    nextPageToken: string;
    nextPageContext: NextPageContext;
}

type Data = {
    items: Item[];
    nextPage: NextPage;
    error: boolean;
}

export { Data }