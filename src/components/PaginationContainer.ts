import { Component, ReactElement, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as dijitRegistry from "dijit/registry";
import * as classNames from "classnames";
import * as dojoConnect from "dojo/_base/connect";
import * as dojoAspect from "dojo/aspect";
import * as dojoTopic from "dojo/topic";

import { ListView, UpdateSourceType, WrapperProps, findTargetNode, parseStyle } from "../utils/ContainerUtils";
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
    isLoadingItems: boolean;
    publishedOffset?: number;
    publishedPageNumber?: number;
    pendingOffset?: number;
    pendingPageNumber?: number;
    currentOffset?: number;
    currentPageNumber?: number;
    targetListView?: ListView | null;
    targetNode?: HTMLElement | null;
    updateSource?: UpdateSourceType;
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
            isLoadingItems: false,
            listViewSize: 0,
            message: "",
            offset: 1
        };

        this.updateListView = this.updateListView.bind(this);
        this.publishOffsetUpdate = this.publishOffsetUpdate.bind(this);
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
        const targetNode = this.getTargetNode();

        this.hideLoadMoreButton(targetNode);
    }

    componentWillUnmount() {
        const targetNode = this.getTargetNode();

        dojoConnect.disconnect(this.navigationHandler);
        this.showLoadMoreButton(targetNode);
    }

    private getTargetNode(): HTMLElement {
        const queryNode = findDOMNode(this) as HTMLElement;
        return findTargetNode(queryNode) as HTMLElement;
    }

    private renderPageButton(): ReactElement<PaginationProps> | null {
        if (this.state.validationPassed) {
            return createElement(Pagination, {
                getMessageStatus: PaginationContainer.translateMessageStatus,
                hideUnusedPaging: this.state.hideUnusedPaging,
                items: this.props.items,
                listViewSize: this.state.listViewSize,
                offset: this.state.offset,
                onClickAction: this.updateListView,
                pagingStyle: this.props.pagingStyle,
                publishedOffset: this.state.publishedOffset,
                publishedPageNumber: this.state.publishedPageNumber,
                updateSource: this.state.updateSource
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
                    offset = dataSource._pageSize;
                    hideUnusedPaging = ((offset >= dataSource._setSize) || (offset === 0)) && this.props.hideUnusedPaging;

                    dojoAspect.after(targetListView, "_onLoad", () => {
                        if (this.state.targetListView) {
                            const listViewHTML = this.getTargetNode();
                            this.maintainListViewStructure(listViewHTML);

                            this.setState({
                                listViewSize: this.state.targetListView._datasource._setSize,
                                offset,
                                publishedOffset: 0,
                                publishedPageNumber: 1,
                                updateSource: "other"
                            });
                        }
                    });

                    dojoAspect.after(targetListView, "_renderData", () => {
                        const { pendingPageNumber, pendingOffset, currentOffset } = this.state;

                        if (pendingPageNumber && pendingOffset && pendingOffset !== currentOffset) {
                            this.setState({ isLoadingItems: false });
                            this.updateListView(pendingOffset, pendingPageNumber);
                        } else {
                            this.setState({ isLoadingItems: false });
                        }

                        this.resetListViewStructure(this.state.targetNode as HTMLElement);
                    });

                    dojoTopic.subscribe(targetListView.friendlyId, (message: number[]) => {
                        if (this.state.targetListView) {
                            this.setState({
                                publishedOffset: message[0],
                                publishedPageNumber: message[1],
                                updateSource: "multiple"
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

    private showLoadMoreButton(targetNode?: HTMLElement | null) {
        if (targetNode) {
            const buttonNode = targetNode.querySelector(".mx-listview-loadMore") as HTMLButtonElement;
            const listNode = this.getListNode(targetNode);

            if (buttonNode) {
                buttonNode.classList.remove("widget-pagination-hide-load-more");
            }

            listNode.style.removeProperty("height");
        }
    }

    private updateListView(offSet: number, pageNumber: number) {
        const { targetListView, targetNode, validationPassed, isLoadingItems } = this.state;

        if (targetListView && targetNode && validationPassed) {
            const listNode = this.getListNode(targetNode);
            this.setState({ pendingOffset: offSet, pendingPageNumber: pageNumber });

            if (!isLoadingItems) {
                this.setState({
                    currentOffset: offSet,
                    currentPageNumber: pageNumber,
                    isLoadingItems: true
                });

                this.maintainListViewStructure(targetNode);
                this.setListNodeToEmpty(listNode);
                targetListView._datasource.setOffset(offSet);
                targetListView._showLoadingIcon();
                targetListView.sequence([ "_sourceReload", "_renderData" ]);
                this.publishOffsetUpdate(offSet, pageNumber);
            }
        }
    }

    private publishOffsetUpdate(offSet: number, pageNumber: number) {
        if (this.state.targetListView) {
            dojoTopic.publish(this.state.targetListView.friendlyId, [ offSet, pageNumber ]);
        }
    }

    private maintainListViewStructure(targetNode: HTMLElement) {
        const listNode = targetNode.querySelector("ul") as HTMLUListElement;

        listNode.style.height = `${this.listListViewHeight}px`;
        listNode.style.overflow = "hidden";
    }

    private resetListViewStructure(targetNode: HTMLElement) {
        const listNode = targetNode.querySelector("ul") as HTMLUListElement;

        listNode.style.removeProperty("height");
        listNode.style.removeProperty("overflow");
    }

    private getListNode(targetNode: HTMLElement): HTMLUListElement {
        return targetNode.querySelector("ul") as HTMLUListElement;
    }

    private setListNodeToEmpty(listNode: HTMLUListElement) {
        listNode.innerHTML = "";
    }
}
