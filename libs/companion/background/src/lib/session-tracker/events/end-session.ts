import { GameSession } from '../game-session.model';
import { buildInitialGameSession } from '../session-tracker.service';
import { GameSessionEvent, GameSessionEventName } from './_event';
import { GameSessionEventProcessor } from './_processor';

export class EndSessionEvent implements GameSessionEvent {
	readonly eventName: GameSessionEventName = 'end-session';
}

export class EndSessionEventProcessor implements GameSessionEventProcessor {
	public updateSession(sessionState: GameSession): GameSession {
		return buildInitialGameSession();
	}
}
