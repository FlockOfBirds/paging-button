import page from "./pages/home.page";
import indexPage from "./pages/index.page";

const testValueOne = "Color 2";
const testValueFive = "Color 22";
const testValueSeven = "Color 24";
const testValueThirteen = "Color 26";
const testLastItemValue = "Color P 12";

describe("Pagination", () => {

    beforeAll(() => {
        indexPage.tearDownSetUp();
        // wait for the records to be populated
        browser.timeouts("implicit", 10 * 1000);
    });

    it("when next button is clicked list view should have those items", () => {
        page.open();
        page.paginationOne.waitForVisible();
        page.nextButton.waitForVisible();
        page.listViewOne.waitForVisible();
        page.listViewFirstItem.waitForVisible();

        const itemValueOne = page.listViewFirstItem.getHTML();
        expect(itemValueOne).toContain(testValueOne);

        page.nextButton.click();
        page.nextButton.click();
        page.listViewThirdItem.waitForVisible();

        const itemValueFive = page.listViewThirdItem.getHTML();
        expect(itemValueFive).toContain(testValueFive);
    });

    it("when last button is clicked list view should have last items ", () => {
        page.open();
        page.paginationOne.waitForVisible();
        page.nextButton.waitForVisible();
        page.lastButton.waitForVisible();

        page.nextButton.click();
        page.nextButton.click();
        page.lastButton.click();
        page.listViewLastItem.waitForVisible();

        const lastItemValue = page.listViewLastItem.getHTML();
        expect(lastItemValue).toContain(testLastItemValue);
    });

    it("when first button is clicked list view should show item of first page ", () => {
        page.open();
        page.paginationOne.waitForVisible();
        page.nextButton.waitForVisible();
        page.firstButton.waitForVisible();
        page.listViewOne.waitForVisible();
        page.listViewFirstItem.waitForVisible();

        page.nextButton.click();
        page.nextButton.click();
        page.firstButton.click();
        page.listViewFirstItem.waitForVisible();

        const newItemValue = page.listViewFirstItem.getHTML();
        expect(newItemValue).toContain(testValueOne);
    });

    it("when previous button is clicked list view should show item on the previous page ", () => {
        page.open();
        page.paginationOne.waitForVisible();
        page.nextButton.waitForVisible();
        page.previousButton.waitForVisible();

        page.nextButton.click();
        page.nextButton.click();
        page.nextButton.click();
        page.nextButton.click();
        page.previousButton.click();
        page.listViewSeventhItem.waitForVisible();

        const seventhItemValue = page.listViewSeventhItem.getHTML();
        expect(seventhItemValue).toContain(testValueSeven);
    });

    it("when custom button is clicked list view should show item on the custom page ", () => {
        page.open();
        page.customButtonFive.waitForVisible();
        page.customButtonFive.click();
        page.listViewEighthItem.waitForVisible();

        const thirteenthItemValue = page.listViewEighthItem.getHTML();
        expect(thirteenthItemValue).toContain(testValueThirteen);
    });
});
