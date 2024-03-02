from promptdeploy.database.database import engine
from promptdeploy.database.models import Base


def create_tables():
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    create_tables()
