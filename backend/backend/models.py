# users/models.py
import uuid
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, PermissionsMixin
)
from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator

class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        if not password:
            raise ValueError("Superuser must have a password")
        return self._create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model using email as the unique identifier.
    Password field kept for compatibility (can be unusable for OTP-only users).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField("email address", unique=True, db_index=True)
    full_name = models.CharField(max_length=180, blank=True)
    phone = models.CharField(max_length=20, blank=True, null=True, validators=[
        RegexValidator(r"^\+?\d{7,15}$", "Enter a valid phone number.")
    ])
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    last_seen = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        indexes = [
            models.Index(fields=["email"]),
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return self.email


class Address(models.Model):
    """
    User shipping address.
    Marking is_default helps quick checkout for returning users.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="addresses", on_delete=models.CASCADE)
    full_name = models.CharField(max_length=180)
    phone = models.CharField(max_length=20, validators=[
        RegexValidator(r"^\+?\d{7,15}$", "Enter a valid phone number.")
    ])
    street_address = models.TextField()
    city = models.CharField(max_length=120)
    state = models.CharField(max_length=120)
    pincode = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default="India")
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        indexes = [models.Index(fields=["user", "is_default"]), models.Index(fields=["pincode"])]
        ordering = ["-is_default", "-created_at"]

    def __str__(self):
        return f"{self.full_name} • {self.pincode}"


class EmailOTP(models.Model):
    """
    Short-lived OTPs for passwordless login. In production consider hashing OTP,
    strong rate-limiting, and stricter TTL checks.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(db_index=True)
    otp_code = models.CharField(max_length=12)  # hash in prod if you want
    created_at = models.DateTimeField(default=timezone.now)
    used = models.BooleanField(default=False)

    class Meta:
        indexes = [models.Index(fields=["email", "created_at"])]

    def is_valid(self, ttl_seconds: int = 300) -> bool:
        return (not self.used) and (timezone.now() <= self.created_at + timedelta(seconds=ttl_seconds))

    def mark_used(self):
        self.used = True
        self.save(update_fields=["used"])
