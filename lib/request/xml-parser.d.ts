import { BaseParser } from "./base-parser";
type XMLParserMessage = "DONE" | "ERROR";
export type XMLParserResponse = {
    message: XMLParserMessage | null;
};
export type XMLParserCallback = (response: XMLParserResponse) => void;
export declare class XMLParser extends BaseParser {
    callback: XMLParserCallback | null;
    parseXML(responseXMLText: string): void;
    protected onError(saxError: any): void;
    protected onEnd(): void;
}
export {};