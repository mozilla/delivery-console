import pytest

from pages.base import Base


@pytest.mark.nondestructive
def test_login(base_url, selenium):
    page = Base(selenium, base_url).open()
    page.header.login(email="user@example.com")
    assert page.header.logged_in


@pytest.mark.nondestructive
def test_logout(base_url, selenium):
    page = Base(selenium, base_url).open()
    page.header.login(email="user@example.com")
    page.header.logout()
    assert not page.header.logged_in
