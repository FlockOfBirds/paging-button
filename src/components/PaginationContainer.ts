import { Component, ReactElement, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as dijitRegistry from "dijit/registry";
import * as classNames from "classnames";
import * as dojoConnect from "dojo/_base/connect";
import * as dojoAspect from "dojo/aspect";

import { ListView, PaginationContainerProps, WrapperProps, findTargetNode, parseStyle } from "../utils/ContainerUtils";
import { Pagination, PaginationProps } from "./Pagination";
import { ValidateConfigs } from "../utils/ValidateConfigs";
import { Alert } from "./Alert";
import "../ui/Pagination.css";

interface PaginationContainerState {
    findingListViewWidget: boolean;
    maxPageSize: number;
    message: string;
    offset: number;
    hideUnusedPaging: boolean;
    targetListView?: ListView | null;
    targetNode?: HTMLElement | null;
    validationPassed?: boolean;
}

interface ValidateProps {
    maxPageSize: number;
    offset: number;
    hideUnusedPaging: boolean;
    targetListView?: ListView | null;
    targetNode?: HTMLElement | null;
}

export default class PaginationContainer extends Component<PaginationContainerProps, PaginationContainerState> {
    private navigationHandler: object;
    private listListViewHeight: number;

    constructor(props: PaginationContainerProps) {
        super(props);

        this.state = {
            findingListViewWidget: true,
            hideUnusedPaging: false,
            maxPageSize: 0,
            message: "",
            offset: 1
        };

        this.updateListView = this.updateListView.bind(this);
        this.findListView = this.findListView.bind(this);
        this.navigationHandler = dojoConnect.connect(props.mxform, "onNavigation", this , this.findListView);
    }

    public static setMessageStatus(currentOffset: number, offset: number, maxPageSize: number): string {
        let fromValue = currentOffset + 1;
        let toValue = 0;

        if (maxPageSize === 0) {
            fromValue = 0;
        } else if (maxPageSize < offset || (currentOffset + offset) > maxPageSize) {
            toValue = maxPageSize;
        } else {
            toValue = currentOffset + offset;
        }

        return window.mx.ui.translate("mxui.lib.MxDataSource", "status", [ fromValue, toValue, maxPageSize ]);
    }

    render() {
        return createElement("div",
            {
                className: classNames("widget-pagination", this.props.class),
                style: parseStyle(this.props.style)
            },
            createElement(Alert, {
                className: "widget-pagination-alert",
                message: this.state.message
            }),
            this.renderPageButton()
        );
    }

    componentWillUnmount() {
        dojoConnect.disconnect(this.navigationHandler);
    }

    private renderPageButton(): ReactElement<PaginationProps> | null {
        if (this.state.validationPassed) {
            return createElement(Pagination, {
                hideUnusedPaging: this.state.hideUnusedPaging,
                maxPageSize: this.state.maxPageSize,
                offset: this.state.offset,
                onClickAction: this.updateListView,
                setMessageStatus: PaginationContainer.setMessageStatus
            });
        }

        return null;
    }

    private findListView() {
        if (this.state.findingListViewWidget) {
            const queryNode = findDOMNode(this) as HTMLElement;
            const targetNode = findTargetNode(queryNode);
            let hideUnusedPaging = false;
            let targetListView: ListView | null = null;
            let maxPageSize = 0;
            let offset = 0;

            if (targetNode) {
                this.hideLoadMoreButton(targetNode);
                targetListView = dijitRegistry.byNode(targetNode);

                if (targetListView) {
                    const dataSource = targetListView._datasource;
                    maxPageSize = dataSource._setSize;
                    offset = targetListView._datasource._pageSize;
                    hideUnusedPaging = (offset >= dataSource._setSize) && this.props.hideUnusedPaging;

                    dojoAspect.after(targetListView, "_onLoad", () => {
                        if (this.state.targetListView) {
                            this.setState({ maxPageSize: this.state.targetListView._datasource._setSize });
                        }
                    });
                }
            }

            this.validateListView({ targetNode, targetListView, hideUnusedPaging, maxPageSize, offset });
        }
    }

    private validateListView(props: ValidateProps) {
        const message = ValidateConfigs.validate({
            ...this.props as WrapperProps,
            queryNode: props.targetNode,
            targetListView: props.targetListView
        });

        this.setState({
            findingListViewWidget: false,
            hideUnusedPaging: props.hideUnusedPaging,
            maxPageSize: props.maxPageSize,
            message,
            offset: props.offset,
            targetListView: props.targetListView,
            targetNode: props.targetNode,
            validationPassed: message === ""
        });
    }

    private hideLoadMoreButton(targetNode: HTMLElement) {
        const buttonNode = targetNode.querySelector(".mx-listview-loadMore") as HTMLButtonElement;

        if (buttonNode) {
            buttonNode.classList.add("widget-pagination-hide-load-more");
        }

        this.listListViewHeight = targetNode.clientHeight;
    }

    private updateListView(offSet: number) {
        const { targetListView, targetNode, validationPassed } = this.state;

        if (targetListView && targetNode && validationPassed) {
            const listNode = targetNode.querySelector("ul") as HTMLUListElement;

            listNode.style.height = `${this.listListViewHeight}px`;
            listNode.innerHTML = "";
            targetListView._datasource.setOffset(offSet);
            targetListView._showLoadingIcon();
            targetListView.update();
        }
    }
}
