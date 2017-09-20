import { Component, ReactElement, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as dijitRegistry from "dijit/registry";
import * as classNames from "classnames";
import * as dojoLang from "dojo/_base/lang";
import * as dojoConnect from "dojo/_base/connect";
import * as dojoAspect from "dojo/aspect";

import { PageButton, PageButtonProps } from "./PageButton";
import { ValidateConfigs } from "./ValidateConfigs";
import {
    ButtonType,
    ListView,
    PageButtonContainerProps,
    PageButtonContainerState,
    WrapperProps,
    parseStyle
} from "../utils/ContainerUtils";
import "../ui/PageButton.css";

export default class PageButtonContainer extends Component<PageButtonContainerProps, PageButtonContainerState> {
    pageButtonClass: "custom-listview-page-button";
    private navigationHandler: object;

    constructor(props: PageButtonContainerProps) {
        super(props);

        this.state = {
            findingListviewWidget: true,
            showPageButton: true,
            statusMessage: ""
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

    private renderPageButton(): ReactElement<PageButtonProps> | null {
        if (this.state.validationPassed) {
            return createElement(PageButton, {
                onClickAction: this.updateListView,
                showPageButton: this.state.showPageButton,
                statusMessage: this.state.statusMessage
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
                    this.setState({
                        statusMessage: targetListView._datasource.getStatusMessage(),
                        targetListView
                    });
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

        if (buttonNode) {
            buttonNode.style.display = "none";
        }
        dojoAspect.after(listView, "_renderData", () => {
            // TODO getting status message causes the widget to load all the records.
            // TODO if there is no work around then we have to implement message in PageButton
            // this.setState({ listViewMessageStatus: listView._datasource.getStatusMessage() })
        });
    }

    private updateListView(buttonClicked: ButtonType) {
        if (this.state.targetListView && this.state.targetListView._datasource && this.state.validationPassed) {
            const listView = this.state.targetListView;
            const dataSource = listView._datasource;

            if (buttonClicked === "first") {
                dataSource.first();
            } else if (buttonClicked === "next") {
                dataSource.next();
            } else if (buttonClicked === "previous") {
                dataSource.previous();
            } else {
                dataSource.last();
            }
            listView._showLoadingIcon();
            listView.sequence([ "_sourceReload", "_renderData" ]);
        }
    }
}
