from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([SessionAuthentication])
def me(request):
    print("=" * 50)
    print("All cookies:", request.COOKIES)
    print("Session key Django is using:", request.session.session_key)
    print("User:", request.user)
    print("User authenticated:", request.user.is_authenticated)
    print("=" * 50)
    
    user = request.user
    return Response({
        "id": user.id,
        "username": user.get_username(),
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser,
    })