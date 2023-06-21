import { GameSession } from '../game-session.model';
import { buildInitialGameSession } from '../session-tracker.service';
import { GameSessionEvent, GameSessionEventName } from './_event';
import { GameSessionEventProcessor } from './_processor';

export class StartSessionEvent implements GameSessionEvent {
	readonly eventName: GameSessionEventName = 'start-session';
}

export class StartSessionEventProcessor implements GameSessionEventProcessor {
	public updateSession(sessionState: GameSession): GameSession {
		return buildInitialGameSession();
	}
}
