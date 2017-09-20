export type ButtonType = "first" | "next" | "previous" | "last";

export interface PageButtonContainerProps extends WrapperProps {
    hideUnusedPaging?: boolean;
}

export interface WrapperProps {
    "class"?: string;
    friendlyId: string;
    mxform: mxui.lib.form._FormBase;
    style: string;
}

export interface PageButtonContainerState {
    hidePageButton?: boolean;
    findingListviewWidget: boolean;
    statusMessage: string;
    targetListView?: ListView;
    targetNode?: HTMLElement;
    validationPassed?: boolean;
}

export interface ListView extends mxui.widget._WidgetBase {
    _datasource: {
        atBeginning: () => boolean;
        atEnd: () => boolean;
        first: () => void;
        last: () => void;
        next: () => void;
        previous: () => void;
        getStatusMessage: () => string;
    };
    _showLoadingIcon: () => void;
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
