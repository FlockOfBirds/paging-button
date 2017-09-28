import { Component, createElement } from "react";
import { findDOMNode } from "react-dom";

import { PaginationContainerProps, WrapperProps, findTargetNode } from "./utils/ContainerUtils";
import { Pagination } from "./components/Pagination";
import { ValidateConfigs } from "./utils/ValidateConfigs";
import { Alert } from "./components/Alert";

type VisibilityMap = {
    [ P in keyof PaginationContainerProps ]: boolean;
};

interface PaginationWebModelerState {
    findingListViewWidget: boolean;
    hideUnusedPaging: boolean;
    message: string;
}
// tslint:disable-next-line class-name
export class preview extends Component<PaginationContainerProps, PaginationWebModelerState> {

    constructor(props: PaginationContainerProps) {
        super(props);

        this.state = {
            findingListViewWidget: true,
            hideUnusedPaging: this.props.hideUnusedPaging,
            message: ""
        };
    }

    render() {
        return createElement("div", { className: "widget-pagination" },
            createElement(Alert, {
                className: "widget-pagination-alert",
                message: this.state.message
            }),
            createElement(Pagination, {
                hideUnusedPaging: false,
                maxPageSize: 10,
                offset: 2,
                onClickAction: () => {
                    return;
                },
                setMessageStatus: () => "[2 to 10 of 50]"
            })
        );
    }

    componentDidMount() {
        this.validateConfigs(this.props);
    }

    componentWillReceiveProps(nextProps: PaginationContainerProps) {
        this.validateConfigs(nextProps);
    }

    private validateConfigs(props: PaginationContainerProps) {
        const queryNode = findDOMNode(this) as HTMLElement;
        const targetNode = findTargetNode(queryNode);
        const message = ValidateConfigs.validate({
            ...props as WrapperProps,
            inWebModeler: true,
            queryNode: targetNode
        });

        this.hideLoadMoreButton(targetNode);

        this.setState({
            findingListViewWidget: false,
            hideUnusedPaging: props.hideUnusedPaging,
            message
        });
    }

    private hideLoadMoreButton(targetNode: HTMLElement | null) {
        if (targetNode) {
            const buttonNode = targetNode.querySelector(".mx-listview-loadMore") as HTMLButtonElement;

            if (buttonNode) {
                buttonNode.style.display = "none";
            }
        }
    }
}

export function getVisibleProperties(valueMap: PaginationContainerProps, visibilityMap: VisibilityMap) {
    valueMap.hideUnusedPaging = visibilityMap.hideUnusedPaging = false;

    return visibilityMap;
}

export function getPreviewCss() {
    return require("./ui/Pagination.css");
}
