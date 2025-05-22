const { Builder, By, until } = require("selenium-webdriver");
const edge = require("selenium-webdriver/edge");
const assert = require("assert");

describe("MyProfile Update Tests - Edge", function () {
    this.timeout(90000);

    let driver;

    async function login() {
        await driver.get("http://localhost:3001/login");
        await driver.findElement(By.css('input[placeholder="Username"]')).sendKeys("truongkk");
        await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys("123");
        await driver.findElement(By.css('input[type="submit"]')).click();

        await driver.wait(until.urlContains("/home"), 30000);
        const currentUrl = await driver.getCurrentUrl();
        console.log("URL after login:", currentUrl);

        const cookies = await driver.manage().getCookies();
        console.log("Cookies after login:", cookies);
        global.savedCookies = cookies; // Lưu cookies để so sánh

        const errorToast = await driver.findElements(By.css('.Toastify__toast--error'));
        if (errorToast.length > 0) {
            console.log("Login error:", await errorToast[0].getText());
        }
    }

    before(async function () {
        let options = new edge.Options();
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu"); // Tắt GPU để tránh lỗi
        options.addArguments("--log-level=3");
        driver = await new Builder()
            .forBrowser("MicrosoftEdge")
            .setEdgeOptions(options)
            .build();
        await login();
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    beforeEach(async function () {
        await login();
        const cookies = await driver.manage().getCookies();
        console.log("Cookies before accessing /myprofile:", cookies);
        console.log("Saved cookies from login:", global.savedCookies);

        await driver.get("http://localhost:3001/myprofile");
        const currentUrl = await driver.getCurrentUrl();
        console.log("URL after accessing /myprofile:", currentUrl);

        if (!currentUrl.includes("/myprofile")) {
            throw new Error("Failed to navigate to /myprofile, current URL: " + currentUrl);
        }

        await driver.wait(until.elementLocated(By.css('form.custom-form')), 10000);
    });

    // TC56 - cập nhật email và phone thành công
    it("TC56 - Update email and phone successfully", async function () {
        const emailInput = await driver.findElement(By.css('input[placeholder="example@company.com"]'));
        const phoneInput = await driver.findElement(By.css('input[placeholder="Phone Number"]'));

        await emailInput.clear();
        await emailInput.sendKeys("newemail@example.com");
        await phoneInput.clear();
        await phoneInput.sendKeys("0123456789");

        await driver.findElement(By.css("button.submit-button")).click();

        await driver.wait(until.elementLocated(By.css('.Toastify__toast--success')), 5000);
        const toastText = await driver.findElement(By.css('.Toastify__toast--success')).getText();
        assert.ok(toastText.toLowerCase().includes("update"));
    });

    // TC57 - cập nhật password thành công
    it("TC57 - Update password successfully", async function () {
        const passwordInput = await driver.findElement(By.css('input[placeholder="Password"]'));
        await passwordInput.clear();
        await passwordInput.sendKeys("newpassword123");

        await driver.findElement(By.css("button.submit-button")).click();

        await driver.wait(until.elementLocated(By.css('.Toastify__toast--success')), 5000);
        const toastText = await driver.findElement(By.css('.Toastify__toast--success')).getText();
        assert.ok(toastText.toLowerCase().includes("update"));
    });

    // TC58 - cập nhật thông tin không hợp lệ (email & phone sai định dạng)
    it("TC58 - Update with invalid email and phone", async function () {
        const emailInput = await driver.findElement(By.css('input[placeholder="example@company.com"]'));
        const phoneInput = await driver.findElement(By.css('input[placeholder="Phone Number"]'));

        await emailInput.clear();
        await emailInput.sendKeys("invalid-email");
        await phoneInput.clear();
        await phoneInput.sendKeys("abc123");

        await driver.findElement(By.css("button.submit-button")).click();

        await driver.wait(until.elementLocated(By.css('.Toastify__toast--error')), 5000);
        const toastText = await driver.findElement(By.css('.Toastify__toast--error')).getText();
        assert.ok(toastText.toLowerCase().includes("invalid"));
    });

    // TC59 - bỏ trống email
    it("TC59 - Empty email validation", async function () {
        const emailInput = await driver.findElement(By.css('input[placeholder="example@company.com"]'));
        await emailInput.clear();

        await driver.findElement(By.css("button.submit-button")).click();

        await driver.wait(until.elementLocated(By.css('.Toastify__toast--warning')), 5000);
        const toastText = await driver.findElement(By.css('.Toastify__toast--warning')).getText();
        assert.ok(toastText.toLowerCase().includes("email") && toastText.toLowerCase().includes("required"));
    });

    // TC60 - bỏ trống phone
    it("TC60 - Empty phone validation", async function () {
        const phoneInput = await driver.findElement(By.css('input[placeholder="Phone Number"]'));
        await phoneInput.clear();

        await driver.findElement(By.css("button.submit-button")).click();

        await driver.wait(until.elementLocated(By.css('.Toastify__toast--warning')), 5000);
        const toastText = await driver.findElement(By.css('.Toastify__toast--warning')).getText();
        assert.ok(toastText.toLowerCase().includes("phone") && toastText.toLowerCase().includes("required"));
    });

    // TC61 - bỏ trống password (bạn có thể kiểm tra trường này tương tự)
    it("TC61 - Empty password validation", async function () {
        const passwordInput = await driver.findElement(By.css('input[placeholder="Password"]'));
        await passwordInput.clear();

        await driver.findElement(By.css("button.submit-button")).click();

        await driver.wait(until.elementLocated(By.css('.Toastify__toast--warning')), 5000);
        const toastText = await driver.findElement(By.css('.Toastify__toast--warning')).getText();
        assert.ok(toastText.toLowerCase().includes("password") && toastText.toLowerCase().includes("required"));
    });

    // Các test case khác bạn làm tương tự, thay đổi giá trị input, bấm nút và check toast message.
});
