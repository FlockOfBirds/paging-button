export type PageStyleType = "custom" | "default";

export type ButtonType = "firstButton" | "lastButton" | "nextButton" | "previousButton" | "buttonCaption" | "text" | "pageNumberButtons";

export type IconType = "default" | "none";

export interface ItemType {
    buttonCaption: string;
    item: ButtonType;
    maxPageButtons: number;
    showIcon: IconType;
    text: string;
}

export interface ModelerProps {
    caption: string;
    hideUnusedPaging: boolean;
    items: ItemType[];
    maxPageButtons: number;
    pagingStyle: PageStyleType;
}

export interface WrapperProps extends ModelerProps {
    "class"?: string;
    friendlyId: string;
    mxform: mxui.lib.form._FormBase;
    style: string;
}

export interface ListView extends mxui.widget._WidgetBase {
    _datasource: {
        setOffset: (offSet: number) => void;
        _setSize: number;
        _pageSize: number;
    };
    _showLoadingIcon: () => void;
    _sourceReload: () => void;
    _renderData: () => void;
    sequence: (sequence: string[]) => void;
}

export const parseStyle = (style = ""): { [key: string]: string } => {
    try {
        return style.split(";").reduce<{ [key: string]: string }>((styleObject, line) => {
            const pair = line.split(":");
            if (pair.length === 2) {
                const name = pair[0].trim().replace(/(-.)/g, match => match[1].toUpperCase());
                styleObject[name] = pair[1].trim();
            }
            return styleObject;
        }, {});
    } catch (error) {
        // tslint:disable-next-line no-console
        window.console.log("Failed to parse style", style, error);
    }

    return {};
};

export const findTargetNode = (queryNode: HTMLElement): HTMLElement | null => {
    let targetNode: HTMLElement | null = null;

    while (!targetNode && queryNode) {
        targetNode = queryNode.querySelectorAll(`.mx-listview`)[0] as HTMLElement;

        if (targetNode) {
            break;
        }
        queryNode = queryNode.parentNode as HTMLElement;
    }

    return targetNode;
};
