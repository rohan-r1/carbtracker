"""Initialize the database tables"""
from app.database import engine, Base
from app.models.meal import Meal, Analysis, FoodItem, QuickTapQuestion

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("Done! Database initialized.")
