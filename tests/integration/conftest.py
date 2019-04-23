import json

import pytest
import requests


@pytest.fixture
def api_url():
    return "http://localhost:8000/api/v3"
