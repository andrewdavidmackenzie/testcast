package net.mackenzie.testcast;

import android.annotation.SuppressLint;
import android.graphics.drawable.ColorDrawable;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.MenuItemCompat;
import androidx.mediarouter.app.MediaRouteActionProvider;
import androidx.mediarouter.media.MediaRouteSelector;

import com.google.android.gms.cast.CastMediaControlIntent;

/**
 * This class provides view functionality for the controller of the game, such as joining, leaving,
 * moving paddles etc - but not a view of the game itself.
 *
 * User: andrew
 * Date: 11/01/15
 * Time: 02:50
 * <p/>
 * Copyright Andrew Mackenzie, 2013
 */
public class TestControllerView {
    // CONSTANTS
    private static final String TAG = "TestControllerView";

    // IMMUTABLES
    private final MediaRouteSelector mediaRouteSelector;
    private final AppCompatActivity activity;
    private final TextView messageView;

    @SuppressLint("ClickableViewAccessibility")
    public TestControllerView(final AppCompatActivity activity,
                              final String receiverAppId,
                              final TestController testController) {
        this.activity = activity;
        activity.setContentView(R.layout.activity_main);

        messageView = activity.findViewById(R.id.messageView);

        testController.setView(this);

        activity.getSupportActionBar().setBackgroundDrawable(new ColorDrawable(activity.getResources().getColor(android.R.color.transparent)));

        this.mediaRouteSelector = new MediaRouteSelector.Builder().addControlCategory(
                CastMediaControlIntent.categoryForCast(receiverAppId)).build();
    }

    /**
     * Accessor for media route selector in UI
     * @return the media route selector for the chromecast
     */
    public MediaRouteSelector getMediaSelector() {
        return mediaRouteSelector;
    }

    /**
     * Sets the selector for the chromecast device into an action in a Menu
     *
     * @param menu to add the action to
     */
    public void setMediaRouteSelector(final Menu menu) {
        MenuItem mediaRouteMenuItem = menu.findItem(R.id.media_route_menu_item);
        MediaRouteActionProvider mediaRouteActionProvider =
                (MediaRouteActionProvider) MenuItemCompat.getActionProvider(mediaRouteMenuItem);
        // Set the MediaRouteActionProvider selector for device discovery.
        mediaRouteActionProvider.setRouteSelector(mediaRouteSelector);
    }

    public void setMessage(final int message) {
        messageView.setText(message);
    }
}