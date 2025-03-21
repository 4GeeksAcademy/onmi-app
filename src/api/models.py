from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy import Integer, Enum, String, ForeignKey, Boolean, Column, String, DateTime
from enum import Enum as PyEnum
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from sqlalchemy import Integer, Enum, String, ForeignKey, Boolean, DateTime, func
from enum import Enum as PyEnum
from werkzeug.security import generate_password_hash, check_password_hash
from typing import List

db = SQLAlchemy()

class Gender(PyEnum):
    male = "male"
    female = "female"
    NON_BINARY = "Non-binary"
    OTHER = "Other"
    prefer_not_to_say = "prefer_not_to_say"

class Role(PyEnum):
    ADMIN = "Admin"
    MODERATOR = "Moderator"
    USER = "User"

class User(db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(500))
    gender: Mapped[Gender] = mapped_column(Enum(Gender), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    role: Mapped[Role] = mapped_column(Enum(Role), nullable=False, default=Role.USER)
    notes: Mapped["Notes"] = relationship(back_populates="user")
    habits: Mapped["Habits"] = relationship(back_populates="user")
    goals: Mapped["Goals"] = relationship(back_populates="user")
    projects: Mapped["Projects"] = relationship(back_populates="user")
     # Campos para manejar el reseteo de contraseña
    reset_token: Mapped[str] = mapped_column(String(500), nullable=True)
    token_expiration: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    def set_password(self, password):
        """Establece el hash de la contraseña."""
        self.password = generate_password_hash(password)

    def check_password(self, password):
        """Verifica si la contraseña proporcionada coincide con el hash almacenado."""
        return check_password_hash(self.password, password)

    def serialize(self):
        
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "gender": self.gender.value,
            "is_active": self.is_active,
            "role": self.role.value
        }

class Notes(db.Model):
    __tablename__ = "notes"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str] = mapped_column(String(2000), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="notes")
    projects_id: Mapped[int] = mapped_column(ForeignKey("projects.id"), nullable=True)
    projects: Mapped["Projects"] = relationship(back_populates="notes")

    def serialize(self):
        
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "user_id": self.user_id
        }
    
class Habits(db.Model):
    __tablename__ = "habits"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=True)
    category: Mapped[str] = mapped_column(String(100), nullable=True)
    ready: Mapped[bool]
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="habits")
    goals_id: Mapped[int] = mapped_column(ForeignKey("goals.id"), nullable=True)
    goals: Mapped["Goals"] = relationship(back_populates="habits")
    tracker: Mapped[List["HabitsTracker"]] = relationship("HabitsTracker", back_populates="habit") 

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "category": self.category,
            "ready": self.ready,
            "dates": [item.serialize() for item in self.tracker],  
            "count": len(self.tracker)
        }
    
class HabitsTracker(db.Model):
    __tablename__ = "habitstracker"

    id: Mapped[int] = mapped_column(primary_key=True)
    habit_id: Mapped[int] = mapped_column(ForeignKey("habits.id"))
    completed_at: Mapped[datetime] = mapped_column(DateTime,server_default=func.now())
    success: Mapped[bool] = mapped_column(Boolean, default=True)
    habit: Mapped["Habits"] = relationship("Habits", back_populates="tracker")  # Corregido

    def serialize(self):
        return {
            "id": self.id,
            "habit_id": self.habit_id,
            "completed_at": self.completed_at.isoformat(),
            "success": self.success
        }


class Goals(db.Model):
    __tablename__ = "goals"

    id: Mapped[int] = mapped_column(primary_key=True)
    target: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=False)
    ready: Mapped[bool]
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="goals")
    projects_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    projects: Mapped["Projects"] = relationship(back_populates="goals")
    habits: Mapped["Habits"] = relationship(back_populates="goals")
    def serialize(self):
        
        return {
            "id": self.id,
            "target": self.target,
            "description": self.description,
            "ready": self.ready
        }

class Projects(db.Model):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    Urgency: Mapped[str] = mapped_column(String(1500), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=True)
    date: Mapped[str] = mapped_column(String(100), nullable=True)
    status: Mapped[str] = mapped_column(String(100), nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped["User"] = relationship(back_populates="projects")
    notes: Mapped["Notes"] = relationship(back_populates="projects")
    goals: Mapped["Goals"] = relationship(back_populates="projects")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "Urgency": self.Urgency,
            "date": self.date,
            "status": self.status,
            
        }