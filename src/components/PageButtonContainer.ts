import { Component, ReactElement, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as dijitRegistry from "dijit/registry";
import * as classNames from "classnames";
import * as dojoLang from "dojo/_base/lang";
import * as dojoConnect from "dojo/_base/connect";

import { PageButton, PageButtonProps } from "./PageButton";
import { ValidateConfigs } from "./ValidateConfigs";
import {
    ListView,
    PageButtonContainerProps,
    PageButtonContainerState,
    WrapperProps,
    parseStyle
} from "../utils/ContainerUtils";
import "../ui/PageButton.css";

export default class PageButtonContainer extends Component<PageButtonContainerProps, PageButtonContainerState> {
    private navigationHandler: object;
    private listListViewHeight: number;

    constructor(props: PageButtonContainerProps) {
        super(props);

        this.state = {
            findingListviewWidget: true,
            maxPageSize: 0,
            offSet: 1,
            showPageButton: true
        };

        this.updateListView = this.updateListView.bind(this);
        this.transformListView = this.transformListView.bind(this);

        this.navigationHandler = dojoConnect.connect(
            props.mxform,
            "onNavigation",
            this,
            dojoLang.hitch(this, this.validateConfigs)
        );
    }

    render() {
        return createElement("div",
            {
                className: classNames("widget-page-button", this.props.class),
                style: parseStyle(this.props.style)
            },
            createElement(ValidateConfigs, {
                ...this.props as WrapperProps,
                queryNode: this.state.targetNode,
                targetListview: this.state.targetListView,
                validate: !this.state.findingListviewWidget
            }),
            this.renderPageButton()
        );
    }

    componentWillUnmount() {
        dojoConnect.disconnect(this.navigationHandler);
    }

    public static setMessageStatus(currentOffSet: number, offSet: number, maxPageSize: number): string {
        let fromValue = currentOffSet + 1;
        let toValue = 0;
        if (maxPageSize === 0) {
            fromValue = 0;
        } else if (maxPageSize < offSet || (currentOffSet + offSet) > maxPageSize) {
            toValue = maxPageSize;
        } else {
            toValue = currentOffSet + offSet;
        }

        return window.mx.ui.translate(
            "mxui.lib.MxDataSource",
            "status",
            [ fromValue, toValue, maxPageSize ]);
    }

    private renderPageButton(): ReactElement<PageButtonProps> | null {
        if (this.state.validationPassed) {
            return createElement(PageButton, {
                maxPageSize: this.state.maxPageSize,
                offSet: this.state.offSet,
                onClickAction: this.updateListView,
                setMessageStatus: PageButtonContainer.setMessageStatus,
                showPageButton: this.state.showPageButton
            });
        }

        return null;
    }

    private validateConfigs() {
        if (!this.state.validationPassed) {
            const queryNode = findDOMNode(this) as HTMLElement;
            const targetNode = ValidateConfigs.findTargetNode(queryNode);
            let targetListView: ListView | null = null;

            if (targetNode) {
                targetListView = dijitRegistry.byNode(targetNode);
                this.setState({ targetNode });

                if (targetListView) {
                    this.transformListView(targetNode, targetListView);
                    this.setState({ targetListView });
                }
            }
            const validateMessage = ValidateConfigs.validate({
                ...this.props as WrapperProps,
                queryNode: this.state.targetNode,
                targetListview: this.state.targetListView,
                validate: !this.state.findingListviewWidget
            });
            this.setState({ findingListviewWidget: false, validationPassed: !validateMessage });
        }
    }

    private transformListView(targetNode: HTMLElement, listView: ListView) {
        const buttonNode = targetNode.querySelector(".mx-listview-loadMore") as HTMLButtonElement;

        this.setState({
            maxPageSize: listView._datasource._setSize,
            offSet: listView._datasource._pageSize,
            showPageButton: !((listView._datasource._pageSize >= listView._datasource._setSize) && this.props.hideUnusedPaging)
        });

        if (buttonNode) {
            buttonNode.style.display = "none";
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
            targetListView.sequence([ "_sourceReload", "_renderData" ]);
        }
    }

}
