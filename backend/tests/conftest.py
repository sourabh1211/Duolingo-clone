import os
import tempfile

import pytest

# Point the app at a throwaway database *before* it is imported.
_tmp = tempfile.mkdtemp()
os.environ["DATABASE_URL"] = f"sqlite:///{_tmp}/test.db"

from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402
from app.seed.seed import run  # noqa: E402


@pytest.fixture()
def client():
    run(reset=True)
    with TestClient(app) as c:
        yield c
