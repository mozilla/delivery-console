from pypom import Page, Region
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC


class Base(Page):
    def __init__(self, selenium, base_url, **kwargs):
        super(Base, self).__init__(selenium, base_url, timeout=10, **kwargs)

    def wait_for_page_to_load(self):
        return self

    @property
    def header(self):
        return self.Header(self)

    class Header(Region):
        _root_locator = (By.CSS_SELECTOR, ".app-header")
        _avatar_icon_locator = (By.CSS_SELECTOR, ".ant-avatar")
        _login_button_locator = (By.CSS_SELECTOR, ".ant-btn-primary")
        _login_menu_locator = (By.CSS_SELECTOR, ".ant-popover")
        _login_email_button_locator = (
            By.CSS_SELECTOR,
            ".text-colored-links > div:nth-child(1) > a:nth-child(1)",
        )
        _logout_btn_locator = (By.CSS_SELECTOR, ".text-colored-links > a:nth-child(1)")
        _user_locator = (By.CSS_SELECTOR, ".user-button")

        def login(self, email=None):
            # Login using email given
            self.find_element(*self._login_button_locator).click()
            login_menu = self.selenium.find_element(*self._login_menu_locator)
            login_menu.find_element(*self._login_email_button_locator).click()
            modal = self.LoginModal(self)
            modal.email_input.send_keys(email)
            modal.email_login_button.click()

        def logout(self):
            # Log out
            self.find_element(*self._avatar_icon_locator).click()
            menu = self.selenium.find_element(*self._login_menu_locator)
            menu.find_element(*self._logout_btn_locator).click()

        @property
        def logged_in(self):
            return self.is_element_displayed(*self._user_locator)

        class LoginModal(Region):
            _root_locator = (By.CSS_SELECTOR, ".ant-modal")
            _email_input_locator = (By.CSS_SELECTOR, ".ant-input")
            _email_login_button_locator = (By.CSS_SELECTOR, ".ant-btn-primary")

            @property
            def root(self):
                # Root element for Login Modal
                return self.selenium.find_element(*self._root_locator)

            @property
            def email_input(self):
                return self.root.find_element(*self._email_input_locator)

            @property
            def email_login_button(self):
                # Click the login button
                self.wait.until(
                    EC.element_to_be_clickable(self._email_login_button_locator)
                )
                return self.root.find_element(*self._email_login_button_locator)
