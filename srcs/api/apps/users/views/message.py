from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.db.models import Q
from ..models import Message, Connection
from ..serializers import MessageSerializer

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        connection_id = self.kwargs.get('connection_id')

        if connection_id:
            # Get messages for specific connection
            connection = Connection.objects.filter(
                Q(id=connection_id),
                Q(status=Connection.FRIENDS),
                Q(initiator=user) | Q(recipient=user)
            ).first()
            if connection:
                return Message.objects.filter(connection=connection).order_by('-timestamp')

        return Message.objects.none()

    def perform_create(self, serializer):
        recipient_id = self.request.data.get('recipient_id')
        if not recipient_id:
            raise ValidationError("recipient_id is required")

        connection = Connection.objects.filter(
            Q(initiator=self.request.user, recipient_id=recipient_id) |
            Q(initiator_id=recipient_id, recipient=self.request.user),
            status=Connection.FRIENDS
        ).first()

        if not connection:
            raise ValidationError("No valid connection found with this user")

        serializer.save(
            sender=self.request.user,
            connection=connection
        )

    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Get count of unread messages"""
        user = request.user
        unread_count = Message.objects.filter(
            connection__in=Connection.get_friends(user=user),
            sender__in=Connection.get_friends(user=user).values('initiator', 'recipient'),
            recipient=user,
            is_read=False
        ).count()

        return Response({'unread_count': unread_count})

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark message as read"""
        message = self.get_object()
        if message.recipient == request.user:
            message.is_read = True
            message.save()
        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all messages as read for a specific connection"""
        connection_id = request.data.get('connection_id')
        if not connection_id:
            raise ValidationError("connection_id is required")

        connection = Connection.objects.filter(
            Q(id=connection_id),
            Q(initiator=request.user) | Q(recipient=request.user),
            status=Connection.FRIENDS
        ).first()

        if connection:
            Message.objects.filter(
                connection=connection,
                recipient=request.user,
                is_read=False
            ).update(is_read=True)

        return Response(status=status.HTTP_200_OK)
