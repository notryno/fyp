####
import json

import pyotp
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.html import strip_tags
from django.views.decorators.csrf import csrf_exempt

from authentication.models import CustomUser


def generate_and_send_otp(user):
    otp_secret = pyotp.random_base32()
    otp = pyotp.TOTP(otp_secret, interval=120)
    otp_code = otp.now()

    user.otp_secret = otp_secret
    user.otp_created_at = timezone.now()
    user.save()

    html_message = render_to_string(
        "email_template/verify_email.html",
        {
            "user": user.first_name,
            "digit1": otp_code[0],
            "digit2": otp_code[1],
            "digit3": otp_code[2],
            "digit4": otp_code[3],
            "digit5": otp_code[4],
            "digit6": otp_code[5],
        },
    )

    plain_message = strip_tags(html_message)

    email = EmailMultiAlternatives(
        "Verify Your Email with OTP",
        plain_message,
        settings.EMAIL_HOST_USER,
        [user.email],
    )

    email.attach_alternative(html_message, "text/html")

    email.send(fail_silently=False)


@csrf_exempt
def resend_otp(request):
    data = json.loads(request.body)
    email = data.get("email")
    user = CustomUser.objects.get(email=email)
    generate_and_send_otp(user)
    return JsonResponse(
        {"success": True, "message": "OTP has been sent!"},
        status=200,
    )
