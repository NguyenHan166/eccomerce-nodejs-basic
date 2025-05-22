const { Builder, By, until } = require("selenium-webdriver");
const edge = require("selenium-webdriver/edge");
const assert = require("assert");

describe("Login Component E2E Test - Edge", function () {
  this.timeout(60000);

  let driver;

  before(async function () {
    console.log("Starting Edge WebDriver...");

    // Khai báo options cho Edge
    let options = new edge.Options();

    // Nếu muốn chạy headless (ko mở cửa sổ)
    // options.headless();

    driver = await new Builder()
      .forBrowser("MicrosoftEdge") // hoặc "edge"
      .setEdgeOptions(options)
      .build();

    console.log("Edge WebDriver started");
  });

  after(async function () {
    if (driver) {
      await driver.quit();
      console.log("Edge WebDriver closed");
    }
  });

  beforeEach(async function () {
    // Xóa cookie để tránh giữ trạng thái đăng nhập cũ
    await driver.manage().deleteAllCookies();
    // Load lại trang login chung cho tất cả các test
    await driver.get("http://localhost:3001/login");
  });

  it("TC01 - should login successfully and redirect to /home", async function () {
    await driver.get("http://localhost:3001/login");

    const usernameInput = await driver.findElement(By.css('input[placeholder="Username"]'));
    await usernameInput.sendKeys("truongkk");

    const passwordInput = await driver.findElement(By.css('input[placeholder="Password"]'));
    await passwordInput.sendKeys("123");

    const submitButton = await driver.findElement(By.css('input[type="submit"][value="Đăng Nhập Ngay"]'));
    await submitButton.click();

    await driver.wait(until.urlContains("/home"), 15000);

    const currentUrl = await driver.getCurrentUrl();
    assert.ok(currentUrl.includes("/home"), "Không chuyển sang trang /home sau login");
  });

  it("TC02 - should show error on wrong password", async function () {
    await driver.findElement(By.css('input[placeholder="Username"]')).sendKeys("testuser");
    await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys("wrongpassword");
    await driver.findElement(By.css('input[type="submit"]')).click();

    // Đợi toast lỗi xuất hiện và có nội dung text không rỗng trong 10 giây
    const toast = await driver.wait(async () => {
      const elements = await driver.findElements(By.css('.Toastify__toast--error'));
      if (elements.length === 0) return false;
      const text = await elements[0].getText();
      return text.trim().length > 0 ? elements[0] : false;
    }, 10000);

    const toastText = await toast.getText();
    console.log("Toast text:", JSON.stringify(toastText));
    assert.ok(toastText.trim().length > 0, "Toast lỗi rỗng");


  });

  // TC03: username sai, password đúng
  it("TC03 - Login fail with wrong username and correct password", async function () {
    await driver.findElement(By.css('input[placeholder="Username"]')).sendKeys("admin123");
    await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys("123");
    await driver.findElement(By.css('input[type="submit"]')).click();

    // Đợi toast lỗi xuất hiện và có nội dung text không rỗng trong 10 giây
    const toast = await driver.wait(async () => {
      const elements = await driver.findElements(By.css('.Toastify__toast--error'));
      if (elements.length === 0) return false;
      const text = await elements[0].getText();
      return text.trim().length > 0 ? elements[0] : false;
    }, 10000);

    const toastText = await toast.getText();
    console.log("Toast text:", JSON.stringify(toastText));
    assert.ok(toastText.trim().length > 0, "Toast lỗi rỗng");
  });

  // // TC04: username đúng, password sai
  // it("TC04 - Login fail with correct username and wrong password", async function () {
  //   await driver.findElement(By.css('input[placeholder="Username"]')).sendKeys("admin");
  //   await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys("1234");
  //   await driver.findElement(By.css('input[type="submit"]')).click();

  //   // Đợi toast lỗi xuất hiện và có nội dung text không rỗng trong 10 giây
  //   const toast = await driver.wait(async () => {
  //     const elements = await driver.findElements(By.css('.Toastify__toast--error'));
  //     if (elements.length === 0) return false;
  //     const text = await elements[0].getText();
  //     return text.trim().length > 0 ? elements[0] : false;
  //   }, 10000);

  //   const toastText = await toast.getText();
  //   console.log("Toast text:", JSON.stringify(toastText));
  //   assert.ok(toastText.trim().length > 0, "Toast lỗi rỗng");
  // });

  // TC04: username và password sai
  it("TC4 - Login fail with wrong username and wrong password", async function () {
    await driver.findElement(By.css('input[placeholder="Username"]')).sendKeys("admin1234");
    await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys("1234");
    await driver.findElement(By.css('input[type="submit"]')).click();

    // Đợi toast lỗi xuất hiện và có nội dung text không rỗng trong 10 giây
    const toast = await driver.wait(async () => {
      const elements = await driver.findElements(By.css('.Toastify__toast--error'));
      if (elements.length === 0) return false;
      const text = await elements[0].getText();
      return text.trim().length > 0 ? elements[0] : false;
    }, 10000);

    const toastText = await toast.getText();
    console.log("Toast text:", JSON.stringify(toastText));
    assert.ok(toastText.trim().length > 0, "Toast lỗi rỗng");
  });

  // TC05: username hoặc password để trống
  it("TC05 - Login fail with empty username and/or password", async function () {
    // Bỏ trống username
    await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys("123");
    await driver.findElement(By.css('input[type="submit"]')).click();

    // Bỏ trống password
    await driver.navigate().refresh();
    await driver.findElement(By.css('input[placeholder="Username"]')).sendKeys("admin");
    await driver.findElement(By.css('input[type="submit"]')).click();

    // Đợi toast lỗi xuất hiện và có nội dung text không rỗng trong 10 giây
    const toast = await driver.wait(async () => {
      const elements = await driver.findElements(By.css('.Toastify__toast--warning'));
      if (elements.length === 0) return false;
      const text = await elements[0].getText();
      return text.trim().length > 0 ? elements[0] : false;
    }, 10000);

    const toastText = await toast.getText();
    console.log("Toast text:", JSON.stringify(toastText));
    assert.ok(toastText.trim().length > 0, "Toast lỗi rỗng");
  });

  // TC06: nhập ký tự không hợp lệ
  it("TC06 - Login fail with invalid characters in username and password", async function () {
    await driver.findElement(By.css('input[placeholder="Username"]')).sendKeys("admin*");
    await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys("á");
    await driver.findElement(By.css('input[type="submit"]')).click();

    // Đợi toast lỗi xuất hiện và có nội dung text không rỗng trong 10 giây
    const toast = await driver.wait(async () => {
      const elements = await driver.findElements(By.css('.Toastify__toast--error'));
      if (elements.length === 0) return false;
      const text = await elements[0].getText();
      return text.trim().length > 0 ? elements[0] : false;
    }, 10000);

    const toastText = await toast.getText();
    console.log("Toast text:", JSON.stringify(toastText));
    assert.strictEqual(toastText.trim(), "Invalid character input" , "Toast message không phải là 'Invalid character input'");

  });

  // TC07: tài khoản vô hiệu hóa (bạn cần mock hoặc chuẩn bị sẵn tài khoản này)
  it("TC07 - Login fail with disabled account", async function () {
    await driver.findElement(By.css('input[placeholder="Username"]')).sendKeys("disabledAdmin");
    await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys("123");
    await driver.findElement(By.css('input[type="submit"]')).click();

    // Đợi toast lỗi xuất hiện và có nội dung text không rỗng trong 10 giây
    const toast = await driver.wait(async () => {
      const elements = await driver.findElements(By.css('.Toastify__toast--error'));
      if (elements.length === 0) return false;
      const text = await elements[0].getText();
      return text.trim().length > 0 ? elements[0] : false;
    }, 10000);

    const toastText = await toast.getText();
    console.log("Toast text:", JSON.stringify(toastText));
    assert.ok(toastText.trim().length > 0, "Toast lỗi rỗng");
  });

  // TC08: server lỗi, kiểm tra hiển thị thông báo (bạn có thể mock API lỗi)
  it("TC08 - Display error when server error occurs", async function () {
    // Thường phải mock API trả lỗi hoặc cấu hình server test
    // Demo test chỉ check toast lỗi xuất hiện
    await driver.findElement(By.css('input[placeholder="Username"]')).sendKeys("admin");
    await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys("123");
    await driver.findElement(By.css('input[type="submit"]')).click();

    // Đợi toast lỗi xuất hiện và có nội dung text không rỗng trong 10 giây
    const toast = await driver.wait(async () => {
      const elements = await driver.findElements(By.css('.Toastify__toast--error'));
      if (elements.length === 0) return false;
      const text = await elements[0].getText();
      return text.trim().length > 0 ? elements[0] : false;
    }, 10000);

    const toastText = await toast.getText();
    console.log("Toast text:", JSON.stringify(toastText));
    assert.strictEqual(toastText.trim(), "Server Error" , "Toast message không phải là 'Server error'");
  });

});
