import { createElement } from "react";
import { shallow } from "enzyme";

import { PageNumberView } from "../PageNumberView";
import * as classNames from "classnames";

describe("PageNumberView", () => {

    it("renders the active structure correctly", () => {
        const pageNumber = 5;

        const pageNumberView = shallow(createElement(PageNumberView, {
            onClickAction: () => jasmine.any(Function),
            pageCount: 10,
            pageNumber,
            selectedPageNumber: 5
        }));

        expect(pageNumberView).toBeElement(
            createElement("li", {
                    className: classNames(
                        "active",
                        "single-digit"
                    ),
                    onClick: jasmine.any(Function)
                },
                pageNumber
            )
        );
    });

    it("renders the disabled structure correctly", () => {
        const pageNumber = 5;

        const pageNumberView = shallow(createElement(PageNumberView, {
            onClickAction: () => jasmine.any(Function),
            pageCount: 10,
            pageNumber,
            selectedPageNumber: 5
        }));

        expect(pageNumberView).toBeElement(
            createElement("li", {
                    className: "",
                    onClick: jasmine.any(Function)
                },
                pageNumber
            )
        );
    });
});
