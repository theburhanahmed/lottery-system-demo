from rest_framework import serializers
from apps.lotteries.models import Lottery, Ticket, Winner, LotteryDrawLog
from apps.users.serializers import UserSerializer


class LotterySerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    total_participants = serializers.SerializerMethodField()
    total_tickets_sold = serializers.SerializerMethodField()
    revenue = serializers.SerializerMethodField()

    class Meta:
        model = Lottery
        fields = [
            'id', 'name', 'description', 'ticket_price', 'total_tickets',
            'available_tickets', 'prize_amount', 'status', 'draw_date',
            'created_by', 'total_participants', 'total_tickets_sold',
            'revenue', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def get_total_participants(self, obj):
        return obj.get_total_participants()

    def get_total_tickets_sold(self, obj):
        return obj.get_total_tickets_sold()

    def get_revenue(self, obj):
        return str(obj.get_revenue())


class TicketSerializer(serializers.ModelSerializer):
    lottery = LotterySerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Ticket
        fields = ['id', 'user', 'lottery', 'ticket_number', 'is_winner', 'purchased_at']
        read_only_fields = ['id', 'ticket_number', 'purchased_at']


class WinnerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    lottery = LotterySerializer(read_only=True)
    ticket = TicketSerializer(read_only=True)

    class Meta:
        model = Winner
        fields = ['id', 'user', 'lottery', 'ticket', 'prize_amount', 
                  'announced_at', 'claimed_at', 'is_claimed']
        read_only_fields = ['id', 'announced_at', 'claimed_at']


class LotteryDrawLogSerializer(serializers.ModelSerializer):
    lottery = LotterySerializer(read_only=True)
    conducted_by = UserSerializer(read_only=True)

    class Meta:
        model = LotteryDrawLog
        fields = ['id', 'lottery', 'conducted_by', 'total_participants', 
                  'total_tickets_sold', 'revenue', 'random_seed', 'drawn_at']
        read_only_fields = ['id', 'drawn_at']
