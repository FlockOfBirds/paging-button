import { Component, createElement } from "react";

import { Alert } from "./Alert";
import { ListView, WrapperProps } from "../utils/ContainerUtils";

export interface ValidateConfigProps extends WrapperProps {
    inWebModeler?: boolean;
    queryNode?: HTMLElement;
    targetListview?: ListView;
    validate: boolean;
}

const showAlert = (friendlyId: string, message: string) => `Custom widget ${friendlyId} Error in configuration" ${message}`;

export class ValidateConfigs extends Component<ValidateConfigProps, {}> {
    render() {
        return createElement(Alert, {
            bootstrapStyle: "danger",
            className: "widget-page-button-alert",
            message: this.props.validate ? ValidateConfigs.validate(this.props) : ""
        });
    }

    static validate(props: ValidateConfigProps): string {
        if (!props.queryNode) {
            return showAlert(props.friendlyId, "unable to find a list view on the page");
        }
        if (props.inWebModeler) {
            return "";
        }
        if (props.targetListview && !ValidateConfigs.isCompatible(props.targetListview)) {
            return showAlert(props.friendlyId, "this Mendix version is incompatible");
        }

        return "";
    }

    static isCompatible(targetListView: ListView): boolean {
        return !!(targetListView
            && targetListView._datasource
            && targetListView._datasource.setOffset
            && targetListView._datasource._setSize
            && targetListView._datasource._pageSize
            && targetListView._showLoadingIcon
            && targetListView.sequence);
    }

    static findTargetNode(queryNode: HTMLElement): HTMLElement | null {
        let targetNode: HTMLElement | null = null;

        while (!targetNode && queryNode) {
            targetNode = queryNode.querySelectorAll(`.mx-listview`)[0] as HTMLElement;

            if (targetNode) {
                break;
            }
            queryNode = queryNode.parentNode as HTMLElement;
        }

        return targetNode;
    }

    static itContains(array: string[] | string, element: string) {
        return array.indexOf(element) > -1;
    }
}
