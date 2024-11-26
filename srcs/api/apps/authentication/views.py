from rest_framework import generics, permissions, views
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainSlidingView
from rest_framework_simplejwt.tokens import SlidingToken
from django.conf import settings

from . import serializers
from apps.utils import validate_token_and_uid, sing_in_response


class TwoFaBaseView(generics.GenericAPIView):
    serializer_class = serializers.TwoFASerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        self.context["request"] = request
        serializer = self.serializer_class(
            data=request.data,
            context=self.context,
        )
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)


class Enable2FaView(TwoFaBaseView):
    context = {"action": "enable"}


class Disable2FaView(TwoFaBaseView):
    context = {"action": "disable"}


class SignUpView(generics.CreateAPIView):
    serializer_class = serializers.SignUpSerializer
    permission_classes = [permissions.AllowAny]


class SignInView(TokenObtainSlidingView):

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            sing_in_response(response, response.data.pop("token"))
            response.data["message"] = "Successfully signed in."
        return response


class SignOutView(views.APIView):

    def post(self, request):
        res = Response({"message": "Signed out successfully"})
        token = SlidingToken(request.COOKIES[settings.AUTH_TOKEN_NAME])
        token.blacklist()
        res.delete_cookie(settings.AUTH_TOKEN_NAME)
        return res


class EmailVerifyView(views.APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.EmailVerifySerializer

    def get(self, request):
        serializer = self.serializer_class(
            data=request.GET,
        )
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)

class TestAuthView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({"success": True})


class ResendVerifyEmailView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = serializers.ResendVerifyEmailSerializer
