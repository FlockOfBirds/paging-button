import { Component, ReactElement, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as dijitRegistry from "dijit/registry";
import * as classNames from "classnames";
import * as dojoConnect from "dojo/_base/connect";
import * as dojoAspect from "dojo/aspect";

import { ListView, WrapperProps, findTargetNode, parseStyle } from "../utils/ContainerUtils";
import { Pagination, PaginationProps } from "./Pagination";
import { ValidateConfigs } from "../utils/ValidateConfigs";
import { Alert } from "./Alert";
import "../ui/Pagination.scss";

interface PaginationContainerState {
    findingListViewWidget: boolean;
    listViewSize: number;
    message: string;
    offset: number;
    hideUnusedPaging: boolean;
    targetListView?: ListView | null;
    targetNode?: HTMLElement | null;
    validationPassed?: boolean;
}

interface ValidateProps {
    listViewSize: number;
    offset: number;
    hideUnusedPaging: boolean;
    targetListView?: ListView | null;
    targetNode?: HTMLElement | null;
}

export default class PaginationContainer extends Component<WrapperProps, PaginationContainerState> {
    private navigationHandler: object;
    private listListViewHeight: number;

    constructor(props: WrapperProps) {
        super(props);

        this.state = {
            findingListViewWidget: true,
            hideUnusedPaging: false,
            listViewSize: 0,
            message: "",
            offset: 1
        };

        this.updateListView = this.updateListView.bind(this);
        this.findListView = this.findListView.bind(this);
        this.navigationHandler = dojoConnect.connect(props.mxform, "onNavigation", this , this.findListView);
    }

    public static translateMessageStatus(fromValue: number, toValue: number, maxPageSize: number): string {
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

    componentDidMount() {
        const queryNode = findDOMNode(this) as HTMLElement;
        const targetNode = findTargetNode(queryNode);
        this.hideLoadMoreButton(targetNode);
    }

    componentWillUnmount() {
        dojoConnect.disconnect(this.navigationHandler);
    }

    private renderPageButton(): ReactElement<PaginationProps> | null {
        if (this.state.validationPassed) {
            return createElement(Pagination, {
                getMessageStatus: PaginationContainer.translateMessageStatus,
                hideUnusedPaging: this.state.hideUnusedPaging,
                items: this.props.items,
                listViewSize: this.state.listViewSize,
                maxPageButtons: this.props.maxPageButtons,
                offset: this.state.offset,
                onClickAction: this.updateListView,
                pagingStyle: this.props.pagingStyle
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
            let listViewSize = 0;
            let offset = 0;
            let dataSource: ListView["_datasource"];

            if (targetNode) {
                this.hideLoadMoreButton(targetNode);
                targetListView = dijitRegistry.byNode(targetNode);

                if (targetListView) {
                    dataSource = targetListView._datasource;
                    listViewSize = dataSource._setSize;
                    offset = targetListView._datasource._pageSize;
                    hideUnusedPaging = (offset >= dataSource._setSize) && this.props.hideUnusedPaging;

                    dojoAspect.after(targetListView, "_onLoad", () => {
                        if (this.state.targetListView) {
                            this.setState({
                                listViewSize: this.state.targetListView._datasource._setSize,
                                offset
                            });
                        }
                    });
                }
            }

            this.validateListView({ targetNode, targetListView, hideUnusedPaging, listViewSize, offset });
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
            listViewSize: props.listViewSize,
            message,
            offset: props.offset,
            targetListView: props.targetListView,
            targetNode: props.targetNode,
            validationPassed: message === ""
        });
    }

    private hideLoadMoreButton(targetNode?: HTMLElement | null) {
        if (targetNode) {
            const buttonNode = targetNode.querySelector(".mx-listview-loadMore") as HTMLButtonElement;

            if (buttonNode) {
                buttonNode.classList.add("widget-pagination-hide-load-more");
            }

            this.listListViewHeight = targetNode.clientHeight;
        }
    }

    private updateListView(offSet: number) {
        const { targetListView, targetNode, validationPassed } = this.state;

        if (targetListView && targetNode && validationPassed) {
            const listNode = targetNode.querySelector("ul") as HTMLUListElement;

            listNode.style.height = `${this.listListViewHeight}px`;
            listNode.innerHTML = "";
            targetListView._datasource.setOffset(offSet);
            targetListView._showLoadingIcon();
            targetListView.sequence([ "_sourceReload", "_renderData" ]);
        }
    }
}
