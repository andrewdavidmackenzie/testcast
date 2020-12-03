package net.mackenzie.testcast;

import android.app.Activity;
import android.util.Log;

import androidx.annotation.NonNull;

import net.mackenzie.chromeinteractor.ChromecastInteractor;
import net.mackenzie.chromeinteractor.GameController;

/**
 * This class implements control of the Tests, implementing the GameController Interface that permits it to
 * work in conjunction with the ChromecastInteractor.
 *
 * It holds the logic of what actions can be taken and how the games responds to events, according to the current
 * state of the game.
 *
 * User: andrew
 * Date: 11/01/15
 * Time: 02:15
 * <p/>
 * Copyright Andrew Mackenzie, 2013
 */
public class TestController implements GameController {
    // CONSTANTS
    private static final String LOG_TAG = "TestController";

    // MUTABLES
    private TestControllerView testView;

    public TestController() {
    }

    public void setView(TestControllerView testView) {
        this.testView = testView;
    }

    /**
     * Setter for the ChromeInteractor - as they have a mutual dependency
     *
     * @param chromecastInteractor to use for controlling game
     */
    @Override
    public void setChromecastInteractor(@NonNull final ChromecastInteractor chromecastInteractor) {
    }

    /**
     * Handle new state coming from the chromecast
     *
     * @param newState - the new ChromecastInteractor.CHROMECAST_STATE
     */
    @Override
    public void newChromecastState(@NonNull final ChromecastInteractor.CHROMECAST_STATE newState) {
        Log.d(LOG_TAG, "Chromecast newState: " + newState);
        switch (newState) {
            case NO_WIFI:
                testView.setMessage(R.string.enableWifi);
                break;

            case NO_ROUTE_AVAILABLE:
                testView.setMessage(R.string.noRoute);
                break;

            case ROUTE_AVAILABLE:
                testView.setMessage(R.string.selectRoute);
                break;

            case CONNECTING:
                testView.setMessage(R.string.connecting);
                break;

            case CONNECTION_SUSPENDED:
                testView.setMessage(R.string.disconnected);
                break;

            case CONNECTED:
                testView.setMessage(R.string.connected);
                break;

            case RECEIVER_READY:
                testView.setMessage(R.string.ready);
                break;
        }
    }

    /**
     * Parse a message from the receiver app
     *
     * @param message from chromecast to parse
     */
    @Override
    public void receiverMessage(@NonNull final String message) {
        Log.i(LOG_TAG, "Receiver Message: " + message);
    }
}

