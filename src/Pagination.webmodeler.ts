import { Component, createElement } from "react";
import { findDOMNode } from "react-dom";

import { WrapperProps, findTargetNode } from "./utils/ContainerUtils";
import { Pagination } from "./components/Pagination";
import { ValidateConfigs } from "./utils/ValidateConfigs";
import { Alert } from "./components/Alert";

type VisibilityMap = {
    [ P in keyof WrapperProps ]: boolean;
};

interface PaginationWebModelerState {
    findingListViewWidget: boolean;
    hideUnusedPaging: boolean;
    message: string;
}
// tslint:disable-next-line class-name
export class preview extends Component<WrapperProps, PaginationWebModelerState> {

    constructor(props: WrapperProps) {
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
                getMessageStatus: () => "[2 to 10 of 50]",
                hideUnusedPaging: false,
                items: this.props.items,
                listViewSize: 10,
                maxPageButtons: this.props.maxPageButtons,
                offset: 2,
                onClickAction: () => {
                    return;
                },
                pagingStyle: this.props.pagingStyle
            })
        );
    }

    componentDidMount() {
        this.validateConfigs(this.props);
    }

    componentWillReceiveProps(nextProps: WrapperProps) {
        this.validateConfigs(nextProps);
    }

    private validateConfigs(props: WrapperProps) {
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
                buttonNode.classList.add("widget-pagination-hide-load-more");
            }
        }
    }
}

export function getVisibleProperties(valueMap: WrapperProps, visibilityMap: VisibilityMap) {
    valueMap.hideUnusedPaging = visibilityMap.hideUnusedPaging = false;

    visibilityMap.items = valueMap.pagingStyle !== "default";

    return visibilityMap;
}

export function getPreviewCss() {
    return require("./ui/Pagination.scss");
}
