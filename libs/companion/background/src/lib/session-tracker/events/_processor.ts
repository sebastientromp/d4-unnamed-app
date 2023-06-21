import { GameSession } from '../game-session.model';

export interface GameSessionEventProcessor {
	updateSession(event: GameSession, data?: any): GameSession;
}
