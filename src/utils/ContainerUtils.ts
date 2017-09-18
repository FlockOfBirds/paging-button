export interface WrapperProps {
    "class"?: string;
    mxform: mxui.lib.form._FormBase;
    friendlyId: string;
    style: string;
}

export interface PageButtonState {
    alertMessage?: string;
    targetListview?: ListView;
    targetNode?: HTMLElement;
    findingListviewWidget: boolean;
    validationPassed?: boolean;
}

export interface ListView extends mxui.widget._WidgetBase {
    _datasource: {
        _setsize: number;
        _setSize: number;
        atEnd: () => boolean;
        _pageSize: number;
    };
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
