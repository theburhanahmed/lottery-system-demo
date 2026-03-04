# Game Integration Guide

This guide describes how to add a new game type to the platform (e.g. Ludo, Carrom, Rummy) using the shared game platform and Snakes & Ladders as the reference.

## Overview

- **Backend:** Django app `apps.games` provides rooms, players, state, REST lobby API, and WebSocket consumers. Each game type has an **engine** module that defines initial state and action handling.
- **Frontend:** Lobby pages list/create/join rooms; game pages connect via WebSocket and render game-specific UI.

## 1. Register the game kind

In [`backend/apps/games/models.py`](../../backend/apps/games/models.py):

- Add a new constant to `GameKind` (e.g. `LUDO = 'LUDO'`).
- Add the choice to `GameKind.CHOICES`.

In [`backend/apps/games/services.py`](../../backend/apps/games/services.py):

- Add entry-fee limits in `GAME_ENTRY_LIMITS` for the new kind.
- In `start_game`, add a branch that creates initial state using the new engine’s `initial_state(room, config)`.

## 2. Implement the game engine

Create a new module under `backend/apps/games/engines/`, e.g. `ludo.py`.

- **`initial_state(room, config) -> dict`**  
  Build the initial JSON state for the room (e.g. board, player positions, turn index). Use `room.players.order_by('position')` to get ordered players.

- **`apply_action(state, user_id, action, room_id, version) -> dict`**  
  Apply one action (e.g. `roll_dice`, `move_piece`). Validate turn and rules; return a **new** state dict (do not mutate the input). Use `room_id` and `version` for deterministic RNG if needed. Raise `ValueError` for invalid moves.

Export the module in `backend/apps/games/engines/__init__.py`.

## 3. Wire the WebSocket consumer

In [`backend/apps/games/consumers.py`](../../backend/apps/games/consumers.py):

- In `_apply_action_sync`, add a branch for the new `game_kind`: load `room.game_state`, call your engine’s `apply_action(state, str(user.id), payload, self.room_id, gs.version)`, then save `GameState` and return the new state.
- If the new state indicates game over (e.g. a `winner_id` or `phase == 'finished'`), the existing flow will call `end_game(room_id)` after broadcasting.

No change to routing is required; the same consumer handles all game types by room.

## 4. REST API

Existing endpoints support any game kind:

- `GET /api/games/rooms/?game_kind=LUDO&status=WAITING` – list rooms.
- `POST /api/games/rooms/` – create room (`game_kind`, `entry_fee`, `config`).
- `GET /api/games/rooms/<id>/` – room detail and current state.
- `POST /api/games/rooms/<id>/join/` – join.
- `POST /api/games/rooms/<id>/leave/` – leave (only when status is WAITING).
- `POST /api/games/rooms/<id>/start/` – start game (deducts entry, creates state, broadcasts).

## 5. Frontend

- **Lobby:** Add a lobby page (or section) for the new game, e.g. `/games/ludo`. Use `gamesService.listRooms('LUDO')`, `createRoom`, `joinRoom`, and navigate to the game page with `roomId`.
- **Game page:** Add a route, e.g. `/games/ludo/:roomId`. Load room with `gamesService.getRoom(roomId)`. Connect WebSocket to `${API_CONFIG.wsURL}/games/${roomId}/?token=<access_token>`. On message type `game_state`, update React state and render the board/UI. Send actions as `{ type: 'action', payload: { action: '...', ... } }`.
- **Nav:** Add links under Games (desktop and mobile) to the new lobby.

## 6. End-game and payouts

`end_game(room_id, results=None)` in [`backend/apps/games/services.py`](../../backend/apps/games/services.py) credits the winner(s) and creates `GAME_WIN` transactions. If you do not pass `results`, it derives them from `GameState.state` (e.g. `winner_id`). For multiple winners or custom payout splits, pass a `results` list of `{ user_id, result, payout }`.

## Reference: Snakes & Ladders

- **Engine:** [`backend/apps/games/engines/snakes_ladders.py`](../../backend/apps/games/engines/snakes_ladders.py) – `initial_state`, `apply_action` (roll_dice, move, snakes/ladders, win, extra turn on 6).
- **Lobby:** [`frontend-react/src/pages/SnakesLaddersLobbyPage.tsx`](../../frontend-react/src/pages/SnakesLaddersLobbyPage.tsx).
- **Game UI:** [`frontend-react/src/pages/SnakesLaddersPage.tsx`](../../frontend-react/src/pages/SnakesLaddersPage.tsx) – board grid, WebSocket, roll button.

## Running with WebSockets

Development server must run with **Daphne** so WebSockets are served:

```bash
cd backend
daphne -b 0.0.0.0 -p 8000 lottery.asgi:application
```

Frontend should use `VITE_WS_URL=ws://localhost:8000/ws` (or your backend origin) so game WebSocket URLs become `ws://localhost:8000/ws/games/<room_id>/?token=...`.
