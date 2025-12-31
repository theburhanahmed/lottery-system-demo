from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Count
import random
import secrets

from apps.lotteries.models import Lottery, Ticket, Winner, LotteryDrawLog
from apps.lotteries.serializers import (
    LotterySerializer, TicketSerializer, WinnerSerializer,
    LotteryDrawLogSerializer
)
from apps.transactions.models import Transaction
from apps.users.models import AuditLog, UserProfile


class LotteryViewSet(viewsets.ModelViewSet):
    """Manage lottery operations"""
    queryset = Lottery.objects.all()
    serializer_class = LotterySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ['status']
    ordering_fields = ['created_at', 'draw_date']
    ordering = ['-created_at']

    def create(self, request, *args, **kwargs):
        """Create new lottery (admin only)"""
        if not request.user.is_admin:
            return Response(
                {'error': 'Only admins can create lotteries'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            AuditLog.objects.create(
                user=request.user,
                action='BUY_TICKET',
                description=f'Created lottery: {serializer.data["name"]}'
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """Update lottery (admin only)"""
        if not request.user.is_admin:
            return Response(
                {'error': 'Only admins can update lotteries'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Delete lottery (admin only)"""
        if not request.user.is_admin:
            return Response(
                {'error': 'Only admins can delete lotteries'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def buy_ticket(self, request, pk=None):
        """Purchase a lottery ticket"""
        lottery = self.get_object()

        # Validation
        if not lottery.is_active():
            return Response(
                {'error': 'This lottery is not active'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if request.user.wallet_balance < lottery.ticket_price:
            return Response(
                {'error': 'Insufficient balance'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Generate ticket number
        last_ticket = Ticket.objects.filter(lottery=lottery).order_by('ticket_number').last()
        ticket_number = (last_ticket.ticket_number + 1) if last_ticket else 1

        # Create ticket
        ticket = Ticket.objects.create(
            user=request.user,
            lottery=lottery,
            ticket_number=ticket_number
        )

        # Deduct from wallet
        request.user.deduct_balance(lottery.ticket_price)

        # Update lottery
        lottery.available_tickets -= 1
        lottery.save()

        # Create transaction
        Transaction.objects.create(
            user=request.user,
            type='TICKET_PURCHASE',
            amount=lottery.ticket_price,
            status='COMPLETED',
            lottery=lottery,
            description=f'Bought ticket #{ticket_number} for {lottery.name}'
        )

        # Update user profile
        profile = request.user.profile
        profile.total_spent += float(lottery.ticket_price)
        profile.total_tickets_bought += 1
        profile.save()

        # Log action
        AuditLog.objects.create(
            user=request.user,
            action='BUY_TICKET',
            description=f'Bought ticket #{ticket_number} for lottery: {lottery.name}'
        )

        return Response(
            {
                'message': 'Ticket purchased successfully',
                'ticket': TicketSerializer(ticket).data
            },
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        """Get lottery results"""
        lottery = self.get_object()
        winners = Winner.objects.filter(lottery=lottery)
        serializer = WinnerSerializer(winners, many=True)
        return Response({
            'lottery': LotterySerializer(lottery).data,
            'winners': serializer.data,
            'total_winners': winners.count()
        })

    @action(detail=True, methods=['get'])
    def winner(self, request, pk=None):
        """Get lottery winner"""
        lottery = self.get_object()
        try:
            winner = Winner.objects.get(lottery=lottery)
            return Response(WinnerSerializer(winner).data)
        except Winner.DoesNotExist:
            return Response(
                {'error': 'No winner yet for this lottery'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def draw(self, request, pk=None):
        """Conduct lottery draw (admin only)"""
        if not request.user.is_admin:
            return Response(
                {'error': 'Only admins can conduct draws'},
                status=status.HTTP_403_FORBIDDEN
            )

        lottery = self.get_object()

        # Validation
        if lottery.status != 'CLOSED':
            return Response(
                {'error': 'Lottery must be closed to conduct draw'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if lottery.draw_date > timezone.now():
            return Response(
                {'error': 'Draw date has not been reached yet'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get all tickets
        tickets = Ticket.objects.filter(lottery=lottery)
        if not tickets.exists():
            return Response(
                {'error': 'No tickets purchased for this lottery'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Select random winner
        random_seed = secrets.token_hex(16)
        random.seed(random_seed)
        winning_ticket = random.choice(list(tickets))

        # Create winner record
        winner = Winner.objects.create(
            user=winning_ticket.user,
            lottery=lottery,
            ticket=winning_ticket,
            prize_amount=lottery.prize_amount
        )

        winning_ticket.is_winner = True
        winning_ticket.save()

        # Create draw log
        LotteryDrawLog.objects.create(
            lottery=lottery,
            conducted_by=request.user,
            total_participants=lottery.get_total_participants(),
            total_tickets_sold=lottery.get_total_tickets_sold(),
            revenue=lottery.get_revenue(),
            random_seed=random_seed
        )

        # Update lottery status
        lottery.status = 'DRAWN'
        lottery.save()

        # Update user profile
        profile = winner.user.profile
        profile.total_won += float(lottery.prize_amount)
        profile.total_wins += 1
        profile.save()

        # Log action
        AuditLog.objects.create(
            user=request.user,
            action='WIN',
            description=f'Lottery draw conducted for {lottery.name}. Winner: {winner.user.username}'
        )

        return Response(
            {
                'message': 'Draw conducted successfully',
                'winner': WinnerSerializer(winner).data
            },
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['get'])
    def my_tickets(self, request, pk=None):
        """Get user's tickets for this lottery"""
        lottery = self.get_object()
        tickets = Ticket.objects.filter(user=request.user, lottery=lottery)
        serializer = TicketSerializer(tickets, many=True)
        return Response({
            'lottery': LotterySerializer(lottery).data,
            'tickets': serializer.data,
            'count': tickets.count()
        })

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def participants(self, request, pk=None):
        """Get lottery participants (admin only)"""
        if not request.user.is_admin:
            return Response(
                {'error': 'Only admins can view participants'},
                status=status.HTTP_403_FORBIDDEN
            )

        lottery = self.get_object()
        participants = Ticket.objects.filter(lottery=lottery).values('user').distinct().count()
        return Response({
            'lottery': LotterySerializer(lottery).data,
            'total_participants': participants,
            'total_tickets': Ticket.objects.filter(lottery=lottery).count()
        })

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def stats(self, request, pk=None):
        """Get lottery statistics"""
        if not request.user.is_admin:
            return Response(
                {'error': 'Only admins can view stats'},
                status=status.HTTP_403_FORBIDDEN
            )

        lottery = self.get_object()
        return Response({
            'lottery': LotterySerializer(lottery).data,
            'total_participants': lottery.get_total_participants(),
            'total_tickets_sold': lottery.get_total_tickets_sold(),
            'total_tickets_remaining': lottery.available_tickets,
            'revenue': str(lottery.get_revenue()),
            'revenue_percentage': f"{(lottery.get_total_tickets_sold() / lottery.total_tickets * 100) if lottery.total_tickets > 0 else 0:.2f}%"
        })


class TicketViewSet(viewsets.ReadOnlyModelViewSet):
    """View user tickets"""
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]
    ordering = ['-purchased_at']

    def get_queryset(self):
        return Ticket.objects.filter(user=self.request.user)
