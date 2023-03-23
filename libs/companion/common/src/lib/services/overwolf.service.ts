import { Injectable } from '@angular/core';

const DIABLO_IV_GAME_ID = 22700;

@Injectable()
export class OverwolfService {
	public static CONTROLLER = 'BackgroundWindow';
	public static MAIN = 'MainWindow';
	public static MAIN_OVERLAY = 'MainOverlayWindow';
	public static OVERLAY = 'FullScreenOverlaysWindow';

	public async getCurrentWindow(): Promise<overwolf.windows.WindowInfo> {
		return new Promise<overwolf.windows.WindowInfo>((resolve, reject) => {
			try {
				overwolf.windows.getCurrentWindow((res: overwolf.windows.WindowResult) => {
					resolve(res.window);
				});
			} catch (e) {
				console.warn('Exception while getting current window window');
				reject();
			}
		});
	}

	public getMainWindow(): Window & { appStore: any } {
		return overwolf.windows.getMainWindow() as any;
	}

	public async obtainDeclaredWindow(windowName: string): Promise<overwolf.windows.WindowInfo> {
		return new Promise<overwolf.windows.WindowInfo>((resolve, reject) => {
			overwolf.windows.obtainDeclaredWindow(windowName, (res) => {
				if (res.success) {
					resolve(res.window);
				}
			});
		});
	}

	public async restoreWindow(windowId: string): Promise<overwolf.windows.WindowIdResult | null> {
		return new Promise<overwolf.windows.WindowIdResult | null>((resolve) => {
			try {
				overwolf.windows.restore(windowId, async (result) => {
					resolve(result);
				});
			} catch (e) {
				// This doesn't seem to prevent the window from being restored, so let's ignore it
				console.warn('Exception while restoring window', e);
				resolve(null);
			}
		});
	}

	public async bringToFront(
		windowId: string | undefined,
		grabFocus = false,
	): Promise<overwolf.windows.WindowIdResult | null> {
		if (!windowId) {
			return null;
		}

		return new Promise<overwolf.windows.WindowIdResult | null>((resolve) => {
			// https://overwolf.github.io/docs/api/overwolf-windows#setdesktoponlywindowid-shouldbedesktoponly-callback
			try {
				overwolf.windows.bringToFront(windowId, grabFocus, (result) => {
					resolve(result);
				});
			} catch (e) {
				console.warn('exception when bringing to front', windowId, e);
				resolve(null);
			}
		});
	}

	public async closeWindow(windowId: string): Promise<overwolf.windows.WindowIdResult> {
		return new Promise<overwolf.windows.WindowIdResult>((resolve) => {
			overwolf.windows.close(windowId, (result) => {
				resolve(result);
			});
		});
	}

	public async dragResize(windowId: string, edge: overwolf.windows.enums.WindowDragEdge) {
		return new Promise<overwolf.windows.DragResizeResult>((resolve) => {
			overwolf.windows.dragResize(windowId, edge, null as any, (result) => {
				resolve(result);
			});
		});
	}

	public async dragMove(windowId: string) {
		return new Promise<void>((resolve) => {
			overwolf.windows.dragMove(windowId, () => {
				resolve();
			});
		});
	}

	public addHotKeyPressedListener(
		hotkey: string,
		callback: (event: overwolf.settings.hotkeys.OnPressedEvent) => void,
	): void {
		// overwolf.settings.registerHotKey(hotkey, callback);
		overwolf.settings.hotkeys.onPressed.addListener((hotkeyPressed) => {
			if (hotkeyPressed?.name === hotkey) {
				callback(hotkeyPressed);
			}
		});
	}

	public setWindowPassthrough(windowId: string): Promise<void> {
		return new Promise<void>((resolve) => {
			overwolf.windows.setWindowStyle(windowId, overwolf.windows.enums.WindowStyle.InputPassThrough, (data) => {
				resolve();
			});
		});
	}

	public addGameInfoUpdatedListener(
		callback: (message: overwolf.games.GameInfoUpdatedEvent) => void,
	): (message: overwolf.games.GameInfoUpdatedEvent) => void {
		overwolf.games.onGameInfoUpdated.addListener(callback);
		return callback;
	}

	public exitGame(gameInfoResult: overwolf.games.GameInfoUpdatedEvent): boolean {
		return (
			!gameInfoResult ||
			!gameInfoResult.gameInfo ||
			!gameInfoResult.gameInfo.isRunning ||
			Math.floor(gameInfoResult.gameInfo.id / 10) !== DIABLO_IV_GAME_ID
		);
	}

	public async inGame(): Promise<boolean> {
		return new Promise<boolean>((resolve) => {
			overwolf.games.getRunningGameInfo((res: overwolf.games.GetRunningGameInfoResult) => {
				if (this.gameRunning(res)) {
					resolve(true);
				}
				resolve(false);
			});
		});
	}

	public gameRunning(gameInfo: overwolf.games.GetRunningGameInfoResult): boolean {
		if (!gameInfo) {
			return false;
		}
		if (!gameInfo.isRunning) {
			return false;
		}

		// NOTE: we divide by 10 to get the game class id without it's sequence number
		if (Math.floor(gameInfo.id / 10) !== DIABLO_IV_GAME_ID) {
			return false;
		}
		return true;
	}

	public async getRunningGameInfo() {
		return new Promise<overwolf.games.GetRunningGameInfoResult>((resolve) => {
			try {
				overwolf.games.getRunningGameInfo((res: overwolf.games.GetRunningGameInfoResult) => {
					resolve(res);
				});
			} catch (e) {
				// This doesn't seem to prevent the window from being restored, so let's ignore it
				console.warn('Exception while getting running game info', e);
				resolve(null as any);
			}
		});
	}

	public async changeWindowPosition(windowId: string, newX: number, newY: number): Promise<void> {
		return new Promise<void>((resolve) => {
			try {
				overwolf.windows.changePosition(windowId, Math.round(newX), Math.round(newY), (res) => {
					resolve();
				});
			} catch (e) {
				console.error('Exception while trying to changePosition', windowId, newX, newY, e);
				resolve();
			}
		});
	}

	public async changeWindowSize(windowId: string, width: number, height: number): Promise<void> {
		return new Promise<void>((resolve) => {
			try {
				overwolf.windows.changeSize(windowId, Math.round(width), Math.round(height), (res) => {
					resolve();
				});
			} catch (e) {
				console.error('Exception while trying to changeSize', windowId, width, height, e);
				resolve();
			}
		});
	}

	public async setRequiredFeatures(features: string[]): Promise<void> {
		return new Promise<void>((resolve) => {
			try {
				overwolf.games.events.setRequiredFeatures(features, (res) => {
					resolve();
				});
			} catch (e) {
				console.error('Exception while trying to setRequiredFeatures', features, e);
				resolve();
			}
		});
	}
}
