import { Component, ReactElement, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as dijitRegistry from "dijit/registry";
import * as classNames from "classnames";
import * as dojoLang from "dojo/_base/lang";
import * as dojoConnect from "dojo/_base/connect";
//import * as dojoAspect from "dojo/aspect";

import { PageButton, PageButtonProps } from "./PageButton";
import { ValidateConfigs } from "./ValidateConfigs";
import { PageButtonState, ListView, WrapperProps, parseStyle } from "../utils/ContainerUtils";
import "../ui/PageButton.css";

export default class PageButtonContainer extends Component<WrapperProps, PageButtonState> {
    pageButtonClass: "custom-listview-page-button";
    private navigationHandler: object;

    constructor(props: WrapperProps) {
        super(props);

        this.state = {
            alertMessage: "",
            findingListviewWidget: true
        };
        this.pageListView = this.pageListView.bind(this);
        this.navigationHandler = dojoConnect.connect(props.mxform, "onNavigation", this, dojoLang.hitch(this, this.validate));
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
                targetListview: this.state.targetListview,
                validate: !this.state.findingListviewWidget
            }),
            this.renderPageButton()
        );
    }

    componentWillUnmount() {
        dojoConnect.disconnect(this.navigationHandler);
    }

    private renderPageButton(): ReactElement<PageButtonProps> | null {
        if (this.state.validationPassed) {
            return createElement(PageButton, {
                onClickAction: this.pageListView,
                pageSize: this.state.targetListview ? this.state.targetListview._datasource._pageSize: 0
            });
        }

        return null;
    }

    private validate() {
        if (!this.state.validationPassed) {
            const queryNode = findDOMNode(this).parentNode as HTMLElement;
            const targetNode = ValidateConfigs.findTargetNode(queryNode);
            let targetListView: ListView | null = null;

            if (targetNode) {
                this.setState({ targetNode });
                targetListView = dijitRegistry.byNode(targetNode);
                if (targetListView) {
                    this.setState({ targetListview: targetListView });
                }
            }
            const validateMessage = ValidateConfigs.validate({
                ...this.props as WrapperProps,
                queryNode: this.state.targetNode,
                targetListview: this.state.targetListview,
                validate: !this.state.findingListviewWidget
            });
            this.setState({ findingListviewWidget: false, validationPassed: !validateMessage });
        }
    }

    private pageListView(_pageNumber: number) {
        if (this.state.targetListview && this.state.targetListview._datasource && this.state.validationPassed) {
            //perform paging
        }
    }
}
