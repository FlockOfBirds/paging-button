import { createElement } from "react";
import { shallow } from "enzyme";

import { PageButton, PageButtonProps } from "../PageButton";
import * as classNames from "classnames";

describe("PageButton", () => {

    describe("with default page style", () => {
        it("renders first button structure correctly", () => {
            const cssClass = "btn mx-button mx-name-paging-first";
            const iconClass = "glyphicon glyphicon-step-backward";

            const pageButton = shallow(createElement(PageButton, {
                buttonType: "firstButton",
                showIcon: "default"
            }));

            expect(pageButton).toBeElement(
                createElement("button", {
                        className: classNames(cssClass, { disabled: false })
                    },
                    createElement("span", { className: iconClass })
                )
            );
        });

        it("renders previous button structure correctly", () => {
            const cssClass = "btn mx-button mx-name-paging-previous";
            const iconClass = "glyphicon glyphicon-backward";

            const pageButton = shallow(createElement(PageButton, {
                buttonType: "previousButton",
                showIcon: "default"
            }));

            expect(pageButton).toBeElement(
                createElement("button", {
                        className: classNames(cssClass, { disabled: false })
                    },
                    createElement("span", { className: iconClass })
                )
            );
        });

        it("renders next button structure correctly", () => {
            const cssClass = "btn mx-button mx-name-paging-next";
            const iconClass = "glyphicon glyphicon-forward";

            const pageButton = shallow(createElement(PageButton, {
                buttonType: "nextButton",
                showIcon: "default"
            }));

            expect(pageButton).toBeElement(
                createElement("button", {
                        className: classNames(cssClass, { disabled: false })
                    },
                    createElement("span", { className: iconClass })
                )
            );
        });

        it("renders last button structure correctly", () => {
            const cssClass = "btn mx-button mx-name-paging-last";
            const iconClass = "glyphicon glyphicon-step-forward";

            const pageButton = shallow(createElement(PageButton, {
                buttonType: "lastButton",
                showIcon: "default"
            }));

            expect(pageButton).toBeElement(
                createElement("button", {
                        className: classNames(cssClass, { disabled: false })
                    },
                    createElement("span", { className: iconClass })
                )
            );
        });
    });

    describe("with custom page style", () => {

        it("renders custom button structure correctly", () => {
            const cssClass = "btn mx-button mx-name-paging-first";
            const iconClass = "glyphicon glyphicon-step-backward";
            const message = "first";

            const pageButton = shallow(createElement(PageButton, {
                buttonType: "firstButton",
                message,
                showIcon: "none"
            }));

            expect(pageButton).toBeElement(
                createElement("span", { className: classNames("button-text") },
                    createElement("button", { className: classNames(cssClass, { disabled: false }) },
                        createElement("span", { className: iconClass }),
                        createElement("span", { className: "firstButton" },
                            message
                        )
                    )
                )
            );
        });

        it("renders message structure correctly", () => {
            const message = "first";

            const pageButton = shallow(createElement(PageButton, {
                buttonType: "text",
                message,
                showIcon: "none"
            }));

            expect(pageButton).toBeElement(
                createElement("span", {
                        className: classNames("button-text")
                    },
                    createElement("button", { className: classNames({ disabled: false }) },
                        createElement("span", { className: "text" },
                            message
                        ),
                        createElement("span", { className: "" })
                    )
                )
            );
        });
    });

    it("enabled responds when clicked", () => {
        const pageButtonProps: PageButtonProps = {
            buttonType: "firstButton",
            onClickAction: jasmine.createSpy("onClick"),
            showIcon: "default"
        };

        const pageButton = shallow(createElement(PageButton, pageButtonProps));
        pageButton.simulate("click");

        expect(pageButtonProps.onClickAction).toHaveBeenCalled();
    });

    it("when disabled does not responds when clicked", () => {
        const pageButtonProps: PageButtonProps = {
            buttonType: "firstButton",
            isDisabled: true,
            onClickAction: jasmine.createSpy("onClick"),
            showIcon: "default"
        };

        const pageButton = shallow(createElement(PageButton, pageButtonProps));
        pageButton.simulate("click");

        expect(pageButtonProps.onClickAction).not.toHaveBeenCalled();
    });
});
