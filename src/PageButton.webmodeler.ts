import { Component, createElement } from "react";
import { findDOMNode } from "react-dom";

import { PageButton } from "./components/PageButton";
import { ValidateConfigs } from "./components/ValidateConfigs";
import { PageButtonState, WrapperProps } from "./utils/ContainerUtils";

declare function require(name: string): string;

// tslint:disable-next-line class-name
export class preview extends Component<WrapperProps, PageButtonState> {
    constructor(props: WrapperProps) {
        super(props);

        this.state = { findingListviewWidget: true };
    }

    render() {
        return createElement("div", { className: "widget-page-button" },
            createElement(ValidateConfigs, {
                ...this.props as WrapperProps,
                inWebModeler: true,
                queryNode: this.state.targetNode,
                targetListview: this.state.targetListview,
                validate: !this.state.findingListviewWidget
            }),
            createElement(PageButton, {
                onClickAction: () => { return; },
                pageSize: this.state.targetListview ? this.state.targetListview._datasource._pageSize: 0
            })
        );
    }

    componentDidMount() {
        this.validateConfigs();
    }

    componentWillReceiveProps(_newProps: WrapperProps) {
        this.validateConfigs();
    }

    private validateConfigs() {
        const routeNode = findDOMNode(this) as HTMLElement;
        const targetNode = ValidateConfigs.findTargetNode(routeNode);

        if (targetNode) {
            this.setState({ targetNode });
        }
        this.setState({ findingListviewWidget: true });
    }
}

export function getPreviewCss() {
    return require("./ui/PageButton.css");
}
